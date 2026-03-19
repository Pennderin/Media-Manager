const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

function createLogger(prefix, level) {
  const currentLevel = LOG_LEVELS[level || process.env.LOG_LEVEL || 'info'] ?? 2;
  const ts = () => new Date().toISOString().slice(11, 19);

  return {
    error: (...args) => currentLevel >= 0 && console.error(`[${ts()}] [${prefix}] ERROR:`, ...args),
    warn: (...args) => currentLevel >= 1 && console.warn(`[${ts()}] [${prefix}] WARN:`, ...args),
    info: (...args) => currentLevel >= 2 && console.log(`[${ts()}] [${prefix}] INFO:`, ...args),
    debug: (...args) => currentLevel >= 3 && console.log(`[${ts()}] [${prefix}] DEBUG:`, ...args),
  };
}

module.exports = { createLogger, LOG_LEVELS };
