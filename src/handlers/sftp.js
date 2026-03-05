// ═══════════════════════════════════════════════════════════════════
// SFTP Handler — REST API version
// ═══════════════════════════════════════════════════════════════════

const SftpClient = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

// High-performance SFTP connection options
// Large window/chunk sizes reduce flow-control pauses and burst/stall behavior
function sftpConnectOpts(s) {
  return {
    host: s.sftpHost,
    port: s.sftpPort || 22,
    username: s.sftpUsername,
    password: s.sftpPassword,
    readyTimeout: 20000,
    sock: undefined,
    algorithms: { compress: ['none'] }, // disable compression overhead
  };
}

function setupSftpRoutes(app, store, auth) {
  app.get('/api/sftp/test', auth, async (req, res) => {
    const sftp = new SftpClient();
    try {
      const s = store.get('seedbox');
      await sftp.connect(sftpConnectOpts(s));
      await sftp.end();
      res.json({ success: true });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  app.get('/api/sftp/list', auth, async (req, res) => {
    const sftp = new SftpClient();
    try {
      const s = store.get('seedbox');
      await sftp.connect(sftpConnectOpts(s));
      const l = await sftp.list(req.query.path || s.sftpRemotePath);
      await sftp.end();
      res.json({ success: true, files: l });
    } catch (e) { res.json({ success: false, error: e.message }); }
  });

  app.post('/api/sftp/download', auth, async (req, res) => {
    const sftp = new SftpClient();
    try {
      const s = store.get('seedbox'), sp = req.body.localPath || store.get('paths.staging');
      if (!sp) throw new Error('Staging not configured');
      if (!fs.existsSync(sp)) fs.mkdirSync(sp, { recursive: true });
      await sftp.connect(sftpConnectOpts(s));
      const rp = req.body.remotePath;
      const st = await sftp.stat(rp);
      if (st.isDirectory) {
        await dlDir(sftp, rp, path.join(sp, path.basename(rp)));
      } else {
        await sftp.fastGet(rp, path.join(sp, path.basename(rp)));
      }
      await sftp.end();
      res.json({ success: true });
    } catch (e) {
      try { await sftp.end(); } catch (x) {}
      res.json({ success: false, error: e.message });
    }
  });
}

async function dlDir(sftp, rp, lp) {
  if (!fs.existsSync(lp)) fs.mkdirSync(lp, { recursive: true });
  for (const i of await sftp.list(rp)) {
    const r2 = `${rp}/${i.name}`, l2 = path.join(lp, i.name);
    if (i.type === 'd') await dlDir(sftp, r2, l2);
    else await sftp.fastGet(r2, l2);
  }
}

module.exports = { setupSftpRoutes };
