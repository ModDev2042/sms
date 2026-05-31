(function(items){
  const css = document.createElement('style');
  css.textContent = `
    #_tb{position:fixed;bottom:1.4rem;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:2px;padding:4px;border-radius:9999px;background:rgba(20,20,22,0.75);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 4px 24px rgba(0,0,0,0.35);white-space:nowrap;}
    #_tb a{display:inline-flex;align-items:center;padding:6px 16px;border-radius:9999px;font-size:13px;font-weight:500;font-family:ui-sans-serif,system-ui,sans-serif;text-decoration:none;color:rgba(255,255,255,0.5);transition:background .15s,color .15s;}
    #_tb a:hover{background:rgba(255,255,255,0.1);color:#fff;}
    #_tb a.on{background:rgba(255,255,255,0.15);color:#fff;}
    #_tb span{width:1px;height:14px;background:rgba(255,255,255,0.12);margin:0 2px;flex-shrink:0;display:block;}
  `;
  document.head.appendChild(css);
  const nav = document.createElement('nav');
  nav.id = '_tb';
  items.forEach((item, i) => {
    if (i > 0) nav.appendChild(document.createElement('span'));
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.active) a.className = 'on';
    nav.appendChild(a);
  });
  document.body.appendChild(nav);
})(window._toolbar_items);