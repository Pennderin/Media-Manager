// ═══════════════════════════════════════════════════════════════════
// Centralized Error Handler Middleware
// ═══════════════════════════════════════════════════════════════════

/**
 * Express error-handling middleware.
 * Logs the error and returns a structured JSON response.
 *
 * Must be registered with app.use() AFTER all routes.
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
}

module.exports = { errorHandler };
