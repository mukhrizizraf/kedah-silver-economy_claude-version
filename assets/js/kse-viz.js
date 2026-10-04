/* ==========================================================================
   Kedah Silver Economy: visualisations
   Hand-built SVG/HTML charts that read from KSE data and theme tokens.
   ========================================================================== */
(function (K) {
'use strict';
var V = K.viz = {};
var f1 = function (n) { return n.toFixed(1); };
var rad = function (d) { return d * Math.PI / 180; };

/* ---------- Constellation: 30 records around one older person ----------
   angle  = organisation type (5 sectors of 64°, with a 40° gap at the top
            that holds the ring labels)
   radius = evidence (inner Verified, middle Candidate, outer Demo)
   colour = type (band steps --b1..5), fill style = evidence              */
var GAP = 40, SECTOR = (360 - GAP) / 5, START = -90 + GAP / 2;
V.pos = [];
V.constellation = function (svg, legend, intro) {
  if (!svg) return;
  var R = K.records, rings = '', dividers = '', links = '', nodes = '', labels = '', ringLabels = '';
  K.statusOrder.slice().reverse().forEach(function (s) { rings += '<circle class="ring" cx="0" cy="0" r="' + K.status[s].ring + '"/>'; });
  for (var b = 0; b <= 5; b++) {
    var a = rad(START + SECTOR * b);
    dividers += '<line class="divider" x1="' + f1(46 * Math.cos(a)) + '" y1="' + f1(46 * Math.sin(a)) + '" x2="' + f1(194 * Math.cos(a)) + '" y2="' + f1(194 * Math.sin(a)) + '"/>';
  }
  K.typeOrder.forEach(function (type, i) {
    var a0 = START + SECTOR * i, t = K.types[type];
    K.statusOrder.forEach(function (st, si) {
      var group = [];
      R.forEach(function (r, idx) { if (r.type === type && r.status === st) group.push(idx); });
      var n = group.length, pad = 6, span = SECTOR - 2 * pad, ring = K.status[st].ring;
      group.forEach(function (idx, j) {
        var r = R[idx], ang = n === 1 ? a0 + SECTOR / 2 : a0 + pad + j * span / (n - 1);
        var x = ring * Math.cos(rad(ang)), y = ring * Math.sin(rad(ang)), delay = (si * 160 + j * 40 + i * 25) + 'ms';
        V.pos[idx] = { x: x, y: y, c: t.c };
        if (st !== 'Demo') links += '<line class="link ' + st.toLowerCase() + '" x1="0" y1="0" x2="' + f1(x) + '" y2="' + f1(y) + '" style="stroke:var(--b' + t.c + ');--d:' + delay + '"/>';
        var tip = '<b>' + K.esc(r.name) + '</b><span>' + K.esc(K.L(t.one)) + ' · ' + K.esc(r.district) + '</span><span>' + K.esc(r.cap) + '</span>' + K.pill(r.status);
        nodes += '<g class="node ' + st.toLowerCase() + '" transform="translate(' + f1(x) + ' ' + f1(y) + ')" tabindex="0" role="link" data-idx="' + idx + '" style="--c:var(--b' + t.c + ');--d:' + delay + '"' +
          ' aria-label="' + K.esc(r.name + ', ' + K.L(t.one) + ', ' + r.district + ', ' + K.L(K.status[st])) + '" data-tip="' + K.esc(tip) + '">' +
          '<circle class="hit" r="12"/><circle class="dot" r="6.5"/></g>';
      });
    });
    var la = rad(a0 + SECTOR / 2), lx = 208 * Math.cos(la), ly = 208 * Math.sin(la) + (Math.sin(la) > 0.5 ? 6 : 0);
    var anchor = lx > 20 ? 'start' : lx < -20 ? 'end' : 'middle';
    var count = R.filter(function (r) { return r.type === type; }).length;
    labels += '<text data-type="' + type + '" x="' + f1(lx) + '" y="' + f1(ly) + '" text-anchor="' + anchor + '"><tspan class="sl-name">' + K.esc(K.L(t.many)) + '</tspan>' +
      '<tspan class="sl-count" x="' + f1(lx) + '" dy="15">' + count + ' ' + K.T(count === 1 ? 'organisation' : 'organisations', 'organisasi') + '</tspan></text>';
  });
  K.statusOrder.forEach(function (s) {
    ringLabels += '<text class="ring-label" x="0" y="' + (-K.status[s].ring - 5) + '" text-anchor="middle">' + K.esc(K.L(K.status[s]).toUpperCase()) + '</text>';
  });
  /* The hub is the person the network is meant to serve: a round portrait
     clipped to it, like the Me pin in Find My. K.elderArt can override it. */
  var elderSrc = K.elderArt || 'assets/img/map-elder.webp?v=3d';
  var elder = '<clipPath id="elderClip"><circle r="31"/></clipPath>' +
    '<image href="' + elderSrc + '" x="-31" y="-31" width="62" height="62" clip-path="url(#elderClip)" preserveAspectRatio="xMidYMid slice"/>';
  var core = '<circle class="halo" r="48"/><circle class="core" r="34"/>' +
    '<a class="elder-link" href="scenario.html" tabindex="0" aria-label="' + K.esc(K.T('Try a case for one older person', 'Cuba satu kes untuk seorang warga emas')) + '">' +
    '<g class="elder-avatar">' + elder + '</g></a>';
  svg.innerHTML = rings + dividers + links + core + nodes + labels + ringLabels;

  svg.setAttribute('aria-label', K.T(
    'Map of ' + R.length + ' organisations around one older person: ' + K.counts.Verified + ' confirmed, ' + K.counts.Candidate + ' to check, ' + K.counts.Demo + ' examples.',
    'Peta ' + R.length + ' organisasi di sekeliling seorang warga emas: ' + K.counts.Verified + ' disahkan, ' + K.counts.Candidate + ' perlu disemak, ' + K.counts.Demo + ' contoh.'));
  var fig = svg.closest('.cons');
  if (intro && fig && !K.reduceMotion) { fig.classList.add('intro'); setTimeout(function () { fig.classList.remove('intro'); }, 1800); }
  if (legend) {
    legend.innerHTML = '<ul>' + K.typeOrder.map(function (k) { return '<li><i style="background:var(--b' + K.types[k].c + ')"></i>' + K.esc(K.L(K.types[k].many)) + '</li>'; }).join('') + '</ul>' +
      '<span class="sep" aria-hidden="true"></span><ul>' + K.statusOrder.map(function (s) { return '<li><i class="ev ' + s.toLowerCase() + '"></i>' + K.esc(K.L(K.status[s])) + ' <b>' + K.counts[s] + '</b></li>'; }).join('') + '</ul>';
  }
};

/* ---------- Need picker: "What does she need?" ----------
   Tap a need and only the organisations whose services match it stay lit,
   with a line drawing out from her to each one; a short list follows.
   Matching reads each record's services (cap), so new records join in. */
var ICON = {
  all: 'M12 4v16M4 12h16',
  transport: 'M4 15v-3.5L6.2 6h11.6L20 11.5V15zM5 15v2.5h3V15M16 15v2.5h3V15M7.5 11.5h.01M16.5 11.5h.01',
  meals: 'M3 11h18a9 9 0 0 1-18 0zM8.5 7.5c0-1.2 1-1.6 1-3M12.5 7.5c0-1.2 1-1.6 1-3',
  care: 'M12 20s-7.5-4.6-7.5-10.2A4 4 0 0 1 12 7.6a4 4 0 0 1 7.5 2.2C19.5 15.4 12 20 12 20zM12 10.5v4.5M9.8 12.75h4.4',
  home: 'M4 11.5l8-7 8 7M6.5 9.5V20h11V9.5M10 20v-5h4v5',
  company: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a2.6 2.6 0 1 0 0-5.2M17.5 14.2c2 .6 3.5 2.6 3.5 5.3',
  money: 'M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5H4zM4 7.5l11-3.5v3.5M16.5 14h.01'
};
K.needs = [
  { k: 'transport', en: 'Transport', bm: 'Pengangkutan', re: /transport|escort/i },
  { k: 'meals', en: 'Meals', bm: 'Makanan', re: /food|meal/i },
  { k: 'care', en: 'Nursing and care', bm: 'Rawatan dan jagaan', re: /nursing|wound|medication|home care|residential|short stays|caregiver|care referral/i },
  { k: 'home', en: 'Help at home', bm: 'Bantuan di rumah', re: /home visit|help at home|shopping|errand|daily living/i },
  { k: 'company', en: 'Company', bm: 'Teman', re: /companion|befriend|social|peer|community activities|community visits|phone check/i },
  { k: 'money', en: 'Money and aid', bm: 'Wang dan bantuan', re: /financial|zakat|welfare assessment|welfare programme|welfare navigation/i }
];
V.need = null;
V.needMatches = function (k) {
  var n = K.needs.filter(function (x) { return x.k === k; })[0], out = [];
  if (n) K.records.forEach(function (r, i) { if (n.re.test(r.cap)) out.push(i); });
  return out;
};
var icon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[k] + '"/></svg>'; };

V.needPicker = function (svg, bar, out) {
  if (!svg || !bar) return;
  bar.innerHTML = '<p class="need-q" id="needQ">' + K.esc(K.T('What does she need? Tap one.', 'Apa yang dia perlukan? Tekan satu.')) + '</p>' +
    '<div class="need-chips" role="group" aria-labelledby="needQ">' +
    '<button type="button" class="need-chip" data-need="">' + icon('all') + K.esc(K.T('Everyone', 'Semua')) + '</button>' +
    K.needs.map(function (n) {
      return '<button type="button" class="need-chip" data-need="' + n.k + '">' + icon(n.k) + K.esc(K.L(n)) + '<span class="need-n">' + V.needMatches(n.k).length + '</span></button>';
    }).join('') + '</div>';
  if (!bar.dataset.wired) {
    bar.dataset.wired = '1';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.need-chip'); if (!b) return;
      var k = b.getAttribute('data-need') || null;
      V.need = V.need === k ? null : k;
      V.applyNeed(svg, bar, out, true);
    });
    if (out) {
      var hot = function (e, on) {
        var a = e.target.closest('[data-idx]'); if (!a) return;
        var n = svg.querySelector('.node[data-idx="' + a.getAttribute('data-idx') + '"]');
        if (n) n.classList.toggle('hot', on);
      };
      out.addEventListener('mouseover', function (e) { hot(e, true); });
      out.addEventListener('mouseout', function (e) { hot(e, false); });
      out.addEventListener('focusin', function (e) { hot(e, true); });
      out.addEventListener('focusout', function (e) { hot(e, false); });
    }
  }
  V.applyNeed(svg, bar, out, false);
};

