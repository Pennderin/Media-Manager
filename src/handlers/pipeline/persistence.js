// ═══════════════════════════════════════════════════════════════════
// Pipeline Persistence — save/restore job queue across restarts
// Extracted from pipeline.js saveQueue() + restoreQueue()
// ═══════════════════════════════════════════════════════════════════

/**
 * Serialize and persist the current job queue to the config store.
 *
 * @param {Array} jobs - Current jobs array
 * @param {number} jobId - Next job ID counter
 * @param {Object} store - Config store with .set()
 */
function saveQueue(jobs, jobId, store) {
  if (!store) return;
  try {
    const data = jobs.map(j => ({
      id: j.id, name: j.name, status: j.status, step: j.step,
      error: j.error, progress: j.progress, options: { ...j.options },
      renamePreview: j.renamePreview || null,
      torrentFiles: j.torrentFiles || null,
    }));
    store.set('pipeline_queue', data);
    store.set('pipeline_nextId', jobId);
  } catch (e) { console.log('[pipeline] Failed to save queue:', e.message); }
}

/**
 * Restore saved job queue from config store.
 * Running jobs from previous session are marked as failed.
 *
 * @param {Object} store - Config store with .get()
 * @returns {{ jobs: Array, jobId: number }}
 */
function restoreQueue(store) {
  const jobs = [];
  let jobId = 1;
  try {
    const saved = store.get('pipeline_queue') || [];
    jobId = store.get('pipeline_nextId') || 1;
    for (const s of saved) {
      // Only restore non-complete jobs, mark running ones as failed (crashed)
      if (s.status === 'complete') continue;
      const job = {
        id: s.id, name: s.name, step: s.step,
        status: (s.status === 'running') ? 'failed' : s.status,
        error: (s.status === 'running') ? 'App was closed while job was running' : (s.error || null),
        progress: s.progress || '', transferDetail: null, parallelTransfers: null,
        renamePreview: s.renamePreview || null, torrentFiles: s.torrentFiles || null,
        options: s.options || {},
      };
      jobs.push(job);
    }
    if (jobs.length) console.log(`[pipeline] Restored ${jobs.length} jobs from previous session`);
  } catch (e) { console.log('[pipeline] Failed to restore queue:', e.message); }
  return { jobs, jobId };
}

module.exports = { saveQueue, restoreQueue };
