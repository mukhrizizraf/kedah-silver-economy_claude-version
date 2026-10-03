/* ==========================================================================
   Kedah Silver Economy: page controllers
   One init per body[data-page]. Each init binds events once and pushes its
   render functions onto K.onLang, which the shell runs on load and on every
   language switch.
   ========================================================================== */
(function (K) {
'use strict';
var $ = K.$, $$ = K.$$, esc = K.esc;

/* ---------- 01 Overview ---------- */
K.pageInit.overview = function () {
  var svg = $('#constellation'), first = true, scene = $('[data-scene]'), hero = $('#hero');
  /* The sheet rises over the photo and the photo recedes behind it, the way
     an iOS view steps back when a sheet is presented. One scroll listener
     writes --p (0 to 1); kse-ios.css does the rest. */
  if (hero && scene && !K.reduceMotion) {
    var ticking = false;
    var settle = function () {
      ticking = false;
      var h = scene.offsetHeight || 1, p = Math.min(1, Math.max(0, window.scrollY / (h * 0.7)));
      hero.style.setProperty('--p', p.toFixed(3));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(settle); } }, { passive: true });
    settle();
  }
  /* A restrained cursor parallax keeps the couple and the room feeling like
     a living illustration without moving layout or stealing the CTAs. */
  if (scene && !K.reduceMotion) {
    var raf = 0;
    scene.addEventListener('pointermove', function (e) {
      var r = scene.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - .5) * 2;
      var y = ((e.clientY - r.top) / r.height - .5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        scene.style.setProperty('--mx', (x * 8).toFixed(2) + 'px');
        scene.style.setProperty('--my', (y * 5).toFixed(2) + 'px');
      });
    });
    scene.addEventListener('pointerleave', function () {
      scene.style.setProperty('--mx', '0px'); scene.style.setProperty('--my', '0px');
    });
  }
  function go(node) { if (node) location.href = 'network.html#r' + node.getAttribute('data-idx'); }
  svg.addEventListener('click', function (e) { go(e.target.closest('.node')); });
  svg.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { var n = e.target.closest('.node'); if (n) { e.preventDefault(); go(n); } }
  });
  var STATS = {
    ecosystem: { n: String(K.schema.length), l: { en: 'types of data', bm: 'jenis data' } },
    network: { n: K.counts.Verified + ' / ' + K.records.length, l: { en: 'confirmed so far', bm: 'disahkan setakat ini' } },
    scenario: { n: '3', l: { en: 'sample people', bm: 'contoh warga emas' } },
    roadmap: { n: '9', l: { en: 'months, 4 phases', bm: 'bulan, 4 fasa' } },
    evidence: { n: String(K.reviews.length), l: { en: 'reviewer comments', bm: 'ulasan penilai' } },
    data: { n: '11', l: { en: 'workbook sheets', bm: 'lembaran workbook' } },
    app: { n: '10', l: { en: 'app screens', bm: 'skrin aplikasi' } }
  };
  /* the map draws on its own, so a problem there never blanks the lists below */
  K.onLang.push(function () { K.viz.constellation(svg, $('#consLegend'), first); first = false; });
  K.onLang.push(function () {
    $('#why').innerHTML = K.why.map(function (w) {
      return '<div class="fig"><b>' + esc(K.L(w.big)) + '</b><p>' + esc(K.L(w.t)) + '</p><small>' + esc(K.T('Source: ', 'Sumber: ') + K.L(w.src)) + '</small></div>';
    }).join('');
    $('#partnerList').innerHTML = K.partners.map(function (p) {
      var s = K.partnerStatus[p.s];
      return '<li><b>' + esc(K.L(p.n)) + '</b>' + K.pill(s.c === 'verified' ? 'Verified' : 'Candidate', K.L(s)) + '</li>';
    }).join('');
    $('#team').innerHTML = K.team.map(function (m, i) {
      return '<li class="person' + (m.cls ? ' ' + m.cls : '') + '"><span class="avatar avatar-' + i + '" aria-hidden="true"></span><div><b>' + esc(m.n) + '</b><span>' + esc(K.L(m.r)) + '</span></div></li>';
    }).join('');
    $('#track').innerHTML = K.track.map(function (t) { return '<li><b>' + esc(t.n) + '</b><span>' + esc(K.L(t.t)) + '</span></li>'; }).join('');
    /* ticked in the application form, so each one carries a drawn tick */
    if ($('#plans')) $('#plans').innerHTML = K.plans.map(function (p) {
      return '<li><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg><b>' + esc(K.L(p.n)) + '</b><span>' + esc(K.L(p.t)) + '</span></li>';
    }).join('');
    if ($('#walk')) $('#walk').innerHTML = K.PAGES.slice(1).map(function (p, i) {
      var s = STATS[p.id];
      return '<a href="' + p.href + '"><span class="no"><span class="wk-icon">' + K.pageIcon(p.id) + '</span>0' + (i + 2) + K.icon('right') + '</span><b>' + esc(K.L(p.label)) + '</b><p>' + esc(K.L(p.desc)) + '</p>' +
        '<span class="stat"><strong>' + esc(s.n) + '</strong>' + esc(K.L(s.l)) + '</span></a>';
    }).join('');
  });
};

