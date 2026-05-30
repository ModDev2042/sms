/**
 * ─────────────────────────────────────────────
 *  SHARED TOOLBAR  —  toolbar.js
 *  Drop  <script src="./toolbar.js"></script>
 *  anywhere before </body> on any page.
 *
 *  TO ADD / REMOVE ITEMS  ↓  edit NAV_ITEMS only.
 *  Each entry:
 *    { label: 'Display name', href: '/any/path/you/want' }
 *  Use any href you like — absolute paths, relative paths,
 *  or full URLs. Active tab is auto-detected from the URL.
 * ─────────────────────────────────────────────
 */

const NAV_ITEMS = [
  { label: 'Clock',     href: '/clock'     },
  { label: 'Grades',    href: '/grades'    },
  { label: 'Countdown', href: '/countdown' },
];

/* ── PWA install (optional — shows only when browser fires the prompt) ────── */
const SHOW_INSTALL = true;

/* ═══════════════════════════════════════════════════════════════════
   Internal — do not edit below unless you know what you're doing
═══════════════════════════════════════════════════════════════════ */
(function () {
  /* Detect active page by matching href tail against current path */
  function isActive(href) {
    const path = location.pathname.replace(/\/$/, '') || '/';
    const target = href.replace(/^\./, '').replace(/\/index\.html$/, '') || '/';
    return path === target || path.endsWith(target);
  }

  /* Inject styles once, scoped to #_toolbar so they never bleed */
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
      /* neutral pill that works on any background */
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

  /* Build the nav */
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
    if (isActive(item.href)) {
      a.className = '_active';
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });

  /* PWA install button */
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

    let _installEvt = null;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      _installEvt = e;
      btn.style.display = '';
    });
    btn.addEventListener('click', async () => {
      if (!_installEvt) return;
      _installEvt.prompt();
      const { outcome } = await _installEvt.userChoice;
      if (outcome === 'accepted') btn.style.display = 'none';
      _installEvt = null;
    });
    window.addEventListener('appinstalled', () => { btn.style.display = 'none'; });
  }

  document.body.appendChild(nav);
})();