V.applyNeed = function (svg, bar, out, animate) {
  var k = V.need, m = k ? V.needMatches(k) : [], set = {}, types = {};
  m.forEach(function (i) { set[i] = 1; types[K.records[i].type] = 1; });
  K.$$('.need-chip', bar).forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-need') || null) === k)); });
  var old = svg.querySelector('.need-links'); if (old) old.parentNode.removeChild(old);
  svg.classList.toggle('is-filtering', !!k);
  K.$$('.node', svg).forEach(function (n) { n.classList.toggle('match', !!set[n.getAttribute('data-idx')]); });
  K.$$('text[data-type]', svg).forEach(function (t) { t.classList.toggle('dim', !!k && !types[t.getAttribute('data-type')]); });
  if (k) {
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'need-links' + (animate && !K.reduceMotion ? ' draw' : ''));
    g.setAttribute('aria-hidden', 'true');
    g.innerHTML = m.map(function (i, j) {
      var p = V.pos[i]; if (!p) return '';
      return '<line pathLength="1" x1="0" y1="0" x2="' + f1(p.x) + '" y2="' + f1(p.y) + '" style="stroke:var(--b' + p.c + ');--d:' + (j * 70) + 'ms"/>';
    }).join('');
    svg.insertBefore(g, svg.querySelector('.halo'));
  }
  if (!out) return;
  if (!k) { out.hidden = true; out.innerHTML = ''; return; }
  var need = K.needs.filter(function (x) { return x.k === k; })[0], rank = { Verified: 0, Candidate: 1, Demo: 2 }, by = { Verified: 0, Candidate: 0, Demo: 0 };
  m.sort(function (a, b) { return rank[K.records[a].status] - rank[K.records[b].status] || a - b; });
  m.forEach(function (i) { by[K.records[i].status]++; });
  var word = { Verified: ['confirmed', 'confirmed', 'disahkan'], Candidate: ['to check', 'to check', 'perlu disemak'], Demo: ['example', 'examples', 'contoh'] };
  var parts = K.statusOrder.filter(function (s) { return by[s]; }).map(function (s) { return by[s] + ' ' + K.T(word[s][by[s] === 1 ? 0 : 1], word[s][2]); });
  out.hidden = false;
  out.innerHTML = '<p class="need-sum"><b>' + K.esc(K.T(m.length + ' can help with ' + need.en.toLowerCase(), m.length + ' boleh membantu: ' + need.bm.toLowerCase())) + '</b>' +
    '<span>' + K.esc(parts.join(' · ')) + '</span></p>' +
    '<ul class="need-list">' + m.map(function (i) {
      var r = K.records[i], t = K.types[r.type];
      return '<li><a href="network.html#r' + i + '" data-idx="' + i + '"><i style="--c:var(--b' + t.c + ')" aria-hidden="true"></i>' +
        '<span class="nl-txt"><b>' + K.esc(r.name) + '</b><small>' + K.esc(K.L(t.one) + ' · ' + r.district + ' · ' + r.cap) + '</small></span>' + K.pill(r.status) + '</a></li>';
    }).join('') + '</ul>' +
    '<a class="need-cta" href="scenario.html">' + K.esc(K.T('Plan her help in Try a case', 'Rancang bantuannya dalam Cuba satu kes')) + ' <span aria-hidden="true">→</span></a>';
};