/* ---------- 02 Ecosystem ---------- */
K.pageInit.ecosystem = function () {
  var arrow = '<div class="fit-arrow" aria-hidden="true"><svg viewBox="0 0 16 22"><path d="M8 2v17M3 14l5 5 5-5"/></svg></div>';
  var engine = $('.engine');
  if (engine) {
    function closeEngine() {
      engine.classList.remove('is-open');
      engine.classList.add('is-dismissed');
      engine.setAttribute('aria-expanded', 'false');
    }
    function toggleEngine(e) {
      if (e && e.type === 'click' && window.matchMedia('(hover: hover)').matches && engine.matches(':hover') &&
          !engine.classList.contains('is-open') && !engine.classList.contains('is-dismissed')) {
        closeEngine();
        return;
      }
      var open = engine.classList.toggle('is-open');
      engine.classList.toggle('is-dismissed', !open);
      engine.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    engine.addEventListener('click', toggleEngine);
    engine.addEventListener('focusin', function () { engine.classList.remove('is-dismissed'); });
    engine.addEventListener('pointerleave', function () {
      if (!engine.classList.contains('is-open')) engine.classList.remove('is-dismissed');
    });
    engine.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEngine(); }
      if (e.key === 'Escape') closeEngine();
    });
    document.addEventListener('click', function (e) {
      if (!engine.contains(e.target)) closeEngine();
    });
  }
  function list(items) { return '<ul>' + items.map(function (x) { return '<li>' + esc(K.L(x)) + '</li>'; }).join('') + '</ul>'; }
  K.onLang.push(function () {
    $('#fit').innerHTML = K.fit.map(function (l) {
      var body = l.items
        ? '<ul class="chips">' + l.items.map(function (x) { return '<li>' + esc(K.L(x)) + '</li>'; }).join('') + '</ul>'
        : '<div class="layer-cols">' + l.cols.map(function (c) { return '<div><h4>' + esc(K.L(c.h)) + '</h4>' + list(c.items) + '</div>'; }).join('') + '</div>';
      return '<div class="layer' + (l.ours ? ' ours' : '') + '"><div class="layer-head"><h3>' + esc(K.L(l.t)) + '</h3><span class="layer-note">' + esc(K.L(l.note)) + '</span></div>' + body +
        (l.foot ? '<p class="layer-foot">' + esc(K.L(l.foot)) + '</p>' : '') + '</div>';
    }).join(arrow);
  });
  /* One real pass through the three steps, built from the same data the
     "Try a case" page uses, so the diagram above stops being abstract. */
  K.onLang.push(function () {
    var S = K.scenario, pre = S.presets[0], nd = S.needs[pre.need];
    /* the profile's own first port of call, not the need's fallback node: it
       is the agency a referral actually goes through, and it is confirmed */
    var node = S.nodes[S.profiles[pre.persona].nodes[0]];
    var idx = -1;
    if (node.m) for (var i = 0; i < K.records.length; i++) {
      if (K.records[i].name.indexOf(node.m) !== 0) continue;
      if (K.records[i].district === pre.district) { idx = i; break; }
      if (idx < 0) idx = i;
    }
    var rec = idx >= 0 ? K.records[idx] : null;
    var steps = [
      { h: K.T('The older person', 'Warga emas'),
        b: K.T('Manages alone, lives in ' + pre.district + ', needs ' + K.L(S.steps[nd.step]).toLowerCase() + '.',
               'Boleh urus diri, tinggal di ' + pre.district + ', perlukan ' + K.L(S.steps[nd.step]).toLowerCase() + '.') },
      { h: K.T('Matching step', 'Langkah padanan'),
        b: K.T('Look for a body that offers this help, works in ' + pre.district + ', has space, and takes referrals.',
               'Cari badan yang tawarkan bantuan ini, beroperasi di ' + pre.district + ', ada kekosongan, dan terima rujukan.') },
      { h: K.T('Result', 'Keputusan'),
        b: rec ? rec.name + ' · ' + rec.cap : K.L(node.n),
        pill: rec ? rec.status : node.s, href: rec ? 'network.html#r' + idx : null }
    ];
    $('#worked').innerHTML = steps.map(function (s, i) {
      return '<li><span class="n">' + (i + 1) + '</span><div><b>' + esc(s.h) + '</b>' +
        (s.href ? '<a href="' + s.href + '">' + esc(s.b) + K.icon('right') + '</a>' : '<p>' + esc(s.b) + '</p>') +
        (s.pill ? K.pill(s.pill) : '') + '</div></li>';
    }).join('');
  });

  K.onLang.push(function () {
    $('#schema').innerHTML = K.schema.map(function (s) {
      return '<div class="card"><div class="schema-head"><h3>' + esc(K.L(s.t)) + '</h3><span>' + s.f.length + ' ' + K.T('fields', 'medan') + '</span></div><ul class="fields">' +
        s.f.map(function (x, i) {
          var flag = s.key[i];
          return '<li' + (flag ? ' class="key" data-flag="' + esc(K.L(flag)) + '"' : '') + '>' + esc(K.lang === 'bm' ? x[1] : x[0]) + '</li>';
        }).join('') + '</ul></div>';
    }).join('');
  });
};

