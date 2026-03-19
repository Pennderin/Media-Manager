// ═══════════════════════════════════════════════════════════════
// Top 20 View — trending content with period tabs, poster grid
// ═══════════════════════════════════════════════════════════════

class Top20View extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._period = 'day';
    this._type = 'movies';
    this._indexerId = null;
    this._cache = {};
    this._results = [];
    this._initialized = false;
  }

  connectedCallback() {
    this._render();
    this._setupListeners();
  }

  async onActivated() {
    if (!this._initialized) {
      await this._initIndexers();
      this._initialized = true;
    }
    this._loadTop();
  }

  onDeactivated() {}

  async _initIndexers() {
    try {
      const data = await AppShell.api('/companion/api/top/indexers');
      if (data.success && data.indexers && data.indexers.length) {
        const leet = data.indexers.find(i => i.id === '1337x' || i.name.toLowerCase().includes('1337'));
        this._indexerId = leet ? leet.id : data.indexers[0].id;
      }
    } catch (e) { console.error('[top] indexers:', e); }
  }

  async _loadTop() {
    if (!this._indexerId) {
      this.shadowRoot.querySelector('#topResults').innerHTML = `
        <div class="empty-state">
          <mm-icon name="alert-triangle" size="40"></mm-icon>
          <p class="empty-title">Prowlarr not configured</p>
        </div>
      `;
      return;
    }

    const cacheKey = `${this._period}-${this._type}`;
    const cached = this._cache[cacheKey];
    if (cached && Date.now() - cached.ts < 10 * 60 * 1000) {
      this._renderResults(cached.results);
      return;
    }

    this.shadowRoot.querySelector('#topResults').innerHTML = '<div class="loading-state"><mm-spinner size="28"></mm-spinner></div>';

    const category = this._type === 'tv' ? 5000 : 2000;
    const data = await AppShell.api('/companion/api/top/browse', {
      method: 'POST',
      body: JSON.stringify({ indexerId: this._indexerId, category, period: this._period }),
    });

    if (!data.success || !data.results) {
      this.shadowRoot.querySelector('#topResults').innerHTML = `
        <div class="empty-state">
          <mm-icon name="alert-triangle" size="40"></mm-icon>
          <p class="empty-error">${AppShell.escHtml(data.error || 'Failed to load')}</p>
        </div>
      `;
      return;
    }

    this._cache[cacheKey] = { results: data.results, ts: Date.now() };
    this._renderResults(data.results);
  }

  _renderResults(results) {
    this._results = results;
    const container = this.shadowRoot.querySelector('#topResults');
    const esc = AppShell.escHtml;
    const fmtSize = AppShell.fmtSize;

    if (!results.length) {
      container.innerHTML = '<div class="empty-state"><p class="empty-title">No results</p></div>';
      return;
    }

    container.innerHTML = `<div class="top-list">
      ${results.slice(0, 20).map((r, i) => `
        <div class="top-card" data-idx="${i}">
          <div class="top-rank ${i < 3 ? 'top3' : ''}">${i + 1}</div>
          <div class="top-body">
            <div class="top-title">${esc(r.title)}</div>
            <div class="top-meta">
              <span class="top-seeds">▲ ${r.seeders || 0}</span>
              <span class="top-size">${fmtSize(r.size)}</span>
              ${r.timeStr ? `<span class="top-age">${esc(r.timeStr)}</span>` : ''}
            </div>
          </div>
          <div class="top-actions">
            <button class="top-info-btn" data-action="info" data-idx="${i}" aria-label="Info">
              <mm-icon name="info" size="14"></mm-icon>
            </button>
            <button class="top-get-btn" data-action="get" data-idx="${i}">Get</button>
          </div>
        </div>
      `).join('')}
    </div>`;

    // Wire up buttons
    container.querySelectorAll('[data-action="info"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showTopInfo(parseInt(btn.dataset.idx));
      });
    });
    container.querySelectorAll('[data-action="get"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._grabTop(parseInt(btn.dataset.idx));
      });
    });
    container.querySelectorAll('.top-card').forEach(card => {
      card.addEventListener('click', () => this._showTopInfo(parseInt(card.dataset.idx)));
    });
  }

  async _showTopInfo(idx) {
    const r = this._results[idx];
    if (!r) return;
    const esc = AppShell.escHtml;

    // Parse title/year from torrent name
    const cleaned = r.title.replace(/\./g, ' ').replace(/_/g, ' ');
    const stopWords = /\b(1080p|2160p|720p|480p|4k|BluRay|WEB[-\s]?DL|WEBRip|HDTV|HEVC|x265|x264|AVC|HDR|DTS|AAC|AC3|REMUX|EXTENDED|REPACK|PROPER|IMAX|THEATRICAL|DIRECTORS|UNRATED|REMASTERED|COMPLETE|S\d{2}E\d{2}|S\d{2})\b/i;
    const stopMatch = cleaned.search(stopWords);
    const beforeTags = stopMatch > 0 ? cleaned.slice(0, stopMatch).trim() : cleaned;
    const match = beforeTags.match(/^(.+?)\s+(\d{4})\s*$/);
    const title = match ? match[1].trim() : beforeTags.replace(/\s*\d{4}\s*$/, '').trim() || r.title;
    const year = match ? match[2] : (cleaned.match(/\b(20\d{2})\b/) || [])[1] || '';
    const type = this._type === 'tv' ? 'tv' : 'movie';

    const overlay = this.shadowRoot.querySelector('#infoOverlay');
    overlay.innerHTML = `
      <div class="sheet-overlay" id="infoSheetOverlay">
        <div class="info-sheet">
          <div class="sheet-handle"></div>
          <div class="info-poster-row">
            <div class="info-poster-placeholder" id="infoPosterWrap">
              <mm-spinner size="20"></mm-spinner>
            </div>
            <div class="info-meta">
              <div class="info-title">${esc(title)}</div>
              <div class="info-sub">${year}${year ? ' · ' : ''}${type === 'tv' ? 'TV Show' : 'Movie'}</div>
              <div class="info-rating" id="infoRating"></div>
            </div>
          </div>
          <div class="info-overview" id="infoOverviewText">
            <mm-spinner size="16"></mm-spinner>
          </div>
          <button class="info-grab-btn" id="infoGrabBtn">
            <mm-icon name="download" size="18"></mm-icon>
            Get
          </button>
          <button class="sheet-cancel" id="infoCancel">Cancel</button>
        </div>
      </div>
    `;

    const overlayEl = overlay.querySelector('#infoSheetOverlay');
    overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) overlay.innerHTML = ''; });
    overlay.querySelector('#infoCancel').addEventListener('click', () => overlay.innerHTML = '');
    overlay.querySelector('#infoGrabBtn').addEventListener('click', () => {
      overlay.innerHTML = '';
      this._grabTop(idx);
    });

    // Fetch TMDB info
    try {
      let tmdb = null;
      if (r.imdbId) {
        const imdbData = await AppShell.api(`/companion/api/imdb/${r.imdbId}`);
        if (imdbData.success && imdbData.result) tmdb = imdbData.result;
      }
      if (!tmdb) {
        const typeParam = type === 'tv' ? '&type=tv' : '';
        const data = await AppShell.api(`/companion/api/search?q=${encodeURIComponent(title)}${typeParam}`);
        if (data.success && data.results && data.results.length) {
          const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
          const titleNorm = norm(title);
          const parsedYear = year ? parseInt(year) : null;
          const scored = data.results.map(x => {
            const xNorm = norm(x.title || '');
            const xYear = x.year ? parseInt(x.year) : null;
            let score = xNorm === titleNorm ? 2 : (xNorm.startsWith(titleNorm) || titleNorm.startsWith(xNorm) ? 1 : 0);
            if (parsedYear && xYear) {
              if (xYear === parsedYear) score += 2;
              else if (Math.abs(xYear - parsedYear) === 1) score += 1;
              else score -= 1;
            }
            return { x, score };
          });
          scored.sort((a, b) => b.score - a.score);
          tmdb = scored[0].x;
        }
      }

      if (tmdb && overlay.querySelector('#infoPosterWrap')) {
        const posterWrap = overlay.querySelector('#infoPosterWrap');
        if (tmdb.poster) {
          posterWrap.outerHTML = `<img class="info-poster" src="${tmdb.poster}" alt="">`;
        } else {
          posterWrap.innerHTML = `<mm-icon name="film" size="28"></mm-icon>`;
        }
        const titleEl = overlay.querySelector('.info-title');
        if (titleEl) titleEl.textContent = tmdb.title || title;
        const subEl = overlay.querySelector('.info-sub');
        if (subEl) subEl.textContent = `${tmdb.year || year}${(tmdb.year || year) ? ' · ' : ''}${type === 'tv' ? 'TV Show' : 'Movie'}`;
        if (tmdb.rating && tmdb.rating !== '0.0') {
          const ratingEl = overlay.querySelector('#infoRating');
          if (ratingEl) ratingEl.textContent = `★ ${tmdb.rating}`;
        }
        const overviewEl = overlay.querySelector('#infoOverviewText');
        if (overviewEl) overviewEl.textContent = tmdb.overview || 'No description available.';
      } else {
        const overviewEl = overlay.querySelector('#infoOverviewText');
        if (overviewEl) overviewEl.textContent = 'No TMDB info found.';
      }
    } catch (e) {
      const overviewEl = overlay.querySelector('#infoOverviewText');
      if (overviewEl) overviewEl.textContent = 'Could not load details.';
    }
  }

  async _grabTop(idx) {
    const r = this._results[idx];
    if (!r) return;
    const btn = this.shadowRoot.querySelector(`[data-action="get"][data-idx="${idx}"]`);
    if (!btn || btn.classList.contains('loading')) return;

    btn.classList.add('loading');
    btn.textContent = '...';

    // Parse title/year
    const cleaned = r.title.replace(/\./g, ' ').replace(/_/g, ' ');
    const stopWords = /\b(1080p|2160p|720p|480p|4k|BluRay|WEB[-\s]?DL|WEBRip|HDTV|HEVC|x265|x264|AVC|HDR|DTS|AAC|AC3|REMUX|EXTENDED|REPACK|PROPER|IMAX|S\d{2}E\d{2}|S\d{2})\b/i;
    const stopMatch = cleaned.search(stopWords);
    const beforeTags = stopMatch > 0 ? cleaned.slice(0, stopMatch).trim() : cleaned;
    const match = beforeTags.match(/^(.+?)\s+(\d{4})\s*$/);
    const title = match ? match[1].trim() : beforeTags.replace(/\s*\d{4}\s*$/, '').trim() || r.title;
    const year = match ? match[2] : (cleaned.match(/\b(20\d{2})\b/) || [])[1] || '';
    const type = this._type === 'tv' ? 'tv' : 'movie';

    try {
      // Resolve magnet if needed
      let magnetUrl = r.downloadUrl;
      if (!magnetUrl || !magnetUrl.startsWith('magnet:')) {
        try {
          const resolveData = await AppShell.api('/companion/api/top/resolve', {
            method: 'POST',
            body: JSON.stringify({ guid: r.guid, title: r.title, infoUrl: r.infoUrl }),
          });
          if (resolveData.success && resolveData.downloadUrl) magnetUrl = resolveData.downloadUrl;
        } catch {}
      }

      const smsPhone = localStorage.getItem('sms_phone') || '';
      const smsCarrier = localStorage.getItem('sms_carrier') || '';
      const data = await AppShell.api('/companion/api/get', {
        method: 'POST',
        body: JSON.stringify({
          title, year, type, skipPlexCheck: false,
          magnetUrl, torrentTitle: r.title,
          torrentSize: r.size, torrentSeeders: r.seeders,
          torrentIndexer: r.indexer,
          primaryIndexer: this._indexerId || null,
          exclusiveIndexer: !!this._indexerId,
          pushSubscription: AppShell.pushSubscription,
          smsPhone, smsCarrier,
        }),
      });

      btn.classList.remove('loading');
      if (data.error === 'already_in_plex') {
        btn.classList.add('plex-exists');
        btn.textContent = 'In Plex';
        AppShell.toast(`Already in Plex: ${title}`, 'info');
        setTimeout(() => { btn.classList.remove('plex-exists'); btn.textContent = 'Get'; }, 6000);
      } else if (data.success) {
        btn.classList.add('success');
        btn.textContent = 'Sent';
        AppShell.toast(`${title} — queued!`, 'success');
        setTimeout(() => { btn.classList.remove('success'); btn.textContent = 'Get'; }, 3000);
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (e) {
      btn.classList.remove('loading');
      btn.classList.add('error');
      btn.textContent = 'Failed';
      AppShell.toast(e.message || 'Failed', 'error');
      setTimeout(() => { btn.classList.remove('error'); btn.textContent = 'Get'; }, 3000);
    }
  }

  _setupListeners() {
    // Period tabs
    this.shadowRoot.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._period = btn.dataset.period;
        this._loadTop();
      });
    });

    // Type toggle
    this.shadowRoot.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._type = btn.dataset.topType;
        this._loadTop();
      });
    });

    // Refresh button
    const refreshBtn = this.shadowRoot.querySelector('#refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const cacheKey = `${this._period}-${this._type}`;
        delete this._cache[cacheKey];
        this._loadTop();
      });
    }
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>${Top20View._styles()}</style>
      <div class="top-container">
        <div class="top-header">
          <div class="top-header-row">
            <h2>Top 20</h2>
            <button class="refresh-btn" id="refreshBtn" aria-label="Refresh">
              <mm-icon name="refresh-cw" size="16"></mm-icon>
            </button>
          </div>
          <div class="period-toggle">
            <button class="period-btn active" data-period="day">Day</button>
            <button class="period-btn" data-period="week">Week</button>
            <button class="period-btn" data-period="month">Month</button>
          </div>
          <div class="type-toggle">
            <button class="type-btn active" data-top-type="movies">Movies</button>
            <button class="type-btn" data-top-type="tv">TV Shows</button>
          </div>
        </div>
        <div class="top-scroll">
          <div id="topResults" class="top-results">
            <div class="empty-state">
              <mm-icon name="star" size="48"></mm-icon>
              <p class="empty-title">Select a period to load top content</p>
            </div>
          </div>
        </div>
      </div>
      <div id="infoOverlay"></div>
    `;
  }

  static _styles() {
    return `
      :host {
        display: flex; flex-direction: column; height: 100%;
        color: var(--mm-text-primary, #e2e4ed);
        font-family: var(--mm-font-sans, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif);
      }

      .top-container { display: flex; flex-direction: column; height: 100%; }
      .top-header {
        flex-shrink: 0; padding: 8px 20px 12px;
        display: flex; flex-direction: column; gap: 10px;
      }
      .top-header-row {
        display: flex; align-items: center; justify-content: space-between;
      }
      .top-header h2 { font-size: 18px; font-weight: 700; }
      .refresh-btn {
        width: 34px; height: 34px; border-radius: 10px; border: none;
        background: var(--mm-bg-surface, #10121a);
        color: var(--mm-text-secondary, #8b8fa3);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
      }
      .refresh-btn:active { opacity: 0.6; }

      /* Period toggle */
      .period-toggle {
        display: flex; background: var(--mm-bg-surface, #10121a);
        border-radius: 12px; padding: 3px; gap: 2px;
      }
      .period-btn {
        flex: 1; padding: 8px; border: none; border-radius: 10px;
        background: none; color: var(--mm-text-muted, #4a4d5e);
        font-size: 13px; font-weight: 700; cursor: pointer;
        transition: all 0.15s; font-family: inherit;
      }
      .period-btn.active {
        background: var(--mm-accent, #6c5ce7); color: #fff;
        box-shadow: 0 2px 10px rgba(108,92,231,0.3);
      }
      .period-btn:active { opacity: 0.7; }

      /* Type toggle */
      .type-toggle { display: flex; gap: 8px; }
      .type-btn {
        flex: 1; padding: 7px 16px; border-radius: 20px;
        border: 1.5px solid var(--mm-border, #1e2030);
        background: var(--mm-bg-surface, #10121a);
        color: var(--mm-text-secondary, #8b8fa3);
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.15s; font-family: inherit;
      }
      .type-btn.active {
        background: var(--mm-accent-glow, rgba(108,92,231,0.18));
        color: var(--mm-accent, #6c5ce7);
        border-color: var(--mm-accent, #6c5ce7);
      }
      .type-btn:active { transform: scale(0.96); }

      /* Scroll */
      .top-scroll {
        flex: 1; overflow-y: auto; padding: 0 20px 24px;
        -webkit-overflow-scrolling: touch;
      }
      .top-results { display: flex; flex-direction: column; gap: 8px; }

      /* ── Top Card ────────────────────────────────────────── */
      .top-list { display: flex; flex-direction: column; gap: 8px; }
      .top-card {
        display: flex; gap: 12px; padding: 14px;
        background: var(--mm-bg-surface, #10121a);
        border: 1px solid var(--mm-border, #1e2030);
        border-radius: 14px; cursor: pointer;
        transition: all 0.15s; align-items: center;
      }
      .top-card:active { background: var(--mm-bg-elevated, #181b27); transform: scale(0.99); }
      .top-rank {
        font-size: 20px; font-weight: 800; color: var(--mm-text-muted, #4a4d5e);
        width: 28px; flex-shrink: 0; text-align: center; line-height: 1;
      }
      .top-rank.top3 { color: var(--mm-accent, #6c5ce7); }
      .top-body { flex: 1; min-width: 0; }
      .top-title {
        font-size: 13px; font-weight: 600; line-height: 1.4; margin-bottom: 4px;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .top-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .top-seeds { font-size: 12px; color: var(--mm-success, #3fb950); font-weight: 700; }
      .top-size { font-size: 12px; color: var(--mm-text-secondary, #8b8fa3); }
      .top-age { font-size: 11px; color: var(--mm-text-muted, #4a4d5e); }
      .top-actions { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; flex-shrink: 0; }
      .top-info-btn {
        width: 30px; height: 30px; border-radius: 8px;
        border: 1px solid var(--mm-border, #1e2030);
        background: var(--mm-bg-elevated, #181b27);
        color: var(--mm-text-secondary, #8b8fa3);
        cursor: pointer; display: flex; align-items: center; justify-content: center;
      }
      .top-info-btn:active { background: var(--mm-border, #1e2030); }
      .top-get-btn {
        padding: 8px 18px; border-radius: 20px; border: none;
        background: var(--mm-accent, #6c5ce7); color: #fff;
        font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap;
        font-family: inherit; transition: all 0.15s;
        box-shadow: 0 2px 8px rgba(108,92,231,0.25);
      }
      .top-get-btn:active { transform: scale(0.95); }
      .top-get-btn.loading { background: var(--mm-text-muted, #4a4d5e); pointer-events: none; }
      .top-get-btn.success { background: var(--mm-success, #3fb950); }
      .top-get-btn.error { background: var(--mm-danger, #f85149); }
      .top-get-btn.plex-exists {
        background: var(--mm-accent-glow, rgba(108,92,231,0.18));
        color: var(--mm-accent, #6c5ce7);
        box-shadow: none;
      }

      /* ── Info Sheet ──────────────────────────────────────── */
      .sheet-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.65);
        z-index: 100;
        display: flex; align-items: flex-end; justify-content: center;
        animation: overlayFadeIn 0.15s ease;
      }
      @keyframes overlayFadeIn { from { opacity: 0; } }

      .info-sheet {
        background: var(--mm-bg-surface, #10121a);
        border: 1px solid var(--mm-border, #1e2030);
        border-radius: 20px 20px 0 0;
        padding: 12px 20px calc(20px + env(safe-area-inset-bottom, 0px));
        width: 100%; max-width: 480px;
        min-height: 50vh; max-height: 85vh; overflow-y: auto;
        animation: sheetSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        display: flex; flex-direction: column;
      }
      @keyframes sheetSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

      .sheet-handle {
        width: 36px; height: 4px; border-radius: 2px;
        background: var(--mm-text-muted, #4a4d5e);
        margin: 0 auto 16px;
      }
      .info-poster-row { display: flex; gap: 14px; margin-bottom: 14px; }
      .info-poster {
        width: 100px; height: 150px; border-radius: 12px; object-fit: cover;
        flex-shrink: 0; background: var(--mm-bg-elevated, #181b27);
      }
      .info-poster-placeholder {
        width: 100px; height: 150px; border-radius: 12px;
        background: var(--mm-bg-elevated, #181b27);
        display: flex; align-items: center; justify-content: center;
        color: var(--mm-text-muted, #4a4d5e); flex-shrink: 0;
      }
      .info-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; padding-top: 4px; }
      .info-title { font-size: 18px; font-weight: 700; line-height: 1.3; }
      .info-sub { font-size: 13px; color: var(--mm-text-secondary, #8b8fa3); }
      .info-rating { font-size: 14px; color: var(--mm-warning, #d29922); font-weight: 700; }
      .info-overview {
        font-size: 14px; color: var(--mm-text-secondary, #8b8fa3);
        line-height: 1.6; flex: 1; margin-bottom: 18px;
      }
      .info-grab-btn {
        width: 100%; padding: 16px; border: none; border-radius: 14px;
        background: var(--mm-accent, #6c5ce7); color: #fff;
        font-size: 16px; font-weight: 700; cursor: pointer;
        font-family: inherit; display: flex; align-items: center;
        justify-content: center; gap: 8px;
        box-shadow: 0 4px 20px rgba(108,92,231,0.3);
      }
      .info-grab-btn:active { transform: scale(0.97); opacity: 0.9; }
      .sheet-cancel {
        width: 100%; padding: 14px; margin-top: 8px; border: none;
        background: none; color: var(--mm-text-muted, #4a4d5e);
        font-size: 14px; cursor: pointer; font-family: inherit;
      }

      /* ── States ──────────────────────────────────────────── */
      .empty-state {
        text-align: center; padding: 60px 20px;
        color: var(--mm-text-muted, #4a4d5e);
        display: flex; flex-direction: column; align-items: center; gap: 8px;
      }
      .empty-state mm-icon { opacity: 0.3; }
      .empty-title { font-size: 15px; font-weight: 500; }
      .empty-error { font-size: 14px; color: var(--mm-danger, #f85149); }
      .loading-state { display: flex; justify-content: center; padding: 40px; }
    `;
  }
}

customElements.define('top20-view', Top20View);
