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
    labels += '<text x="' + f1(lx) + '" y="' + f1(ly) + '" text-anchor="' + anchor + '"><tspan class="sl-name">' + K.esc(K.L(t.many)) + '</tspan>' +
      '<tspan class="sl-count" x="' + f1(lx) + '" dy="15">' + count + ' ' + K.T(count === 1 ? 'organisation' : 'organisations', 'organisasi') + '</tspan></text>';
  });
  K.statusOrder.forEach(function (s) {
    ringLabels += '<text class="ring-label" x="0" y="' + (-K.status[s].ring - 5) + '" text-anchor="middle">' + K.esc(K.L(K.status[s]).toUpperCase()) + '</text>';
  });
  /* The hub is the person the network is meant to serve. Our own generated
     elder (K.elderArt, set by kse-art.js) sits in it when it exists;
     until then a drawn person mark, like the Me pin in Find My. */
  var elderSrc = K.elderArt || 'assets/img/elder-motion/frame-01.webp';
  var elder = '<image href="' + elderSrc + '" x="-47" y="-78" width="94" height="132" preserveAspectRatio="xMidYMid meet"/>';
  var core = '<circle class="halo" r="48"/><circle class="core" r="34"/>' +
    '<a class="elder-link" href="scenario.html" tabindex="0" aria-label="' + K.esc(K.T('Try a case for one older person', 'Cuba satu kes untuk seorang warga emas')) + '">' +
    '<g class="elder-avatar">' + elder + '</g></a>';
  svg.innerHTML = rings + dividers + links + core + nodes + labels + ringLabels;
  /* the elder waves once (eight frames), unless our own still art is in use */
  if (svg._elderTimer) { clearTimeout(svg._elderTimer); svg._elderTimer = null; }
  var elderImage = svg.querySelector('.elder-avatar image');
  if (elderImage && !K.elderArt && !K.reduceMotion) {
    var elderFrame = 1, elderTicks = 0;
    (function playWelcome() {
      if (document.hidden || elderTicks >= 8) return;
      elderFrame = elderFrame % 8 + 1;
      elderTicks++;
      elderImage.setAttribute('href', 'assets/img/elder-motion/frame-' + String(elderFrame).padStart(2, '0') + '.webp');
      svg._elderTimer = setTimeout(playWelcome, 180);
    }());
  }
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
