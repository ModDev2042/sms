/**
 * ─────────────────────────────────────────────
 * SHARED TOOLBAR  —  toolbar.js
 * Drop  <script src="./toolbar.js" data-config="YOUR_JSON_URL"></script>
 * anywhere before </body> on any page.
 * ─────────────────────────────────────────────
 */

(async function () {
  /* 1. Grab the URL from the script tag's data-config attribute */
  const currentScript = document.currentScript;
  const configUrl = currentScript ? currentScript.getAttribute('data-config') : null;

  let NAV_ITEMS = [];

  /* 2. Fetch the remote items if a URL is provided */
  if (configUrl) {
    try {
      const response = await fetch(configUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      NAV_ITEMS = await response.json();
    } catch (error) {
      console.error('Toolbar: Failed to load links from URL', error);
      return; 
    }
  } else {
    // Fallback if no data-config URL is provided in the HTML
    NAV_ITEMS = [
      { label: 'Clock',     href: './' },
      { label: 'Grades',    href: './grades' },
      { label: 'Countdown', href: './countdown' },
    ];
  }

  /* ── PWA install (optional — shows only when browser fires the prompt) ────── */
  const SHOW_INSTALL = true;

  /* ═══════════════════════════════════════════════════════════════════
     Internal UI & Logic
  ═══════════════════════════════════════════════════════════════════ */
  
  function isActive(href) {
    try {
      const targetUrl = new URL(href, document.baseURI);
      if (targetUrl.host !== location.host) return false;

      const normalize = (path) => {
        return path
          .replace(/\/index\.html$/, '') 
          .replace(/\.html$/, '')        
          .replace(/\/$/, '');           
      };

      const currentClean = normalize(location.pathname);
      const targetClean = normalize(targetUrl.pathname);

      if ((currentClean === '' || currentClean === '/sms') && (targetClean === '' || targetClean === '/sms')) {
        return true;
      }

      return currentClean === targetClean;
    } catch (e) {
      return false;
    }
  }

  /* Inject styles once */
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

  // Inject navigation elements into DOM
  document.body.appendChild(nav);

  /* URL Masking — Placed here at the very end so it doesn't break active classes */
  if (location.pathname.endsWith('.html')) {
    const cleanPath = location.pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '');
    window.history.replaceState(null, '', cleanPath + location.search + location.hash);
  }
})();