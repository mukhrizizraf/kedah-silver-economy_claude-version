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
    data: { n: '11', l: { en: 'workbook sheets', bm: 'lembaran workbook' } }
  };
  K.onLang.push(function () {
    K.viz.constellation(svg, $('#consLegend'), first); first = false;
    $('#why').innerHTML = K.why.map(function (w) {
      return '<div class="fig"><b>' + esc(K.L(w.big)) + '</b><p>' + esc(K.L(w.t)) + '</p><small>' + esc(K.T('Source: ', 'Sumber: ') + K.L(w.src)) + '</small></div>';
    }).join('');
    $('#partnerList').innerHTML = K.partners.map(function (p) {
      var s = K.partnerStatus[p.s];
      return '<li><b>' + esc(K.L(p.n)) + '</b>' + K.pill(s.c === 'verified' ? 'Verified' : 'Candidate', K.L(s)) + '</li>';
    }).join('');
    $('#team').innerHTML = K.team.map(function (m, i) {
      return '<li class="person' + (m.cls ? ' ' + m.cls : '') + '"><span class="avatar avatar-' + i + '" aria-hidden="true">' + esc(m.i || '') + '</span><div><b>' + esc(m.n) + '</b><span>' + esc(K.L(m.r)) + '</span></div></li>';
    }).join('');
    $('#track').innerHTML = K.track.map(function (t) { return '<li><b>' + esc(t.n) + '</b><span>' + esc(K.L(t.t)) + '</span></li>'; }).join('');
    /* ticked in the application form, so each one carries a drawn tick */
    if ($('#plans')) $('#plans').innerHTML = K.plans.map(function (p) {
      return '<li><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg><b>' + esc(K.L(p.n)) + '</b><span>' + esc(K.L(p.t)) + '</span></li>';
    }).join('');
    $('#walk').innerHTML = K.PAGES.slice(1).map(function (p, i) {
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
    function toggleEngine() {
      var open = engine.classList.toggle('is-open');
      engine.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    engine.addEventListener('click', toggleEngine);
    engine.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEngine(); }
      if (e.key === 'Escape') { engine.classList.remove('is-open'); engine.setAttribute('aria-expanded', 'false'); }
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

/* ---------- 04 Scenario lab ---------- */
K.pageInit.scenario = function () {
  var S = K.scenario, ageBand = $('#ageBand'), gender = $('#gender'), persona = $('#persona'), district = $('#district'), mukim = $('#mukim'), living = $('#living'), need = $('#need'), income = $('#income');
  var shown = null, raf = 0, routeAnimation = null;
  var DISTRICTS = Object.keys(S.districtAdj);

  function updateMukim() {
    if (!mukim) return;
    var list = S.mukimByDistrict[district.value] || [];
    mukim.innerHTML = list.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('');
  }
  var wizard = $('#intakeWizard'), wizardStep = 1, wizardState = { ageBand:'60-64', gender:'woman', district:district.value, mukim:'', persona:'independent', support:['alone'], financialSupport:[], income:'3500', living:'alone', needs:['companion'], urgency:'info' };
  function wizardOptions() {
    var wd = $('#wizardDistrict'), wm = $('#wizardMukim');
    if (!wd || !wm) return;
    wd.innerHTML = DISTRICTS.map(function (d) { return '<option>' + esc(d) + '</option>'; }).join(''); wd.value = wizardState.district;
    wm.innerHTML = (S.mukimByDistrict[wd.value] || []).map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('');
    if (wizardState.mukim && (S.mukimByDistrict[wd.value] || []).indexOf(wizardState.mukim) >= 0) wm.value = wizardState.mukim;
    wizardState.mukim = wm.value;
  }
  function setWizardChoices() {
    if (!wizard) return;
    K.$$('[data-choice-group]').forEach(function (group) { var key = group.getAttribute('data-choice-group'); group.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-selected', String(wizardState[key]) === b.getAttribute('data-value')); }); });
    K.$$('[data-multi-group]').forEach(function (group) { var key = group.getAttribute('data-multi-group'); group.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-selected', (wizardState[key] || []).indexOf(b.getAttribute('data-value')) >= 0); }); });
  }
  function showWizardStep() {
    if (!wizard) return;
    wizard.querySelectorAll('.intake-step').forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-step')) === wizardStep); });
    $('#intakeStepLabel').textContent = 'Step ' + wizardStep + ' of 5'; $('#intakeProgressBar').style.setProperty('--v', (wizardStep * 20) + '%');
    $('#intakeBack').disabled = wizardStep === 1; $('#intakeNext').textContent = wizardStep === 5 ? 'See support options' : 'Next';
    wizardOptions(); setWizardChoices();
  }
  function finishWizard() {
    ageBand.value = wizardState.ageBand; gender.value = wizardState.gender; district.value = wizardState.district; updateMukim(); if (wizardState.mukim) mukim.value = wizardState.mukim;
    persona.value = wizardState.persona; living.value = wizardState.living; income.value = wizardState.income; setNeeds(wizardState.needs); update(false); wizard.classList.add('is-complete');
    var score = document.querySelector('.lab'); if (score) score.scrollIntoView({behavior:K.reduceMotion?'auto':'smooth',block:'start'});
  }
  if (wizard) {
    wizard.addEventListener('click', function (e) {
      var mode = e.target.closest('[data-mode]'); if (mode) return;
      var choice = e.target.closest('[data-choice-group] button');
      if (choice) { wizardState[choice.parentNode.getAttribute('data-choice-group')] = choice.getAttribute('data-value'); setWizardChoices(); return; }
      var multi = e.target.closest('[data-multi-group] button');
      if (multi) { var key = multi.parentNode.getAttribute('data-multi-group'), v = multi.getAttribute('data-value'), a = wizardState[key] || []; wizardState[key] = a.indexOf(v) >= 0 ? a.filter(function (x) { return x !== v; }) : a.concat(v); if (!wizardState[key].length) wizardState[key] = [v]; setWizardChoices(); }
    });
    $('#wizardDistrict').addEventListener('change', function () { wizardState.district = this.value; wizardState.mukim = ''; wizardOptions(); });
    $('#wizardMukim').addEventListener('change', function () { wizardState.mukim = this.value; });
    $('#intakeBack').addEventListener('click', function () { if (wizardStep > 1) { wizardStep--; showWizardStep(); } });
    $('#intakeNext').addEventListener('click', function () { if (wizardStep < 5) { wizardStep++; showWizardStep(); } else finishWizard(); });
    showWizardStep();
  }
  $$('.case-mode').forEach(function (b) { b.addEventListener('click', function () { var guided = b.getAttribute('data-mode') === 'guided'; $$('.case-mode').forEach(function (x) { x.classList.toggle('is-on', x === b); }); if (wizard) wizard.hidden = !guided; $$('.quick-only').forEach(function (x) { x.hidden = guided; }); }); });

  function setCoverage(v, instant) {
    var el = $('#coverage');
    if (instant || K.reduceMotion || shown === null) { el.textContent = v + '%'; shown = v; return; }
    var a = shown, t0 = performance.now(); shown = v; cancelAnimationFrame(raf);
    (function step(t) {
      var k = Math.min(1, (t - t0) / 340), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(a + (v - a) * e) + '%';
      if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }

  /* The same arithmetic the prototype used, but it hands back every part so
     the page can show its working. Income under RM1,000 adds 6; welfare on
     over RM3,000 takes 8 away. The two can never both apply. */
  var NEEDS = ['companion','transport','homecare','welfare','food'];
  function labelNeed(k) {
    var map = {companion:'Company or hospital escort',transport:'Transport',homecare:'Home care',welfare:'Money or welfare help',food:'Food'};
    return K.T(map[k], {companion:'Teman atau iringan ke hospital',transport:'Pengangkutan',homecare:'Penjagaan di rumah',welfare:'Bantuan wang atau kebajikan',food:'Makanan'}[k]);
  }
  function selectedNeeds() {
    var out = K.$$('#needPicker input[name="needs"]:checked').map(function (el) { return el.value; });
    if (!out.length) { var first = $('#needPicker input[name="needs"]'); first.checked = true; out = [first.value]; }
    need.value = out.join(',');
    $('#needSummary').textContent = out.length === 1 ? labelNeed(out[0]) : out.length + ' ' + K.T('needs selected', 'keperluan dipilih');
    return out;
  }
  function setNeeds(arr) {
    K.$$('#needPicker input[name="needs"]').forEach(function (el) { el.checked = arr.indexOf(el.value) >= 0; });
    selectedNeeds();
  }
  function score(pk, nks, dk, inc) {
    var p = S.profiles[pk], adj = S.districtAdj[dk] || 0;
    var needAdd = nks.reduce(function (sum, k) { return sum + S.needs[k].add; }, 0);
    var complexity = Math.max(0, nks.length - 1) * -4;
    var raw = p.coverage + needAdd + complexity + adj, v = Math.max(20, Math.min(96, raw)), incAdj = 0;
    if (inc < 1000) incAdj = Math.min(96, v + 6) - v;
    else if (inc > 3000 && nks.indexOf('welfare') >= 0) incAdj = -8;
    return { v: v + incAdj, sub: v, base: p.coverage, need: needAdd, complexity: complexity, district: adj, income: incAdj, clamped: v !== raw };
  }

  /* Point a case provider at the real row on the organisation list, choosing
     the one in this district when there is one. */
  function findRecord(node, dk) {
    if (!node.m) return -1;
    var best = -1;
    for (var i = 0; i < K.records.length; i++) {
      if (K.records[i].name.indexOf(node.m) !== 0) continue;
      if (K.records[i].district === dk) return i;
      if (best < 0) best = i;
    }
    return best;
  }

  function optionText(sel) { var o = sel.options[sel.selectedIndex]; return o ? o.textContent : sel.value; }
  function signed(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + (n === 0 ? '0' : Math.abs(n)); }

  function renderPresets() {
    $('#presetList').innerHTML = S.presets.map(function (p, i) {
      var on = persona.value === p.persona && district.value === p.district && selectedNeeds().length === 1 && selectedNeeds()[0] === p.need && Number(income.value) === p.income;
      return '<button class="preset" type="button" data-preset="' + i + '" aria-pressed="' + on + '">' + esc(K.L(p.l)) + '</button>';
    }).join('');
  }

  function update(instant) {
    var pk = persona.value, nks = selectedNeeds(), dk = district.value, p = S.profiles[pk];
    var inc = Math.max(0, Number(income.value) || 0), s = score(pk, nks, dk, inc), coverage = s.v;
    var tipTitle = K.T('How the score is calculated', 'Cara skor dikira');
    var tipBody = K.T('Start with the person profile. Add or subtract each selected need, district availability and income adjustment. Multiple needs include a coordination adjustment. The final sample score is capped between 20 and 96.', 'Mulakan dengan profil warga emas. Tambah atau tolak pelarasan bagi setiap keperluan, daerah dan pendapatan. Beberapa keperluan turut mengambil kira penyelarasan. Skor contoh akhir dihadkan antara 20 hingga 96.');
    var info = $('#scoreInfo');
    info.setAttribute('aria-label', tipTitle);
    info.setAttribute('data-tip', '<b>' + esc(tipTitle) + '</b><span>' + esc(tipBody) + '</span>');
    var path = p.path.slice(), nodes = p.nodes.slice();
    nks.forEach(function (k) { var nd = S.needs[k]; if (path.indexOf(nd.step) < 0) path.unshift(nd.step); if (nodes.indexOf(nd.node) < 0) nodes.unshift(nd.node); });
    path = path.slice(0, 5); nodes = nodes.slice(0, 4);
    var negativeNeeds = nks.filter(function (k) { return S.needs[k].add < 0; }).length;
    var steps = Math.max(2, p.steps + Math.max(0, nks.length - 1) + negativeNeeds + (s.district < 0 ? 1 : 0));
    var gap = p.gap; if (s.district < 0) gap = 'district'; else if (nks.length > 1) gap = 'multiple'; else if (negativeNeeds) gap = 'capacity';
    var state = coverage > 70 ? 'good' : coverage > 50 ? 'warn' : 'crit';

    setCoverage(coverage, instant);
    $('#coverageBar').style.setProperty('--v', coverage + '%');
    var st = $('#coverageState'); st.className = 'state ' + state; st.innerHTML = '<i aria-hidden="true"></i>' + esc(K.L(S.states[state]));

    /* Show the working. Every line is a number a reviewer can add up. */
    var rows = [
      { l: optionText(persona), v: s.base, head: true },
      { l: K.T('District: ', 'Daerah: ') + dk, v: s.district },
    ].concat(nks.map(function (k) { return { l: K.T('Need: ', 'Keperluan: ') + labelNeed(k), v: S.needs[k].add }; }));
    if (s.complexity) rows.push({ l: K.T('Several needs: coordination', 'Penyelarasan beberapa keperluan'), v: s.complexity });
    if (s.income) rows.push({ l: K.T('Household income RM', 'Pendapatan isi rumah RM') + inc.toLocaleString('en-MY'), v: s.income });
    $('#working').innerHTML = rows.map(function (r) {
      return '<li' + (r.head ? ' class="is-base"' : '') + '><span>' + esc(r.l) + '</span><b>' + esc(r.head ? String(r.v) : signed(r.v)) + '</b></li>';
    }).join('') + '<li class="is-total"><span>' + esc(K.T('Coverage score', 'Skor liputan')) + '</span><b>' + coverage + '</b></li>';
    $('#workingNote').textContent = s.clamped
      ? K.T('The score is held inside 20 to 96, so this one was capped before income was applied.', 'Skor dihadkan antara 20 hingga 96, jadi yang ini dicapai sebelum pendapatan dikira.')
      : K.T('Sample logic, not an estimate. Phase 1 replaces these weights with checked data.', 'Logik contoh, bukan anggaran. Fasa 1 akan ganti pemberat ini dengan data yang disemak.');

    $('#steps').textContent = steps;
    $('#pathwayList').innerHTML = path.map(function (k, i) {
      var pr = nks.some(function (nk) { return S.needs[nk].step === k; });
      var detail = S.stepInfo && S.stepInfo[k], info = '';
      if (detail) {
        var tipTitle = K.T('About this step', 'Tentang langkah ini');
        info = '<button class="info-btn path-info" type="button" aria-label="' + esc(tipTitle) + '" data-tip="' + esc('<b>' + tipTitle + '</b><span>' + K.L(detail) + '</span>') + '">i</button>';
      }
      return '<li' + (pr ? ' class="is-priority"' : '') + '><span class="n">' + (i + 1) + '</span><span class="path-label">' + esc(K.L(S.steps[k])) + '</span>' + info + (pr ? '<em>' + esc(K.T('Selected need', 'Keperluan dipilih')) + '</em>' : '') + '</li>';
    }).join('');

    /* Who could help, named from the organisation list and carrying that
       record's status, so the two pages can never drift apart. */
    var confirmed = 0;
    $('#providerList').innerHTML = nodes.map(function (k) {
      var node = S.nodes[k], idx = findRecord(node, dk), rec = idx >= 0 ? K.records[idx] : null;
      var status = rec ? rec.status : node.s;
      if (status === 'Verified') confirmed++;
      var away = rec && rec.district !== dk
        ? '<em>' + esc(K.T('in ' + rec.district, 'di ' + rec.district)) + '</em>' : '';
      var name = rec
        ? '<a href="network.html#r' + idx + '">' + esc(rec.name) + K.icon('right') + '</a>'
        : '<span>' + esc(K.L(node.n)) + '</span>';
      var contact = rec && rec.phone ? '<div class="node-meta"><span>' + esc(rec.help) + '</span><small>' + esc(K.T('Sample contact · ' + rec.contact, 'Hubungan contoh · ' + rec.contact)) + '</small></div>' : '';
      var call = rec && rec.phone ? '<a class="call-btn" href="tel:' + esc(rec.phone.replace(/[^0-9+]/g, '')) + '">' + esc(K.T('Call', 'Telefon')) + '</a>' : '';
      var note = rec && rec.aid ? '<small class="node-aid">' + esc(rec.aid + (rec.amount ? ' · ' + rec.amount : '')) + '</small>' : '';
      return '<li><div class="node-copy"><div class="node-name">' + name + away + K.pill(status) + '</div>' + contact + note + '</div><div class="node-actions">' + call + '</div></li>';
    }).join('');
    $('#confirmed').textContent = confirmed + ' / ' + nodes.length;
    $('#confirmedNote').textContent = confirmed === nodes.length
      ? K.T('Every organisation in this plan is on our confirmed list.', 'Semua organisasi dalam pelan ini ada dalam senarai disahkan kami.')
      : K.T(
        (nodes.length - confirmed) + ' of these are still to check or examples, so this plan is not yet a promise of help.',
        (nodes.length - confirmed) + ' daripadanya masih perlu disemak atau contoh, jadi pelan ini belum satu janji bantuan.');

    $('#gap').textContent = K.L(S.gaps[gap]);
    $('#caseContext').textContent = K.T('Profile: ' + optionText(ageBand) + ' · ' + optionText(gender) + ' · ' + dk + ' · ' + optionText(mukim) + ' · ' + optionText(living) + ' · ' + optionText(income), 'Profil: ' + optionText(ageBand) + ' · ' + optionText(gender) + ' · ' + dk + ' · ' + optionText(mukim) + ' · ' + optionText(living) + ' · ' + optionText(income));
    renderRoute(path, nodes, nks);
    renderCompare(pk, nks, inc, dk);
    renderPresets();
  }

  /* The same person and the same need, priced in every district. This is the
     argument the project is making, so it stays on screen. */
  function renderCompare(pk, nks, inc, dk) {
    var vals = DISTRICTS.map(function (d) { return { d: d, v: score(pk, nks, d, inc).v }; })
      .sort(function (a, b) { return b.v - a.v; });
    var hi = vals[0], lo = vals[vals.length - 1];
    $('#compare').innerHTML = vals.map(function (x) {
      var on = x.d === dk;
      return '<li' + (on ? ' class="is-on"' : '') + '><button type="button" data-district="' + esc(x.d) + '"' + (on ? ' aria-current="true"' : '') + '>' +
        '<span class="d">' + esc(x.d) + '</span>' +
        '<span class="cmp-bar"><i style="--v:' + x.v + '%"></i></span>' +
        '<b>' + x.v + '</b></button></li>';
    }).join('');
    $('#compareNote').textContent = K.T(
      'Same person, same needs, same income. ' + hi.d + ' scores ' + hi.v + ' and ' + lo.d + ' scores ' + lo.v + ', a gap of ' + (hi.v - lo.v) + ' points.',
      'Orang yang sama, keperluan yang sama, pendapatan yang sama. ' + hi.d + ' dapat ' + hi.v + ' dan ' + lo.d + ' dapat ' + lo.v + ', beza ' + (hi.v - lo.v) + ' mata.');
  }

  function renderRoute(path, nodes, nks) {
    var flow = $('#routeFlow'), request = $('#routeRequest'), stepsEl = $('#routeSteps'), contacts = $('#routeContacts'), end = $('#routeEndMark');
    if (!flow || !request || !stepsEl || !contacts) return;
    request.innerHTML = '<strong>' + esc(K.T('I need support with...', 'Saya perlukan bantuan untuk...')) + '</strong><div class="route-need-list">' + nks.map(function (k) { return '<span>' + esc(labelNeed(k)) + '</span>'; }).join('') + '</div>';
    stepsEl.innerHTML = path.slice(0, 4).map(function (k, i) { return '<li><b>' + (i + 1) + '</b><span>' + esc(K.L(S.steps[k])) + '</span></li>'; }).join('');
    contacts.innerHTML = nodes.slice(0, 3).map(function (k) {
      var node = S.nodes[k], idx = findRecord(node, district.value), rec = idx >= 0 ? K.records[idx] : null;
      if (!rec) return '<li><span class="route-contact-name">' + esc(K.L(node.n)) + '</span><span class="route-contact-meta">' + esc(K.T('Contact to be checked', 'Hubungan perlu disemak')) + '</span></li>';
      return '<li><span class="route-contact-name">' + esc(rec.name) + '</span><span class="route-contact-meta">' + esc(rec.phone) + ' ' + K.pill(rec.status) + '</span><a class="route-call" href="tel:' + esc(rec.phone.replace(/[^0-9+]/g, '')) + '">' + esc(K.T('Call this contact', 'Telefon hubungan ini')) + '</a></li>';
    }).join('');
    flow.classList.remove('is-animating');
    void flow.offsetWidth;
    flow.classList.add('is-animating');
    if (routeAnimation) { routeAnimation.destroy(); routeAnimation = null; }
    if (end && window.lottie && K.routeLottie && !K.reduceMotion) {
      routeAnimation = window.lottie.loadAnimation({ container:end, renderer:'svg', loop:false, autoplay:true, animationData:K.routeLottie, rendererSettings:{ progressiveLoad:true, preserveAspectRatio:'xMidYMid meet' } });
    }
  }

  [ageBand, gender, persona, district, mukim, living, income].forEach(function (el) { el.addEventListener('input', function () { if (el === district) updateMukim(); update(false); }); });
  district.addEventListener('change', function () { updateMukim(); update(false); });
  K.$$('#needPicker input[name="needs"]').forEach(function (el) { el.addEventListener('change', function () { selectedNeeds(); update(false); }); });
  $('#presetList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-preset]'); if (!b) return;
    var p = S.presets[Number(b.getAttribute('data-preset'))];
    persona.value = p.persona; district.value = p.district; setNeeds([p.need]); income.value = p.income;
    update(false);
    var again = $('#presetList [data-preset="' + b.getAttribute('data-preset') + '"]'); if (again) again.focus();
  });
  $('#compare').addEventListener('click', function (e) {
    var b = e.target.closest('[data-district]'); if (!b) return;
    district.value = b.getAttribute('data-district');
    update(false);
    var again = $('#compare [data-district="' + b.getAttribute('data-district') + '"]'); if (again) again.focus();
  });
  var firstRun = true;
  updateMukim();
  K.onLang.push(function () { update(firstRun); firstRun = false; });
};

/* ---------- 08 Our Silver App ---------- */
K.pageInit.app = function () {
  var current = 0, screens = K.$$('[data-screen]'), dots = $('#appDots'), progress = $('#appProgress');
  function show(n) {
    current = Math.max(0, Math.min(screens.length - 1, n));
    screens.forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-screen')) === current); });
    if (progress) progress.style.setProperty('--v', ((current + 1) / screens.length * 100) + '%');
    if (dots) dots.innerHTML = screens.map(function (s, i) { return '<button type="button" class="' + (i === current ? 'is-on' : '') + '" data-app-dot="' + i + '" aria-label="Screen ' + (i + 1) + '"></button>'; }).join('');
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
    if (next) move(current + 1); if (reset) move(0); if (choice) { K.$$('.mock-choices button').forEach(function (b) { b.classList.remove('is-selected'); }); choice.classList.add('is-selected'); } if (lang) document.documentElement.lang = document.documentElement.lang === 'ms' ? 'en' : 'ms';
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
