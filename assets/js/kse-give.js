/* ============================================================================
   Kedah Silver Economy: the giving side of Try a case (rules 2026.10.06)
   The i-CareElder framework treats an older person as someone who can also
   give: sedekah, cash waqf, sponsoring another older person, giving things,
   volunteering, sharing skills and supporting others of the same age.
   This file holds the rules only (no DOM). Money always goes through the
   official page of LZNK, MAIK or the masjid itself; the plan never takes
   money and never shows an account number. Volunteers are pointed to the
   organisations on our list, as the lead researcher asked.
   It reads K.assist (kse-assist.js) for the sample abilities of each
   organisation, and leaves those rules untouched.
   ============================================================================ */
(function (K) {
'use strict';
var VERSION = '2026.10.06';
function t(en, bm) { return { en: en, bm: bm }; }
var G = {}, A = K.assist;
G.version = VERSION;

/* ---------- The first question of Try a case: get help, or give ---------- */
G.paths = {
  get: { l: t('Get help', 'Dapatkan bantuan'), d: t('Care, aid, equipment or company', 'Penjagaan, bantuan, peralatan atau teman') },
  give: { l: t('Give or volunteer', 'Menyumbang atau menjadi sukarelawan'), d: t('Sedekah, waqf, sponsor an older person or give your time', 'Sedekah, wakaf, tanggung warga emas atau beri masa anda') }
};

/* ---------- Ways to give: money and things, or time ---------- */
G.types = {
  sedekah: { l: t('Sedekah or a donation', 'Sedekah atau derma'), d: t('Money for people in need or a good cause', 'Wang untuk orang yang memerlukan atau tujuan yang baik'), i: 'coins', money: true },
  wakaf: { l: t('Cash waqf', 'Wakaf tunai'), d: t('A lasting gift, held by MAIK', 'Pemberian yang kekal, dipegang oleh MAIK'), i: 'office', money: true },
  sponsor: { l: t('Sponsor an older person', 'Tanggung warga emas lain'), d: t('Help one older person near you, often every month', 'Bantu seorang warga emas berdekatan, selalunya setiap bulan'), i: 'heart', money: true },
  goods: { l: t('Give things', 'Derma barang'), d: t('A wheelchair, walker or food you can spare', 'Kerusi roda, rangka berjalan atau makanan yang boleh diberi'), i: 'wheelchair', goods: true },
  volunteer: { l: t('Volunteer', 'Jadi sukarelawan'), d: t('Give some of your time to help others', 'Beri sedikit masa anda untuk membantu orang lain'), i: 'helper', time: true },
  mentor: { l: t('Share my skills', 'Kongsi ilmu dan kemahiran'), d: t('Teach or guide others from your life and work', 'Ajar atau bimbing orang lain daripada pengalaman hidup dan kerja'), i: 'memory', time: true },
  peer: { l: t('Support others my age', 'Sokong rakan sebaya'), d: t('Join or lead a group at a senior centre', 'Sertai atau pimpin kumpulan di pusat warga emas'), i: 'people', time: true }
};
G.moneyTypes = ['sedekah', 'wakaf', 'sponsor'];
G.timeTypes = ['volunteer', 'mentor', 'peer'];

/* where a sedekah should go */
G.causes = {
  masjid: t('My masjid', 'Masjid kariah saya'),
  elderly: t('Older people near me', 'Warga emas berdekatan'),
  poor: t('Poor and needy families', 'Fakir miskin dan asnaf'),
  health: t('Patients, such as dialysis', 'Pesakit, seperti dialisis'),
  education: t('Quran and education', 'Al-Quran dan pendidikan'),
  any: t('Where it is most needed', 'Di mana paling diperlukan')
};
G.often = {
  once: t('One time', 'Sekali'), monthly: t('Every month', 'Setiap bulan'),
  friday: t('Every Friday', 'Setiap Jumaat'), ramadan: t('In Ramadan', 'Pada bulan Ramadan'), unsure: t('Not sure yet', 'Belum pasti')
};
G.payWays = {
  online: t('Online, by myself', 'Dalam talian, sendiri'),
  helper: t('Online, with help from family', 'Dalam talian, dibantu keluarga'),
  cash: t('Cash, in person', 'Tunai, secara bersemuka')
};

/* what a volunteer can do: it = the items on the help side that this skill serves;
   away = has to leave home; drive = needs to drive */
G.skills = {
  visit: { l: t('Visiting and keeping company', 'Menziarah dan menemani'), it: ['visits'], away: true },
  phone: { l: t('Phone calls to check on others', 'Telefon bertanya khabar'), it: ['checkins'] },
  drive: { l: t('Driving or going along to the clinic', 'Memandu atau menemani ke klinik'), it: ['escort', 'apptTransport', 'dialysis', 'rehab'], away: true, drive: true },
  cook: { l: t('Cooking or packing food', 'Memasak atau membungkus makanan'), it: ['meals', 'mealDelivery', 'foodBasket'], away: true },
  quran: { l: t('Teaching Quran or giving religious talks', 'Mengajar mengaji atau tazkirah'), it: ['spiritual'] },
  errands: { l: t('Shopping and errands', 'Membeli barang dan urusan'), it: ['groceries', 'pharmacy'], away: true },
  fix: { l: t('Small repairs or cleaning', 'Pembaikan kecil atau mengemas'), it: ['repairs', 'cleaning'], away: true },
  digital: { l: t('Teaching phone use', 'Mengajar guna telefon'), it: ['digital'] },
  activities: { l: t('Leading activities, like exercise or crafts', 'Memimpin aktiviti, seperti senaman atau kraf'), it: ['activities', 'dayCare'], away: true }
};
/* sharing skills and peer support look for the same help as these */
var TYPE_ITEMS = { mentor: ['activities', 'digital', 'spiritual'], peer: ['activities', 'visits', 'checkins'] };
G.hours = { month: t('A few hours a month', 'Beberapa jam sebulan'), week: t('A few hours a week', 'Beberapa jam seminggu'), more: t('A day a week or more', 'Sehari seminggu atau lebih') };
G.travels = {
  drive: t('I can drive or ride', 'Saya boleh memandu atau menunggang'),
  lift: t('Someone can take me', 'Ada orang boleh menghantar saya'),
  near: t('Near home only', 'Dekat rumah sahaja'),
  home: t('From home only', 'Dari rumah sahaja')
};

/* ---------- Official routes for money ----------
   From the agencies' public pages, checked 6 October 2026. Each route links
   to the agency's own page; the agency's page is where the money is paid. */
G.routes = [
  { k: 'masjid', agency: 'Masjid', l: t('Give at your masjid', 'Beri di masjid kariah anda'), by: t('The Imam and the mosque committee (Jawatankuasa Kariah)', 'Imam dan Jawatankuasa Kariah'),
    types: ['sedekah', 'sponsor', 'goods'], causes: ['masjid', 'elderly', 'poor', 'any'], cash: true, masjid: true,
    steps: [
      t('Find the masjid in your kariah. The button below opens Google Maps near you.', 'Cari masjid di kariah anda. Butang di bawah membuka Google Maps berdekatan anda.'),
      t('Give into the tabung, or scan the masjid\'s own DuitNow QR. Check the account name is the masjid\'s.', 'Masukkan ke dalam tabung, atau imbas DuitNow QR masjid itu sendiri. Pastikan nama akaun ialah nama masjid.'),
      t('To sponsor an older person or give things, speak to the Imam or a committee member first. They know who in the kariah needs help.', 'Untuk menanggung warga emas atau menderma barang, berjumpa Imam atau ahli jawatankuasa dahulu. Mereka tahu siapa di kariah yang memerlukan.')
    ] },
  { k: 'lznk', agency: 'LZNK', l: t('Sadaqah4Ummah', 'Sadaqah4Ummah'), by: t('Lembaga Zakat Negeri Kedah', 'Lembaga Zakat Negeri Kedah'),
    types: ['sedekah'], causes: ['poor', 'health', 'education', 'any'], cash: true,
    online: 'https://sadaqah4ummah.com.my/', office: 'Lembaga Zakat Negeri Kedah', counter: t('An LZNK counter', 'Kaunter LZNK'), source: 'https://www.lznk.com.my/',
    steps: [
      t('Choose a cause on the page: community development, education, or health such as free dialysis.', 'Pilih tujuan di laman itu: pembangunan ummah, pendidikan, atau perubatan seperti dialisis percuma.'),
      t('Pay by online banking (FPX) or QR. For every month, choose the monthly direct debit.', 'Bayar melalui perbankan dalam talian (FPX) atau QR. Untuk setiap bulan, pilih potongan terus bulanan.'),
      t('Or give at an LZNK counter, Monday to Friday, 8am to 5pm.', 'Atau beri di kaunter LZNK, Isnin hingga Jumaat, 8 pagi hingga 5 petang.')
    ] },
  { k: 'maikInfak', agency: 'MAIK', l: t('Infaq to MAIK', 'Infak kepada MAIK'), by: t('Majlis Agama Islam Negeri Kedah', 'Majlis Agama Islam Negeri Kedah'),
    types: ['sedekah'], causes: ['education', 'any'], cash: true,
    online: 'https://maik.kedah.gov.my/saluran-pembayaran-sumbangan/', office: 'Majlis Agama Islam Negeri Kedah, Bangunan Wan Mat Saman, Alor Setar', counter: t('The MAIK office in Alor Setar', 'Pejabat MAIK di Alor Setar'), source: 'https://maik.kedah.gov.my/saluran-pembayaran-sumbangan/',
    steps: [
      t('Open MAIK\'s page of official payment channels.', 'Buka laman saluran pembayaran rasmi MAIK.'),
      t('Choose "Infak Sumbangan" for general giving, or the Quran centre (Pusat Pemuliaan Al-Quran).', 'Pilih "Infak Sumbangan" untuk sumbangan am, atau Pusat Pemuliaan Al-Quran.'),
      t('Pay online on that page, or at the MAIK office.', 'Bayar dalam talian di laman itu, atau di pejabat MAIK.')
    ] },
  { k: 'maikWakaf', agency: 'MAIK', l: t('Cash waqf (Wakaf Tunai)', 'Wakaf Tunai'), by: t('Majlis Agama Islam Negeri Kedah, the waqf trustee in Kedah', 'Majlis Agama Islam Negeri Kedah, pemegang amanah wakaf di Kedah'),
    types: ['wakaf'], cash: true,
    online: 'https://infaqpay.my/plus/maik-wakaftunai-sumbangan', projects: 'https://maik.kedah.gov.my/utama/wakaf/wakaf-tunai/',
    office: 'Majlis Agama Islam Negeri Kedah, Bangunan Wan Mat Saman, Alor Setar', counter: t('The MAIK office in Alor Setar', 'Pejabat MAIK di Alor Setar'), source: 'https://maik.kedah.gov.my/utama/wakaf/wakaf-tunai/',
    steps: [
      t('Choose a project on MAIK\'s waqf page, such as a masjid, a religious school or the Projek Hassan paddy farm. Each has its own DuitNow QR.', 'Pilih projek di laman wakaf MAIK, seperti masjid, sekolah agama atau Projek Hassan (sawah padi). Setiap satu ada DuitNow QR sendiri.'),
      t('Or give to the general waqf fund online through MAIK\'s form, from RM1.', 'Atau beri kepada dana wakaf am dalam talian melalui borang MAIK, serendah RM1.'),
      t('If you transfer by bank, the account name must be "Kumpulan Wang Majlis Agama Islam Kedah", as listed on MAIK\'s page.', 'Jika pindahan bank, nama akaun mesti "Kumpulan Wang Majlis Agama Islam Kedah", seperti di laman MAIK.')
    ] }
];

/* ---------- Case shape ---------- */
function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
function pick(v, obj, d) { return has(obj, v) ? v : d; }
function known(list, obj) { var out = []; (Array.isArray(list) ? list : []).forEach(function (k) { if (has(obj, k) && out.indexOf(k) < 0) out.push(k); }); return out; }
function any(list, keys) { return list.some(function (k) { return keys.indexOf(k) >= 0; }); }

G.blank = function () { return { types: [], causes: [], often: '', pay: '', skills: [], hours: '', travel: '' }; };
G.normalize = function (input) {
  var g = input || {}, types = known(g.types, G.types);
  return {
    types: types,
    causes: types.indexOf('sedekah') >= 0 ? known(g.causes, G.causes) : [],
    often: pick(g.often, G.often, ''), pay: pick(g.pay, G.payWays, ''),
    skills: types.indexOf('volunteer') >= 0 ? known(g.skills, G.skills) : [],
    hours: pick(g.hours, G.hours, ''), travel: pick(g.travel, G.travels, '')
  };
};
G.hasMoney = function (g) { return any(G.normalize(g).types, G.moneyTypes); };
G.hasTime = function (g) { return any(G.normalize(g).types, G.timeTypes); };
G.hasGoods = function (g) { return G.normalize(g).types.indexOf('goods') >= 0; };

/* ---------- Money: which official routes fit ---------- */
function routesFor(g) {
  var out = G.routes.filter(function (r) {
    if (!any(g.types, r.types)) return false;
    /* a sedekah-only route shows when one of its causes is chosen, or no cause yet */
    var onlySedekah = r.types.length === 1 && r.types[0] === 'sedekah';
    if (onlySedekah && g.causes.length && !any(g.causes, r.causes)) return false;
    return true;
  });
  /* in person first for someone who gives cash; the masjid first for causes close to home */
  var near = g.pay === 'cash' || any(g.causes, ['masjid', 'elderly']) || g.types.indexOf('sponsor') >= 0;
  out.sort(function (a, b) { return (near ? (b.masjid ? 1 : 0) - (a.masjid ? 1 : 0) : (a.masjid ? 1 : 0) - (b.masjid ? 1 : 0)); });
  return out.map(function (r) { return { route: r, forTypes: g.types.filter(function (k) { return r.types.indexOf(k) >= 0; }) }; });
}

/* ---------- Time and things: which organisations on our list fit ---------- */
function capFor(rec) {
  for (var i = 0; i < A.providers.length; i++) if (rec.name.indexOf(A.providers[i].p) === 0) return A.providers[i];
  return null;
}
/* money agencies and paid businesses are not where volunteers go */
function takesPeople(rec, cap) { return cap && !cap.elig && cap.cost !== 'paid'; }
var GOODS_ITEMS = ['wheelchair', 'walker', 'stick', 'hospitalBed', 'showerChair', 'diapers', 'underpads', 'foodBasket', 'emergencyFood', 'essentials'];
var SPONSOR_ITEMS = ['monthlyAid', 'foodBasket', 'visits', 'emergencyCash'];

function wantedFor(g) {
  var want = {};
  function add(items, why) { items.forEach(function (k) { (want[k] = want[k] || []).indexOf(why) < 0 && want[k].push(why); }); }
  g.skills.forEach(function (sk) { add(G.skills[sk].it, sk); });
  if (g.types.indexOf('mentor') >= 0) add(TYPE_ITEMS.mentor, 'mentor');
  if (g.types.indexOf('peer') >= 0) add(TYPE_ITEMS.peer, 'peer');
  return want;
}
function matchOrg(g, district, rec, idx, cap, want, kind) {
  var reasons = [], cautions = [], pts = 40, fits = [];
  if (kind === 'time') {
    Object.keys(want).forEach(function (item) { if (cap.it.indexOf(item) >= 0) want[item].forEach(function (w) { if (fits.indexOf(w) < 0) fits.push(w); }); });
    if (!fits.length) return null;
    pts += Math.min(30, fits.length * 12); reasons.push('needsYou');
    if (rec.type === 'Volunteer' || rec.type === 'NGO') { pts += 5; reasons.push('runsVolunteers'); }
    if (/^PAWE/.test(rec.name) && (fits.indexOf('peer') >= 0 || fits.indexOf('mentor') >= 0)) { pts += 10; reasons.push('seniorCentre'); }
  } else {
    var list = kind === 'goods' ? GOODS_ITEMS : SPONSOR_ITEMS;
    var hits = list.filter(function (k) { return cap.it.indexOf(k) >= 0; });
    if (!hits.length || (kind === 'goods' && cap.m.indexOf('donate') < 0 && cap.m.indexOf('borrow') < 0)) return null;
    fits = [kind]; pts += Math.min(24, hits.length * 6); reasons.push(kind === 'goods' ? 'takesThings' : 'helpsElders');
  }
  var remote = kind === 'time' && g.travel === 'home';
  if (rec.district === district) { pts += 20; reasons.push('sameDistrict'); }
  else if (cap.scope === 'state') { pts += 10; reasons.push('statewide'); }
  else if (remote && fits.every(function (f) { return G.skills[f] ? !G.skills[f].away : false; })) { pts += 6; reasons.push('fromHome'); }
  else { pts -= 6; cautions.push('otherDistrict'); }
  if (rec.status === 'Verified') { pts += 10; reasons.push('confirmed'); } else if (rec.status === 'Candidate') pts += 4;
  return { index: idx, record: rec, kind: kind, fits: fits, pts: Math.max(5, Math.min(99, pts)), reasons: reasons, cautions: cautions };
}
function orgsFor(g, district, kind) {
  var want = wantedFor(g), out = [];
  K.records.forEach(function (rec, idx) {
    var cap = capFor(rec); if (!takesPeople(rec, cap)) return;
    var m = matchOrg(g, district, rec, idx, cap, want, kind); if (m) out.push(m);
  });
  out.sort(function (a, b) { return b.pts - a.pts || a.record.name.localeCompare(b.record.name); });
  return out.slice(0, 3);
}

/* things a volunteer should hear before they start */
function skillNotes(g) {
  var notes = [];
  g.skills.forEach(function (sk) {
    var s = G.skills[sk];
    if (s.drive && g.travel && g.travel !== 'drive') notes.push({ skill: sk, k: 'needsDriver' });
    else if (s.away && g.travel === 'home') notes.push({ skill: sk, k: 'needsOut' });
  });
  return notes;
}

function hash(text) {
  var h = 2166136261;
  for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ('00000000' + (h >>> 0).toString(16).toUpperCase()).slice(-8);
}
/* a giving case ID: KSG-, the rules date, and a hash of the answers */
G.caseId = function (g, place) {
  var n = G.normalize(g), p = place || {};
  return 'KSG-' + VERSION.replace(/\./g, '') + '-' + hash(JSON.stringify([p.filler || '', p.district || '', p.mukim || '', n.types.slice().sort(), n.causes.slice().sort(), n.often, n.pay, n.skills.slice().sort(), n.hours, n.travel]));
};

/* ---------- The giving plan ---------- */
G.plan = function (input, place) {
  var g = G.normalize(input), p = place || {}, district = p.district || '';
  var money = any(g.types, G.moneyTypes) || g.types.indexOf('goods') >= 0 ? routesFor(g) : [];
  var orgs = [];
  if (any(g.types, G.timeTypes)) orgsFor(g, district, 'time').forEach(function (m) { orgs.push(m); });
  if (g.types.indexOf('goods') >= 0) orgsFor(g, district, 'goods').forEach(function (m) { if (!orgs.some(function (o) { return o.index === m.index; })) orgs.push(m); });
  if (g.types.indexOf('sponsor') >= 0) orgsFor(g, district, 'sponsor').forEach(function (m) { if (!orgs.some(function (o) { return o.index === m.index; })) orgs.push(m); });
  var flags = [];
  if (money.length) flags.push('official');
  if (any(g.types, G.timeTypes) && !orgs.some(function (o) { return o.kind === 'time' && o.record.district === district; })) flags.push('noneNear');
  /* the coordination desk is the fallback for a volunteer with no group nearby */
  var desk = null;
  K.records.forEach(function (rec, idx) { if (!desk && /Coordination Desk/.test(rec.name)) desk = { index: idx, record: rec }; });
  return { version: VERSION, caseId: G.caseId(g, p), input: g, place: p, routes: money, orgs: orgs, notes: skillNotes(g), flags: flags, desk: flags.indexOf('noneNear') >= 0 ? desk : null };
};

/* a worked example for the pitch: a retired teacher in Kubang Pasu */
G.example = {
  l: t('A retired teacher who wants to give back', 'Pesara guru yang mahu menyumbang'),
  d: t('67, Kubang Pasu: monthly sedekah, cash waqf, teaching Quran and phone calls', '67, Kubang Pasu: sedekah bulanan, wakaf tunai, mengajar mengaji dan telefon bertanya khabar'),
  place: { filler: 'self', district: 'Kubang Pasu', mukim: 'Jitra' },
  g: { types: ['sedekah', 'wakaf', 'volunteer', 'mentor'], causes: ['masjid', 'elderly'], often: 'monthly', pay: 'helper', skills: ['quran', 'phone', 'visit'], hours: 'week', travel: 'lift' }
};

K.give = G;
})(window.KSE);