/* ---------- District chart: records per district, stacked by evidence ---------- */
V.districts = (function () {
  var c = {};
  K.records.forEach(function (r) { c[r.district] = (c[r.district] || 0) + 1; });
  return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; });
})();
V.districtChart = function (el, tf, sf, df) {
  if (!el) return;
  var data = V.districts.map(function (d) {
    var by = { Verified: 0, Candidate: 0, Demo: 0 }, total = 0;
    K.records.forEach(function (r) {
      if (r.district === d && (tf === 'all' || r.type === tf) && (sf === 'all' || r.status === sf)) { by[r.status]++; total++; }
    });
    return { d: d, by: by, total: total };
  });
  var maxv = Math.max.apply(null, data.map(function (x) { return x.total; }).concat([4]));
  var step = maxv > 10 ? 5 : maxv > 4 ? 2 : 1, top = Math.ceil(maxv / step) * step, ticks = [];
  for (var v = 0; v <= top; v += step) ticks.push(v);
  var grid = ticks.map(function (v) { return '<span class="dgl" style="left:' + (v / top * 100) + '%"></span>'; }).join('');
  var html = data.map(function (x) {
    var w = x.total / top * 100;
    var segs = K.statusOrder.filter(function (s) { return x.by[s] > 0; }).map(function (s) {
      var tip = '<b>' + K.esc(x.d) + '</b><span>' + K.esc(K.L(K.status[s])) + ': ' + x.by[s] + ' ' + K.T(x.by[s] === 1 ? 'organisation' : 'organisations', 'organisasi') + '</span>';
      return '<span class="seg ' + s.toLowerCase() + '" style="flex:' + x.by[s] + '" data-tip="' + K.esc(tip) + '"></span>';
    }).join('');
    return '<div class="drow' + (df !== 'all' && df !== x.d ? ' dim' : '') + '"><span class="dname">' + K.esc(x.d) + '</span>' +
      '<div class="dtrack">' + grid + '<div class="dbar" style="width:' + w + '%">' + segs + '</div><b class="dval" style="left:' + w + '%">' + x.total + '</b></div></div>';
  }).join('');
  html += '<div class="daxis" aria-hidden="true"><span></span><div class="dticks">' + ticks.map(function (v) { return '<span style="left:' + (v / top * 100) + '%">' + v + '</span>'; }).join('') + '</div></div>';
  el.innerHTML = html;
};

