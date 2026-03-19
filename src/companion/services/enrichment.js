// ═══════════════════════════════════════════════════════════════════
// Request enrichment — live torrent progress and pipeline ETA
// ═══════════════════════════════════════════════════════════════════

const https = require('https');
const { LRUCache } = require('media-manager-shared');

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

// Bounded step-start-time tracker (replaces unbounded plain object)
const stepStartTimes = new LRUCache(500);

// ── Helpers ──────────────────────────────────────────────────────

function fetchWithTimeout(url, opts, ms) {
  ms = ms || 5000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const fetchOpts = { ...opts, signal: controller.signal };
  if (url.startsWith('https')) fetchOpts.agent = insecureAgent;
  return fetch(url, fetchOpts).finally(() => clearTimeout(timer));
}

/**
 * Fetch active torrents from qBittorrent.
 *
 * @param {Object} config - App config (needs seedbox.qbitUrl)
 * @param {string|null} qbitCookie - Current qBit session cookie
 * @param {Function} qbitLogin - Async function that refreshes the cookie
 * @returns {Promise<Array>} Array of torrent objects
 */
async function getQbitStatus(config, qbitCookie, qbitLogin) {
  const base = (config.seedbox.qbitUrl || '').replace(/\/$/, '');
  if (!base) return [];
  try {
    const r = await fetchWithTimeout(base + '/api/v2/torrents/info', {
      headers: { Cookie: qbitCookie || '' },
    }, 2500);
    if (r.status === 403) {
      await qbitLogin();
      // Caller should pass updated cookie; we re-fetch with empty cookie
      // because qbitLogin mutates shared state in media.js
      const r2 = await fetchWithTimeout(base + '/api/v2/torrents/info', {
        headers: { Cookie: qbitCookie || '' },
      }, 2500);
      return await r2.json();
    }
    return await r.json();
  } catch (e) {
    console.log('[requests] qBit unreachable:', e.message);
    return [];
  }
}

/**
 * Fetch pipeline status from Media Manager server.
 *
 * @param {string} managerUrl - Media Manager base URL
 * @returns {Promise<Array>} Array of pipeline job objects
 */
async function getManagerStatus(managerUrl) {
  try {
    const res = await fetchWithTimeout(`${managerUrl}/status`, {}, 2000);
    if (res.ok) {
      const data = await res.json();
      return data.jobs || [];
    }
  } catch {}
  return [];
}

/**
 * Match a torrent from the qBit list to a request by comparing names.
 *
 * @param {Object} request - Request object with .torrent field
 * @param {Array} torrents - Array of qBit torrent objects
 * @returns {Object|null} Matched torrent or null
 */
function matchTorrentToRequest(request, torrents) {
  return torrents.find(t => {
    const tName = (t.name || '').toLowerCase();
    const rTorrent = (request.torrent || '').toLowerCase();
    return tName && rTorrent &&
      (tName.includes(rTorrent.slice(0, 30)) || rTorrent.includes(tName.slice(0, 30)));
  }) || null;
}

/**
 * Calculate ETA to Plex for a single request given current state.
 *
 * @param {Object} request - Request object
 * @param {Object} stepData - { pipelineStep, match, pipelineJob, sizeMB, isTV, dlEta, postDownloadEstimate, sftpEstimate, renameEstimate, moveEstimate }
 * @returns {{ pipelineStep: string, progress: number, dlspeed: number, etaToPlex: number, size: number, completed: boolean, seeding: boolean }}
 */
function calculateETA(request, stepData) {
  const {
    pipelineStep, match, isDownloading, isDone, isSeeding, isPaused,
    dlEta, postDownloadEstimate, sftpEstimate, renameEstimate, moveEstimate,
    progress,
  } = stepData;

  const now = Date.now();
  const rid = request.id;
  const tracked = stepStartTimes.get(rid);

  // Calculate what the TOTAL remaining estimate is when entering each step
  const stepEstimates = {
    'Starting': dlEta + postDownloadEstimate,
    'Downloading': dlEta + postDownloadEstimate,
    'Waiting for transfer': postDownloadEstimate,
    'Transferring': sftpEstimate + renameEstimate + moveEstimate,
    'Renaming': renameEstimate + moveEstimate,
    'Moving to NAS': moveEstimate,
    'Processing': postDownloadEstimate,
  };

  if (!tracked || tracked.step !== pipelineStep) {
    // Step changed — record new start time
    stepStartTimes.set(rid, {
      step: pipelineStep,
      startedAt: now,
      totalEstimate: stepEstimates[pipelineStep] || postDownloadEstimate,
    });
  }

  const track = stepStartTimes.get(rid);
  let etaToPlex;

  if (pipelineStep === 'Downloading' && dlEta > 0) {
    etaToPlex = dlEta + postDownloadEstimate;
    track.totalEstimate = etaToPlex;
    // Update in cache
    stepStartTimes.set(rid, track);
  } else {
    const elapsed = Math.floor((now - track.startedAt) / 1000);
    etaToPlex = Math.max(0, track.totalEstimate - elapsed);
  }

  return {
    pipelineStep,
    progress,
    dlspeed: match ? (match.dlspeed || 0) : 0,
    etaToPlex,
    size: match ? match.size : request.size,
    completed: false,
    seeding: !!isSeeding,
  };
}

