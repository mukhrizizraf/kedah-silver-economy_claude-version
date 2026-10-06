/* ============================================================================
   Kedah Silver Economy: the giving side of Try a case (rules 2026.10.07)
   The i-CareElder framework treats an older person as someone who can also
   give: sedekah, cash waqf, sponsoring another older person, giving things,
   volunteering, sharing skills and supporting others of the same age.
   This file holds the rules only (no DOM). Money always goes through the
   official page of LZNK, MAIK or the masjid itself; the plan never takes
   money and never shows an account number. Volunteers are pointed to the JKM
   volunteer scheme, the PAWE centres and NGOs in Kedah, as the lead
   researcher asked. The help rules in kse-assist.js are left untouched.
   ============================================================================ */
(function (K) {
'use strict';
var VERSION = '2026.10.07';
function t(en, bm) { return { en: en, bm: bm }; }
var G = {};
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

/* what a volunteer can do: away = has to leave home; drive = needs to drive */
G.skills = {
  visit: { l: t('Visiting and keeping company', 'Menziarah dan menemani'), away: true },
  phone: { l: t('Phone calls to check on others', 'Telefon bertanya khabar') },
  drive: { l: t('Driving or going along to the clinic', 'Memandu atau menemani ke klinik'), away: true, drive: true },
  cook: { l: t('Cooking or packing food', 'Memasak atau membungkus makanan'), away: true },
  quran: { l: t('Teaching Quran or giving religious talks', 'Mengajar mengaji atau tazkirah') },
  errands: { l: t('Shopping and errands', 'Membeli barang dan urusan'), away: true },
  fix: { l: t('Small repairs or cleaning', 'Pembaikan kecil atau mengemas'), away: true },
  digital: { l: t('Teaching phone use', 'Mengajar guna telefon') },
  activities: { l: t('Leading activities, like exercise or crafts', 'Memimpin aktiviti, seperti senaman atau kraf'), away: true }
};
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

/* ---------- Time and things: real places to volunteer in Kedah ----------
   Checked 6 to 7 October 2026. The JKM volunteer scheme and the PAWE centres come
   from JKM's own pages and register (status Verified: they exist and are run for
   or with older people). The NGOs are from their own public pages (status
   Candidate: whether each takes older volunteers is for Phase 1 to confirm).
   No phone numbers here: each card links to the official page or to Google Maps. */
var JKM_VOL = 'https://www.jkm.gov.my/main/article/sukarelawan-komuniti';
var PAWE_REG = 'https://wargaemas.jkm.gov.my/komuniti/pawe/index';
G.jkm = {
  l: t('Register as a JKM volunteer (Sukarelawan JKM)', 'Daftar sebagai Sukarelawan JKM'), by: t('Jabatan Kebajikan Masyarakat, every district', 'Jabatan Kebajikan Masyarakat, setiap daerah'),
  online: 'https://komuniti.jkm.gov.my/', source: JKM_VOL,
  steps: [
    t('Register once online on JKM\'s e-Komuniti portal, or at the district welfare office.', 'Daftar sekali dalam talian di portal e-Komuniti JKM, atau di Pejabat Kebajikan Masyarakat Daerah.'),
    t('For citizens aged 18 or older. There is no upper age limit, and it is free.', 'Untuk warganegara berumur 18 tahun ke atas. Tiada had umur maksimum, dan percuma.'),
    t('JKM volunteers help with home visits and home help, religious and cultural programmes, and floods.', 'Sukarelawan JKM membantu lawatan dan bantuan di rumah, program keagamaan dan kebudayaan, serta bencana banjir.')
  ]
};
var PAWE_SKILLS = ['activities', 'quran', 'digital', 'phone', 'visit', 'cook'];
function pawe(name, district, members) {
  return { name: name, district: district, status: 'Verified', kinds: ['peer', 'mentor', 'volunteer'], skills: PAWE_SKILLS, members: members, pawe: true,
    what: t('A JKM activity centre run for and with older people.', 'Pusat aktiviti JKM untuk dan bersama warga emas.'), link: PAWE_REG, linkL: t('JKM list of PAWE centres', 'Senarai PAWE JKM'), q: name + ', ' + district + ', Kedah', source: PAWE_REG };
}
G.places = [
  pawe('PAWE Kota Setar', 'Kota Setar', 177), pawe('PAWE Alor Setar', 'Kota Setar', 176), pawe('PAWE Masjid Aman', 'Kota Setar', 255), pawe('PAWE LKPI', 'Kota Setar', 117),
  pawe('PAWE Kubang Pasu', 'Kubang Pasu', 391), pawe('PAWE Padang Terap', 'Padang Terap', 379), pawe('PAWE Kg Nawa Pokok Sena', 'Pokok Sena', 72),
  pawe('PAWE Sungai Petani', 'Sungai Petani', 391), pawe('PAWE Permatang Katong', 'Sungai Petani', 212), pawe('PAWE Kulim', 'Kulim', 514),
  pawe('PAWE Bandar Baharu', 'Bandar Baharu', 287), pawe('PAWE Baling', 'Baling', 234), pawe('PAWE Sik', 'Sik', 256), pawe('PAWE Yan', 'Yan', 160),
  pawe('PAWE Pendang', 'Pendang', 257), pawe('PAWE Langkawi', 'Langkawi', 295),
  { name: 'Food Bank Malaysia', district: 'Kota Setar', status: 'Candidate', kinds: ['volunteer', 'goods'], skills: ['cook', 'errands', 'drive'],
    what: t('Packs and gives out food to families in need. HQ in Taman Aman, Alor Setar; open 9am to 5pm, not on Thursday, Sunday or public holidays.', 'Membungkus dan mengagihkan makanan kepada keluarga yang memerlukan. Ibu pejabat di Taman Aman, Alor Setar; buka 9 pagi hingga 5 petang, kecuali Khamis, Ahad dan cuti umum.'),
    link: 'https://foodbankmalaysia.com/contact-us/', linkL: t('Official page', 'Laman rasmi'), q: 'Food Bank Malaysia, Jalan Sultanah, Taman Aman, Alor Setar', source: 'https://foodbankmalaysia.com/contact-us/' },
  { name: 'PEWARIS Kubang Pasu', district: 'Kubang Pasu', status: 'Candidate', kinds: ['volunteer', 'mentor', 'goods'], skills: ['quran', 'visit', 'cook', 'activities'],
    what: t('A welfare body for older people, building a home for older single mothers, with classes and a food bank.', 'Pertubuhan kebajikan warga emas yang membina asrama untuk ibu tunggal warga emas, dengan kelas ilmu dan bank makanan.'),
    link: 'https://www.facebook.com/pewarislangkasukakubangpasu/', linkL: t('Facebook page', 'Laman Facebook'), q: 'Pewaris Langkasuka Kubang Pasu', source: 'https://sumbangan.com/penganjur/pewaris' },
  { name: 'IKRAM Kedah', districts: ['Kota Setar', 'Sungai Petani', 'Kulim'], status: 'Candidate', kinds: ['volunteer'], skills: ['cook', 'errands', 'fix', 'visit', 'drive'],
    what: t('Community and flood-relief volunteers, with offices in Alor Setar, Sungai Petani and Kulim.', 'Sukarelawan komuniti dan bantuan banjir, dengan pejabat di Alor Setar, Sungai Petani dan Kulim.'),
    link: 'https://ikram.org.my/kedah/', linkL: t('Official page', 'Laman rasmi'), q: 'Pertubuhan IKRAM Malaysia Kedah', source: 'https://ikram.org.my/kedah/' },
  { name: 'Bulan Sabit Merah Malaysia, Kedah', district: 'state', status: 'Candidate', kinds: ['volunteer'], skills: ['drive', 'visit', 'cook', 'errands'],
    what: t('First aid, ambulance and flood help, with branches across Kedah.', 'Pertolongan cemas, ambulans dan bantuan banjir, dengan cawangan di seluruh Kedah.'),
    link: 'https://www.redcrescent.org.my/', linkL: t('Official page', 'Laman rasmi'), q: 'Bulan Sabit Merah Malaysia Kedah', source: 'https://www.redcrescent.org.my/' },
  { name: 'Persatuan Hospis Kedah', district: 'state', status: 'Candidate', kinds: ['volunteer'], skills: ['visit', 'phone'],
    what: t('Home care for people who are very ill, run from Alor Setar with teams in the districts.', 'Jagaan di rumah untuk pesakit tenat, dari Alor Setar dengan pasukan di daerah.'),
    link: 'https://aphn.org/services/persatuan-hospis-kedah-hospice-society-kedah/', linkL: t('Listing page', 'Laman senarai'), q: 'Persatuan Hospis Kedah Alor Setar', source: 'https://aphn.org/services/persatuan-hospis-kedah-hospice-society-kedah/' },
  { name: 'WANIDA Kedah', district: 'state', status: 'Candidate', partner: true, kinds: ['volunteer', 'goods'], skills: ['visit', 'cook', 'phone', 'activities'],
    what: t('Welfare programmes and volunteer groups across Kedah.', 'Program kebajikan dan kumpulan sukarelawan di seluruh Kedah.'), q: 'WANIDA Kedah' },
  { name: 'PERKIM Kedah', district: 'state', status: 'Candidate', partner: true, kinds: ['volunteer', 'mentor'], skills: ['quran', 'visit'],
    what: t('Faith-based welfare and support for new Muslims.', 'Kebajikan berasaskan agama dan sokongan untuk saudara baru.'), q: 'PERKIM Kedah Alor Setar' },
  { name: 'Persatuan Warga Emas Alor Setar', district: 'Kota Setar', status: 'Candidate', kinds: ['peer', 'mentor'], skills: ['activities', 'visit'],
    what: t('An association run by older people, a member of the national council of senior citizens (NACSCOM).', 'Persatuan yang dikendalikan oleh warga emas, ahli majlis kebangsaan warga emas (NACSCOM).'), q: 'Persatuan Warga Emas Alor Setar' },
  { name: 'Senior Citizens Association Sungai Petani', district: 'Sungai Petani', status: 'Candidate', kinds: ['peer', 'mentor'], skills: ['activities', 'visit'],
    what: t('An association run by older people, a member of NACSCOM.', 'Persatuan yang dikendalikan oleh warga emas, ahli NACSCOM.'), q: 'Senior Citizens Association Sungai Petani' }
];
function placeIn(pl, district) { return pl.districts ? pl.districts.indexOf(district) >= 0 : pl.district === district; }
function matchPlace(g, district, pl) {
  var fits = [], reasons = [], cautions = [], pts = 40;
  if (pl.kinds.indexOf('volunteer') >= 0) g.skills.forEach(function (sk) { if (pl.skills.indexOf(sk) >= 0) fits.push(sk); });
  ['mentor', 'peer', 'goods'].forEach(function (k) { if (g.types.indexOf(k) >= 0 && pl.kinds.indexOf(k) >= 0) fits.push(k); });
  if (!fits.length) return null;
  pts += Math.min(24, fits.length * 8); reasons.push(fits.length === 1 && fits[0] === 'goods' ? 'takesThings' : 'needsYou');
  if (pl.pawe && (fits.indexOf('peer') >= 0 || fits.indexOf('mentor') >= 0)) { pts += 8; reasons.push('seniorCentre'); }
  if (placeIn(pl, district)) { pts += 25; reasons.push('sameDistrict'); }
  else if (pl.district === 'state') { pts += 10; reasons.push('statewide'); }
  else if (g.travel === 'home' && fits.every(function (f) { return G.skills[f] && !G.skills[f].away; })) { pts += 2; reasons.push('fromHome'); }
  else { pts -= 15; cautions.push('otherDistrict'); }
  if (pl.status === 'Verified') { pts += 8; reasons.push('official'); }
  if (pl.partner) { pts += 6; reasons.push('partner'); }
  return { place: pl, fits: fits, pts: Math.max(5, Math.min(99, pts)), reasons: reasons, cautions: cautions };
}
function placesFor(g, district) {
  var out = [];
  G.places.forEach(function (pl) { var m = matchPlace(g, district, pl); if (m) out.push(m); });
  out.sort(function (a, b) { return b.pts - a.pts || a.place.name.localeCompare(b.place.name); });
  /* places in another district only when nothing nearer fits */
  var near = out.filter(function (m) { return !m.cautions.length; }), list = near.length ? near : out, pawes = 0;
  /* at most two PAWE centres, so other groups get a place too */
  return list.filter(function (m) { return !m.place.pawe || ++pawes <= 2; }).slice(0, 4);
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
  var time = any(g.types, G.timeTypes);
  var places = time || g.types.indexOf('goods') >= 0 ? placesFor(g, district) : [];
  return { version: VERSION, caseId: G.caseId(g, p), input: g, place: p, routes: money, jkm: time ? G.jkm : null, places: places, notes: skillNotes(g), flags: money.length ? ['official'] : [] };
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