/* ---------- 03 Supply network ---------- */
K.pageInit.network = function () {
  var tf = $('#typeFilter'), df = $('#districtFilter'), sf = $('#statusFilter'), q = $('#search');
  var sortKey = null, sortDir = 1;
  var focusIdx = null, m = /^#r(\d+)$/.exec(location.hash || '');
  if (m && K.records[Number(m[1])]) focusIdx = Number(m[1]);

  /* Type and status sort by their own order, not alphabetically: Confirmed
     before To check before Example is the ranking that means something. */
  function keyOf(r, k) {
    if (k === 'type') return K.typeOrder.indexOf(r.type);
    if (k === 'status') return K.statusOrder.indexOf(r.status);
    return (k === 'name' ? r.name : r.district).toLowerCase();
  }
  function matches(r) {
    if (tf.value !== 'all' && r.type !== tf.value) return false;
    if (df.value !== 'all' && r.district !== df.value) return false;
    if (sf.value !== 'all' && r.status !== sf.value) return false;
    var t = q.value.trim().toLowerCase();
    return !t || (r.name + ' ' + r.cap + ' ' + r.district).toLowerCase().indexOf(t) >= 0;
  }

  function renderRecords() {
    var rows = [];
    K.records.forEach(function (r, idx) { if (matches(r)) rows.push(idx); });
    if (sortKey) rows.sort(function (a, b) {
      var x = keyOf(K.records[a], sortKey), y = keyOf(K.records[b], sortKey);
      return (x < y ? -1 : x > y ? 1 : a - b) * sortDir;
    });
    $('#records').innerHTML = rows.length ? rows.map(function (idx) {
      var r = K.records[idx], t = K.types[r.type];
      return '<tr id="r' + idx + '"><td class="org">' + esc(r.name) + '</td><td><span class="type"><i style="background:var(--t' + t.c + ')"></i>' + esc(K.L(t.one)) + '</span></td>' +
        '<td>' + esc(r.district) + '</td><td class="cap">' + esc(r.cap) + '</td><td>' + K.pill(r.status) + '</td></tr>';
    }).join('') : '<tr><td colspan="5" class="empty">' + esc(K.T('Nothing matches these filters. Try a wider filter.', 'Tiada padanan untuk penapis ini. Cuba penapis yang lebih luas.')) + '</td></tr>';
    $('#recordCount').textContent = K.T('Showing ' + rows.length + ' of ' + K.records.length, 'Memaparkan ' + rows.length + ' daripada ' + K.records.length);
    $$('.sort').forEach(function (b) {
      var on = b.getAttribute('data-sort') === sortKey;
      b.parentNode.setAttribute('aria-sort', on ? (sortDir > 0 ? 'ascending' : 'descending') : 'none');
      b.classList.toggle('is-on', on);
      b.classList.toggle('is-desc', on && sortDir < 0);
    });
    K.viz.districtChart($('#districtChart'), tf.value, sf.value, df.value);
  }

  /* The status counts double as filters, so the honest breakdown is also the
     fastest way to see only what we can vouch for. */
  function renderStatusBar() {
    $('#statusBar').innerHTML = K.statusOrder.map(function (s) {
      var on = sf.value === s;
      return '<li><button type="button" data-status="' + s + '" aria-pressed="' + on + '">' +
        K.pill(s, K.counts[s] + ' · ' + K.L(K.status[s])) + '</button></li>';
    }).join('') + '<li><button type="button" data-status="all" aria-pressed="' + (sf.value === 'all') + '" class="all">' +
      esc(K.T('Show all ' + K.records.length, 'Papar semua ' + K.records.length)) + '</button></li>' +
      '<li><button type="button" data-status="reset" class="reset">' + esc(K.T('Reset', 'Set semula')) + '</button></li>';
  }
  [tf, df, sf].forEach(function (el) { el.addEventListener('change', function () { renderStatusBar(); renderRecords(); }); });
  q.addEventListener('input', renderRecords);
  $$('.search-suggestions [data-search-example]').forEach(function (b) {
    b.addEventListener('click', function () { q.value = b.getAttribute('data-search-example'); renderRecords(); q.focus(); });
  });
  $('#statusBar').addEventListener('click', function (e) {
    var b = e.target.closest('[data-status]'); if (!b) return;
    if (b.getAttribute('data-status') === 'reset') {
      tf.value = 'all'; df.value = 'all'; sf.value = 'all'; q.value = '';
      sortKey = null; sortDir = 1; renderStatusBar(); renderRecords(); b.focus(); return;
    }
    sf.value = b.getAttribute('data-status');
    renderStatusBar(); renderRecords();
    var again = $('#statusBar [data-status="' + b.getAttribute('data-status') + '"]'); if (again) again.focus();
  });
  $$('.sort').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-sort');
      if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = 1; }
      renderRecords();
    });
  });

  K.onLang.push(function () {
    q.placeholder = K.T('Name or service', 'Nama atau perkhidmatan');
    $('#statusKeys').innerHTML = K.statusOrder.map(function (s) { return '<li>' + K.pill(s) + '<span>' + esc(K.L(K.status[s].key)) + '</span></li>'; }).join('');
    $('#dLegend').innerHTML = K.statusOrder.map(function (s) { return K.pill(s); }).join('');
    renderStatusBar();
    renderRecords();
    if (focusIdx !== null) {
      var row = document.getElementById('r' + focusIdx);
      if (row) {
        row.scrollIntoView({ block: 'center', behavior: K.reduceMotion ? 'auto' : 'smooth' });
        row.classList.add('flash');
      }
      focusIdx = null;
    }
  });
};