/**
 * Enrich an array of requests with live torrent and pipeline status.
 *
 * @param {Array} requests - Request objects to enrich
 * @param {Object} config - App config
 * @param {string} managerUrl - Media Manager base URL
 * @param {string|null} qbitCookie - Current qBit session cookie
 * @param {Function} qbitLogin - Async function to refresh qBit cookie
 * @returns {Promise<Array>} Enriched request objects
 */
async function enrichRequests(requests, config, managerUrl, qbitCookie, qbitLogin) {
  const [torrents, pipelineJobs] = await Promise.all([
    getQbitStatus(config, qbitCookie, qbitLogin),
    getManagerStatus(managerUrl),
  ]);

  const now = Date.now();

  return requests.map(r => {
    try {
      const match = matchTorrentToRequest(r, torrents);

      const pipelineJob = pipelineJobs.find(j => {
        const jName = (j.name || '').toLowerCase();
        const rTitle = (r.title || '').toLowerCase();
        const rTorrent = (r.torrent || '').toLowerCase();
        const nameMatch =
          (jName && rTitle && jName.includes(rTitle.slice(0, 20))) ||
          (jName && rTorrent && (jName.includes(rTorrent.slice(0, 30)) || rTorrent.includes(jName.slice(0, 30))));
        if (!nameMatch) return false;
        if (r.minPipelineJobId && j.id < r.minPipelineJobId) return false;
        return true;
      });

      if (!match && !pipelineJob) {
        const age = now - new Date(r.timestamp).getTime();
        if (age > 3600000) return { ...r, live: { pipelineStep: 'In Plex', completed: true, etaToPlex: 0 } };
        return r;
      }

      // ===== ESTIMATED PIPELINE TIMES =====
      const sizeMB = ((match && match.size) || r.size || 0) / (1024 * 1024);
      const isTV = r.type === 'tv';

      const sftpSpeed = isTV ? 65 : 25;
      const sftpEstimate = Math.round(sizeMB / sftpSpeed);
      const estFileCount = isTV ? Math.max(Math.round(sizeMB / 400), 1) : 1;
      const renameEstimate = 10 + (estFileCount * 2);
      const moveEstimate = Math.round(sizeMB / 100);
      const postDownloadEstimate = sftpEstimate + renameEstimate + moveEstimate;

      // Determine current step
      const progress = match ? Math.round(match.progress * 100) : 100;
      const isDownloading = match && ['downloading', 'forcedDL', 'metaDL', 'queuedDL', 'stalledDL', 'checkingDL'].includes(match.state);
      const isSeeding = match && ['uploading', 'stalledUP'].includes(match.state);
      const isPaused = match && ['pausedDL', 'pausedUP'].includes(match.state);
      const isDone = progress >= 100;
      const dlEta = (match && isDownloading && match.eta > 0 && match.eta < 8640000) ? match.eta : 0;

      let pipelineStep = '';

      if (pipelineJob) {
        const step = pipelineJob.step || '';
        const pStatus = pipelineJob.status || '';
        if (pStatus === 'complete' || pStatus === 'done') return { ...r, live: { pipelineStep: 'In Plex', completed: true, etaToPlex: 0 } };
        if (pStatus === 'failed') return { ...r, live: { pipelineStep: 'Failed', completed: false, etaToPlex: 0 } };

        if (step === 'grabbing') pipelineStep = 'Starting';
        else if (step === 'waiting_torrent') pipelineStep = 'Downloading';
        else if (step === 'transferring') pipelineStep = 'Transferring';
        else if (step === 'renaming') pipelineStep = 'Renaming';
        else if (step === 'moving') pipelineStep = 'Moving to NAS';
        else pipelineStep = step || 'Processing';
      } else if (isDownloading && !isDone) {
        pipelineStep = 'Downloading';
      } else if (isDone && (isSeeding || isPaused)) {
        pipelineStep = 'Waiting for transfer';
      } else if (isDone) {
        pipelineStep = 'Processing';
      }

      return {
        ...r,
        live: calculateETA(r, {
          pipelineStep, match, isDownloading, isDone, isSeeding, isPaused,
          dlEta, postDownloadEstimate, sftpEstimate, renameEstimate, moveEstimate,
          progress,
        }),
      };
    } catch (e) {
      return r;
    }
  });
}

module.exports = {
  getQbitStatus,
  getManagerStatus,
  matchTorrentToRequest,
  calculateETA,
  enrichRequests,
};
