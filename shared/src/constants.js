// ═══════════════════════════════════════════════════════════════════
// Shared constants for Media Manager ecosystem
// Extracted from companion/server.js, server/src/handlers/files.js,
// server/src/handlers/smart-grab.js, server/src/handlers/pipeline.js
// ═══════════════════════════════════════════════════════════════════

/**
 * Quality tiers for torrent scoring, ordered by resolution.
 * Each entry has a regex pattern, a human-readable label, and scoring weights
 * for when the torrent matches/mismatches the user's preferred quality.
 */
const QUALITY_TIERS = [
  { pattern: /2160p|4k|uhd/i, label: '4k',    matchScore: 100, anyScore: 70, mismatchScore: 40 },
  { pattern: /1080p/i,        label: '1080p',  matchScore: 100, anyScore: 80, mismatchScore: 50 },
  { pattern: /720p/i,         label: '720p',   matchScore: 100, anyScore: 60, mismatchScore: 30 },
];

/**
 * Source/encode quality bonuses applied to torrent scoring.
 * Positive scores reward high-quality sources; negative scores penalize cams/telesyncs.
 */
const SOURCE_BONUSES = [
  { pattern: /bluray|bdrip|remux/i,                score: 20 },
  { pattern: /web[\.\-\s]?dl|webrip|amzn|nf|dsnp/i, score: 15 },
  { pattern: /hdtv/i,                              score: 5 },
  { pattern: /cam|ts|telesync|hdts/i,              score: -100 },
];

/**
 * SMS carrier gateways for email-to-SMS notifications.
 * Keys are the gateway domain; values are carrier display names.
 */
const SMS_CARRIERS = {
  'txt.att.net':              'AT&T',
  'tmomail.net':              'T-Mobile',
  'vtext.com':                'Verizon',
  'messaging.sprintpcs.com':  'Sprint',
  'pcs.rogers.com':           'Rogers',
  'txt.bell.ca':              'Bell',
  'text.telus.com':           'Telus',
  'msg.telus.com':            'Telus (alt)',
};

/**
 * Accepted video file extensions (lowercase, with leading dot).
 */
const VIDEO_EXTENSIONS = ['.mkv', '.mp4', '.avi', '.m4v', '.wmv', '.mov', '.ts', '.flv', '.webm'];

/**
 * Accepted subtitle file extensions (lowercase, with leading dot).
 */
const SUBTITLE_EXTENSIONS = ['.srt', '.sub', '.idx', '.ass', '.ssa', '.vtt'];

/**
 * Ordered pipeline step names — a job progresses through these in sequence.
 */
const PIPELINE_STEPS = ['Queued', 'Downloading', 'Transferring', 'Renaming', 'Moving', 'Complete'];

/**
 * Size thresholds and penalties used during torrent scoring.
 * - maxSizeGBMovie / maxSizeGBTV: default caps when prefs don't specify
 * - tooSmallGB: movies smaller than this are suspiciously small
 * - reasonableMinGB: bonus for torrents above this size (likely not fakes)
 * - oversizePenalty / tooSmallPenalty: score adjustments
 */
const SIZE_PENALTIES = {
  maxSizeGBMovie: 4,
  maxSizeGBTV: 60,
  tooSmallGB: 0.3,
  reasonableMinGB: 1,
  oversizePenalty: -50,
  tooSmallPenalty: -30,
  reasonableSizeBonus: 10,
};

/**
 * Known high-quality release groups that get a small scoring bonus.
 */
const TRUSTED_RELEASE_GROUPS = /FLUX|NTb|SPARKS|RARBG|YTS|YIFY|EVO|AMIABLE/i;

/**
 * Preferred indexer pattern — 1337x links don't expire unlike ext.to (HTTP 410).
 */
const PREFERRED_INDEXER = '1337x';
const PREFERRED_INDEXER_BONUS = 15;

/**
 * Minimum seeder gate — torrents below this get a heavy penalty.
 */
const DEFAULT_MIN_SEEDERS = 5;
const MIN_SEEDERS_PENALTY = -200;

/**
 * Seeder bonus parameters: logarithmic with a cap.
 * Formula: min(log2(seeders + 1) * multiplier, cap)
 */
const SEEDER_BONUS = {
  multiplier: 8,
  cap: 50,
};

/**
 * Bytes per GB — used for size conversions in scoring.
 */
const BYTES_PER_GB = 1073741824;

/**
 * TV pack scoring adjustments.
 */
const TV_PACK_BONUS = 25;
const TV_SINGLE_EPISODE_PENALTY = -20;

/**
 * Year mismatch scoring.
 */
const YEAR_MATCH_BONUS = 50;
const YEAR_MISMATCH_PENALTY = -500;

/**
 * Foreign-release penalty when no English marker is present.
 */
const FOREIGN_PENALTY = -500;
const FOREIGN_LANG_CODE_PENALTY = -30;
const DUBBED_MULTI_PENALTY = -15;
const ENGLISH_CONFIRMED_BONUS = 5;

/**
 * Full-series pack minimum size (bytes) — torrents above this are likely packs.
 */
const FULL_PACK_MIN_BYTES = 10 * 1024 * 1024 * 1024;

/**
 * Torrent category ranges used by Prowlarr/Jackett.
 */
const CATEGORY_MOVIE = { min: 2000, max: 3000 };
const CATEGORY_TV    = { min: 5000, max: 6000 };

module.exports = {
  QUALITY_TIERS,
  SOURCE_BONUSES,
  SMS_CARRIERS,
  VIDEO_EXTENSIONS,
  SUBTITLE_EXTENSIONS,
  PIPELINE_STEPS,
  SIZE_PENALTIES,
  TRUSTED_RELEASE_GROUPS,
  PREFERRED_INDEXER,
  PREFERRED_INDEXER_BONUS,
  DEFAULT_MIN_SEEDERS,
  MIN_SEEDERS_PENALTY,
  SEEDER_BONUS,
  BYTES_PER_GB,
  TV_PACK_BONUS,
  TV_SINGLE_EPISODE_PENALTY,
  YEAR_MATCH_BONUS,
  YEAR_MISMATCH_PENALTY,
  FOREIGN_PENALTY,
  FOREIGN_LANG_CODE_PENALTY,
  DUBBED_MULTI_PENALTY,
  ENGLISH_CONFIRMED_BONUS,
  FULL_PACK_MIN_BYTES,
  CATEGORY_MOVIE,
  CATEGORY_TV,
};
