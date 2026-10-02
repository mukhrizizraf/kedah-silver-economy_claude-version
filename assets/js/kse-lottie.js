/* ==========================================================================
   Kedah Silver Economy (iOS version): Lottie animations
   Three small Lottie (bodymovin 5.7) animations, kept as JS objects so the
   site still runs from file:// with no fetch(). Layers carry a class (cl)
   so kse-ios.css can recolour them from the theme tokens.
     nearby  : a Find My style pulse, one person with help around them
     spinner : the iOS activity indicator, shown when a page is slow to open
     check   : a success tick, drawn once
   K.lottie(el, name, opts) plays one; under reduced motion it shows the
   last frame, still.
   ========================================================================== */
(function (K) {
'use strict';

function tr() { return { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }; }
function ks(o, p, s, r) {
  return { o: o || { a: 0, k: 100 }, r: r || { a: 0, k: 0 }, p: { a: 0, k: p }, a: { a: 0, k: [0, 0, 0] }, s: s || { a: 0, k: [100, 100, 100] } };
}
var OUT = { x: [0.2], y: [1] }, IN = { x: [0.4], y: [0] };

/* One ring of the pulse: grows from the dot and fades out. */
function ring(ind, start) {
  var end = start + 60;
  return {
    ddd: 0, ind: ind, ty: 4, nm: 'Ring ' + ind, cl: 'lt-tint-stroke', sr: 1,
    ks: ks({ a: 1, k: [{ t: start, s: [70], i: OUT, o: IN }, { t: end, s: [0] }] }, [24, 24, 0]),
    shapes: [{ ty: 'gr', nm: 'Ring', it: [
      { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 1, k: [{ t: start, s: [12, 12], i: { x: [0.2, 0.2], y: [1, 1] }, o: { x: [0.4, 0.4], y: [0, 0] } }, { t: end, s: [46, 46] }] } },
      { ty: 'st', c: { a: 0, k: [0.082, 0.502, 0.239, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2 },
      tr()
    ] }],
    ip: 0, op: 90, st: 0, bm: 0
  };
}

var A = {
  nearby: {
    v: '5.7.4', fr: 30, ip: 0, op: 90, w: 48, h: 48, nm: 'Help nearby', ddd: 0, assets: [],
    layers: [
      { ddd: 0, ind: 1, ty: 4, nm: 'Person', cl: 'lt-tint-fill', sr: 1, ks: ks(null, [24, 24, 0]),
        shapes: [{ ty: 'gr', nm: 'Dot', it: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [13, 13] } },
          { ty: 'st', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2.5 }, lc: 2, lj: 2 },
          { ty: 'fl', c: { a: 0, k: [0.082, 0.502, 0.239, 1] }, o: { a: 0, k: 100 }, r: 1 },
          tr()
        ] }], ip: 0, op: 90, st: 0, bm: 0 },
      ring(2, 0),
      ring(3, 30)
    ]
  },

  /* Eight spokes, stepping round in 45 degree jumps once a second. */
  spinner: (function () {
    var spokes = [];
    for (var k = 0; k < 8; k++) {
      spokes.push({ ty: 'gr', nm: 'Spoke ' + k, it: [
        { ty: 'rc', p: { a: 0, k: [0, -8.5] }, s: { a: 0, k: [2.6, 7] }, r: { a: 0, k: 1.3 } },
        { ty: 'fl', c: { a: 0, k: [0.42, 0.42, 0.44, 1] }, o: { a: 0, k: 100 }, r: 1 },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: k * 45 }, o: { a: 0, k: 100 - k * 10 } }
      ] });
    }
    var steps = [];
    for (var s = 0; s <= 8; s++) steps.push(s < 8 ? { t: s * 3, s: [s * 45], h: 1 } : { t: 24, s: [360] });
    return {
      v: '5.7.4', fr: 24, ip: 0, op: 24, w: 28, h: 28, nm: 'Loading', ddd: 0, assets: [],
      layers: [{ ddd: 0, ind: 1, ty: 4, nm: 'Spokes', cl: 'lt-muted-fill', sr: 1,
        ks: ks(null, [14, 14, 0], null, { a: 1, k: steps }), shapes: spokes, ip: 0, op: 24, st: 0, bm: 0 }]
    };
  }()),

  check: {
    v: '5.7.4', fr: 30, ip: 0, op: 34, w: 56, h: 56, nm: 'Done', ddd: 0, assets: [],
    layers: [
      { ddd: 0, ind: 1, ty: 4, nm: 'Tick', sr: 1, ks: ks(null, [28, 28, 0]),
        shapes: [{ ty: 'gr', nm: 'Tick', it: [
          { ty: 'sh', ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-10, 1], [-3.5, 7.5], [10.5, -7]], c: false } } },
          { ty: 'tm', s: { a: 0, k: 0 }, e: { a: 1, k: [{ t: 10, s: [0], i: OUT, o: IN }, { t: 28, s: [100] }] }, o: { a: 0, k: 0 }, m: 1 },
          { ty: 'st', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4.5 }, lc: 2, lj: 2 },
          tr()
        ] }], ip: 0, op: 34, st: 0, bm: 0 },
      { ddd: 0, ind: 2, ty: 4, nm: 'Disc', cl: 'lt-tint-fill', sr: 1,
        ks: ks(null, [28, 28, 0], { a: 1, k: [
          { t: 0, s: [30, 30, 100], i: { x: [0.2, 0.2, 0.2], y: [1, 1, 1] }, o: { x: [0.3, 0.3, 0.3], y: [0, 0, 0] } },
          { t: 14, s: [106, 106, 100], i: { x: [0.3, 0.3, 0.3], y: [1, 1, 1] }, o: { x: [0.3, 0.3, 0.3], y: [0, 0, 0] } },
          { t: 22, s: [100, 100, 100] }] }),
        shapes: [{ ty: 'gr', nm: 'Disc', it: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] } },
          { ty: 'fl', c: { a: 0, k: [0.082, 0.502, 0.239, 1] }, o: { a: 0, k: 100 }, r: 1 },
          tr()
        ] }], ip: 0, op: 34, st: 0, bm: 0 }
    ]
  }
};

K.lottieData = A;
K.lottie = function (el, name, opts) {
  opts = opts || {};
  if (!el || !A[name]) return null;
  if (el._lottie) { el._lottie.destroy(); el._lottie = null; }
  if (!window.lottie) return null;
  var still = K.reduceMotion;
  var anim = window.lottie.loadAnimation({
    container: el, renderer: 'svg', loop: still ? false : opts.loop !== false,
    autoplay: still ? false : opts.autoplay !== false,
    animationData: JSON.parse(JSON.stringify(A[name])),
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true }
  });
  if (still) anim.addEventListener('DOMLoaded', function () { anim.goToAndStop(A[name].op - 1, true); });
  el._lottie = anim;
  return anim;
};

/* Static markup can ask for one: <span data-lottie="nearby"></span> */
document.addEventListener('DOMContentLoaded', function () {
  Array.prototype.forEach.call(document.querySelectorAll('[data-lottie]'), function (el) {
    K.lottie(el, el.getAttribute('data-lottie'), { loop: el.getAttribute('data-loop') !== 'false' });
  });
});

})(window.KSE = window.KSE || {});
