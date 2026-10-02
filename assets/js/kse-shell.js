/* ==========================================================================
   Kedah Silver Economy: shared shell
   Placed as the FIRST child of <body data-page="…">. It injects the top bar
   and drawer immediately (no layout jump), then on DOMContentLoaded adds the
   footer pager + tooltip, runs the page's init (kse-pages.js) and applies the
   language. Also owns: helpers, i18n, theme, arrow-key page navigation.
   ========================================================================== */
(function (K) {
'use strict';
var doc = document, body = doc.body, root = doc.documentElement;

/* ---------- Helpers ---------- */
K.$ = function (s, r) { return (r || doc).querySelector(s); };
K.$$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
K.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
K.store = {
  get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
K.reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
K.lang = K.store.get('kse-lang') === 'bm' ? 'bm' : 'en';
K.L = function (v) { return v == null ? '' : typeof v === 'string' ? v : (v[K.lang] || v.en); };
K.T = function (en, bm) { return K.lang === 'bm' ? bm : en; };
K.pill = function (s, label) {
  return '<span class="pill ' + s.toLowerCase() + '"><i aria-hidden="true"></i>' + K.esc(label || K.L(K.status[s])) + '</span>';
};
K.onLang = [];    // render functions re-run on every language change
K.pageInit = {};  // filled by kse-pages.js, keyed by body[data-page]

/* ---------- Site map (order = pitch order) ---------- */
K.PAGES = [
{id:'overview',href:'index.html',label:{en:'Overview',bm:'Latar belakang'},
 desc:{en:'What the project is, why it matters and what it will deliver.',bm:'Apa projek ini, kenapa ia penting dan apa hasilnya.'}},
{id:'ecosystem',href:'ecosystem.html',label:{en:'How it works',bm:'Cara ia berfungsi'},
 desc:{en:'How an older person\'s needs are matched to help.',bm:'Bagaimana keperluan warga emas dipadankan dengan bantuan.'}},
{id:'network',href:'network.html',label:{en:'Who can help',bm:'Siapa boleh membantu'},
 desc:{en:'The 30 organisations on our list, and which ones are confirmed.',bm:'30 organisasi dalam senarai kami, dan yang mana sudah disahkan.'}},
{id:'scenario',href:'scenario.html',label:{en:'Try a case',bm:'Cuba satu kes'},
 desc:{en:'Pick a person and a need, and see what help they get.',bm:'Pilih warga emas dan keperluannya, dan lihat bantuan yang ada.'}},
{id:'roadmap',href:'roadmap.html',label:{en:'Plan & budget',bm:'Pelan & bajet'},
 desc:{en:'What happens each month, and how the RM30,000 is spent.',bm:'Apa berlaku setiap bulan, dan bagaimana RM30,000 dibelanjakan.'}},
{id:'evidence',href:'evidence.html',label:{en:'Sources',bm:'Sumber'},
 desc:{en:'The documents behind this dashboard and the reviewer comments.',bm:'Dokumen di sebalik dashboard ini dan ulasan penilai.'}}
,{id:'data',href:'data.html',label:{en:'Data blueprint',bm:'Pelan data'},
 desc:{en:'The sheets and fields needed to turn this prototype into a working dashboard.',bm:'Lembaran dan medan yang diperlukan untuk menjadikan prototaip ini dashboard sebenar.'}}
,{id:'app',href:'app.html',label:{en:'Our Silver App',bm:'Aplikasi Silver Kami'},
 desc:{en:'A screen-by-screen mock app for an older person seeking help.',bm:'Simulasi skrin demi skrin untuk warga emas mencari bantuan.'}}
];
K.page = body.getAttribute('data-page') || 'overview';
K.pageIndex = 0;
K.PAGES.forEach(function (p, i) { if (p.id === K.page) K.pageIndex = i; });

/* ---------- Icons ---------- */
var ICON = {
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  right:'<path d="M5 12h13M13 6l6 6-6 6"/>',
  left:'<path d="M19 12H6M11 6l-6 6 6 6"/>'
};
K.icon = function (n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; };

/* ---------- Page icons ----------
   One drawn icon per page. Each part carries pathLength="1" so the page head
   can draw it in, and the parts that move on hover carry a class (see the
   "Page icons" block in kse.css). The motion says what the page does:
   the compass finds its bearing, the match turns, someone joins, the
   sliders move, the plan gets ticked, the lines of a source get written. */
var PICON = {
  overview: '<circle pathLength="1" cx="12" cy="12" r="8.6"/><path class="ai-n" pathLength="1" d="M15 9l-1.8 4.2L9 15l1.8-4.2z"/>',
  ecosystem: '<circle pathLength="1" cx="5.2" cy="6.8" r="2.4"/><path class="ai-l1" pathLength="1" d="M6.9 8.6l3.2 4"/>' +
    '<g class="ai-m"><rect pathLength="1" x="9.3" y="13.3" width="5.4" height="5.4" rx=".9" transform="rotate(45 12 16)"/></g>' +
    '<path class="ai-l2" pathLength="1" d="M13.9 12.6l3.2-4"/><circle class="ai-b" pathLength="1" cx="18.8" cy="6.8" r="2.4"/>',
  network: '<circle pathLength="1" cx="9" cy="8.2" r="3.2"/><path pathLength="1" d="M3.4 19.6a5.6 5.6 0 0 1 11.2 0"/>' +
    '<g class="ai-p"><circle pathLength="1" cx="17" cy="9.4" r="2.4"/><path pathLength="1" d="M16.2 14.2c2.6.3 4.4 2.3 4.4 5.2"/></g>',
  scenario: '<path class="ai-t" pathLength="1" d="M3.5 7h17M3.5 12h17M3.5 17h17"/>' +
    '<circle class="ai-k1" pathLength="1" cx="8.5" cy="7" r="2.1"/><circle class="ai-k2" pathLength="1" cx="15.5" cy="12" r="2.1"/><circle class="ai-k3" pathLength="1" cx="7" cy="17" r="2.1"/>',
  roadmap: '<rect pathLength="1" x="3.6" y="5.2" width="16.8" height="15.3" rx="2.6"/><path pathLength="1" d="M3.6 9.9h16.8"/>' +
    '<path class="ai-pin" pathLength="1" d="M8 3.2v3.6M16 3.2v3.6"/><path class="ai-c" pathLength="1" d="M8.8 15.2l2.2 2.2 4.3-4.4"/>',
  evidence: '<path pathLength="1" d="M14 3.2H7.6A1.6 1.6 0 0 0 6 4.8v14.4a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6V7.2z"/><path pathLength="1" d="M14 3.2v4h4"/>' +
    '<path class="ai-r1" pathLength="1" d="M9 11.6h6"/><path class="ai-r2" pathLength="1" d="M9 14.6h6"/><path class="ai-r3" pathLength="1" d="M9 17.6h3.6"/>',
  data: '<path pathLength="1" d="M4 5.5h6v6H4zM14 5.5h6v6h-6zM4 15.5h6v3H4zM14 15.5h6v3h-6z"/><path class="ai-r1" pathLength="1" d="M10 8.5h4M10 17h4"/>',
  app: '<rect pathLength="1" x="6" y="2.8" width="12" height="18.4" rx="2.2"/><path pathLength="1" d="M9.5 5.6h5M10.4 18.3h3.2"/><circle class="ai-app-dot" pathLength="1" cx="12" cy="11.4" r="2.8"/>'
};
K.pageIcon = function (id) { return '<svg class="ai ai-' + id + '" viewBox="0 0 24 24" aria-hidden="true">' + (PICON[id] || '') + '</svg>'; };
K.mark = '<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><path class="leaf" d="M24 5C13 10 8 20 12 29c4 10 14 14 23 9 8-5 8-17 3-24C34 9 29 6 24 5Z"/><path class="vein" d="M14 35c7-8 12-16 10-28M15 28c5-1 9-3 13-7"/><circle class="node" cx="9" cy="35" r="3"/><circle class="node" cx="39" cy="11" r="3"/><circle class="node" cx="24" cy="5" r="3"/></svg>';
function no(i) { return (i + 1 < 10 ? '0' : '') + (i + 1); }

/* ---------- Theme ---------- */
function effectiveTheme() {
  var a = root.getAttribute('data-theme');
  if (a) return a;
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function toggleTheme() {
  var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  K.store.set('kse-theme', next);
  renderChrome();
  var b = K.$('#themeBtn'); if (b) b.focus();
}

/* ---------- Chrome: top bar + drawer ---------- */
var chrome = doc.createElement('div');
chrome.id = 'kse-chrome';
body.insertBefore(chrome, body.firstChild);

function langSwitch() {
  return '<div class="lang" role="group" aria-label="' + K.T('Language', 'Bahasa') + '">' +
    '<button class="lang-btn" data-lang="en" aria-pressed="' + (K.lang === 'en') + '" title="English">EN</button>' +
    '<button class="lang-btn" data-lang="bm" aria-pressed="' + (K.lang === 'bm') + '" title="Bahasa Melayu">BM</button></div>';
}
/* iOS chrome. Wide screens get an iPad sidebar (Settings-style icon tiles);
   narrower screens get a frosted nav bar and an iOS tab bar with four pages
   plus More, which opens the full list as a bottom sheet (#drawer). The
   bars carry view-transition names, so they hold still while the page
   underneath pushes in. */
var TABBED = ['overview', 'ecosystem', 'network', 'scenario'];
function tile(id) { return '<span class="tile tile-' + id + '">' + K.pageIcon(id) + '</span>'; }
function renderChrome() {
  var dark = effectiveTheme() === 'dark';
  var cur = K.PAGES[K.pageIndex];
  var rows = K.PAGES.map(function (p) {
    return '<a class="srow" href="' + p.href + '"' + (p.id === K.page ? ' aria-current="page"' : '') + '>' + tile(p.id) +
      '<span class="srow-label">' + K.esc(K.L(p.label)) + '</span></a>';
  }).join('');
  var tabs = TABBED.map(function (id) {
    var p = K.PAGES.filter(function (x) { return x.id === id; })[0];
    return '<a class="tbtn" href="' + p.href + '"' + (p.id === K.page ? ' aria-current="page"' : '') + '>' + K.pageIcon(p.id) + '<span>' + K.esc(K.L(p.label)) + '</span></a>';
  }).join('');
  var inMore = TABBED.indexOf(K.page) < 0;
  var dlinks = K.PAGES.map(function (p, i) {
    return '<a class="dlink" href="' + p.href + '"' + (p.id === K.page ? ' aria-current="page"' : '') + '>' + tile(p.id) + '<b><em>' + no(i) + '</em>' + K.esc(K.L(p.label)) + '</b><small>' + K.esc(K.L(p.desc)) + '</small></a>';
  }).join('');
  chrome.innerHTML =
    '<a class="skip" href="#main">' + K.T('Skip to content', 'Langkau ke kandungan') + '</a>' +
    '<aside class="sidebar" aria-label="' + K.T('Pages', 'Halaman') + '">' +
      '<a class="brand" href="index.html">' + K.mark + '<span><b>Kedah Silver Economy</b><small>' + K.T('UUM Scale-Up Research Grant 2026', 'Geran Penyelidikan Scale-Up UUM 2026') + '</small></span></a>' +
      '<nav class="side-list" aria-label="' + K.T('Pages', 'Halaman') + '">' + rows + '</nav>' +
      '<div class="side-foot">' + langSwitch() + '</div>' +
    '</aside>' +
    '<header class="navbar"><div class="navbar-row">' +
      '<a class="brand nav-brand" href="index.html">' + K.mark + '<span><b>Kedah Silver Economy</b></span></a>' +
      '<span class="nav-title" aria-hidden="true">' + K.esc(K.L(cur.label)) + '</span>' +
      '<div class="tools"><span class="nav-spinner" aria-hidden="true"></span>' + langSwitch() +
        '<button class="iconbtn" id="themeBtn" aria-label="' + (dark ? K.T('Switch to light theme', 'Tukar ke tema cerah') : K.T('Switch to dark theme', 'Tukar ke tema gelap')) + '">' + K.icon(dark ? 'sun' : 'moon') + '</button>' +
      '</div>' +
    '</div></header>' +
    '<nav class="ios-tabbar" aria-label="' + K.T('Main pages', 'Halaman utama') + '">' + tabs +
      '<button class="tbtn" id="menuBtn" type="button" aria-expanded="false" aria-controls="drawer"' + (inMore ? ' aria-current="page"' : '') + '>' + K.icon('menu') + '<span>' + K.T('More', 'Lagi') + '</span></button>' +
    '</nav>' +
    '<div class="scrim" id="scrim" hidden></div>' +
    '<nav class="drawer" id="drawer" aria-label="' + K.T('All pages', 'Semua halaman') + '" hidden>' +
      '<span class="grabber" aria-hidden="true"></span>' +
      '<div class="drawer-head"><b>' + K.T('All pages', 'Semua halaman') + '</b>' +
      '<button class="done-btn" id="drawerClose" type="button">' + K.T('Done', 'Selesai') + '</button></div>' +
      '<div class="dlist">' + dlinks + '</div>' + langSwitch() +
    '</nav>';
  if (K.spin) K.spin();
}
function openDrawer() {
  K.$('#drawer').hidden = false; K.$('#scrim').hidden = false;
  body.classList.add('drawer-open');
  K.$('#menuBtn').setAttribute('aria-expanded', 'true');
  var cur = K.$('#drawer [aria-current="page"]') || K.$('#drawer a');
  if (cur) cur.focus();
}
function closeDrawer(refocus) {
  var d = K.$('#drawer'); if (!d || d.hidden) return;
  d.hidden = true; K.$('#scrim').hidden = true;
  body.classList.remove('drawer-open');
  var m = K.$('#menuBtn'); m.setAttribute('aria-expanded', 'false');
  if (refocus !== false) m.focus();
}
chrome.addEventListener('click', function (e) {
  var t = e.target.closest ? e.target.closest('button,#scrim') : null;
  if (!t) return;
  if (t.id === 'menuBtn') openDrawer();
  else if (t.id === 'drawerClose' || t.id === 'scrim') closeDrawer();
  else if (t.id === 'themeBtn') toggleTheme();
  else if (t.classList.contains('lang-btn')) K.setLang(t.getAttribute('data-lang'));
});

/* ---------- Page changes ----------
   Links navigate at once. The browser's own cross-document view transition
   (see "Push transition" in kse-ios.css) slides the new page in like an iOS
   push; the inline script in each <head> sets html[data-dir] so a lower
   page number slides back the other way. Two things make it feel instant:
   Chrome prerenders a page while the pointer rests on its link, and if a
   page is still slow after 350ms the nav bar shows the iOS spinner. */
var spinTimer = 0;
K.spin = function () {
  var el = K.$('.nav-spinner');
  if (el && !el._lottie && K.lottie) K.lottie(el, 'spinner');
};
function stopSpin() { clearTimeout(spinTimer); root.classList.remove('is-loading'); }
doc.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
  if (u.origin !== location.origin || u.pathname === location.pathname) return;
  stopSpin();
  spinTimer = setTimeout(function () { K.spin(); root.classList.add('is-loading'); }, 350);
});
/* Back and Forward can restore this page from the cache with the spinner still on. */
window.addEventListener('pageshow', stopSpin);
window.addEventListener('pagehide', stopSpin);
if (doc.prerendering) {
  root.classList.add('is-prerendering');
  doc.addEventListener('prerenderingchange', function () { root.classList.remove('is-prerendering'); }, { once: true });
}
if (location.protocol !== 'file:' && window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
  var rules = doc.createElement('script');
  rules.type = 'speculationrules';
  rules.textContent = JSON.stringify({ prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { selector_matches: '[download]' } }] }, eagerness: 'moderate' }] });
  doc.head.appendChild(rules);
}
doc.addEventListener('DOMContentLoaded', function () {
  var overviewDrawers = K.$$('.overview-button-grid .home-drawer');
  overviewDrawers.forEach(function (drawer) {
    var bodyPanel = drawer.querySelector('.drawer-body');
    if (bodyPanel) {
      drawer.querySelector('summary').addEventListener('click', function (e) {
        if (drawer.open) {
          e.preventDefault();
          bodyPanel.style.maxHeight = bodyPanel.scrollHeight + 'px';
          requestAnimationFrame(function () { bodyPanel.style.maxHeight = '0px'; });
          window.setTimeout(function () { drawer.open = false; bodyPanel.style.maxHeight = ''; }, 600);
        } else {
          window.setTimeout(function () {
            bodyPanel.style.maxHeight = '0px';
            requestAnimationFrame(function () { bodyPanel.style.maxHeight = bodyPanel.scrollHeight + 'px'; });
          }, 0);
        }
      });
    }
    drawer.addEventListener('toggle', function () {
      if (!drawer.open) return;
      overviewDrawers.forEach(function (other) {
        if (other !== drawer && other.open) {
          var otherPanel = other.querySelector('.drawer-body');
          if (otherPanel) otherPanel.style.maxHeight = '0px';
          other.open = false;
          if (otherPanel) otherPanel.style.maxHeight = '';
        }
      });
    });
  });
  var pageDrawers = K.$$('.page-drawer');
  pageDrawers.forEach(function (drawer) {
    var panel = drawer.querySelector('.page-drawer-body');
    var summary = drawer.querySelector('summary');
    if (panel && summary) {
      summary.addEventListener('click', function (e) {
        if (drawer.open) {
          e.preventDefault();
          panel.style.maxHeight = panel.scrollHeight + 'px';
          requestAnimationFrame(function () { panel.style.maxHeight = '0px'; });
          window.setTimeout(function () { drawer.open = false; panel.style.maxHeight = ''; }, 620);
        } else {
          window.setTimeout(function () {
            panel.style.maxHeight = '0px';
            requestAnimationFrame(function () { panel.style.maxHeight = panel.scrollHeight + 'px'; });
          }, 0);
        }
      });
    }
    drawer.addEventListener('toggle', function () {
      if (!drawer.open) return;
      pageDrawers.forEach(function (other) {
        if (other !== drawer && other.open) {
          var otherPanel = other.querySelector('.page-drawer-body');
          if (otherPanel) otherPanel.style.maxHeight = '0px';
          other.open = false;
          if (otherPanel) otherPanel.style.maxHeight = '';
        }
      });
    });
  });
  var pagehead = K.$('.pagehead-grid');
  /* Our own page art (assets/art/), set in K.pageArt by kse-art.js. */
  var pageArt = K.pageArt || {};
  if (pagehead && K.page !== 'overview' && !K.$('.page-character') && pageArt[K.page]) {
    var figure = doc.createElement('figure');
    figure.className = 'page-character page-character-' + K.page;
    var img = doc.createElement('img');
    img.src = pageArt[K.page];
    img.alt = '';
    figure.appendChild(img);
    var marker = doc.createElement('span');
    marker.className = 'page-character-mark';
    marker.innerHTML = K.pageIcon(K.page);
    figure.appendChild(marker);
    var stat = K.$('.headstat', pagehead);
    pagehead.insertBefore(figure, stat || null);
  }
  initLargeTitle();
});

