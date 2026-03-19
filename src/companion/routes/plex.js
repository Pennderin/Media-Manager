// ═══════════════════════════════════════════════════════════════════
// Plex proxy route — checks if title exists via Media Manager
// ═══════════════════════════════════════════════════════════════════

const express = require('express');

/**
 * @param {Object} config - Shared app config
 * @param {Function} requireAuth - Auth middleware
 * @returns {express.Router}
 */
module.exports = function createPlexRoutes(config, requireAuth) {
  const router = express.Router();
  const MANAGER_URL = config.internalBaseUrl || process.env.MANAGER_URL || `http://127.0.0.1:${config.server?.port || 9876}`;

  async function plexSearch(title, type, year) {
    try {
      const params = new URLSearchParams({ title, type: type || 'movie', ...(year ? { year } : {}) });
      const res = await fetch(`${MANAGER_URL}/api/plex/check?${params}`, {
        headers: { 'x-api-key': config.server?.apiKey || process.env.MANAGER_API_KEY || '' },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.configured) return null;
      return data;
    } catch (e) {
      console.error('[plex] Check error:', e.message);
      return null;
    }
  }

  // GET /plex/check
  router.get('/plex/check', requireAuth, async (req, res) => {
    try {
      const { title, type, year } = req.query;
      if (!title) return res.status(400).json({ error: 'Title required' });
      const result = await plexSearch(title, type || 'movie', year);
      if (result === null) return res.json({ configured: false });
      res.json({ configured: true, ...result });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return router;
};