/* ---------- 04 Try a case: see kse-assist.js (rules) and kse-case-ui.js (screens) ---------- */

/* ---------- 08 Our Silver App ---------- */
K.pageInit.app = function () {
  var current = 0, screens = K.$$('[data-screen]'), dots = $('#appDots'), progress = $('#appProgress');
  function show(n) {
    current = Math.max(0, Math.min(screens.length - 1, n));
    screens.forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-screen')) === current); });
    if (progress) progress.style.setProperty('--v', ((current + 1) / screens.length * 100) + '%');
    if (dots) dots.innerHTML = screens.map(function (s, i) { return '<button type="button" class="' + (i === current ? 'is-on' : '') + '" data-app-dot="' + i + '" aria-label="Screen ' + (i + 1) + '"></button>'; }).join('');
    /* the last screen draws a Lottie tick each time it is reached */
    var done = $('#appDone');
    if (done && K.lottie && current === screens.length - 1) K.lottie(done, 'check', { loop: false });
    var back = $('#appScreenBack');
    if (back) {
      back.disabled = !current;
      back.style.visibility = current ? 'visible' : 'hidden';
    }
  }
  function move(n) { show(n); }
  $('#appLaunch').addEventListener('click', function () { move(0); document.querySelector('.phone-mock').scrollIntoView({ behavior: K.reduceMotion ? 'auto' : 'smooth', block: 'center' }); });
  $('#appScreens').addEventListener('click', function (e) {
    var next = e.target.closest('[data-app-next]'), reset = e.target.closest('[data-app-reset]'), choice = e.target.closest('.mock-choices button'), lang = e.target.closest('[data-app-lang]');
    if (next) move(current + 1); if (reset) move(0); if (choice) { var grp = choice.parentNode; if (grp.hasAttribute('data-multi')) { var on = !choice.classList.contains('is-selected'); choice.classList.toggle('is-selected', on); choice.setAttribute('aria-pressed', String(on)); } else { [].forEach.call(grp.querySelectorAll('button'), function (b) { b.classList.remove('is-selected'); b.setAttribute('aria-pressed', 'false'); }); choice.classList.add('is-selected'); choice.setAttribute('aria-pressed', 'true'); } } if (lang) K.setLang(K.lang === 'bm' ? 'en' : 'bm');
  });
  $('#appScreenBack').addEventListener('click', function () { move(current - 1); });
  $('#appDots').addEventListener('click', function (e) { var b = e.target.closest('[data-app-dot]'); if (b) move(Number(b.getAttribute('data-app-dot'))); });
  show(0);
};

/* ---------- 05 Roadmap & budget ---------- */
K.pageInit.roadmap = function () {
  K.onLang.push(function () {
    K.viz.roadStatus($('#roadStatus'));
    K.viz.budget($('#budget'));
  });
};

/* ---------- 06 Evidence ---------- */
K.pageInit.evidence = function () {
  K.onLang.push(function () {
    var n = { Verified: 0, Candidate: 0, Demo: 0 };
    K.reviews.forEach(function (r) { n[r.s]++; });
    $('#revSummary').innerHTML = ['Verified', 'Candidate', 'Demo'].map(function (s) {
      return K.pill(s, n[s] + ' · ' + K.L(K.reviewStatus[s]));
    }).join('');
    $('#reviews').innerHTML = K.reviews.map(function (r, i) {
      return '<tr><td class="no">' + (i + 1) + '</td><td class="area">' + esc(K.L(r.area)) + '</td><td class="asked">' + esc(K.L(r.asked)) + '</td>' +
        '<td>' + esc(K.L(r.done)) + '</td><td class="where">' + esc(K.L(r.where)) + '</td><td>' + K.pill(r.s, K.L(K.reviewStatus[r.s])) + '</td></tr>';
    }).join('');
  });
};

})(window.KSE);