/* ---------- Large title ----------
   Like iOS: the page's big heading is the title. Once it scrolls under the
   nav bar, the bar shows the page name small and gains its hairline. */
function initLargeTitle() {
  var h = K.$('main h1');
  if (!h || !window.IntersectionObserver) return;
  new IntersectionObserver(function (es) {
    root.classList.toggle('title-tucked', !es[0].isIntersecting && es[0].boundingClientRect.top < 0);
  }, { rootMargin: '-60px 0px 0px 0px' }).observe(h);
}

/* ---------- Footer: pager ---------- */
function renderFooter() {
  var foot = K.$('#kse-foot'); if (!foot) return;
  var i = K.pageIndex, prev = K.PAGES[i - 1], next = K.PAGES[i + 1] || K.PAGES[0];
  var nextDir = K.PAGES[i + 1] ? K.T('Next', 'Seterusnya') : K.T('Back to the start', 'Kembali ke permulaan');
  var mainFooter = K.page === 'overview' ? '<section class="site-foot-main" aria-label="' + K.T('Project navigation', 'Navigasi projek') + '">' +
    '<div class="site-foot-brand">' + K.mark + '<div><b>Kedah Silver Economy</b><p>' + K.T('A prototype that shows how older people in Kedah could be linked to help.', 'Prototaip yang menunjukkan cara warga emas di Kedah boleh dihubungkan dengan bantuan.') + '</p></div></div>' +
    '<div class="site-foot-links">' +
      '<div><span>' + K.T('DASHBOARD', 'DASHBOARD') + '</span><a href="index.html">' + K.T('Overview', 'Latar belakang') + '</a><a href="ecosystem.html">' + K.T('How it works', 'Cara ia berfungsi') + '</a><a href="network.html">' + K.T('Who can help', 'Siapa boleh membantu') + '</a><a href="scenario.html">' + K.T('Try a case', 'Cuba satu kes') + '</a></div>' +
      '<div><span>' + K.T('PROJECT', 'PROJEK') + '</span><a href="roadmap.html">' + K.T('Plan &amp; budget', 'Pelan &amp; bajet') + '</a><a href="evidence.html">' + K.T('Sources', 'Sumber') + '</a><a href="data.html">' + K.T('Data blueprint', 'Pelan data') + '</a><a href="app.html">' + K.T('Our Silver App', 'Aplikasi Silver Kami') + '</a></div>' +
      '<div><span>' + K.T('ABOUT', 'TENTANG') + '</span><p>' + K.T('9 months, Nov 2026 to Jul 2027', '9 bulan, Nov 2026 hingga Jul 2027') + '</p><p>' + K.T('Kedah pilot concept', 'Konsep percubaan Kedah') + '</p></div>' +
    '</div>' +
  '</section>' : '';
  foot.innerHTML = '<footer class="site-foot"><div class="wrap">' +
    '<nav class="pager" aria-label="' + K.T('Page sequence', 'Urutan halaman') + '">' +
      (prev ? '<a class="prev" href="' + prev.href + '" rel="prev"><span class="pg-icon">' + K.pageIcon(prev.id) + '</span><span class="dir">' + K.icon('left') + K.T('Previous', 'Sebelumnya') + ' · ' + no(i - 1) + '</span><b>' + K.esc(K.L(prev.label)) + '</b></a>' : '<span class="ghost"></span>') +
      '<a class="next" href="' + next.href + '"' + (K.PAGES[i + 1] ? ' rel="next"' : '') + '><span class="pg-icon">' + K.pageIcon(next.id) + '</span><span class="dir">' + nextDir + ' · ' + no(K.PAGES.indexOf(next)) + K.icon('right') + '</span><b>' + K.esc(K.L(next.label)) + '</b></a>' +
    '</nav>' +
    mainFooter +
    '<div class="foot-row"><span>' + K.T('Prototype for the UUM Scale-Up Research Grant 2026. The organisation list is a sample only.', 'Prototaip untuk Geran Penyelidikan Scale-Up UUM 2026. Senarai organisasi hanyalah contoh.') + '</span>' +
    '<span class="keys-hint"><kbd>←</kbd> <kbd>→</kbd> ' + K.T('move between pages', 'bergerak antara halaman') + '</span></div>' +
  '</div></footer>';
  K.$$('.step[data-step]').forEach(function (el) {
    var dots = K.PAGES.map(function (p, j) { return '<i' + (j === i ? ' class="on"' : '') + '></i>'; }).join('');
    el.innerHTML = tile(K.page) + '<span>' + K.T('Page ', 'Halaman ') + no(i) + ' / ' + no(K.PAGES.length - 1) + '</span><span class="dots" aria-hidden="true">' + dots + '</span>';
  });
}

