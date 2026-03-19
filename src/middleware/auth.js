// ═══════════════════════════════════════════════════════════════════
// API Key Authentication Middleware
// Extracted from server.js requireAuth()
// ═══════════════════════════════════════════════════════════════════

/**
 * Create an API key auth middleware that reads the key from the
 * provided config getter function.
 *
 * @param {Function} getApiKey - Returns the current API key (string or falsy)
 * @returns {Function} Express middleware
 */
function createAuthMiddleware(getApiKey) {
  return function requireAuth(req, res, next) {
    const apiKey = getApiKey();
    if (!apiKey) return next(); // no key = open access
    const provided = req.headers['x-api-key'];
    if (provided === apiKey) return next();
    res.status(401).json({ error: 'Invalid or missing API key' });
  };
}

module.exports = { createAuthMiddleware };
