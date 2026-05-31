/**
 * ─────────────────────────────────────────────
 *  SHARED TOOLBAR  —  toolbar.js
 *
 *  TO ADD / REMOVE ITEMS: edit NAV_ITEMS only.
 *  Just put whatever href you want — relative,
 *  absolute, anything. It works like a normal link.
 *
 *  active: true  → marks this tab as highlighted.
 *  Set it to true on whichever page you're on.
 * ─────────────────────────────────────────────
 */

const NAV_ITEMS = [
  { label: 'Clock',     href: '/sms/',     active: false },
  { label: 'Grades',    href: '/sms/grades',    active: false },
  { label: 'Countdown', href: '/sms/countdown', active: false },
];

/* ── PWA install button — set false to hide it entirely ── */
const SHOW_INSTALL = true;

/* ═══════════════════════════════════════════════════════
   Don't edit below this line
═══════════════════════════════════════════════════════ */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    #_toolbar {
      position: fixed;
      bottom: 1.4rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px;
      border-radius: 9999px;
      background: rgba(20, 20, 22, 0.72);
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
      white-space: nowrap;
    }
    #_toolbar a, #_toolbar button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      letter-spacing: 0.01em;
      text-decoration: none;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.55);
      cursor: pointer;
      transition: background 0.16s, color 0.16s, transform 0.1s;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    #_toolbar a:hover, #_toolbar button:hover {
      background: rgba(255,255,255,0.10);
      color: rgba(255,255,255,0.9);
    }
    #_toolbar a:active, #_toolbar button:active {
      transform: scale(0.95);
    }
    #_toolbar a._active {
      background: rgba(255,255,255,0.14);
      color: #ffffff;
    }
    #_toolbar ._divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.12);
      flex-shrink: 0;
      margin: 0 2px;
    }
    #_toolbar #_tb_install { display: none; }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = '_toolbar';
  nav.setAttribute('aria-label', 'Site navigation');

  NAV_ITEMS.forEach((item, i) => {
    if (i > 0) {
      const div = document.createElement('span');
      div.className = '_divider';
      div.setAttribute('aria-hidden', 'true');
      nav.appendChild(div);
    }
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.active) {
      a.className = '_active';
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });

  if (SHOW_INSTALL) {
    const div = document.createElement('span');
    div.className = '_divider';
    div.setAttribute('aria-hidden', 'true');
    nav.appendChild(div);

    const btn = document.createElement('button');
    btn.id = '_tb_install';
    btn.textContent = 'Install';
    btn.setAttribute('aria-label', 'Install app');
    nav.appendChild(btn);

    let _evt = null;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault(); _evt = e; btn.style.display = '';
    });
    btn.addEventListener('click', async () => {
      if (!_evt) return;
      _evt.prompt();
      const { outcome } = await _evt.userChoice;
      if (outcome === 'accepted') btn.style.display = 'none';
      _evt = null;
    });
    window.addEventListener('appinstalled', () => { btn.style.display = 'none'; });
  }

  document.body.appendChild(nav);
})();