/* ---------- Tooltip (any element with data-tip="<html>") ---------- */
function initTooltip() {
  var tip = K.$('#tip');
  function place(html, x, y) {
    tip.innerHTML = html; tip.hidden = false;
    var w = tip.offsetWidth, h = tip.offsetHeight, left = x + 14, top = y + 14;
    if (left + w > innerWidth - 8) left = x - w - 14;
    if (top + h > innerHeight - 8) top = y - h - 14;
    tip.style.left = Math.max(8, left) + 'px'; tip.style.top = Math.max(8, top) + 'px';
  }
  doc.addEventListener('pointermove', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    if (el && e.pointerType !== 'touch') place(el.getAttribute('data-tip'), e.clientX, e.clientY);
    else tip.hidden = true;
  });
  doc.addEventListener('focusin', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
    if (el) { var r = el.getBoundingClientRect(); place(el.getAttribute('data-tip'), r.right, r.top); }
  });
  doc.addEventListener('focusout', function () { tip.hidden = true; });
  window.addEventListener('scroll', function () { tip.hidden = true; }, { passive: true });
}

/* ---------- Count-up for [data-count] numbers ---------- */
function countUp() {
  if (K.reduceMotion) return;
  K.$$('[data-count]').forEach(function (el) {
    var target = Number(el.getAttribute('data-count')), t0 = performance.now(), D = 900;
    if (!isFinite(target) || el.getAttribute('data-counted')) return;
    el.setAttribute('data-counted', '1');
    var final = el.textContent, done = false;
    function finish() { done = true; el.textContent = final; }
    (function step(t) {
      if (done) return;
      var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      if (k < 1) { el.textContent = String(Math.round(target * e)); requestAnimationFrame(step); } else finish();
    })(t0);
    // rAF pauses in background tabs, print and capture; never leave a partial figure on screen
    setTimeout(finish, D + 100);
    window.addEventListener('beforeprint', finish);
  });
}

