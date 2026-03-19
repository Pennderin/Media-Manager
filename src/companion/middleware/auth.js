// ═══════════════════════════════════════════════════════════════════
// Auth middleware — decoupled from config via getPin callback
// ═══════════════════════════════════════════════════════════════════

/**
 * Create an Express middleware that checks for a PIN in headers or query.
 *
 * @param {Function} getPin - Returns the current PIN string (empty = no auth)
 * @returns {Function} Express middleware
 */
function createAuthMiddleware(getPin) {
  return function requireAuth(req, res, next) {
    const pin = getPin();
    if (!pin) return next(); // no pin = open access
    const provided = req.headers['x-pin'] || req.query.pin;
    if (provided === pin) return next();
    res.status(401).json({ error: 'Invalid PIN' });
  };
}

module.exports = { createAuthMiddleware };
