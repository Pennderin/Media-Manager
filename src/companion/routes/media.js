// ═══════════════════════════════════════════════════════════════════
// Media routes — grab, requests history, queue, debug
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const webpush = require('web-push');
const { LRUCache } = require('media-manager-shared');
const { enrichRequests } = require('../services/enrichment');
const { sendSms, sendPushNotification } = require('../services/notifications');

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

// ── Notification dedup — bounded LRU (max 1000) ──────────────
const notifiedIds = new LRUCache(1000);

// VAPID keys are now passed via config.vapidKeys from the server

// ── qBittorrent session ───────────────────────────────────────
let qbitCookie = null;

function fetchWithTimeout(url, opts, ms) {
  ms = ms || 5000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const fetchOpts = { ...opts, signal: controller.signal };
  if (url.startsWith('https')) fetchOpts.agent = insecureAgent;
  return fetch(url, fetchOpts).finally(() => clearTimeout(timer));
}

async function qbitLogin(config) {
  const s = config.seedbox;
  if (!s.qbitUrl) throw new Error('qBittorrent URL not configured');
  const res = await fetchWithTimeout(`${s.qbitUrl.replace(/\/$/, '')}/api/v2/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(s.qbitUsername)}&password=${encodeURIComponent(s.qbitPassword)}`,
  }, 5000);
  if (res.ok) {
    const c = res.headers.get('set-cookie');
    if (c) qbitCookie = c.split(';')[0];
  } else {
    throw new Error('qBittorrent login failed');
  }
}