/* ---------- Keyboard: ← → move through the pitch ---------- */
doc.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeDrawer(); return; }
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  var t = e.target;
  if (t && t.closest && t.closest('input,select,textarea,[contenteditable],.table-scroll,.gantt-scroll,.drawer')) return;
  var p = K.PAGES[K.pageIndex + (e.key === 'ArrowRight' ? 1 : -1)];
  if (p) location.href = p.href;
});

/* ---------- i18n ---------- */
K.applyLang = function () {
  root.lang = K.lang === 'bm' ? 'ms' : 'en';
  K.$$('[data-i18n]').forEach(function (el) {
    if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
    var k = el.getAttribute('data-i18n');
    el.textContent = (K.lang === 'bm' && K.bm[k]) ? K.bm[k] : el.getAttribute('data-en');
  });
  renderChrome();
  renderFooter();
  K.onLang.forEach(function (fn) { try { fn(); } catch (err) { if (window.console) console.error(err); } });
  root.classList.remove('i18n-pending');
};
K.setLang = function (l) {
  K.lang = l === 'bm' ? 'bm' : 'en';
  K.store.set('kse-lang', K.lang);
  var drawerOpen = K.$('#drawer') && !K.$('#drawer').hidden;
  K.applyLang();
  if (drawerOpen) closeDrawer(false);
  var b = K.$('.navbar .lang-btn[data-lang="' + K.lang + '"]'); if (b && b.offsetParent) b.focus();
};

/* ---------- Boot ---------- */
if (K.lang === 'bm') { root.classList.add('i18n-pending'); setTimeout(function () { root.classList.remove('i18n-pending'); }, 1500); }
renderChrome();
doc.addEventListener('DOMContentLoaded', function () {
  var foot = doc.createElement('div'); foot.id = 'kse-foot'; body.appendChild(foot);
  var tip = doc.createElement('div'); tip.id = 'tip'; tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; body.appendChild(tip);
  initTooltip();
  /* static markup can ask for a page icon: <span data-icon="scenario"></span> */
  K.$$('[data-icon]').forEach(function (el) { el.innerHTML = K.pageIcon(el.getAttribute('data-icon')); });
  var init = K.pageInit[K.page];
  if (init) { try { init(); } catch (err) { if (window.console) console.error(err); } }
  K.applyLang();
  /* a prerendered page counts up when it is actually shown, not while hidden */
  if (doc.prerendering) doc.addEventListener('prerenderingchange', countUp, { once: true }); else countUp();
});

})(window.KSE);
