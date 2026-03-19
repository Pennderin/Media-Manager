// ═══════════════════════════════════════════════════════════════
// Settings View — notifications, SMS, connection, preferences
// ═══════════════════════════════════════════════════════════════

class SettingsView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loaded = false;
  }

  connectedCallback() {
    this._render();
    this._setupListeners();
  }

  onActivated() {
    this._loadSettings();
    this._updateNotifButton();
    this._loadSmsSettings();
    this._loadIndexerPills();
  }

  onDeactivated() {}

  async _loadSettings() {
    try {
      const data = await AppShell.api('/companion/api/config');
      const dot = this.shadowRoot.querySelector('#statusDot');
      const text = this.shadowRoot.querySelector('#statusText');

      if (data.configured) {
        dot.className = 'status-dot ok';
        text.textContent = 'Connected to Media Manager';
      } else {
        dot.className = 'status-dot err';
        text.textContent = 'Not configured — edit config.json';
      }

      if (data.preferences) {
        this.shadowRoot.querySelector('#prefQuality').value = data.preferences.quality || '1080p';
        this.shadowRoot.querySelector('#prefMaxSize').value = data.preferences.maxSizeGB || 4;
        this.shadowRoot.querySelector('#prefMaxSizeTV').value = data.preferences.maxSizeGBTV || 60;
        this.shadowRoot.querySelector('#prefMinSeed').value = data.preferences.minSeeders || 5;
      }
    } catch {
      const dot = this.shadowRoot.querySelector('#statusDot');
      const text = this.shadowRoot.querySelector('#statusText');
      if (dot) dot.className = 'status-dot err';
      if (text) text.textContent = 'Cannot reach server';
    }
    this._loaded = true;
  }

  _loadSmsSettings() {
    const phone = localStorage.getItem('sms_phone') || '';
    const carrier = localStorage.getItem('sms_carrier') || '';
    const phoneInput = this.shadowRoot.querySelector('#smsPhone');
    const carrierSelect = this.shadowRoot.querySelector('#smsCarrier');
    if (phone && phoneInput) phoneInput.value = phone;
    if (carrier && carrierSelect) carrierSelect.value = carrier;
  }

  _saveSmsSettings() {
    const phone = this.shadowRoot.querySelector('#smsPhone').value.replace(/\D/g, '');
    const carrier = this.shadowRoot.querySelector('#smsCarrier').value;
    localStorage.setItem('sms_phone', phone);
    localStorage.setItem('sms_carrier', carrier);
  }

  async _testSms() {
    const status = this.shadowRoot.querySelector('#smsStatus');
    const phone = localStorage.getItem('sms_phone') || '';
    const carrier = localStorage.getItem('sms_carrier') || '';
    status.textContent = 'Sending...';
    status.style.color = 'var(--mm-text-secondary)';
    try {
      const d = await AppShell.api('/companion/api/sms/test', { method: 'POST', body: JSON.stringify({ smsPhone: phone, smsCarrier: carrier }) });
      status.textContent = d.success ? 'SMS sent!' : 'Failed: ' + (d.error || 'Unknown');
      status.style.color = d.success ? 'var(--mm-success)' : 'var(--mm-danger)';
    } catch (e) {
      status.textContent = 'Error: ' + e.message;
      status.style.color = 'var(--mm-danger)';
    }
  }

  async _savePreferences() {
    const prefs = {
      quality: this.shadowRoot.querySelector('#prefQuality').value,
      maxSizeGB: parseInt(this.shadowRoot.querySelector('#prefMaxSize').value) || 4,
      maxSizeGBTV: parseInt(this.shadowRoot.querySelector('#prefMaxSizeTV').value) || 60,
      minSeeders: parseInt(this.shadowRoot.querySelector('#prefMinSeed').value) || 5,
    };
    await AppShell.api('/companion/api/config', {
      method: 'POST',
      body: JSON.stringify({ preferences: prefs }),
    });
    AppShell.toast('Preferences saved', 'success');
  }

  _loadIndexerPills() {
    const cur = AppShell.getIndexer();
    this.shadowRoot.querySelectorAll('.indexer-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.idx === cur);
    });
  }

  _updateNotifButton() {
    const btn = this.shadowRoot.querySelector('#notifBtn');
    const dbg = this.shadowRoot.querySelector('#notifDebug');
    if (!btn) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    const supported = 'PushManager' in window;

    if (dbg) {
      dbg.textContent = `iOS:${isIOS} standalone:${isStandalone} PushManager:${supported} permission:${supported ? Notification.permission : 'n/a'}`;
    }

    if (isIOS && !isStandalone) {
      btn.textContent = 'Add to Home Screen First';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else if (!supported) {
      btn.textContent = 'Not Supported';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else if (Notification.permission === 'granted' && AppShell.pushSubscription) {
      btn.textContent = 'Notifications Enabled';
      btn.classList.add('notif-on');
    } else if (Notification.permission === 'denied') {
      btn.textContent = 'Blocked — Enable in Settings';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else {
      btn.textContent = 'Enable Notifications';
    }
  }

  async _requestPushPermission() {
    if (!('PushManager' in window)) {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone = window.navigator.standalone;
      if (isIOS && !isStandalone) {
        AppShell.toast('Add to Home Screen first, then enable notifications', 'error');
      } else {
        AppShell.toast('Push notifications not supported in this browser', 'error');
      }
      return;
    }
    if (Notification.permission === 'granted') {
      await AppShell.subscribePush();
      this._updateNotifButton();
      AppShell.toast('Notifications enabled', 'success');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      await AppShell.subscribePush();
      this._updateNotifButton();
      AppShell.toast('Notifications enabled', 'success');
    } else {
      AppShell.toast('Notification permission denied', 'error');
    }
  }

  _setupListeners() {
    // Notification button
    this.shadowRoot.querySelector('#notifBtn').addEventListener('click', () => this._requestPushPermission());

    // SMS
    this.shadowRoot.querySelector('#smsPhone').addEventListener('input', () => this._saveSmsSettings());
    this.shadowRoot.querySelector('#smsCarrier').addEventListener('change', () => this._saveSmsSettings());
    this.shadowRoot.querySelector('#testSmsBtn').addEventListener('click', () => this._testSms());

    // Preferences auto-save
    ['prefQuality', 'prefMaxSize', 'prefMaxSizeTV', 'prefMinSeed'].forEach(id => {
      this.shadowRoot.querySelector(`#${id}`).addEventListener('change', () => this._savePreferences());
    });

    // Indexer pills
    this.shadowRoot.querySelectorAll('.indexer-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        AppShell.setIndexer(pill.dataset.idx);
        this._loadIndexerPills();
      });
    });
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>${SettingsView._styles()}</style>
      <div class="settings-container">
        <div class="settings-scroll">
          <h2 class="page-title">Settings</h2>

          <!-- Notifications -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="bell" size="14"></mm-icon>
              Push Notifications
            </div>
            <div class="card">
              <p class="card-desc">Get notified when your download is ready in Plex</p>
              <button id="notifBtn" class="action-btn">Enable Notifications</button>
              <div id="notifDebug" class="debug-text"></div>
            </div>
          </div>

          <!-- SMS -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="send" size="14"></mm-icon>
              SMS Notifications
            </div>
            <div class="card">
              <div class="field-row">
                <label>Phone Number</label>
                <input type="tel" id="smsPhone" placeholder="5551234567" class="field-input" />
              </div>
              <div class="field-row">
                <label>Carrier</label>
                <select id="smsCarrier" class="field-select">
                  <option value="">-- Select --</option>
                  <option value="txt.att.net">AT&T</option>
                  <option value="tmomail.net">T-Mobile</option>
                  <option value="vtext.com">Verizon</option>
                  <option value="messaging.sprintpcs.com">Sprint</option>
                  <option value="pcs.rogers.com">Rogers</option>
                  <option value="txt.bell.ca">Bell</option>
                  <option value="text.telus.com">Telus</option>
                  <option value="msg.telus.com">Telus (alt)</option>
                </select>
              </div>
              <button id="testSmsBtn" class="action-btn secondary">Send Test SMS</button>
              <div id="smsStatus" class="status-text"></div>
            </div>
          </div>

          <!-- Connection -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="globe" size="14"></mm-icon>
              Connection
            </div>
            <div class="card">
              <div class="status-row">
                <span class="status-dot unknown" id="statusDot"></span>
                <span id="statusText">Checking...</span>
              </div>
            </div>
          </div>

          <!-- Quality -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="eye" size="14"></mm-icon>
              Preferred Quality
            </div>
            <div class="card">
              <div class="field-row">
                <label>Quality</label>
                <select id="prefQuality" class="field-select">
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                  <option value="720p">720p</option>
                  <option value="any">Any</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Size Limits -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="hash" size="14"></mm-icon>
              Size Limits
            </div>
            <div class="card">
              <div class="field-row">
                <label>Max Movie Size (GB)</label>
                <input type="number" id="prefMaxSize" min="1" max="100" value="4" class="field-input narrow" />
              </div>
              <div class="field-row">
                <label>Max TV Size (GB)</label>
                <input type="number" id="prefMaxSizeTV" min="1" max="200" value="60" class="field-input narrow" />
              </div>
            </div>
          </div>

          <!-- Seeders -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="chevron-down" size="14"></mm-icon>
              Seeders
            </div>
            <div class="card">
              <div class="field-row">
                <label>Minimum Seeders</label>
                <input type="number" id="prefMinSeed" min="0" max="100" value="5" class="field-input narrow" />
              </div>
            </div>
          </div>

          <!-- Preferred Indexer -->
          <div class="section">
            <div class="section-label">
              <mm-icon name="search" size="14"></mm-icon>
              Preferred Indexer
            </div>
            <div class="card">
              <p class="card-desc">Choose which tracker to search first</p>
              <div class="indexer-pills">
                <button class="indexer-pill" data-idx="1337x">1337x</button>
                <button class="indexer-pill" data-idx="extto">ext.to</button>
                <button class="indexer-pill" data-idx="nyaa">Nyaa</button>
              </div>
            </div>
          </div>

          <p class="footer-text">
            Media Companion v2.0<br>
            Server settings are configured in config.json
          </p>
        </div>
      </div>
    `;
  }

  static _styles() {
    return `
      :host {
        display: flex; flex-direction: column; height: 100%;
        color: var(--mm-text-primary, #e2e4ed);
        font-family: var(--mm-font-sans, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif);
      }

      .settings-container { display: flex; flex-direction: column; height: 100%; }
      .settings-scroll {
        flex: 1; overflow-y: auto; padding: 8px 20px 40px;
        -webkit-overflow-scrolling: touch;
      }
      .page-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }

      /* ── Section ─────────────────────────────────────────── */
      .section { margin-bottom: 24px; }
      .section-label {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.8px; color: var(--mm-text-secondary, #8b8fa3);
        margin-bottom: 10px; display: flex; align-items: center; gap: 6px;
      }
      .section-label mm-icon { opacity: 0.6; }

      /* ── Card ────────────────────────────────────────────── */
      .card {
        background: var(--mm-bg-surface, #10121a);
        border: 1px solid var(--mm-border, #1e2030);
        border-radius: 14px; padding: 16px;
        display: flex; flex-direction: column; gap: 12px;
      }
      .card-desc {
        font-size: 13px; color: var(--mm-text-secondary, #8b8fa3);
        margin: 0;
      }

      /* ── Field Row ───────────────────────────────────────── */
      .field-row {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px;
      }
      .field-row label {
        font-size: 14px; flex-shrink: 0;
      }
      .field-input, .field-select {
        background: var(--mm-bg-base, #08090d);
        border: 1.5px solid var(--mm-border, #1e2030);
        border-radius: 10px; color: var(--mm-text-primary, #e2e4ed);
        padding: 10px 14px; font-size: 14px; outline: none;
        font-family: inherit; transition: border-color 0.2s;
      }
      .field-input:focus, .field-select:focus {
        border-color: var(--mm-accent, #6c5ce7);
      }
      .field-input { width: 140px; }
      .field-input.narrow { width: 80px; text-align: center; }
      .field-select { min-width: 140px; }

      /* ── Buttons ─────────────────────────────────────────── */
      .action-btn {
        width: 100%; padding: 12px; border-radius: 12px;
        border: 1.5px solid rgba(108,92,231,0.3);
        background: var(--mm-accent-glow, rgba(108,92,231,0.18));
        color: var(--mm-accent, #6c5ce7);
        font-size: 14px; font-weight: 600; cursor: pointer;
        font-family: inherit; transition: all 0.15s;
      }
      .action-btn:active { transform: scale(0.98); }
      .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .action-btn.notif-on {
        background: rgba(63,185,80,0.12);
        color: var(--mm-success, #3fb950);
        border-color: rgba(63,185,80,0.3);
      }
      .action-btn.secondary {
        background: var(--mm-bg-base, #08090d);
        border-color: var(--mm-border, #1e2030);
        color: var(--mm-text-secondary, #8b8fa3);
      }

      /* ── Status ──────────────────────────────────────────── */
      .status-row {
        display: flex; align-items: center; gap: 10px;
        font-size: 14px;
      }
      .status-dot {
        width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      }
      .status-dot.ok { background: var(--mm-success, #3fb950); box-shadow: 0 0 8px var(--mm-success, #3fb950); }
      .status-dot.err { background: var(--mm-danger, #f85149); }
      .status-dot.unknown { background: var(--mm-text-muted, #4a4d5e); }
      .status-text {
        font-size: 12px; color: var(--mm-text-secondary, #8b8fa3);
        text-align: center;
      }
      .debug-text {
        font-size: 10px; color: var(--mm-text-muted, #4a4d5e);
        font-family: monospace; word-break: break-all;
      }

      /* ── Indexer Pills ───────────────────────────────────── */
      .indexer-pills { display: flex; gap: 6px; }
      .indexer-pill {
        flex: 1; padding: 10px 0; text-align: center;
        font-size: 13px; font-weight: 600;
        border-radius: 10px;
        border: 1.5px solid var(--mm-border, #1e2030);
        background: var(--mm-bg-base, #08090d);
        color: var(--mm-text-secondary, #8b8fa3);
        cursor: pointer; transition: all 0.15s; font-family: inherit;
      }
      .indexer-pill.active {
        background: var(--mm-accent-glow, rgba(108,92,231,0.18));
        color: var(--mm-accent, #6c5ce7);
        border-color: var(--mm-accent, #6c5ce7);
      }
      .indexer-pill:active { transform: scale(0.96); }

      /* ── Footer ──────────────────────────────────────────── */
      .footer-text {
        text-align: center; margin-top: 32px;
        font-size: 11px; color: var(--mm-text-muted, #4a4d5e);
        line-height: 1.6;
      }
    `;
  }
}

customElements.define('settings-view', SettingsView);