/* ---------- Budget bars (share of total) ---------- */
V.budget = function (el) {
  if (!el) return;
  var total = K.budget.reduce(function (a, b) { return a + b.v; }, 0);
  el.innerHTML = K.budget.map(function (b) {
    var pct = b.v / total * 100;
    return '<div class="bud-row"><span>' + K.esc(K.L(b.l)) + (b.vot ? '<small>Vot ' + K.esc(b.vot) + '</small>' : '') + '</span><div class="bud-track"><div class="bud-fill" style="width:' + pct.toFixed(2) + '%"></div></div>' +
      '<span class="bud-rm">RM' + b.v.toLocaleString('en-US') + '</span><span class="bud-pct">' + pct.toFixed(1) + '%</span></div>';
  }).join('');
};

/* ---------- Project clock on the Gantt ---------- */
V.roadStatus = function (el) {
  if (!el) return;
  var now = new Date(), start = new Date(2026, 10, 1), end = new Date(2027, 6, 31, 23, 59, 59);
  K.$$('.g-now').forEach(function (n) { n.parentNode.removeChild(n); });
  K.$$('.g-mh').forEach(function (m) { m.classList.remove('now'); });
  if (now < start) {
    var d = Math.ceil((start - now) / 864e5);
    el.textContent = K.T('Starts 1 Nov 2026 · in ' + d + (d === 1 ? ' day' : ' days'), 'Bermula 1 Nov 2026 · dalam ' + d + ' hari');
  } else if (now <= end) {
    var m = (now.getFullYear() - 2026) * 12 + now.getMonth() - 10;
    el.textContent = K.T('In progress · month ' + (m + 1) + ' of 9', 'Sedang berjalan · bulan ' + (m + 1) + ' daripada 9');
    K.$$('.g-row').forEach(function (r) { var x = document.createElement('div'); x.className = 'g-now'; x.style.gridColumn = (m + 2) + '/' + (m + 3); r.insertBefore(x, r.firstChild); });
    var mh = K.$$('.g-mh')[m]; if (mh) mh.classList.add('now');
  } else {
    el.textContent = K.T('Project period ended 31 Jul 2027', 'Tempoh projek tamat 31 Jul 2027');
  }
};

})(window.KSE);
