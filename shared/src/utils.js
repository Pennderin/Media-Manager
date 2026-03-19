// ═══════════════════════════════════════════════════════════════════
// Shared utility functions for Media Manager ecosystem
// Consolidated from server/src/utils.js, server/src/handlers/renamer.js,
// server/src/handlers/pipeline.js, companion/server.js
// ═══════════════════════════════════════════════════════════════════

/**
 * Clean a torrent/file name for TMDB search by stripping quality tags,
 * release group names, season/episode markers, and normalizing separators.
 *
 * Consolidated from:
 *   - server/src/handlers/renamer.js cleanForSearch()
 *   - server/src/handlers/pipeline.js cleanName()
 *
 * @param {string} str - Raw torrent or filename
 * @returns {string} Cleaned name suitable for search queries
 */
function cleanForSearch(str) {
  return str
    .replace(/\.\w{2,4}$/, '')             // strip file extension
    .replace(/[\.\-\_]/g, ' ')             // separators to spaces
    .replace(/\[.*?\]/g, '')               // strip [YTS.BZ], [ext.to], etc.
    .replace(/\((\d{4})\)/g, '$1')         // keep year but remove parens
    .replace(/\b(720p|1080p|2160p|4k|uhd|bluray|bdrip|brrip|webrip|web|dl|hdtv|dvdrip|x264|x265|h264|h265|hevc|avc|aac|ac3|atmos|dts|remux|proper|repack|internal|dubbed|subbed|multi|10bit|hdr|sdr|ddp|dv|dovi|5\.1)\b/gi, '')
    .replace(/\b(NeoNoir|NTb|FLUX|SPARKS|RARBG|YTS|YIFY|FGT|EVO|AMIABLE|TERRi|MeGusta|ION10|SUCCESSORS|EDITH|CAKES|TGx|MIXED|ETHEL)\b/gi, '')
    .replace(/\bS\d{1,2}[\s._-]*E\d{1,3}\b/gi, '')
    .replace(/\b(Season|S)\s*\d+/gi, '')
    .replace(/\bE\d{1,3}\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Normalize a name for fuzzy matching — lowercase, strip all non-alphanumeric.
 *
 * Used in plex.js, smart-grab.js, pipeline.js for deduplication and matching.
 *
 * @param {string} name
 * @returns {string}
 */
function normalizeName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Format a byte count as a human-readable string (e.g. "1.5 GB").
 *
 * Consolidated from server/src/utils.js formatBytes().
 *
 * @param {number} bytes
 * @returns {string}
 */
function fmtSize(bytes) {
  if (!bytes || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

/**
 * Format a byte-per-second value as a human-readable speed string.
 *
 * @param {number} bytes - Bytes per second
 * @returns {string}
 */
function fmtSpeed(bytes) {
  return fmtSize(bytes) + '/s';
}

/**
 * Escape special HTML characters to prevent XSS.
 *
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Promise-based sleep utility.
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simple LRU cache with optional TTL expiry.
 *
 * Replaces unbounded Map caches used throughout the codebase
 * (e.g. tmdbCache in companion/server.js).
 *
 * @example
 *   const cache = new LRUCache(100, 300000); // 100 entries, 5-minute TTL
 *   cache.set('key', value);
 *   cache.get('key'); // value or undefined if evicted/expired
 */
class LRUCache {
  /**
   * @param {number} maxSize - Maximum number of entries before eviction
   * @param {number} [ttlMs=0] - Time-to-live in milliseconds (0 = no expiry)
   */
  constructor(maxSize, ttlMs) {
    this._maxSize = maxSize || 100;
    this._ttlMs = ttlMs || 0;
    this._map = new Map();
  }

  /**
   * Retrieve a value by key. Returns undefined if missing or expired.
   * Accessing a key promotes it to most-recently-used.
   */
  get(key) {
    if (!this._map.has(key)) return undefined;
    const entry = this._map.get(key);
    if (this._ttlMs && Date.now() - entry.ts > this._ttlMs) {
      this._map.delete(key);
      return undefined;
    }
    // Promote to most-recently-used by reinserting
    this._map.delete(key);
    this._map.set(key, entry);
    return entry.value;
  }

  /**
   * Check whether a key exists and is not expired.
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Store a key-value pair. Evicts the oldest entry if at capacity.
   */
  set(key, value) {
    // Delete first so reinsertion puts it at the end (most recent)
    if (this._map.has(key)) this._map.delete(key);
    this._map.set(key, { value, ts: Date.now() });
    // Evict oldest if over capacity
    if (this._map.size > this._maxSize) {
      const oldest = this._map.keys().next().value;
      this._map.delete(oldest);
    }
  }

  /**
   * Remove a key.
   */
  delete(key) {
    this._map.delete(key);
  }

  /**
   * Remove all entries.
   */
  clear() {
    this._map.clear();
  }

  /**
   * Current number of entries.
   */
  get size() {
    return this._map.size;
  }
}

module.exports = {
  cleanForSearch,
  normalizeName,
  fmtSize,
  fmtSpeed,
  escHtml,
  sleep,
  LRUCache,
};
