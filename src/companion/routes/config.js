// ═══════════════════════════════════════════════════════════════════
// Config / settings / SMS / Push subscription routes
// ═══════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const fs = require('fs');
const { sendSms } = require('../services/notifications');

// ── SMS config persistence ────────────────────────────────────
let _configDir = process.env.CONFIG_DIR || null;

function getSmsConfigPath() {
  return _configDir
    ? path.join(_configDir, 'sms-config.json')
    : path.join(__dirname, '..', '..', 'sms-config.json');
}

function loadSmsConfig() {
  try { return JSON.parse(fs.readFileSync(getSmsConfigPath(), 'utf8')); } catch { return {}; }
}

function saveSmsConfig(cfg) {
  fs.writeFileSync(getSmsConfigPath(), JSON.stringify(cfg, null, 2));
}

// ── Route factory ──────────────────────────────────────────────

/**
 * @param {Object} config - Shared app config (mutated by POST /config)
 * @param {Function} requireAuth - Auth middleware
 * @param {Object} options - { saveConfig, vapidKeys }
 * @returns {express.Router}
 */
module.exports = function createConfigRoutes(config, requireAuth, options) {
  const router = express.Router();
  const saveConfig = options && options.saveConfig;
  const vapidKeys = (options && options.vapidKeys) || config.vapidKeys;
  if (config.configDir) _configDir = config.configDir;

  // ── App config ───────────────────────────────────────────────

  router.get('/config', requireAuth, (req, res) => {
    res.json({
      configured: !!(config.prowlarr.url && config.seedbox.qbitUrl),
      hasPin: !!config.server.pin,
      preferences: config.preferences,
    });
  });

  router.post('/config', requireAuth, (req, res) => {
    try {
      const updates = req.body;
      Object.assign(config, updates);
      if (saveConfig) saveConfig(config);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── SMS config ───────────────────────────────────────────────

  router.get('/sms/config', requireAuth, (req, res) => {
    const cfg = loadSmsConfig();
    res.json({ phone: cfg.phone || '', carrier: cfg.carrier || '' });
  });

  router.post('/sms/config', requireAuth, (req, res) => {
    const { phone, carrier } = req.body;
    saveSmsConfig({ phone, carrier });
    res.json({ success: true });
  });

  router.post('/sms/test', requireAuth, async (req, res) => {
    try {
      const phone = (req.body.smsPhone || '').replace(/\D/g, '');
      const carrier = req.body.smsCarrier || '';
      if (!phone || !carrier) return res.json({ success: false, error: 'Phone and carrier required' });
      await sendSms(phone, carrier, '\ud83d\udcfa Test from Media Companion \u2014 notifications are working!');
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false, error: e.message });
    }
  });

  // ── Push subscription ────────────────────────────────────────

  router.get('/push/vapid-public-key', (req, res) => {
    res.json({ publicKey: vapidKeys ? vapidKeys.publicKey : '' });
  });

  router.post('/push/subscribe', requireAuth, (req, res) => {
    // Subscription stored per-request, not globally
    res.json({ success: true });
  });

  return router;
};
