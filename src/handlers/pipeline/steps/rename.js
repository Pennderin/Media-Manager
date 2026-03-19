// ═══════════════════════════════════════════════════════════════════
// Pipeline Step: Rename — build rename plan from TMDB and execute
// Extracted from pipeline.js stepRename()
// ═══════════════════════════════════════════════════════════════════

const fs = require('fs');

/**
 * Recursively remove empty directories (leaves non-empty ones intact).
 */
function cleanEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  const path = require('path');
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.isDirectory()) {
      const sub = path.join(dir, item.name);
      cleanEmptyDirs(sub);
      try { if (fs.readdirSync(sub).length === 0) fs.rmdirSync(sub); } catch (e) {}
    }
  }
}

/**
 * Rename files in staging using TMDB metadata.
 *
 * Builds a rename plan via the injected buildRenamePlan helper,
 * then executes it. Cleans up empty directories afterward.
 *
 * @param {Object} job - Pipeline job
 * @param {Object} store - Config store
 * @param {Function} broadcast - WebSocket broadcast function
 * @param {Object} helpers - { buildRenamePlan, executeRenames }
 */
async function stepRename(job, store, broadcast, helpers) {
  const apiKey = store.get('tmdb.apiKey') || '';
  const sp = job.options.stagingPath || store.get('paths.staging');
  if (!apiKey) throw new Error('TMDB API key not configured — add it in Settings');
  if (!sp || !fs.existsSync(sp)) throw new Error('Staging folder not found');

  const plan = await helpers.buildRenamePlan(sp, job.options.renameType || 'movie', apiKey, job.options.renameQuery || null);
  if (!plan.length) { job.progress = 'No files matched for renaming'; return; }

  const results = await helpers.executeRenames(plan);
  const successCount = results.filter(r => r.success).length;
  job.progress = `Renamed ${successCount} file(s)`;
  cleanEmptyDirs(sp);
}

module.exports = { stepRename };
