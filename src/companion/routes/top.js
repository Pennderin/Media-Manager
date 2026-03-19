// ═══════════════════════════════════════════════════════════════════
// Top 20 / browse routes — proxy to Media Manager server
// ═══════════════════════════════════════════════════════════════════

const express = require('express');

/**
 * @param {Object} config - Shared app config
 * @param {Function} requireAuth - Auth middleware
 * @returns {express.Router}
 */
module.exports = function createTopRoutes(config, requireAuth) {
  const router = express.Router();
  const MANAGER_URL = config.internalBaseUrl || process.env.MANAGER_URL || `http://127.0.0.1:${config.server?.port || 9876}`;

  function internalHeaders(extra) {
    const h = extra ? { ...extra } : {};
    if (config.server?.apiKey) h['x-api-key'] = config.server.apiKey;
    return h;
  }

  // GET /top/indexers
  router.get('/top/indexers', requireAuth, async (req, res) => {
    try {
      const r = await fetch(`${MANAGER_URL}/api/prowlarr/indexers`, {
        headers: internalHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      const data = await r.json();
      res.json(data);
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  // POST /top/browse
  router.post('/top/browse', requireAuth, async (req, res) => {
    try {
      const r = await fetch(`${MANAGER_URL}/api/prowlarr/browse`, {
        method: 'POST',
        headers: internalHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(30000),
      });
      const data = await r.json();
      res.json(data);
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  // POST /top/resolve
  router.post('/top/resolve', requireAuth, async (req, res) => {
    try {
      const r = await fetch(MANAGER_URL + '/api/prowlarr/resolve-magnet', {
        method: 'POST',
        headers: internalHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(60000),
      });
      const data = await r.json();
      res.json(data);
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  return router;
};