async function qbitRequest(config, endpoint, method, body) {
  method = method || 'GET';
  const base = config.seedbox.qbitUrl.replace(/\/$/, '');
  if (!base) throw new Error('qBittorrent URL not configured');
  if (!qbitCookie) await qbitLogin(config);
  const opts = { method, headers: { Cookie: qbitCookie || '' } };
  if (body) { opts.body = body; opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
  const res = await fetchWithTimeout(`${base}${endpoint}`, opts, 5000);
  if (res.status === 403) { qbitCookie = null; await qbitLogin(config); return qbitRequest(config, endpoint, method, body); }
  return res;
}

// ── Requests persistence ──────────────────────────────────────
let _configDir = process.env.CONFIG_DIR || null;

function getRequestsPath() {
  return _configDir
    ? path.join(_configDir, 'requests.json')
    : path.join(__dirname, '..', '..', 'requests.json');
}

function loadRequests() {
  try {
    const p = getRequestsPath();
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {}
  return [];
}

function saveRequests(reqs) {
  try {
    const p = getRequestsPath();
    fs.writeFileSync(p, JSON.stringify(reqs, null, 2));
    console.log(`[requests] Saved ${reqs.length} requests to ${p}`);
  } catch (e) {
    console.error('[requests] Failed to save:', e.message);
  }
}

// ── Send push with expired-subscription cleanup ──────────────
async function sendPush(subscription, payload) {
  try {
    await sendPushNotification(subscription, payload.title, payload.body, {
      icon: payload.icon,
      badge: payload.badge,
      tag: payload.tag,
    });
  } catch (e) {
    if (e.statusCode === 410 || e.statusCode === 404) {
      const reqs = loadRequests();
      const cleaned = reqs.map(r => {
        if (JSON.stringify(r.pushSubscription) === JSON.stringify(subscription)) {
          const { pushSubscription, ...rest } = r;
          return rest;
        }
        return r;
      });
      saveRequests(cleaned);
    }
  }
}

// ── Background push checker ───────────────────────────────────
function startBackgroundChecker(config) {
  const MANAGER_URL = config.internalBaseUrl || process.env.MANAGER_URL || `http://127.0.0.1:${config.server?.port || 9876}`;

  async function checkCompletionsAndNotify() {
    const requests = loadRequests();
    const pending = requests.filter(r => r.pushSubscription && !notifiedIds.has(r.id));
    if (!pending.length) return;
    console.log(`[push-checker] Checking ${pending.length} pending requests...`);

    try {
      const enriched = await Promise.race([
        enrichRequests(pending, config, MANAGER_URL, qbitCookie, () => qbitLogin(config)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);

      for (const r of enriched) {
        console.log(`[push-checker] ${r.title}: completed=${r.live?.completed} step=${r.live?.pipelineStep}`);
        if (!r.live?.completed || notifiedIds.has(r.id)) continue;
        notifiedIds.set(r.id, true);

        const label = r.tvMode === 'season' ? ` S${String(r.tvSeason || '').padStart(2, '0')}`
          : r.tvMode === 'episode' ? ` S${String(r.tvSeason || '').padStart(2, '0')}E${String(r.tvEpisode || '').padStart(2, '0')}`
          : '';
        const message = `\u2705 ${r.title}${label} is ready in Plex`;

        if (r.pushSubscription) {
          sendPush(r.pushSubscription, {
            title: '\u2705 Ready in Plex',
            body: `${r.title}${label} is available`,
            icon: '/companion/icon-192.png',
            badge: '/companion/icon-192.png',
            tag: `complete-${r.id}`,
          }).then(() => console.log(`[push] Sent notification for: ${r.title}`))
            .catch(e => console.log(`[push] Failed for ${r.title}: ${e.message} (status: ${e.statusCode})`));
        }
        sendSms(r.smsPhone, r.smsCarrier, message).catch(e => console.log(`[sms] Failed: ${e.message}`));
      }
    } catch (e) {
      console.log(`[push-checker] Error: ${e.message}`);
    }
  }

  setInterval(checkCompletionsAndNotify, 30000);
}

// ── Route factory ──────────────────────────────────────────────

/**
 * @param {Object} config - Shared app config
 * @param {Function} requireAuth - Auth middleware
 * @returns {express.Router}
 */
module.exports = function createMediaRoutes(config, requireAuth) {
  const router = express.Router();
  const MANAGER_URL = config.internalBaseUrl || process.env.MANAGER_URL || `http://127.0.0.1:${config.server?.port || 9876}`;

  // Set up config dir and VAPID from passed config
  if (config.configDir) _configDir = config.configDir;
  if (config.vapidKeys) {
    webpush.setVapidDetails('mailto:media-companion@local', config.vapidKeys.publicKey, config.vapidKeys.privateKey);
  }

  // Start background push checker
  startBackgroundChecker(config);

  // POST /get — the magic "one tap" endpoint
  router.post('/get', requireAuth, async (req, res) => {
    try {
      let { title, year, type, tmdbId, skipPlexCheck, tvMode, tvSeason, tvEpisode } = req.body;
      if (!title) return res.status(400).json({ error: 'Title required' });

      const internalHeaders = { 'Content-Type': 'application/json' };
      if (config.server?.apiKey) internalHeaders['x-api-key'] = config.server.apiKey;
      const grabRes = await fetchWithTimeout(MANAGER_URL + '/api/smart-grab', {
        method: 'POST',
        headers: internalHeaders,
        body: JSON.stringify({
          title, year, type, tmdbId, skipPlexCheck,
          tvMode, tvSeason, tvEpisode,
          preferences: config.preferences,
          primaryIndexer: req.body.primaryIndexer || null,
          exclusiveIndexer: !!req.body.primaryIndexer,
        }),
      }, 60000);

      const grabData = await grabRes.json();
      if (!grabRes.ok) return res.status(grabRes.status).json(grabData);

      // Log the request locally
      const requests = loadRequests();
      const pushSubscription = req.body.pushSubscription || null;
      const smsPhone = (req.body.smsPhone || '').replace(/\D/g, '');
      const smsCarrier = req.body.smsCarrier || '';
      const contentType = type || 'movie';
      const requestLabel = grabData.requestLabel || title;
      const best = grabData.torrent || {};

      const newRequest = {
        id: Date.now(),
        title: requestLabel, year, type: contentType,
        tvMode: grabData.tvMode || tvMode || null,
        tvSeason: grabData.tvSeason || tvSeason || null,
        tvEpisode: grabData.tvEpisode || tvEpisode || null,
        torrent: best.title || title,
        size: best.size || 0,
        seeders: best.seeders || 0,
        indexer: best.indexer || '',
        quality: /2160p|4k/i.test(best.title || '') ? '4K' : /1080p/i.test(best.title || '') ? '1080p' : /720p/i.test(best.title || '') ? '720p' : 'Unknown',
        method: 'media-manager',
        status: 'sent',
        timestamp: new Date().toISOString(),
        minPipelineJobId: grabData.minPipelineJobId || 0,
        pushSubscription,
        smsPhone: smsPhone || null,
        smsCarrier: smsCarrier || null,
      };

      const deduped = requests.filter(r => {
        const sameItem = r.title === requestLabel && r.tvMode === (grabData.tvMode || tvMode || null) &&
          r.tvSeason === (grabData.tvSeason || tvSeason || null) && r.tvEpisode === (grabData.tvEpisode || tvEpisode || null);
        const samePhoneAndItem = smsPhone && r.smsPhone === smsPhone && r.title === requestLabel;
        return !sameItem && !samePhoneAndItem;
      });
      deduped.unshift(newRequest);
      if (deduped.length > 100) deduped.length = 100;
      saveRequests(deduped);

      res.json({ success: true, message: grabData.message, torrent: best });
    } catch (e) {
      console.error('[get] Error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // GET /requests — request history with enrichment
  router.get('/requests', requireAuth, async (req, res) => {
    const requests = loadRequests();
    if (!requests.length) return res.json({ success: true, requests: [] });

    try {
      const enriched = await Promise.race([
        enrichRequests(requests, config, MANAGER_URL, qbitCookie, () => qbitLogin(config)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);

      // Send push notifications for newly completed items, then remove them
      const completed = enriched.filter(r => r.live?.completed);
      for (const r of completed) {
        if (!notifiedIds.has(r.id)) {
          notifiedIds.set(r.id, true);
          const label = r.tvMode === 'season' ? ` S${String(r.tvSeason || '').padStart(2, '0')}`
            : r.tvMode === 'episode' ? ` S${String(r.tvSeason || '').padStart(2, '0')}E${String(r.tvEpisode || '').padStart(2, '0')}`
            : '';
          const message = `\u2705 ${r.title}${label} is ready in Plex`;
          if (r.pushSubscription) {
            sendPush(r.pushSubscription, {
              title: '\u2705 Ready in Plex',
              body: `${r.title}${label} is available`,
              icon: '/companion/icon-192.png',
              badge: '/companion/icon-192.png',
              tag: `complete-${r.id}`,
            }).then(() => console.log(`[push] Sent notification for: ${r.title}`))
              .catch(e => console.log(`[push] Failed for ${r.title}: ${e.message} (status: ${e.statusCode})`));
          }
          sendSms(r.smsPhone, r.smsCarrier, message).catch(e => console.log(`[sms] Failed: ${e.message}`));
        }
      }

      // Remove completed entries and persist
      const active = enriched.filter(r => !r.live?.completed);
      if (active.length < enriched.length) {
        saveRequests(requests.filter((_, i) => !enriched[i]?.live?.completed));
      }

      return res.json({ success: true, requests: active });
    } catch (e) {
      console.error('[requests] Enrichment failed/timed out:', e.message);
      return res.json({ success: true, requests });
    }
  });

  // GET /queue — active qBit torrents
  router.get('/queue', requireAuth, async (req, res) => {
    try {
      const r = await qbitRequest(config, '/api/v2/torrents/info');
      const torrents = await r.json();
      const active = torrents
        .filter(t => t.category !== 'Long Seed')
        .map(t => ({
          name: t.name,
          progress: Math.round(t.progress * 100),
          state: t.state,
          size: t.size,
          dlspeed: t.dlspeed,
          eta: t.eta,
        }));
      res.json({ success: true, torrents: active });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // GET /requests-debug — debug endpoint (with auth)
  router.get('/requests-debug', requireAuth, (req, res) => {
    try {
      const r = loadRequests();
      res.json({ count: r.length, requests: r });
    } catch (e) {
      res.json({ error: e.message });
    }
  });

  return router;
};

// Expose helpers for Electron integration
module.exports.loadRequests = loadRequests;
module.exports.saveRequests = saveRequests;
