/* ============================================================================
   Kedah Silver Economy: Try a case screens (rules 2026.10.03)
   One question per screen for an older person or a helper. A case card fills
   in beside the questions as each answer is given, and the case ends as one
   Assistance Plan. The rules live in kse-assist.js (no DOM); this file only
   draws and listens.
   ============================================================================ */
(function (K) {
'use strict';
var A, $ = K.$, esc = K.esc;
function L(v) { return K.L(v); }
function T(en, bm) { return K.T(en, bm); }

/* ---------- Drawn icons: one stroke family ---------- */
var IC = {
  person: '<circle cx="12" cy="7" r="3.2"/><path d="M5.5 20c.8-3.8 3.4-5.8 6.5-5.8s5.7 2 6.5 5.8"/>',
  helper: '<circle cx="8.5" cy="8" r="2.6"/><circle cx="16" cy="9" r="2.2"/><path d="M3.5 19c.6-3.2 2.6-4.9 5-4.9s4.4 1.7 5 4.9M14 14.3c2.6-.4 4.8 1 5.5 4.2"/>',
  wheelchair: '<circle cx="11" cy="4.5" r="1.6"/><path d="M11 7v6h5l2 5"/><path d="M8.2 10.5a5 5 0 1 0 6.3 6.6"/>',
  oxygen: '<rect x="8" y="6.5" width="8" height="14.5" rx="3"/><path d="M10 6.5V4h4v2.5M8 11.5h8"/>',
  bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.8"/>',
  care: '<path d="M12 3.5c3 3.6 5 6.3 5 9a5 5 0 0 1-10 0c0-2.7 2-5.4 5-9z"/><path d="M10 13.5a2 2 0 0 0 2 2"/>',
  nurse: '<circle cx="12" cy="7" r="3"/><path d="M5.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M12 16.5v3M10.5 18h3"/>',
  van: '<path d="M3 16V8a1 1 0 0 1 1-1h10v9M14 10h4l3 3v3h-2"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/><path d="M9 17h6M7.5 9.5v3M6 11h3"/>',
  coins: '<ellipse cx="9" cy="7" rx="5" ry="2.3"/><path d="M4 7v4c0 1.3 2.2 2.3 5 2.3s5-1 5-2.3V7M10 15.5c.9.3 2 .5 3.2.5 2.8 0 5-1 5-2.3v-4c0-1-1.4-1.9-3.3-2.2M18.2 13.7v4c0 1.3-2.2 2.3-5 2.3-2.4 0-4.4-.7-4.9-1.8"/>',
  bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0zM9 7.5c0-1 1-1.5 1-2.5M13 7.5c0-1 1-1.5 1-2.5M8 20.5h8"/>',
  people: '<circle cx="8.5" cy="8" r="2.6"/><circle cx="15.5" cy="8" r="2.6"/><path d="M3.5 19c.6-3.2 2.6-4.9 5-4.9 1.4 0 2.6.5 3.5 1.6.9-1.1 2.1-1.6 3.5-1.6 2.4 0 4.4 1.7 5 4.9"/>',
  house: '<path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
  walk: '<circle cx="13" cy="4.5" r="1.7"/><path d="M12.5 8l-2 5 3 2.5V21M10.5 13L8 21M12.5 8l3 3.5 2.5.5M12.5 8L9 9.5 7.5 13"/>',
  stand: '<circle cx="12" cy="4.5" r="1.7"/><path d="M12 8v7M9 21l3-6 3 6M8 11.5l4-3 4 3"/>',
  transfer: '<path d="M3 18V9M3 15h11v3M14 15h5a2 2 0 0 1 2 2v1"/><circle cx="7" cy="12" r="1.6"/><path d="M15 5.5h5M18 3.5l2 2-2 2"/>',
  bath: '<path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 3.7-1M7 19l-1 2M17 19l1 2"/>',
  toilet: '<path d="M7 3h6v7H7zM5 10h12a6 6 0 0 1-6 6H9l1 5H6l1-5"/>',
  shirt: '<path d="M8 4l-4 3 2 4 2-1v10h8V10l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4z"/>',
  pill: '<path d="M4.6 14.6l5.7-8.2a3.5 3.5 0 0 1 5.8 4l-5.7 8.2a3.5 3.5 0 0 1-5.8-4zM7.6 10.6l5.7 4"/>',
  broom: '<path d="M15 3l-3.5 8M7.5 11h8l2 9h-12zM10 15v5M14 15v5"/>',
  alone: '<circle cx="11" cy="8" r="3"/><path d="M5 20c.7-3.5 3-5.3 6-5.3s5.3 1.8 6 5.3M19 3.5a2.6 2.6 0 1 0 1.6 4.4A3.2 3.2 0 0 1 19 3.5z"/>',
  memory: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/><path d="M10.6 8.2a1.5 1.5 0 1 1 2.2 1.3c-.5.3-.8.7-.8 1.2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  hospital: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M12 9v7M8.5 12.5h7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  print: '<path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
  restart: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  alert: '<path d="M12 3l9.5 17h-19zM12 10v4.5M12 17.2v.3"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  chat: '<path d="M4 19.5l1.3-3.8A8 8 0 1 1 8.5 19z"/><path d="M9 10.5h6M9 13.5h4"/>'
};
function icon(n) { return '<svg class="tc-svg" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || IC.spark) + '</svg>'; }

function t2(en, bm) { return { en: en, bm: bm }; }

/* ---------- Screens ---------- */
var SCREENS = ['start', 'about', 'place', 'daily', 'home', 'money', 'areas', 'items', 'how', 'soon', 'review', 'plan'];
var GROUP = { about: 1, place: 2, daily: 3, home: 4, money: 4, areas: 5, items: 5, how: 5, soon: 5, review: 6 };
var GROUPS = [null, t2('About', 'Tentang'), t2('Where', 'Lokasi'), t2('Daily life', 'Harian'), t2('Home and money', 'Rumah dan wang'), t2('Help needed', 'Bantuan'), t2('Check', 'Semak')];

K.pageInit.scenario = function () {
  A = K.assist;
  var root = $('#tc'); if (!root || !A) return;
  var s = A.blank(), at = 'start', chosenAreas = [], playing = 0, lastAdded = '';

  /* the same question, worded for the person or for a helper */
  function Q(selfEn, selfBm, otherEn, otherBm) { return s.filler === 'helper' ? T(otherEn, otherBm) : T(selfEn, selfBm); }

  function tile(field, value, label, opts) {
    opts = opts || {};
    var on = opts.on !== undefined ? opts.on : (Array.isArray(s[field]) ? s[field].indexOf(value) >= 0 : String(s[field]) === String(value));
    return '<button type="button" class="tc-tile' + (opts.small ? ' is-small' : '') + (opts.suggest ? ' is-suggested' : '') + '" aria-pressed="' + on + '"' +
      (opts.attr || (' data-f="' + field + '" data-v="' + esc(String(value)) + '"')) + '>' +
      (opts.icon ? '<span class="tc-ic">' + icon(opts.icon) + '</span>' : '') +
      '<span class="tc-tl"><b>' + esc(label) + '</b>' + (opts.desc ? '<small>' + esc(opts.desc) + '</small>' : '') +
      (opts.suggest ? '<em class="tc-sug">' + esc(T('Suggested', 'Dicadangkan')) + '</em>' : '') + '</span>' +
      '<span class="tc-tick" aria-hidden="true">' + icon('check') + '</span></button>';
  }
  function group(id, title, body, hint) {
    return '<div class="tc-q"><h3 id="' + id + '">' + esc(title) + '</h3>' + (hint ? '<p class="tc-hint">' + esc(hint) + '</p>' : '') +
      '<div class="tc-grid" role="group" aria-labelledby="' + id + '">' + body + '</div></div>';
  }
  function head(title, help) {
    return '<h2 class="tc-title" tabindex="-1">' + esc(title) + '</h2>' + (help ? '<p class="tc-help">' + esc(help) + '</p>' : '');
  }
  function map(obj, fn) { return Object.keys(obj).map(fn).join(''); }

  /* ---------- each screen ---------- */
  var draw = {
    start: function () {
      return head(T('Who is filling this in?', 'Siapa yang mengisi ini?'), T('We will ask a few simple questions, one at a time. You can go back and change any answer.', 'Kami akan tanya beberapa soalan mudah, satu demi satu. Anda boleh kembali dan ubah jawapan.')) +
        '<div class="tc-grid is-two">' +
        tile('filler', 'self', L(A.fillers.self), { icon: 'person', desc: T('I am the older person', 'Saya warga emas itu') }) +
        tile('filler', 'helper', L(A.fillers.helper), { icon: 'helper', desc: T('Family, a neighbour or an officer', 'Keluarga, jiran atau pegawai') }) + '</div>' +
        (s.filler === 'helper' ? group('tcRel', T('Who are you to them?', 'Apakah hubungan anda dengannya?'), map(A.relations, function (k) { return tile('relation', k, L(A.relations[k]), { small: true }); })) : '') +
        '<div class="tc-examples"><h3>' + esc(T('Or watch a full example', 'Atau tonton contoh lengkap')) + '</h3><div class="tc-ex-list">' +
        A.examples.map(function (e, i) {
          return '<button type="button" class="tc-ex" data-example="' + i + '"><span class="tc-ex-play">' + icon('play') + '</span><span><b>' + esc(L(e.l)) + '</b><small>' + esc(L(e.d)) + '</small></span></button>';
        }).join('') + '</div></div>';
    },
    about: function () {
      return head(Q('How old are you?', 'Berapakah umur anda?', 'How old are they?', 'Berapakah umurnya?')) +
        group('tcAge', T('Age', 'Umur'), A.ages.map(function (a) { return tile('age', a, A.ageLabel[a] ? L(A.ageLabel[a]) : a.replace('-', ' to '), { small: true }); }).join('')) +
        group('tcGender', T('Gender', 'Jantina'), map(A.genders, function (k) { return tile('gender', k, L(A.genders[k]), { small: true }); }));
    },
    place: function () {
      var ds = Object.keys(K.scenario.districtAdj), mk = s.district ? (K.scenario.mukimByDistrict[s.district] || []) : [];
      return head(Q('Where do you live?', 'Di mana anda tinggal?', 'Where do they live?', 'Di mana dia tinggal?'), T('Choose the district, then the nearest mukim or town.', 'Pilih daerah, kemudian mukim atau pekan yang paling dekat.')) +
        group('tcDistrict', T('District in Kedah', 'Daerah di Kedah'), ds.map(function (d) { return tile('district', d, d, { small: true, icon: 'pin' }); }).join('')) +
        (s.district ? '<div class="tc-q"><label class="tc-select"><span>' + esc(T('Mukim or nearest town', 'Mukim atau pekan terdekat')) + '</span><select data-f="mukim"><option value="">' + esc(T('Choose one (optional)', 'Pilih satu (pilihan)')) + '</option>' +
          mk.map(function (m) { return '<option' + (s.mukim === m ? ' selected' : '') + '>' + esc(m) + '</option>'; }).join('') + '</select></label></div>' : '');
    },
    daily: function () {
      return head(Q('How do you manage day to day?', 'Bagaimana anda menguruskan kehidupan harian?', 'How do they manage day to day?', 'Bagaimana dia menguruskan kehidupan harian?')) +
        '<div class="tc-grid">' + map(A.levels, function (k) { return tile('level', k, L(A.levels[k].l), { desc: L(A.levels[k].d) }); }) + '</div>' +
        group('tcDiff', Q('What is hard now?', 'Apa yang sukar sekarang?', 'What is hard for them now?', 'Apa yang sukar baginya sekarang?'),
          map(A.difficulties, function (k) { return tile('difficulties', k, L(A.difficulties[k].l), { small: true, icon: A.difficulties[k].i }); }), T('Choose all that apply. We use this to suggest help, not to diagnose.', 'Pilih semua yang berkaitan. Kami gunakan ini untuk mencadangkan bantuan, bukan untuk diagnosis.')) +
        '<div class="tc-q">' + tile('recentHospital', 'yes', Q('I came home from hospital recently', 'Saya baru pulang dari hospital', 'They came home from hospital recently', 'Dia baru pulang dari hospital'), { on: s.recentHospital, icon: 'hospital' }) + '</div>';
    },
    home: function () {
      return head(Q('Who is at home with you?', 'Siapa di rumah bersama anda?', 'Who is at home with them?', 'Siapa di rumah bersamanya?')) +
        group('tcLiving', T('Living', 'Tempat tinggal'), map(A.livings, function (k) { return tile('living', k, L(A.livings[k]), { small: true }); })) +
        group('tcCarer', Q('Who helps you most?', 'Siapa paling banyak membantu anda?', 'Who helps them most?', 'Siapa paling banyak membantunya?'), map(A.carers, function (k) { return tile('carer', k, L(A.carers[k]), { small: true }); })) +
        (s.carer && s.carer !== 'none' ? group('tcCarerTime', T('How often can they help?', 'Berapa kerap mereka boleh membantu?'), map(A.carerTimes, function (k) { return tile('carerTime', k, L(A.carerTimes[k]), { small: true }); })) : '');
    },
    money: function () {
      return head(T('Money', 'Wang'), T('This helps us find aid that fits. You can choose "Prefer not to say".', 'Ini membantu kami mencari bantuan yang sesuai. Anda boleh pilih "Tidak mahu nyatakan".')) +
        group('tcIncome', T('Household income a month', 'Pendapatan isi rumah sebulan'), map(A.incomes, function (k) { return tile('income', k, L(A.incomes[k]), { small: true }); })) +
        group('tcSupport', Q('Do you get any of these?', 'Adakah anda menerima mana-mana ini?', 'Do they get any of these?', 'Adakah dia menerima mana-mana ini?'), map(A.supports, function (k) { return tile('supports', k, L(A.supports[k]), { small: true }); })) +
        group('tcPay', T('Can the family pay for some help?', 'Bolehkah keluarga membayar sebahagian bantuan?'), map(A.pays, function (k) { return tile('pay', k, L(A.pays[k]), { small: true }); }));
    },
    areas: function () {
      var sug = A.suggestions(s), sugAreas = [];
      sug.forEach(function (x) { if (sugAreas.indexOf(x.area) < 0) sugAreas.push(x.area); });
      return head(T('What kind of help is needed?', 'Apakah jenis bantuan yang diperlukan?'), T('Choose as many as you need. Next you will pick the exact items.', 'Pilih seberapa banyak yang perlu. Seterusnya anda pilih barang yang tepat.')) +
        (sugAreas.length ? '<button type="button" class="tc-notsure" data-suggest-all>' + icon('spark') + '<span><b>' + esc(T('Not sure? Suggest from the answers', 'Tidak pasti? Cadangkan daripada jawapan')) + '</b><small>' + esc(T('We mark the areas that fit what you told us.', 'Kami tandakan bidang yang sesuai dengan jawapan anda.')) + '</small></span></button>' : '') +
        '<div class="tc-grid">' + map(A.areas, function (k) {
          return tile('', k, L(A.areas[k].l), { icon: A.areas[k].i, on: chosenAreas.indexOf(k) >= 0, suggest: sugAreas.indexOf(k) >= 0, attr: ' data-area="' + k + '"' });
        }) + '</div>';
    },
    items: function () {
      var sug = A.suggestions(s).map(function (x) { return x.item; });
      return head(T('Which ones exactly?', 'Yang mana satu tepatnya?'), T('Pick every item needed. They all stay in one case.', 'Pilih semua barang yang perlu. Semuanya kekal dalam satu kes.')) +
        chosenAreas.map(function (ak) {
          var area = A.areas[ak];
          return group('tcArea-' + ak, L(area.l), Object.keys(area.items).map(function (ik) {
            var on = s.needs.some(function (n) { return n.item === ik; });
            return tile('', ik, L(A.items[ik].l), { small: true, on: on, suggest: sug.indexOf(ik) >= 0, attr: ' data-item="' + ik + '"' });
          }).join(''));
        }).join('');
    },
    how: function () {
      return head(T('How should each one come?', 'Bagaimana setiap satu patut diperoleh?'), T('Choose the way that suits, and for how long. "Not sure" is fine.', 'Pilih cara yang sesuai, dan untuk berapa lama. "Tidak pasti" pun boleh.')) +
        '<div class="tc-needs">' + s.needs.map(function (n) {
          var it = A.items[n.item], kind = A.kinds[it.kind];
          return '<article class="tc-need"><header><span class="tc-ic">' + icon(A.areas[it.area].i) + '</span><h3>' + esc(L(it.l)) + '</h3></header>' +
            '<p class="tc-mini">' + esc(T('How', 'Cara')) + '</p><div class="tc-chips">' + kind.modes.map(function (m) {
              return '<button type="button" class="tc-chip" aria-pressed="' + (n.mode === m) + '" data-need-mode="' + n.item + '|' + m + '">' + esc(L(A.modes[m])) + '</button>';
            }).join('') + '</div>' +
            '<p class="tc-mini">' + esc(T('For how long', 'Berapa lama')) + '</p><div class="tc-chips">' + Object.keys(A.durations).map(function (d) {
              return '<button type="button" class="tc-chip" aria-pressed="' + (n.duration === d) + '" data-need-dur="' + n.item + '|' + d + '">' + esc(L(A.durations[d])) + '</button>';
            }).join('') + '</div></article>';
        }).join('') + '</div>';
    },
    soon: function () {
      return head(T('How soon is help needed?', 'Bilakah bantuan diperlukan?')) +
        '<div class="tc-grid">' + map(A.urgencies, function (k) { return tile('urgency', k, L(A.urgencies[k].l), { desc: L(A.urgencies[k].d), icon: 'clock' }); }) + '</div>' +
        '<div class="tc-q"><label class="tc-select"><span>' + esc(T('Anything else we should know? (optional)', 'Ada apa-apa lagi yang perlu kami tahu? (pilihan)')) + '</span><textarea data-f="note" rows="3" maxlength="500">' + esc(s.note) + '</textarea></label></div>';
    },
    review: function () {
      function row(label, value, go) { return '<div class="tc-rv"><dt>' + esc(label) + '</dt><dd>' + esc(value || '·') + '</dd><dd><button type="button" class="tc-link" data-go="' + go + '">' + esc(T('Change', 'Ubah')) + '</button></dd></div>'; }
      return head(T('Check the case', 'Semak kes ini'), T('Make sure this is right. Then we make one plan for all of it.', 'Pastikan ini betul. Kemudian kami buat satu pelan untuk semuanya.')) +
        '<dl class="tc-review">' +
        row(T('Filled in by', 'Diisi oleh'), L(A.fillers[s.filler]) + (s.relation ? ' · ' + L(A.relations[s.relation]) : ''), 'start') +
        row(T('Person', 'Orang'), [ageText(), s.gender ? L(A.genders[s.gender]) : ''].filter(Boolean).join(' · '), 'about') +
        row(T('Place', 'Lokasi'), [s.district, s.mukim].filter(Boolean).join(' · '), 'place') +
        row(T('Daily life', 'Kehidupan harian'), [s.level ? L(A.levels[s.level].l) : ''].concat(s.difficulties.map(function (d) { return L(A.difficulties[d].l); })).concat(s.recentHospital ? [T('Home from hospital', 'Baru pulang dari hospital')] : []).filter(Boolean).join(' · '), 'daily') +
        row(T('Home', 'Rumah'), [s.living ? L(A.livings[s.living]) : '', s.carer ? T('Helped by ', 'Dibantu oleh ') + L(A.carers[s.carer]).toLowerCase() : '', s.carerTime ? L(A.carerTimes[s.carerTime]) : ''].filter(Boolean).join(' · '), 'home') +
        row(T('Money', 'Wang'), [s.income ? L(A.incomes[s.income]) : ''].concat(s.supports.map(function (k) { return L(A.supports[k]); })).concat(s.pay ? [L(A.pays[s.pay])] : []).filter(Boolean).join(' · '), 'money') +
        row(T('Needs', 'Keperluan'), s.needs.map(function (n) { return L(A.items[n.item].l) + ' (' + L(A.modes[n.mode]).toLowerCase() + ')'; }).join(' · '), 'items') +
        row(T('How soon', 'Bila'), s.urgency ? L(A.urgencies[s.urgency].l) : '', 'soon') +
        '</dl>';
    },
    plan: function () { return planHtml(A.plan(s)); }
  };
  function ageText() { return s.age ? (A.ageLabel[s.age] ? L(A.ageLabel[s.age]) : s.age.replace('-', T(' to ', ' hingga '))) + T(' years', ' tahun') : ''; }

  /* ---------- the Assistance Plan ---------- */
  var REASON = {
    offers: t2('Offers this', 'Menawarkan ini'), mode: t2('Can help this way', 'Boleh bantu cara ini'), sameDistrict: t2('Same district', 'Daerah yang sama'),
    statewide: t2('Serves all of Kedah', 'Berkhidmat seluruh Kedah'), fast: t2('Can act within days', 'Boleh bertindak dalam beberapa hari'),
    likelyQualifies: t2('Likely to qualify on income', 'Mungkin layak ikut pendapatan'), free: t2('No charge', 'Tiada bayaran'), confirmed: t2('Confirmed on our list', 'Disahkan dalam senarai kami')
  };
  var CAUTION = {
    modeDiffers: t2('Helps another way', 'Membantu dengan cara lain'), otherDistrict: t2('In another district', 'Di daerah lain'), slow: t2('May take weeks', 'Mungkin mengambil masa beberapa minggu'),
    mayNotQualify: t2('May not qualify on income', 'Mungkin tidak layak ikut pendapatan'), checkEligibility: t2('Eligibility to check', 'Kelayakan perlu disemak'), costs: t2('There is a cost', 'Ada bayaran')
  };
  var FLAG = {
    coordinator: function (p) { return T('One coordinator should hold this case: ' + p.total + ' needs across ' + p.areas.length + ' kinds of help.', 'Seorang penyelaras patut memegang kes ini: ' + p.total + ' keperluan dalam ' + p.areas.length + ' jenis bantuan.'); },
    urgent: function () { return T('Needed today. If a life is in danger, call 999 now. Otherwise contact the first place below, then follow the steps.', 'Diperlukan hari ini. Jika nyawa dalam bahaya, hubungi 999 sekarang. Jika tidak, hubungi tempat pertama di bawah, kemudian ikut langkah.'); },
    aloneHighNeed: function () { return T('Needs daily help but has no one there every day. Check that they are safe first.', 'Perlukan bantuan harian tetapi tiada orang setiap hari. Pastikan keselamatannya dahulu.'); },
    carerStrain: function () { return T('The carer helps every day. Plan a break for the carer too.', 'Penjaga membantu setiap hari. Rancang rehat untuk penjaga juga.'); },
    gap: function (p) { var n = p.total - p.covered; return T(n + (n > 1 ? ' needs have' : ' need has') + ' no organisation on our list yet. Phase 1 looks for who can help.', n + ' keperluan belum ada organisasi dalam senarai kami. Fasa 1 akan mencari siapa boleh membantu.'); }
  };
  function provName(m) { return m.record.name; }
  function matchRow(m, label) {
    return '<div class="tc-match"><div class="tc-match-top"><span class="tc-mini">' + esc(label) + '</span>' + K.pill(m.record.status) + '</div>' +
      '<b>' + esc(provName(m)) + '</b><small>' + esc(m.record.district) + '</small>' +
      '<div class="tc-meter" role="img" aria-label="' + esc(T('Match ' + m.pts + ' out of 100', 'Padanan ' + m.pts + ' daripada 100')) + '"><i style="--v:' + m.pts + '%"></i><span>' + m.pts + '</span></div>' +
      '<ul class="tc-why">' + m.reasons.map(function (r) { return '<li class="ok">' + icon('check') + esc(L(REASON[r])) + '</li>'; }).join('') +
      m.cautions.map(function (c) { return '<li class="warn">' + icon('alert') + esc(L(CAUTION[c])) + '</li>'; }).join('') + '</ul></div>';
  }
  function steps(p, line) {
    var out = [], it = line.item, kind = it.kind;
    if (it.area === 'medical' || it.area === 'bedhome' || it.area === 'mobility') out.push(T('Check the right type and size with a nurse or therapist.', 'Semak jenis dan saiz yang betul dengan jururawat atau ahli terapi.'));
    if (line.best) {
      out.push(T('Contact ' + provName(line.best) + ' and ask for: ' + L(it.l).toLowerCase() + ' (' + L(A.modes[line.need.mode]).toLowerCase() + ').', 'Hubungi ' + provName(line.best) + ' dan minta: ' + L(it.l).toLowerCase() + ' (' + L(A.modes[line.need.mode]).toLowerCase() + ').'));
      if (line.matches[1]) out.push(T('If they cannot help: ' + provName(line.matches[1]) + '.', 'Jika mereka tidak dapat membantu: ' + provName(line.matches[1]) + '.'));
    } else {
      out.push(T('Ask the coordination desk to search for this in ' + (p.input.district || 'Kedah') + '.', 'Minta meja penyelarasan mencarinya di ' + (p.input.district || 'Kedah') + '.'));
    }
    if (p.fundHelper && (kind === 'equipment' || kind === 'consumable') && ['buy', 'rent', 'unsure'].indexOf(line.need.mode) >= 0) out.push(T('Ask ' + provName(p.fundHelper) + ' about help to pay.', 'Tanya ' + provName(p.fundHelper) + ' tentang bantuan bayaran.'));
    out.push(T('Confirm who qualifies, if it is available, and any cost before the referral.', 'Sahkan kelayakan, ketersediaan dan kos sebelum rujukan.'));
    return out;
  }
  /* ---------- contact cards: the part a family acts on ---------- */
  var PIC = [['Masjid', 'help-masjid'], ['Kedah Home Nursing', 'help-health'], ['Amanah', 'help-home'], ['Kedah Community Transport', 'help-transport'],
    ['Meals-on-Wheels', 'help-meals'], ['Neighbourhood Care Hub', 'help-home'], ['Volunteer Pool', 'help-company'], ['PAWE', 'people-family'],
    ['Kedah Senior Citizens', 'help-company'], ['WANIDA', 'people-company'], ['PERKIM', 'help-masjid'], ['Kedah Islamic Welfare', 'people-advice']];
  function picFor(rec) { for (var i = 0; i < PIC.length; i++) if (rec.name.indexOf(PIC[i][0]) === 0) return PIC[i][1]; return 'people-advice'; }
  function place(rec) { return rec.name + ', ' + rec.district + ', Kedah'; }
  function mapUrl(rec) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place(rec)); }
  function dirUrl(rec) { return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(place(rec)); }
  function tripUrl(p) {
    var stops = p.contacts.map(function (c) { return place(c.record); }).slice(0, 10);
    if (!stops.length) return '';
    var dest = stops.pop();
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest) + (stops.length ? '&waypoints=' + stops.map(encodeURIComponent).join('%7C') : '');
  }
  function contactCard(c) {
    var rec = c.record;
    return '<li class="tc-contact"><img src="assets/img/' + picFor(rec) + '.webp" alt="" width="560" height="560" loading="lazy">' +
      '<div class="tc-contact-body"><div class="tc-contact-top"><div><b>' + esc(rec.name) + '</b><small>' + icon('pin') + esc(rec.district + ', Kedah') + '</small></div>' + K.pill(rec.status) + '</div>' +
      '<p class="tc-contact-for">' + c.items.map(function (k) { return '<span>' + esc(L(A.items[k].l)) + '</span>'; }).join('') + '</p>' +
      '<div class="tc-contact-acts">' +
        '<a class="btn btn-paddy" href="' + dirUrl(rec) + '" target="_blank" rel="noopener">' + icon('van') + '<span>' + esc(T('Directions', 'Arah')) + '</span></a>' +
        '<a class="btn btn-quiet" href="' + mapUrl(rec) + '" target="_blank" rel="noopener">' + icon('pin') + '<span>' + esc(T('Open in Google Maps', 'Buka di Google Maps')) + '</span></a>' +
        '<span class="tc-call">' + icon('phone') + '<span>' + esc(T('Phone number added after the Phase 1 check', 'Nombor telefon ditambah selepas semakan Fasa 1')) + '</span></span>' +
      '</div></div></li>';
  }
  function followDays(u) { return { today: 1, days: 3, weeks: 7, months: 30, plan: 30 }[u] || 7; }
  function icsFor(p) {
    var d = new Date(); d.setDate(d.getDate() + followDays(p.input.urgency));
    function ymd(x) { return x.getFullYear() + ('0' + (x.getMonth() + 1)).slice(-2) + ('0' + x.getDate()).slice(-2); }
    var end = new Date(d.getTime() + 86400000);
    var text = planText(p).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kedah Silver Economy//Try a case//EN', 'BEGIN:VEVENT', 'UID:' + p.caseId + '@kedah-silver-economy',
      'DTSTAMP:' + ymd(new Date()) + 'T000000Z', 'DTSTART;VALUE=DATE:' + ymd(d), 'DTEND;VALUE=DATE:' + ymd(end),
      'SUMMARY:' + T('Follow up the care plan ', 'Susulan pelan bantuan ') + p.caseId, 'DESCRIPTION:' + text,
      'BEGIN:VALARM', 'TRIGGER:-PT9H', 'ACTION:DISPLAY', 'DESCRIPTION:' + T('Follow up the care plan', 'Susulan pelan bantuan'), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  var canSpeak = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);

  function planHtml(p) {
    var s0 = p.input, ring = p.total ? Math.round(p.covered / p.total * 100) : 0;
    var who = [ageText(), s0.gender && s0.gender !== 'prefer-not' ? L(A.genders[s0.gender]) : '', s0.district].filter(Boolean).join(' · ');
    return '<div class="tc-plan">' +
      '<section class="tc-plan-hero" aria-labelledby="tcPlanTitle">' +
        '<div><p class="tc-mini">' + esc(T('Assistance plan', 'Pelan bantuan')) + '</p><h2 class="tc-title" id="tcPlanTitle" tabindex="-1">' + esc(who || T('This case', 'Kes ini')) + '</h2>' +
        '<p class="tc-plan-sub">' + esc([s0.level ? L(A.levels[s0.level].l) : '', s0.living ? L(A.livings[s0.living]) : '', s0.urgency ? T('Needed: ', 'Diperlukan: ') + L(A.urgencies[s0.urgency].l).toLowerCase() : ''].filter(Boolean).join(' · ')) + '</p>' +
        '<p class="tc-id"><span>' + esc(T('Case', 'Kes')) + '</span><code>' + esc(p.caseId) + '</code><span>' + esc(T('Rules', 'Peraturan')) + ' ' + esc(p.version) + '</span></p></div>' +
        '<div class="tc-ring" style="--v:' + ring + '" role="img" aria-label="' + esc(T(p.covered + ' of ' + p.total + ' needs have a possible match', p.covered + ' daripada ' + p.total + ' keperluan ada padanan yang mungkin')) + '"><b>' + p.covered + '<small>/' + p.total + '</small></b><span>' + esc(T('needs with a possible match', 'keperluan ada padanan')) + '</span></div>' +
      '</section>' +
      (p.flags.length ? '<ul class="tc-flags">' + p.flags.map(function (f) { return '<li class="tc-flag tc-flag-' + f + '">' + icon(f === 'gap' || f === 'urgent' ? 'alert' : f === 'coordinator' ? 'people' : 'person') + '<span>' + esc(FLAG[f](p)) + '</span></li>'; }).join('') + '</ul>' : '') +
      (p.contacts.length ? '<section class="tc-contacts" aria-labelledby="tcContactsTitle"><div class="tc-contacts-head"><div><h3 id="tcContactsTitle">' + esc(T('Who to contact', 'Siapa perlu dihubungi')) + '</h3><p class="tc-hint">' +
        esc(T(p.contacts.length + (p.contacts.length > 1 ? ' places' : ' place') + ' could cover all ' + p.covered + ' matched needs.', p.contacts.length + ' tempat boleh meliputi semua ' + p.covered + ' keperluan yang dipadankan.')) + '</p></div>' +
        (p.contacts.length > 1 ? '<a class="btn btn-paddy tc-trip" href="' + tripUrl(p) + '" target="_blank" rel="noopener">' + icon('van') + '<span>' + esc(T('Plan one trip to all ' + p.contacts.length, 'Rancang satu perjalanan ke semua ' + p.contacts.length)) + '</span></a>' : '') +
        '</div><ol class="tc-contact-list">' + p.contacts.map(contactCard).join('') + '</ol>' +
        '<div class="tc-share">' +
          (canSpeak ? '<button type="button" class="btn btn-quiet" data-act="listen">' + icon('sound') + '<span>' + esc(T('Listen to the plan', 'Dengar pelan ini')) + '</span></button>' : '') +
          '<a class="btn btn-quiet" href="https://wa.me/?text=' + encodeURIComponent(planText(p)) + '" target="_blank" rel="noopener">' + icon('chat') + '<span>' + esc(T('Send to family on WhatsApp', 'Hantar kepada keluarga di WhatsApp')) + '</span></a>' +
          '<button type="button" class="btn btn-quiet" data-act="remind">' + icon('clock') + '<span>' + esc(T('Remind me in ' + followDays(p.input.urgency) + (followDays(p.input.urgency) > 1 ? ' days' : ' day'), 'Ingatkan saya dalam ' + followDays(p.input.urgency) + ' hari')) + '</span></button>' +
        '</div></section>' : '') +
      '<p class="tc-sample">' + icon('alert') + '<span>' + esc(T('Sample matching. What each organisation can offer is an example until Phase 1 checks it. This plan shows possible matches only; it does not promise help or decide who qualifies.', 'Padanan contoh. Apa yang setiap organisasi boleh tawarkan ialah contoh sehingga Fasa 1 menyemaknya. Pelan ini hanya menunjukkan padanan yang mungkin; ia tidak menjanjikan bantuan atau menentukan kelayakan.')) + '</span></p>' +
      '<ol class="tc-lines">' + p.lines.map(function (line, i) {
        var it = line.item;
        return '<li class="tc-line' + (line.covered ? '' : ' is-gap') + '"><header><span class="tc-num">' + (i + 1) + '</span><span class="tc-ic">' + icon(A.areas[it.area].i) + '</span><div><h3>' + esc(L(it.l)) + '</h3>' +
          '<p class="tc-tags"><span>' + esc(L(A.modes[line.need.mode])) + '</span><span>' + esc(L(A.durations[line.need.duration])) + '</span><span>' + esc(L(A.areas[it.area].l)) + '</span></p></div></header>' +
          (line.covered ? '<div class="tc-matches">' + matchRow(line.best, T('Best possible match', 'Padanan terbaik')) + (line.matches[1] ? matchRow(line.matches[1], T('Back-up', 'Pilihan kedua')) : '') + '</div>'
            : '<p class="tc-gapnote">' + icon('alert') + esc(T('No organisation on our list offers this yet. This is a gap the project will map.', 'Belum ada organisasi dalam senarai kami yang menawarkan ini. Ini jurang yang akan dipetakan oleh projek.')) + '</p>') +
          '<details class="tc-steps" open><summary>' + esc(T('Steps', 'Langkah')) + '</summary><ol>' + steps(p, line).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></details></li>';
      }).join('') + '</ol>' +
      '<div class="tc-plan-actions">' +
        '<button type="button" class="btn btn-paddy" data-act="copy">' + icon('copy') + '<span>' + esc(T('Copy the plan', 'Salin pelan')) + '</span></button>' +
        '<button type="button" class="btn btn-quiet" data-act="print">' + icon('print') + '<span>' + esc(T('Print or save as PDF', 'Cetak atau simpan PDF')) + '</span></button>' +
        '<button type="button" class="btn btn-quiet" data-go="review">' + icon('edit') + '<span>' + esc(T('Change answers', 'Ubah jawapan')) + '</span></button>' +
        '<button type="button" class="btn btn-quiet" data-act="restart">' + icon('restart') + '<span>' + esc(T('Start a new case', 'Mula kes baharu')) + '</span></button>' +
        '<p class="tc-copied" id="tcCopied" aria-live="polite"></p>' +
      '</div></div>';
  }
  function planText(p) {
    var out = ['Kedah Silver Economy · ' + T('Assistance plan', 'Pelan bantuan'), T('Case ', 'Kes ') + p.caseId + ' · ' + T('rules ', 'peraturan ') + p.version, ''];
    p.lines.forEach(function (line, i) {
      out.push((i + 1) + '. ' + L(line.item.l) + ' (' + L(A.modes[line.need.mode]) + ', ' + L(A.durations[line.need.duration]) + ')');
      out.push('   ' + (line.best ? T('Possible match: ', 'Padanan mungkin: ') + provName(line.best) + ' (' + L(K.status[line.best.record.status]) + ')' : T('No match on our list yet', 'Belum ada padanan dalam senarai kami')));
    });
    if (p.contacts && p.contacts.length) {
      out.push('', T('Places', 'Tempat') + ':');
      p.contacts.forEach(function (c) { out.push('- ' + c.record.name + ', ' + c.record.district + ': ' + mapUrl(c.record)); });
    }
    out.push('', T('Sample matching only. Eligibility, availability and cost must be confirmed.', 'Padanan contoh sahaja. Kelayakan, ketersediaan dan kos mesti disahkan.'));
    return out.join('\n');
  }

  /* ---------- the case card that fills in as you answer ---------- */
  function card() {
    var rows = [];
    function add(key, label, value) { if (value) rows.push('<div class="tc-cr' + (lastAdded === key ? ' is-new' : '') + '"><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>'); }
    add('filler', T('Filled in by', 'Diisi oleh'), s.filler === 'helper' ? (s.relation ? L(A.relations[s.relation]) : L(A.fillers.helper)) : (at !== 'start' ? L(A.fillers.self) : ''));
    add('person', T('Person', 'Orang'), [ageText(), s.gender ? L(A.genders[s.gender]) : ''].filter(Boolean).join(' · '));
    add('place', T('Place', 'Lokasi'), [s.mukim, s.district].filter(Boolean).join(', '));
    add('level', T('Day to day', 'Harian'), s.level ? L(A.levels[s.level].l) : '');
    add('difficulties', T('Hard to do', 'Sukar dibuat'), s.difficulties.map(function (d) { return L(A.difficulties[d].l); }).join(', '));
    add('recentHospital', T('Hospital', 'Hospital'), s.recentHospital ? T('Home recently', 'Baru pulang') : '');
    add('home', T('Home', 'Rumah'), [s.living ? L(A.livings[s.living]) : '', s.carer ? L(A.carers[s.carer]) : ''].filter(Boolean).join(' · '));
    add('money', T('Money', 'Wang'), [s.income ? L(A.incomes[s.income]) : '', s.pay ? L(A.pays[s.pay]) : ''].filter(Boolean).join(' · '));
    var needs = s.needs.map(function (n) { return '<li' + (lastAdded === 'need-' + n.item ? ' class="is-new"' : '') + '><span class="tc-ic">' + icon(A.areas[A.items[n.item].area].i) + '</span>' + esc(L(A.items[n.item].l)) + '<small>' + esc(L(A.modes[n.mode])) + '</small></li>'; }).join('');
    var filled = rows.length + s.needs.length;
    return '<div class="tc-card-head"><span>' + esc(T('The case so far', 'Kes setakat ini')) + '</span><code>' + esc(A.caseId(s)) + '</code></div>' +
      (filled ? '<dl class="tc-cr-list">' + rows.join('') + '</dl>' : '<p class="tc-card-empty">' + esc(T('Each answer appears here. Together they become one case.', 'Setiap jawapan muncul di sini. Bersama-sama ia menjadi satu kes.')) + '</p>') +
      (needs ? '<p class="tc-mini">' + esc(T('Needs in this case', 'Keperluan dalam kes ini')) + '</p><ul class="tc-card-needs">' + needs + '</ul>' : '') +
      (s.urgency ? '<p class="tc-card-urg">' + icon('clock') + esc(L(A.urgencies[s.urgency].l)) + '</p>' : '');
  }

  /* ---------- progress and the bottom bar ---------- */
  function progress() {
    var g = GROUP[at] || 0;
    if (!g) return '';
    return '<ol class="tc-progress" aria-label="' + esc(T('Steps', 'Langkah')) + '">' + GROUPS.slice(1).map(function (lab, i) {
      var n = i + 1, state = n < g ? 'done' : n === g ? 'now' : 'next';
      var first = SCREENS.filter(function (x) { return GROUP[x] === n; })[0];
      return '<li class="is-' + state + '"' + (state === 'now' ? ' aria-current="step"' : '') + '>' + (state === 'done' ? '<button type="button" data-go="' + first + '">' : '<span>') +
        '<i>' + (state === 'done' ? icon('check') : n) + '</i><em>' + esc(L(lab)) + '</em>' + (state === 'done' ? '</button>' : '</span>') + '</li>';
    }).join('') + '</ol>';
  }
  function ready() {
    switch (at) {
      case 'start': return s.filler === 'self' || !!s.relation;
      case 'about': return !!(s.age && s.gender);
      case 'place': return !!s.district;
      case 'daily': return !!s.level;
      case 'home': return !!(s.living && s.carer && (s.carer === 'none' || s.carerTime));
      case 'money': return !!(s.income && s.pay);
      case 'areas': return chosenAreas.length > 0;
      case 'items': return s.needs.length > 0;
      case 'soon': return !!s.urgency;
      default: return true;
    }
  }
  function bar() {
    if (at === 'plan') return '';
    var i = SCREENS.indexOf(at), next = at === 'review' ? T('Make the plan', 'Buat pelan') : at === 'start' ? T('Start', 'Mula') : T('Next', 'Seterusnya');
    return '<div class="tc-bar">' + (i > 0 ? '<button type="button" class="btn btn-quiet" data-nav="back">' + esc(T('Back', 'Kembali')) + '</button>' : '<span></span>') +
      '<p class="tc-wait" aria-live="polite">' + (ready() ? '' : esc(T('Choose an answer to go on', 'Pilih jawapan untuk teruskan'))) + '</p>' +
      '<button type="button" class="btn btn-paddy" data-nav="next"' + (ready() ? '' : ' aria-disabled="true"') + '>' + esc(next) + '</button></div>';
  }
  /* the screen is redrawn after each tap, so keep keyboard focus on the same control */
  var KEYS = ['data-item', 'data-area', 'data-need-mode', 'data-need-dur', 'data-nav', 'data-suggest-all'];
  function focusKey() {
    var el = document.activeElement; if (!el || !root.contains(el)) return null;
    if (el.hasAttribute('data-f')) return '[data-f="' + el.getAttribute('data-f') + '"]' + (el.hasAttribute('data-v') ? '[data-v="' + el.getAttribute('data-v') + '"]' : '');
    for (var i = 0; i < KEYS.length; i++) if (el.hasAttribute(KEYS[i])) return '[' + KEYS[i] + (el.getAttribute(KEYS[i]) ? '="' + el.getAttribute(KEYS[i]) + '"' : '') + ']';
    return el.classList.contains('tc-card-toggle') ? '.tc-card-toggle' : null;
  }
  function render(focus) {
    var keep = focus ? null : focusKey(), cardOpen = !!root.querySelector('.tc-card.is-open');
    root.innerHTML =
      '<div class="tc-layout' + (at === 'plan' ? ' is-plan' : '') + '">' +
        '<section class="tc-stage" aria-live="off">' + progress() + '<div class="tc-screen tc-screen-' + at + '">' + draw[at]() + '</div>' + bar() + '</section>' +
        (at === 'plan' ? '' : '<aside class="tc-card" aria-label="' + esc(T('The case so far', 'Kes setakat ini')) + '"><button type="button" class="tc-card-toggle" aria-expanded="false">' +
          '<span>' + esc(T('The case so far', 'Kes setakat ini')) + '</span><b>' + (s.needs.length ? s.needs.length + ' ' + T('needs', 'keperluan') : '') + '</b></button><div class="tc-card-body">' + card() + '</div></aside>') +
      '</div>';
    lastAdded = '';
    if (cardOpen) { var c = root.querySelector('.tc-card'); if (c) { c.classList.add('is-open'); c.querySelector('.tc-card-toggle').setAttribute('aria-expanded', 'true'); } }
    if (keep) { var k = root.querySelector(keep); if (k) k.focus({ preventScroll: true }); }
    if (focus) { var h = root.querySelector('.tc-title'); if (h) h.focus({ preventScroll: true }); var top = root.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > top) window.scrollTo({ top: top, behavior: K.reduceMotion ? 'auto' : 'smooth' }); }
  }
  function go(id) { if (SCREENS.indexOf(id) < 0) return; at = id; render(true); }
  function next() {
    if (!ready()) { var w = root.querySelector('.tc-wait'); if (w) { w.classList.remove('is-shake'); void w.offsetWidth; w.classList.add('is-shake'); } return; }
    if (at === 'how' && !s.needs.length) return go('items');
    go(SCREENS[SCREENS.indexOf(at) + 1]);
  }
  function back() { var i = SCREENS.indexOf(at); if (i > 0) go(SCREENS[i - 1]); }

  /* ---------- answers ---------- */
  var MULTI = { difficulties: 1, supports: 1 };
  function setField(f, v) {
    if (f === 'recentHospital') { s.recentHospital = !s.recentHospital; lastAdded = 'recentHospital'; return; }
    if (MULTI[f]) {
      var a = s[f], i = a.indexOf(v);
      if (f === 'supports' && v === 'none') s.supports = i >= 0 ? [] : ['none'];
      else { if (i >= 0) a.splice(i, 1); else a.push(v); if (f === 'supports') s.supports = s.supports.filter(function (x) { return x !== 'none'; }); }
      lastAdded = f === 'supports' ? 'money' : f; return;
    }
    s[f] = v;
    if (f === 'filler' && v === 'self') s.relation = '';
    if (f === 'district') s.mukim = '';
    if (f === 'carer' && v === 'none') s.carerTime = '';
    lastAdded = { age: 'person', gender: 'person', district: 'place', mukim: 'place', living: 'home', carer: 'home', carerTime: 'home', income: 'money', pay: 'money', relation: 'filler', filler: 'filler' }[f] || f;
  }
  function toggleItem(k) {
    var i = -1; s.needs.forEach(function (n, j) { if (n.item === k) i = j; });
    if (i >= 0) s.needs.splice(i, 1);
    else { var kind = A.kinds[A.items[k].kind]; s.needs.push({ item: k, mode: kind.mode, duration: kind.dur }); lastAdded = 'need-' + k; }
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    if (b.hasAttribute('data-example')) return play(A.examples[Number(b.getAttribute('data-example'))]);
    if (b.classList.contains('tc-card-toggle')) { var c = b.closest('.tc-card'), open = !c.classList.contains('is-open'); c.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open)); return; }
    var nav = b.getAttribute('data-nav'); if (nav === 'next') return next(); if (nav === 'back') return back();
    if (b.hasAttribute('data-go')) return go(b.getAttribute('data-go'));
    var act = b.getAttribute('data-act');
    if (act === 'print') return window.print();
    if (act === 'restart') { s = A.blank(); chosenAreas = []; return go('start'); }
    if (act === 'copy') return copy();
    if (act === 'listen') return listen();
    if (act === 'remind') return remind();
    if (b.hasAttribute('data-suggest-all')) { A.suggestions(s).forEach(function (x) { if (chosenAreas.indexOf(x.area) < 0) chosenAreas.push(x.area); }); return render(false); }
    if (b.hasAttribute('data-area')) { var ak = b.getAttribute('data-area'), ai = chosenAreas.indexOf(ak); if (ai >= 0) { chosenAreas.splice(ai, 1); s.needs = s.needs.filter(function (n) { return A.items[n.item].area !== ak; }); } else chosenAreas.push(ak); return render(false); }
    if (b.hasAttribute('data-item')) { toggleItem(b.getAttribute('data-item')); return render(false); }
    if (b.hasAttribute('data-need-mode') || b.hasAttribute('data-need-dur')) {
      var mv = (b.getAttribute('data-need-mode') || b.getAttribute('data-need-dur')).split('|'), key = b.hasAttribute('data-need-mode') ? 'mode' : 'duration';
      s.needs.forEach(function (n) { if (n.item === mv[0]) n[key] = mv[1]; }); lastAdded = 'need-' + mv[0]; return render(false);
    }
    if (b.hasAttribute('data-f')) { setField(b.getAttribute('data-f'), b.getAttribute('data-v')); render(false); }
  });
  root.addEventListener('change', function (e) { var f = e.target.getAttribute('data-f'); if (f === 'mukim') { s.mukim = e.target.value; lastAdded = 'place'; render(false); } });
  root.addEventListener('input', function (e) { if (e.target.getAttribute('data-f') === 'note') s.note = e.target.value.slice(0, 500); });

  function listen() {
    var sp = window.speechSynthesis;
    if (sp.speaking) { sp.cancel(); return; }
    var u = new SpeechSynthesisUtterance(planText(A.plan(s)).replace(/https?:\S+/g, '').replace(/·/g, ','));
    u.lang = K.lang === 'bm' ? 'ms-MY' : 'en-GB'; u.rate = .9;
    var v = sp.getVoices().filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(K.lang === 'bm' ? 'ms' : 'en') === 0; })[0]; if (v) u.voice = v;
    sp.speak(u);
  }
  function remind() {
    var p = A.plan(s), blob = new Blob([icsFor(p)], { type: 'text/calendar' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'follow-up-' + p.caseId + '.ics'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    var out = $('#tcCopied'); if (out) out.textContent = T('A reminder was saved. Open it to add it to the calendar.', 'Peringatan telah disimpan. Buka untuk menambahkannya ke kalendar.');
  }
  function copy() {
    var text = planText(A.plan(s)), out = $('#tcCopied');
    function done(ok) { if (out) out.textContent = ok ? T('Copied. You can paste it in a message.', 'Disalin. Anda boleh tampal dalam mesej.') : T('Could not copy. Use Print instead.', 'Tidak dapat menyalin. Gunakan Cetak.'); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else done(false);
  }

  /* ---------- play an example: the case fills in screen by screen ---------- */
  var ORDER = [['start', ['filler', 'relation']], ['about', ['age', 'gender']], ['place', ['district', 'mukim']], ['daily', ['level', 'difficulties', 'recentHospital']],
    ['home', ['living', 'carer', 'carerTime']], ['money', ['income', 'supports', 'pay']], ['areas', []], ['items', ['needs']], ['how', []], ['soon', ['urgency']], ['review', []], ['plan', []]];
  function play(ex) {
    var src = A.normalize(ex.s), step = 0, run = ++playing;
    s = A.blank(); chosenAreas = [];
    if (K.reduceMotion) { s = src; src.needs.forEach(function (n) { var a = A.items[n.item].area; if (chosenAreas.indexOf(a) < 0) chosenAreas.push(a); }); return go('plan'); }
    (function tick() {
      if (run !== playing) return;
      var o = ORDER[step]; if (!o) return;
      o[1].forEach(function (f) { s[f] = Array.isArray(src[f]) ? src[f].slice() : src[f]; lastAdded = f === 'needs' ? '' : ({ age: 'person', gender: 'person', district: 'place', mukim: 'place', living: 'home', carer: 'home', carerTime: 'home', income: 'money', supports: 'money', pay: 'money', relation: 'filler' }[f] || f); });
      if (o[0] === 'areas') src.needs.forEach(function (n) { var a = A.items[n.item].area; if (chosenAreas.indexOf(a) < 0) chosenAreas.push(a); });
      at = o[0]; render(o[0] === 'plan'); step++;
      if (step < ORDER.length) setTimeout(tick, o[0] === 'items' || o[0] === 'daily' ? 1500 : 1100);
    })();
  }
  /* any real tap stops a running example */
  root.addEventListener('pointerdown', function (e) { if (!e.target.closest('[data-example]')) playing++; }, true);

  K.onLang.push(function () { render(false); });
};
})(window.KSE);
