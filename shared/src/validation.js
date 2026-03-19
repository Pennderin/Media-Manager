// ═══════════════════════════════════════════════════════════════════
// Zod validation schemas for all Media Manager API inputs
// ═══════════════════════════════════════════════════════════════════

var z = require('zod');

/**
 * Search query — used by /api/search (TMDB lookup).
 */
var SearchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.enum(['movie', 'tv']).optional().default('movie'),
  year: z.union([z.string(), z.number()]).optional(),
});

/**
 * Media request — sent by Companion to trigger smart-grab.
 */
var MediaRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  year: z.union([z.string(), z.number()]).optional(),
  type: z.enum(['movie', 'tv']).optional().default('movie'),
  tmdbId: z.number().int().positive().optional(),
  tvMode: z.enum(['full', 'season', 'episode', 'latest']).optional(),
  tvSeason: z.union([z.string(), z.number()]).optional(),
  tvEpisode: z.union([z.string(), z.number()]).optional(),
});

/**
 * Pipeline start — initiating a download/transfer/rename/move job.
 */
var PipelineStartSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  magnetUrl: z.string().optional(),
  torrentUrl: z.string().optional(),
  tmdbId: z.number().int().positive().optional(),
  type: z.enum(['movie', 'tv']).optional().default('movie'),
  year: z.union([z.string(), z.number()]).optional(),
  renameType: z.enum(['movie', 'tv', 'none']).optional(),
  moveType: z.enum(['movie', 'tv', 'none']).optional(),
});

/**
 * Settings update — key/value pair for config changes.
 */
var SettingsUpdateSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: z.any(),
});

/**
 * SFTP credentials — used for seedbox file transfers.
 */
var SftpCredsSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().int().positive().optional().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  SearchSchema,
  MediaRequestSchema,
  PipelineStartSchema,
  SettingsUpdateSchema,
  SftpCredsSchema,
};
