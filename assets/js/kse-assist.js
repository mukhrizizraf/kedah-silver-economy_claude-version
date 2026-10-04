/* ============================================================================
   Kedah Silver Economy: Try a case, rules version 2026.10.04
   The assistance model and the matching engine. No DOM work here, so the same
   state shape and rules can move to SwiftUI and Android Compose unchanged.

   One case = one person, their situation, and every need they have. The
   engine turns that into an Assistance Profile, then into one Assistance Plan:
   for each need, the possible providers ranked with plain reasons, the steps,
   and what must still be confirmed. Provider abilities are SAMPLE data until
   Phase 1 checks them; the plan never promises help or entitlement.
   ============================================================================ */
(function (K) {
'use strict';

var VERSION = '2026.10.04';
function t(en, bm) { return { en: en, bm: bm }; }

/* ---------- The person and their situation ---------- */
var A = {};
A.version = VERSION;
A.fillers = {
  self: t('Myself', 'Diri saya'),
  helper: t('I am helping someone', 'Saya membantu orang lain')
};
A.relations = {
  child: t('Son or daughter', 'Anak'), spouse: t('Husband or wife', 'Suami atau isteri'),
  family: t('Other family', 'Ahli keluarga lain'), neighbour: t('Neighbour or volunteer', 'Jiran atau sukarelawan'),
  officer: t('Officer or carer', 'Pegawai atau penjaga')
};
A.ages = ['60-64', '65-69', '70-74', '75-79', '80-84', '85+'];
A.ageLabel = { '85+': t('85 or older', '85 atau lebih') };
A.genders = { woman: t('Woman', 'Perempuan'), man: t('Man', 'Lelaki'), 'prefer-not': t('Prefer not to say', 'Tidak mahu nyatakan') };
A.levels = {
  independent: { l: t('Manages alone', 'Boleh urus sendiri'), d: t('Does most things without help', 'Buat kebanyakan perkara tanpa bantuan') },
  some: { l: t('Needs some help', 'Perlukan sedikit bantuan'), d: t('Help with a few things each week', 'Bantuan untuk beberapa perkara setiap minggu') },
  regular: { l: t('Needs help every day', 'Perlukan bantuan setiap hari'), d: t('Someone has to help daily', 'Perlu dibantu setiap hari') },
  bedbound: { l: t('Mostly in bed', 'Kebanyakan masa di katil'), d: t('Rarely leaves the bed or chair', 'Jarang turun dari katil atau kerusi') }
};
A.difficulties = {
  walking: { l: t('Walking', 'Berjalan'), i: 'walk' },
  standing: { l: t('Standing up', 'Berdiri'), i: 'stand' },
  transfer: { l: t('Getting in or out of bed', 'Naik atau turun katil'), i: 'transfer' },
  bathing: { l: t('Bathing', 'Mandi'), i: 'bath' },
  toilet: { l: t('Using the toilet', 'Ke tandas'), i: 'toilet' },
  dressing: { l: t('Getting dressed', 'Berpakaian'), i: 'shirt' },
  eating: { l: t('Eating or cooking', 'Makan atau memasak'), i: 'bowl' },
  medicine: { l: t('Taking medicine', 'Mengambil ubat'), i: 'pill' },
  hospital: { l: t('Getting to the clinic', 'Pergi ke klinik'), i: 'van' },
  housework: { l: t('Housework', 'Kerja rumah'), i: 'broom' },
  alone: { l: t('Being alone safely', 'Tinggal seorang dengan selamat'), i: 'alone' },
  memory: { l: t('Memory or confusion', 'Ingatan atau keliru'), i: 'memory' }
};
A.livings = { alone: t('Lives alone', 'Tinggal seorang'), spouse: t('With husband or wife', 'Bersama suami atau isteri'), family: t('With children or family', 'Bersama anak atau keluarga'), care: t('In a care home', 'Di rumah jagaan') };
A.carers = { none: t('No one', 'Tiada sesiapa'), spouse: t('Husband or wife', 'Suami atau isteri'), children: t('Children', 'Anak-anak'), relative: t('Other family', 'Ahli keluarga lain'), neighbour: t('Neighbour or friend', 'Jiran atau kawan'), paid: t('Paid carer', 'Penjaga berbayar') };
A.carerTimes = { daily: t('Every day', 'Setiap hari'), some: t('Some days', 'Beberapa hari'), rarely: t('Rarely', 'Jarang') };
A.incomes = {
  '0': t('No regular income', 'Tiada pendapatan tetap'), '800': t('Below RM1,000', 'Bawah RM1,000'),
  '1500': t('RM1,000 to RM1,999', 'RM1,000 hingga RM1,999'), '2500': t('RM2,000 to RM2,999', 'RM2,000 hingga RM2,999'),
  '4000': t('RM3,000 to RM4,999', 'RM3,000 hingga RM4,999'), '5000': t('RM5,000 or more', 'RM5,000 atau lebih'),
  unknown: t('Prefer not to say', 'Tidak mahu nyatakan')
};
A.supports = { pension: t('Pension', 'Pencen'), welfare: t('Welfare aid', 'Bantuan kebajikan'), zakat: t('Zakat or Baitulmal', 'Zakat atau Baitulmal'), family: t('Money from family', 'Wang daripada keluarga'), none: t('None of these', 'Tiada') };
A.pays = { none: t('Cannot pay', 'Tidak mampu bayar'), little: t('Can pay a little', 'Boleh bayar sedikit'), yes: t('Can pay', 'Boleh bayar'), unsure: t('Not sure', 'Tidak pasti') };

/* ---------- What help: ten areas, each with specific items ---------- */
/* kind sets which ways of getting it make sense and the default */
A.kinds = {
  equipment: { modes: ['borrow', 'rent', 'donate', 'buy', 'fund', 'unsure'], mode: 'borrow', dur: 'long' },
  consumable: { modes: ['monthly', 'donate', 'buy', 'fund', 'unsure'], mode: 'monthly', dur: 'ongoing' },
  service: { modes: ['service', 'refer', 'fund', 'unsure'], mode: 'service', dur: 'mid' },
  money: { modes: ['fund', 'refer', 'unsure'], mode: 'fund', dur: 'ongoing' },
  home: { modes: ['service', 'fund', 'refer', 'unsure'], mode: 'service', dur: 'once' }
};
A.modes = {
  borrow: t('Borrow', 'Pinjam'), rent: t('Rent', 'Sewa'), donate: t('Free or donated', 'Percuma atau sumbangan'),
  buy: t('Buy', 'Beli'), fund: t('Help to pay', 'Bantuan bayaran'), monthly: t('Monthly supply', 'Bekalan bulanan'),
  service: t('Someone to do it', 'Ada orang yang buat'), refer: t('A referral', 'Rujukan'), unsure: t('Not sure', 'Tidak pasti')
};
A.durations = { once: t('One time', 'Sekali sahaja'), short: t('Under a month', 'Kurang sebulan'), mid: t('1 to 3 months', '1 hingga 3 bulan'), long: t('3 to 12 months', '3 hingga 12 bulan'), ongoing: t('Long term', 'Jangka panjang'), unsure: t('Not sure', 'Tidak pasti') };
A.urgencies = {
  today: { l: t('Today', 'Hari ini'), d: t('It cannot wait', 'Tidak boleh tunggu'), rank: 4 },
  days: { l: t('In 1 to 3 days', 'Dalam 1 hingga 3 hari'), d: t('Very soon', 'Tidak lama lagi'), rank: 3 },
  weeks: { l: t('In 1 to 2 weeks', 'Dalam 1 hingga 2 minggu'), d: t('Soon', 'Tidak lama'), rank: 2 },
  months: { l: t('In 1 to 3 months', 'Dalam 1 hingga 3 bulan'), d: t('Can plan ahead', 'Boleh dirancang'), rank: 1 },
  plan: { l: t('Just planning', 'Sekadar merancang'), d: t('Looking for information', 'Mencari maklumat'), rank: 0 }
};
A.areas = {
  mobility: { l: t('Mobility equipment', 'Alat bantuan bergerak'), i: 'wheelchair', items: {
    wheelchair: [t('Wheelchair', 'Kerusi roda'), 'equipment'], ewheelchair: [t('Electric wheelchair', 'Kerusi roda elektrik'), 'equipment'],
    walker: [t('Walking frame', 'Rangka berjalan'), 'equipment'], stick: [t('Walking stick or quad cane', 'Tongkat'), 'equipment'],
    scooter: [t('Mobility scooter', 'Skuter mobiliti'), 'equipment'], brace: [t('Brace or support', 'Pendakap atau sokongan'), 'equipment'] } },
  medical: { l: t('Medical equipment', 'Peralatan perubatan'), i: 'oxygen', items: {
    oxyCylinder: [t('Oxygen tank', 'Tangki oksigen'), 'equipment'], oxyConcentrator: [t('Oxygen concentrator', 'Penumpu oksigen'), 'equipment'],
    nebuliser: [t('Nebuliser', 'Nebuliser'), 'equipment'], suction: [t('Suction machine', 'Mesin sedutan'), 'equipment'],
    monitor: [t('Blood pressure or sugar meter', 'Meter tekanan darah atau gula'), 'equipment'], oximeter: [t('Pulse oximeter', 'Oksimeter nadi'), 'equipment'] } },
  bedhome: { l: t('Bed and bathroom', 'Katil dan bilik air'), i: 'bed', items: {
    hospitalBed: [t('Hospital bed', 'Katil hospital'), 'equipment'], mattress: [t('Pressure-relief mattress', 'Tilam pelega tekanan'), 'equipment'],
    bedRails: [t('Bed rails', 'Palang katil'), 'equipment'], hoist: [t('Patient hoist', 'Pengangkat pesakit'), 'equipment'],
    showerChair: [t('Shower or commode chair', 'Kerusi mandi atau tandas'), 'equipment'], toiletSeat: [t('Raised toilet seat', 'Tempat duduk tandas tinggi'), 'equipment'] } },
  personal: { l: t('Personal care supplies', 'Bekalan penjagaan diri'), i: 'care', items: {
    diapers: [t('Adult diapers', 'Lampin dewasa'), 'consumable'], underpads: [t('Underpads', 'Alas tilam'), 'consumable'],
    catheter: [t('Catheter supplies', 'Bekalan kateter'), 'consumable'], wound: [t('Wound-care supplies', 'Bekalan rawatan luka'), 'consumable'],
    hygiene: [t('Hygiene supplies', 'Bekalan kebersihan'), 'consumable'], protector: [t('Waterproof mattress cover', 'Pelapik tilam kalis air'), 'consumable'] } },
  nursing: { l: t('Nursing and care', 'Rawatan dan penjagaan'), i: 'nurse', items: {
    homeNursing: [t('Home nursing', 'Rawatan di rumah'), 'service'], caregiver: [t('Personal carer', 'Penjaga peribadi'), 'service'],
    respite: [t('A break for the carer', 'Rehat untuk penjaga'), 'service'], postHospital: [t('Care after hospital', 'Jagaan selepas hospital'), 'service'],
    medsHelp: [t('Help with medicine', 'Bantuan mengambil ubat'), 'service'], nightCarer: [t('Night-time carer', 'Penjaga waktu malam'), 'service'] } },
  transport: { l: t('Transport to care', 'Pengangkutan ke rawatan'), i: 'van', items: {
    apptTransport: [t('Transport to appointments', 'Pengangkutan ke temu janji'), 'service'], dialysis: [t('Dialysis transport', 'Pengangkutan dialisis'), 'service'],
    wheelchairVan: [t('Wheelchair-friendly transport', 'Pengangkutan mesra kerusi roda'), 'service'], escort: [t('Someone to go along', 'Teman ke hospital'), 'service'],
    rehab: [t('Transport to therapy', 'Pengangkutan ke terapi'), 'service'], pharmacy: [t('Medicine pick-up', 'Ambil ubat'), 'service'] } },
  money: { l: t('Money and welfare', 'Wang dan kebajikan'), i: 'coins', items: {
    monthlyAid: [t('Monthly living help', 'Bantuan sara hidup bulanan'), 'money'], equipFund: [t('Help to pay for equipment', 'Bantuan membeli peralatan'), 'money'],
    medBills: [t('Medical bills', 'Bil perubatan'), 'money'], zakatAid: [t('Zakat or Baitulmal aid', 'Bantuan zakat atau Baitulmal'), 'money'],
    utilities: [t('Utility bills', 'Bil utiliti'), 'money'], emergencyCash: [t('Emergency money', 'Wang kecemasan'), 'money'] } },
  food: { l: t('Food and daily needs', 'Makanan dan keperluan harian'), i: 'bowl', items: {
    foodBasket: [t('Food basket', 'Bakul makanan'), 'consumable'], meals: [t('Cooked meals', 'Makanan siap dimasak'), 'service'],
    mealDelivery: [t('Meal delivery', 'Penghantaran makanan'), 'service'], groceries: [t('Groceries', 'Barang dapur'), 'service'],
    essentials: [t('Household essentials', 'Keperluan rumah'), 'consumable'], emergencyFood: [t('Emergency food', 'Makanan kecemasan'), 'consumable'] } },
  social: { l: t('Company and support', 'Teman dan sokongan'), i: 'people', items: {
    visits: [t('Home visits', 'Lawatan ke rumah'), 'service'], checkins: [t('Phone check-ins', 'Panggilan bertanya khabar'), 'service'],
    activities: [t('Activities and outings', 'Aktiviti dan lawatan'), 'service'], spiritual: [t('Religious support', 'Sokongan keagamaan'), 'service'],
    digital: [t('Help with the phone', 'Bantuan guna telefon'), 'service'], dementia: [t('Memory and dementia support', 'Sokongan ingatan dan demensia'), 'service'] } },
  housing: { l: t('Home safety and housing', 'Keselamatan rumah dan tempat tinggal'), i: 'house', items: {
    ramp: [t('Ramp or handrails', 'Tanjakan atau pemegang'), 'home'], bathroomMod: [t('Safer bathroom', 'Bilik air lebih selamat'), 'home'],
    repairs: [t('Small repairs', 'Pembaikan kecil'), 'home'], cleaning: [t('Cleaning help', 'Bantuan mengemas'), 'service'],
    dayCare: [t('Day care centre', 'Pusat jagaan harian'), 'service'], residential: [t('Place in a care home', 'Tempat di rumah jagaan'), 'service'] } }
};
/* a flat index: item key -> its area, label and kind */
A.items = {};
Object.keys(A.areas).forEach(function (ak) {
  var its = A.areas[ak].items;
  Object.keys(its).forEach(function (k) { A.items[k] = { k: k, area: ak, l: its[k][0], kind: its[k][1] }; });
});

/* ---------- Suggestions: from the situation to possible needs ---------- */
/* Not a diagnosis: these only offer items for the person or helper to pick. */
A.suggest = {
  walking: ['wheelchair', 'walker', 'stick', 'escort'], standing: ['walker', 'showerChair', 'toiletSeat'],
  transfer: ['hospitalBed', 'hoist', 'bedRails'], bathing: ['showerChair', 'bathroomMod', 'caregiver'],
  toilet: ['diapers', 'underpads', 'toiletSeat'], dressing: ['caregiver'], eating: ['meals', 'mealDelivery'],
  medicine: ['medsHelp', 'pharmacy'], hospital: ['apptTransport', 'escort'], housework: ['cleaning', 'groceries'],
  alone: ['checkins', 'visits'], memory: ['dementia', 'caregiver'],
  bedbound: ['hospitalBed', 'mattress', 'diapers', 'homeNursing'], regular: ['caregiver'],
  recentHospital: ['postHospital', 'apptTransport'], lowIncome: ['monthlyAid', 'zakatAid'], noCarer: ['checkins', 'caregiver']
};

/* ---------- Who could help: SAMPLE abilities for the organisations on our list ---------- */
/* p = name prefix in K.records; it = items; m = ways it can help; cost: free | low | paid;
   speed: days | weeks; scope: district | state; elig: needs a low-income check */
A.providers = [
  { p: 'Masjid', it: ['wheelchair', 'walker', 'stick', 'hospitalBed', 'showerChair', 'diapers', 'underpads', 'foodBasket', 'emergencyFood', 'essentials', 'visits', 'spiritual', 'escort', 'emergencyCash'], m: ['borrow', 'donate', 'service', 'refer', 'fund'], cost: 'free', speed: 'days', scope: 'district' },
  { p: 'Kedah Islamic Welfare', it: ['monthlyAid', 'medBills', 'foodBasket', 'visits', 'diapers', 'wheelchair'], m: ['donate', 'fund', 'service', 'refer'], cost: 'free', speed: 'weeks', scope: 'state', elig: true },
  { p: 'WANIDA', it: ['visits', 'foodBasket', 'essentials', 'diapers', 'checkins', 'activities'], m: ['donate', 'service', 'refer'], cost: 'free', speed: 'weeks', scope: 'state' },
  { p: 'PERKIM', it: ['visits', 'spiritual', 'foodBasket', 'monthlyAid'], m: ['donate', 'service', 'fund', 'refer'], cost: 'free', speed: 'weeks', scope: 'state', elig: true },
  { p: 'Kedah Senior Citizens', it: ['visits', 'checkins', 'activities', 'digital'], m: ['service'], cost: 'free', speed: 'days', scope: 'district' },
  { p: 'MAIK', it: ['monthlyAid', 'equipFund', 'medBills', 'zakatAid', 'utilities', 'emergencyCash', 'ramp', 'bathroomMod', 'repairs'], m: ['fund', 'refer'], cost: 'free', speed: 'weeks', scope: 'state', elig: true },
  { p: 'LZNK', it: ['monthlyAid', 'equipFund', 'medBills', 'zakatAid', 'emergencyCash'], m: ['fund', 'refer'], cost: 'free', speed: 'weeks', scope: 'state', elig: true },
  { p: 'JKM', it: ['monthlyAid', 'equipFund', 'wheelchair', 'walker', 'respite', 'dayCare', 'residential', 'caregiver'], m: ['fund', 'refer', 'donate', 'service'], cost: 'free', speed: 'weeks', scope: 'state', elig: true },
  { p: 'PAWE', it: ['activities', 'visits', 'digital', 'spiritual', 'dayCare'], m: ['service'], cost: 'free', speed: 'days', scope: 'district' },
  { p: 'Kedah Home Nursing', it: ['homeNursing', 'postHospital', 'medsHelp', 'wound', 'catheter', 'caregiver', 'nightCarer', 'oxyConcentrator', 'suction', 'nebuliser', 'monitor', 'oximeter'], m: ['service', 'rent', 'buy'], cost: 'paid', speed: 'days', scope: 'district' },
  { p: 'Amanah Elderly Care', it: ['residential', 'respite', 'dayCare', 'caregiver', 'hospitalBed', 'mattress', 'hoist'], m: ['service', 'rent'], cost: 'paid', speed: 'weeks', scope: 'district' },
  { p: 'Kedah Community Transport', it: ['apptTransport', 'dialysis', 'wheelchairVan', 'escort', 'rehab'], m: ['service'], cost: 'low', speed: 'days', scope: 'district' },
  { p: 'Meals-on-Wheels', it: ['meals', 'mealDelivery', 'foodBasket'], m: ['service', 'donate'], cost: 'low', speed: 'days', scope: 'district' },
  { p: 'Neighbourhood Care Hub', it: ['cleaning', 'groceries', 'repairs', 'pharmacy', 'visits'], m: ['service'], cost: 'low', speed: 'days', scope: 'district' },
  { p: 'Volunteer Pool', it: ['visits', 'checkins', 'escort', 'groceries', 'pharmacy', 'cleaning', 'digital', 'repairs'], m: ['service'], cost: 'free', speed: 'days', scope: 'district' }
];

/* ---------- What the aid forms ask (LZNK, MAIK Baitulmal, JKM) ----------
   From the agencies' public pages, checked October 2026. The plan only says
   "likely fits", "needs a check" or "may not fit"; the agency decides. */
A.muslims = { yes: t('Yes', 'Ya'), no: t('No', 'Tidak'), 'prefer-not': t('Prefer not to say', 'Tidak mahu nyatakan') };
A.yesNo = { yes: t('Yes', 'Ya'), no: t('No', 'Tidak'), unsure: t('Not sure', 'Tidak pasti') };
A.kedahYears = { lt1: t('Under 1 year', 'Kurang 1 tahun'), '1to5': t('1 to 5 years', '1 hingga 5 tahun'), gt5: t('More than 5 years', 'Lebih 5 tahun'), unsure: t('Not sure', 'Tidak pasti') };
A.households = ['1', '2', '3', '4', '5', '6+'];
A.earners = { '0': t('None', 'Tiada'), '1': t('1 person', '1 orang'), '2': t('2 people', '2 orang'), '3+': t('3 or more', '3 atau lebih') };
A.houses = { own: t('Own house', 'Rumah sendiri'), rent: t('Rented', 'Sewa'), family: t("Family's house", 'Rumah keluarga'), other: t('Other', 'Lain-lain') };
A.chronics = {
  diabetes: t('Diabetes', 'Kencing manis'), pressure: t('High blood pressure', 'Darah tinggi'), heart: t('Heart disease', 'Sakit jantung'),
  stroke: t('Stroke', 'Strok'), kidney: t('Kidney failure or dialysis', 'Buah pinggang atau dialisis'), cancer: t('Cancer', 'Kanser'),
  dementia: t('Dementia', 'Demensia'), other: t('Other', 'Lain-lain'), none: t('None', 'Tiada')
};
A.okus = { yes: t('Has an OKU card', 'Ada kad OKU'), applying: t('Applying for one', 'Sedang memohon'), no: t('No', 'Tidak'), unsure: t('Not sure', 'Tidak pasti') };
A.costs = { rent: t('Rent', 'Sewa rumah'), utilities: t('Electricity and water', 'Elektrik dan air'), medicine: t('Medicine', 'Ubat'), transport: t('Transport to hospital', 'Pengangkutan ke hospital'), carer: t('Paid carer', 'Penjaga berbayar'), none: t('None of these', 'Tiada') };
A.onlines = { self: t('Online, by myself', 'Dalam talian, sendiri'), helper: t('Online, with a helper', 'Dalam talian, dengan bantuan'), counter: t('At the counter', 'Di kaunter') };

/* documents: one list, so a paper ticked once counts for every form */
A.docs = {
  ic: { l: t('MyKad of the person (copy, front and back)', 'MyKad pemohon (salinan depan dan belakang)'), w: t('Any photocopy shop.', 'Mana-mana kedai fotostat.') },
  icHousehold: { l: t('MyKad or birth certificate of everyone at home', 'MyKad atau sijil lahir semua ahli isi rumah'), w: t('A copy for each person living together.', 'Satu salinan untuk setiap orang yang tinggal bersama.') },
  address: { l: t('Proof of address (electricity or water bill)', 'Bukti alamat (bil elektrik atau air)'), w: t('A recent TNB or SADA bill for this address.', 'Bil TNB atau SADA terkini untuk alamat ini.') },
  civil: { l: t('Marriage, divorce or spouse death certificate (if any)', 'Sijil nikah, cerai atau kematian pasangan (jika ada)'), w: t('From your own papers; ask the religious office or JPN if lost.', 'Daripada simpanan sendiri; tanya pejabat agama atau JPN jika hilang.') },
  income: { l: t('Proof of income (payslip, pension slip or income form)', 'Bukti pendapatan (slip gaji, slip pencen atau borang pendapatan)'), w: t('Ask the office for its income form (Borang Pengesahan Pendapatan).', 'Minta borang pendapatan daripada pejabat (Borang Pengesahan Pendapatan).') },
  medical: { l: t('Medical report from a government hospital or clinic (if any)', 'Laporan perubatan hospital atau klinik kerajaan (jika ada)'), w: t('Ask where the person is treated.', 'Tanya di tempat rawatan.') },
  bank: { l: t('Bank account statement in the person\'s name', 'Penyata akaun bank atas nama pemohon'), w: t('From the bank or its app. Aid is paid into it.', 'Daripada bank atau aplikasinya. Bantuan dibayar ke akaun ini.') },
  imam: { l: t('Form stamped by the Imam or mosque committee', 'Borang disahkan dan dicop oleh Imam atau Jawatankuasa Kariah'), w: t('The masjid in your kariah.', 'Masjid di kariah anda.') },
  govDoctor: { l: t('Form stamped by a government medical officer', 'Borang disahkan oleh Pegawai Perubatan Kerajaan'), w: t('Bring the form to the hospital or clinic.', 'Bawa borang ke hospital atau klinik.') },
  photo: { l: t('A recent photo of the person', 'Gambar terkini pemohon'), w: t('Any clear recent photo.', 'Mana-mana gambar terkini yang jelas.') },
  quote: { l: t('Price quotation for the equipment', 'Sebut harga peralatan'), w: t('Ask a medical supply shop for a written quote.', 'Minta sebut harga bertulis daripada kedai alat perubatan.') },
  doctorRec: { l: t('Recommendation from a doctor or JKM officer', 'Syor daripada doktor atau pegawai JKM'), w: t('Ask the doctor or therapist who sees the person.', 'Tanya doktor atau ahli terapi yang merawat.') }
};
var MEDICAL_ITEMS = ['oxyCylinder', 'oxyConcentrator', 'nebuliser', 'suction', 'monitor', 'oximeter', 'hospitalBed', 'mattress', 'hoist', 'medBills', 'equipFund', 'dialysis', 'catheter', 'wound'];
var MONEY_ITEMS = ['monthlyAid', 'zakatAid', 'emergencyCash', 'utilities', 'foodBasket', 'essentials', 'medBills', 'equipFund'];
A.schemes = [
  { k: 'lznk', agency: 'LZNK', l: t('Zakat aid for the poor and needy', 'Bantuan zakat fakir dan miskin'), by: 'Lembaga Zakat Negeri Kedah',
    items: MONEY_ITEMS, docs: ['ic', 'icHousehold', 'address', 'civil', 'income', 'medical'],
    online: 'https://agihan.zakatkedah.com.my/', office: 'Lembaga Zakat Negeri Kedah', counter: t('An LZNK office', 'Pejabat LZNK'), source: 'https://agihan.zakatkedah.com.my/' },
  { k: 'maikAm', agency: 'MAIK', l: t('Baitulmal general aid (Bantuan Am)', 'Bantuan Am Baitulmal'), by: 'Majlis Agama Islam Negeri Kedah',
    items: ['monthlyAid', 'zakatAid', 'emergencyCash', 'utilities', 'foodBasket', 'essentials'], docs: ['ic', 'income', 'civil', 'bank', 'imam'],
    online: '', office: 'Pejabat Agama Islam Daerah', counter: t('The District Religious Office', 'Pejabat Agama Islam Daerah'), source: 'https://maik.kedah.gov.my/index.php/baitulmal/',
    time: t('About 2 weeks (MAIK service charter)', 'Kira-kira 2 minggu (piagam pelanggan MAIK)') },
  { k: 'maikMed', agency: 'MAIK', l: t('Baitulmal medical aid (Bantuan Perubatan)', 'Bantuan Perubatan Baitulmal'), by: 'Majlis Agama Islam Negeri Kedah',
    items: MEDICAL_ITEMS, docs: ['ic', 'photo', 'quote', 'bank', 'imam', 'govDoctor'],
    online: '', office: 'Pejabat Agama Islam Daerah', counter: t('The District Religious Office', 'Pejabat Agama Islam Daerah'), source: 'https://maik.kedah.gov.my/index.php/baitulmal/',
    time: t('About 2 weeks (MAIK service charter)', 'Kira-kira 2 minggu (piagam pelanggan MAIK)') },
  { k: 'jkmBwe', agency: 'JKM', l: t('Elderly aid (Bantuan Warga Emas)', 'Bantuan Warga Emas'), by: 'Jabatan Kebajikan Masyarakat',
    items: ['monthlyAid', 'emergencyCash', 'utilities', 'foodBasket', 'essentials'], docs: ['ic', 'icHousehold', 'income', 'medical'],
    online: 'https://ebantuanjkm.jkm.gov.my/', office: 'Pejabat Kebajikan Masyarakat Daerah', counter: t('The District Welfare Office (form JKM18)', 'Pejabat Kebajikan Masyarakat Daerah (borang JKM18)'), source: 'https://www.malaysia.gov.my/my/topics/memohon-bantuan-jkm' },
  { k: 'jkmBat', agency: 'JKM', l: t('Aid for assistive devices (Alat Sokongan)', 'Bantuan Alat Sokongan'), by: 'Jabatan Kebajikan Masyarakat',
    items: ['wheelchair', 'ewheelchair', 'walker', 'stick', 'brace'], docs: ['ic', 'doctorRec', 'income'],
    online: 'https://ebantuanjkm.jkm.gov.my/', office: 'Pejabat Kebajikan Masyarakat Daerah', counter: t('The District Welfare Office', 'Pejabat Kebajikan Masyarakat Daerah'), source: 'https://www.malaysia.gov.my/my/categories/bantuan-kebajikan--kemudahan/bantuan-kesihatan/bantuan-alat-sokongan-alat-tiruan-bat' }
];

/* ---------- Case shape ---------- */
function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
function pick(v, obj, d) { return has(obj, v) ? v : d; }
function known(list, obj) { var out = []; (Array.isArray(list) ? list : []).forEach(function (k) { if (has(obj, k) && out.indexOf(k) < 0) out.push(k); }); return out; }
function districts() { return Object.keys(K.scenario.districtAdj); }

A.blank = function () {
  return { filler: 'self', relation: '', age: '', gender: '', district: '', mukim: '', level: '', difficulties: [], recentHospital: false,
    living: '', carer: '', carerTime: '', income: '', supports: [], pay: '', needs: [], urgency: '', note: '',
    muslim: '', citizen: '', kedahYears: '', household: '', earners: '', house: '', chronic: [], oku: '', govtCare: '', costs: [], bank: '', online: '',
    docs: [], consent: false };
};
A.normalize = function (input) {
  var s = input || {}, ds = districts(), d = ds.indexOf(s.district) >= 0 ? s.district : '';
  var needs = [];
  (Array.isArray(s.needs) ? s.needs : []).forEach(function (n) {
    if (!n || !has(A.items, n.item) || needs.some(function (x) { return x.item === n.item; })) return;
    var kind = A.kinds[A.items[n.item].kind];
    needs.push({ item: n.item, mode: kind.modes.indexOf(n.mode) >= 0 ? n.mode : kind.mode, duration: pick(n.duration, A.durations, kind.dur) });
  });
  return {
    filler: pick(s.filler, A.fillers, 'self'), relation: s.filler === 'helper' ? pick(s.relation, A.relations, '') : '',
    age: A.ages.indexOf(s.age) >= 0 ? s.age : '', gender: pick(s.gender, A.genders, ''),
    district: d, mukim: d && (K.scenario.mukimByDistrict[d] || []).indexOf(s.mukim) >= 0 ? s.mukim : '',
    level: pick(s.level, A.levels, ''), difficulties: known(s.difficulties, A.difficulties), recentHospital: !!s.recentHospital,
    living: pick(s.living, A.livings, ''), carer: pick(s.carer, A.carers, ''), carerTime: s.carer && s.carer !== 'none' ? pick(s.carerTime, A.carerTimes, '') : '',
    income: pick(String(s.income), A.incomes, ''), supports: known(s.supports, A.supports), pay: pick(s.pay, A.pays, ''),
    needs: needs, urgency: pick(s.urgency, A.urgencies, ''), note: typeof s.note === 'string' ? s.note.trim().slice(0, 500) : '',
    muslim: pick(s.muslim, A.muslims, ''), citizen: pick(s.citizen, A.yesNo, ''), kedahYears: pick(s.kedahYears, A.kedahYears, ''),
    household: A.households.indexOf(s.household) >= 0 ? s.household : '', earners: pick(s.earners, A.earners, ''), house: pick(s.house, A.houses, ''),
    chronic: known(s.chronic, A.chronics), oku: pick(s.oku, A.okus, ''), govtCare: pick(s.govtCare, A.yesNo, ''), costs: known(s.costs, A.costs),
    bank: pick(s.bank, A.yesNo, ''), online: pick(s.online, A.onlines, ''), docs: known(s.docs, A.docs), consent: !!s.consent
  };
};
function lowIncome(s) { return s.income === '0' || s.income === '800' || s.income === '1500'; }
function highIncome(s) { return s.income === '4000' || s.income === '5000'; }

/* items offered from the situation, most relevant first, each with its reasons */
A.suggestions = function (input) {
  var s = A.normalize(input), score = {}, why = {};
  function add(keys, reason) { keys.forEach(function (k) { score[k] = (score[k] || 0) + 1; (why[k] = why[k] || []).push(reason); }); }
  s.difficulties.forEach(function (d) { add(A.suggest[d] || [], d); });
  if (s.level === 'bedbound') add(A.suggest.bedbound, 'bedbound');
  if (s.level === 'regular' || s.level === 'bedbound') add(A.suggest.regular, 'level');
  if (s.recentHospital) add(A.suggest.recentHospital, 'recentHospital');
  if (lowIncome(s)) add(A.suggest.lowIncome, 'lowIncome');
  if ((s.carer === 'none' || s.living === 'alone') && s.level && s.level !== 'independent') add(A.suggest.noCarer, 'noCarer');
  return Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).map(function (k) { return { item: k, area: A.items[k].area, why: why[k] }; });
};

/* ---------- Matching: explainable, one need at a time, inside one case ---------- */
function providerFor(rec) {
  for (var i = 0; i < A.providers.length; i++) if (rec.name.indexOf(A.providers[i].p) === 0) return A.providers[i];
  return null;
}
function matchOne(s, need, rec, idx, cap) {
  var reasons = [], cautions = [], pts = 40, urg = s.urgency ? A.urgencies[s.urgency].rank : 1;
  reasons.push('offers');
  if (need.mode === 'unsure') pts += 10;
  else if (cap.m.indexOf(need.mode) >= 0) { pts += 20; reasons.push('mode'); }
  else { cautions.push('modeDiffers'); }
  if (rec.district === s.district) { pts += 20; reasons.push('sameDistrict'); }
  else if (cap.scope === 'state') { pts += 12; reasons.push('statewide'); }
  else { pts += 2; cautions.push('otherDistrict'); }
  if (urg >= 3 && cap.speed === 'weeks') { pts -= 10; cautions.push('slow'); }
  else if (urg >= 3 && cap.speed === 'days') { pts += 6; reasons.push('fast'); }
  if (cap.elig) { if (highIncome(s)) { pts -= 15; cautions.push('mayNotQualify'); } else if (lowIncome(s)) { pts += 6; reasons.push('likelyQualifies'); } else cautions.push('checkEligibility'); }
  if (cap.cost === 'paid' && (s.pay === 'none' || s.pay === 'little')) { pts -= 10; cautions.push('costs'); }
  else if (cap.cost === 'free') reasons.push('free');
  if (rec.status === 'Verified') { pts += 10; reasons.push('confirmed'); } else if (rec.status === 'Candidate') pts += 4;
  return { index: idx, record: rec, pts: Math.max(5, Math.min(99, pts)), reasons: reasons, cautions: cautions };
}
function hash(text) {
  var h = 2166136261;
  for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ('00000000' + (h >>> 0).toString(16).toUpperCase()).slice(-8);
}
A.caseId = function (s) {
  var n = A.normalize(s), key = JSON.stringify([n.filler, n.age, n.gender, n.district, n.mukim, n.level, n.difficulties.slice().sort(), n.recentHospital,
    n.living, n.carer, n.carerTime, n.income, n.supports.slice().sort(), n.pay, n.needs.map(function (x) { return [x.item, x.mode, x.duration]; }), n.urgency,
    n.muslim, n.citizen, n.kedahYears, n.household, n.earners, n.house, n.chronic.slice().sort(), n.oku, n.govtCare, n.costs.slice().sort(), n.bank, n.online]);
  return 'KSE-' + VERSION.replace(/\./g, '') + '-' + hash(key);
};

/* does the case need the form questions at all? money, equipment, supplies or home changes */
A.needsForms = function (input) {
  var s = A.normalize(input);
  return s.needs.some(function (n) { var it = A.items[n.item]; return it.area === 'money' || it.kind === 'equipment' || it.kind === 'consumable' || it.kind === 'home'; });
};
var INCOME_UP_TO = { '0': 0, '800': 999, '1500': 1999, '2500': 2999, '4000': 4999, '5000': Infinity };
function under(s, limit) { if (!s.income || s.income === 'unknown') return null; return INCOME_UP_TO[s.income] <= limit; }
/* one scheme against one case: each reason is ok (true), a problem (false) or for the agency to check (null) */
function fit(sc, s) {
  var r = [];
  function add(ok, en, bm) { r.push({ ok: ok, t: t(en, bm) }); }
  if (s.citizen === 'yes') add(true, 'Malaysian citizen', 'Warganegara Malaysia');
  else if (s.citizen === 'no') add(false, 'It is for Malaysian citizens', 'Untuk warganegara Malaysia');
  else add(null, 'Citizenship to confirm', 'Kewarganegaraan perlu disahkan');
  if (sc.k === 'lznk') {
    if (s.muslim === 'yes') add(true, 'Muslim', 'Beragama Islam');
    else if (s.muslim === 'no') add(false, 'Zakat is for Muslims', 'Zakat untuk orang Islam');
    else add(null, 'Zakat is for Muslims', 'Zakat untuk orang Islam');
    if (s.kedahYears === 'lt1') add(null, 'LZNK may ask for at least a year living in Kedah', 'LZNK mungkin memerlukan sekurang-kurangnya setahun tinggal di Kedah');
    else if (s.kedahYears === '1to5' || s.kedahYears === 'gt5') add(true, 'Has lived in Kedah over a year', 'Tinggal di Kedah lebih setahun');
    if (lowIncome(s)) add(true, 'Low income; LZNK checks it against the had kifayah line', 'Pendapatan rendah; LZNK menyemak dengan had kifayah');
    else if (highIncome(s)) add(false, 'Income may be above the had kifayah line', 'Pendapatan mungkin melebihi had kifayah');
    else add(null, 'LZNK checks income against the had kifayah line', 'LZNK menyemak pendapatan dengan had kifayah');
  }
  if (sc.k === 'maikAm') {
    add(true, 'Older people are one of the groups it helps', 'Warga emas antara golongan yang dibantu');
    var u2 = under(s, 2000);
    if (u2 === true) add(true, 'Household income within RM2,000 a month', 'Pendapatan isi rumah dalam RM2,000 sebulan');
    else if (u2 === false) add(false, 'Household income above RM2,000 a month', 'Pendapatan isi rumah melebihi RM2,000 sebulan');
    else add(null, 'Limit is RM2,000 household income a month', 'Had pendapatan isi rumah RM2,000 sebulan');
  }
  if (sc.k === 'maikMed') {
    var serious = s.chronic.filter(function (c) { return ['heart', 'kidney', 'cancer', 'stroke'].indexOf(c) >= 0; }).length;
    if (serious) add(true, 'A long-term illness of the kind it covers', 'Penyakit kronik yang diliputi');
    else add(null, 'Ask if the illness is covered (heart, kidney, cancer, stroke, accidents)', 'Tanya sama ada penyakit diliputi (jantung, buah pinggang, kanser, strok, kemalangan)');
    if (s.govtCare === 'yes') add(true, 'Treated at a government clinic or hospital', 'Dirawat di klinik atau hospital kerajaan');
    else if (s.govtCare === 'no') add(false, 'Treatment must be at a government clinic or hospital', 'Rawatan mesti di klinik atau hospital kerajaan');
    else add(null, 'Treatment must be at a government clinic or hospital', 'Rawatan mesti di klinik atau hospital kerajaan');
    var u5 = under(s, 4999);
    if (u5 === true) add(true, 'Household income within RM5,000 a month', 'Pendapatan isi rumah dalam RM5,000 sebulan');
    else if (u5 === false) add(null, 'Income near or above the RM5,000 limit', 'Pendapatan menghampiri atau melebihi had RM5,000');
  }
  if (sc.k === 'jkmBwe') {
    add(true, 'Aged 60 or over', 'Berumur 60 tahun ke atas');
    if (lowIncome(s)) add(true, 'Low income; JKM checks it against the poverty line', 'Pendapatan rendah; JKM menyemak dengan garis kemiskinan');
    else if (highIncome(s)) add(false, 'Income may be above the poverty line', 'Pendapatan mungkin melebihi garis kemiskinan');
    else add(null, 'JKM checks income against the poverty line', 'JKM menyemak pendapatan dengan garis kemiskinan');
    if (s.supports.indexOf('family') >= 0 || s.carer === 'children' || s.carer === 'relative') add(null, 'JKM also asks whether family can support', 'JKM juga bertanya sama ada keluarga boleh menyara');
    if (s.supports.indexOf('welfare') >= 0) add(null, 'Already gets welfare aid: ask JKM before applying again', 'Sudah menerima bantuan kebajikan: tanya JKM sebelum memohon lagi');
  }
  if (sc.k === 'jkmBat') {
    add(null, 'Needs a recommendation from a doctor or JKM officer', 'Perlu syor doktor atau pegawai JKM');
    if (s.oku === 'yes') add(true, 'Has an OKU card', 'Ada kad OKU');
    else if (s.oku === 'applying') add(null, 'OKU card being applied for', 'Kad OKU sedang dimohon');
    if (lowIncome(s)) add(true, 'Low income', 'Pendapatan rendah');
    else if (highIncome(s)) add(false, 'Income may be above the poverty line', 'Pendapatan mungkin melebihi garis kemiskinan');
  }
  var bad = r.filter(function (x) { return x.ok === false; }).length, unknown = r.filter(function (x) { return x.ok === null; }).length;
  return { status: bad ? 'unlikely' : unknown <= 1 ? 'likely' : 'check', reasons: r };
}
/* the schemes this case might use, best first, with the papers each one asks for */
A.applyPlan = function (input) {
  var s = A.normalize(input), items = s.needs.map(function (n) { return n.item; });
  var wantsMoney = s.needs.some(function (n) { return ['monthlyAid', 'zakatAid', 'emergencyCash', 'utilities'].indexOf(n.item) >= 0; });
  var order = { likely: 0, check: 1, unlikely: 2 };
  var out = A.schemes.filter(function (sc) {
    if (sc.items.some(function (k) { return items.indexOf(k) >= 0; })) return true;
    return (sc.k === 'lznk' || sc.k === 'jkmBwe') && wantsMoney;
  }).map(function (sc) {
    var f = fit(sc, s), docs = sc.docs.map(function (d) { return { key: d, ready: s.docs.indexOf(d) >= 0 }; });
    return { scheme: sc, status: f.status, reasons: f.reasons, docs: docs, ready: docs.filter(function (d) { return d.ready; }).length,
      forItems: sc.items.filter(function (k) { return items.indexOf(k) >= 0; }) };
  });
  out.sort(function (a, b) { return order[a.status] - order[b.status]; });
  var all = []; out.forEach(function (x) { x.docs.forEach(function (d) { if (all.indexOf(d.key) < 0) all.push(d.key); }); });
  return { schemes: out, docs: all, ready: all.filter(function (k) { return s.docs.indexOf(k) >= 0; }).length };
};

A.plan = function (input) {
  var s = A.normalize(input), moneyHelpers = [];
  var lines = s.needs.map(function (need) {
    var item = A.items[need.item], matches = [];
    K.records.forEach(function (rec, idx) {
      var cap = providerFor(rec);
      if (cap && cap.it.indexOf(need.item) >= 0) matches.push(matchOne(s, need, rec, idx, cap));
    });
    matches.sort(function (a, b) { return b.pts - a.pts || a.index - b.index; });
    matches = matches.slice(0, 3);
    var best = matches[0] || null, near = best && best.reasons.indexOf('sameDistrict') + best.reasons.indexOf('statewide') > -2;
    return { need: need, item: item, area: item.area, matches: matches, best: best, covered: !!best, nearby: !!near };
  });
  /* a helper who can pay, for any equipment the person cannot fund */
  if (s.pay === 'none' || s.pay === 'little' || lowIncome(s)) {
    K.records.forEach(function (rec, idx) { var cap = providerFor(rec); if (cap && cap.it.indexOf('equipFund') >= 0) moneyHelpers.push(matchOne(s, { item: 'equipFund', mode: 'fund' }, rec, idx, cap)); });
    moneyHelpers.sort(function (a, b) { return b.pts - a.pts; });
  }
  var covered = lines.filter(function (l) { return l.covered; }).length, nearby = lines.filter(function (l) { return l.nearby; }).length;
  var areas = []; lines.forEach(function (l) { if (areas.indexOf(l.area) < 0) areas.push(l.area); });
  var flags = [];
  if (lines.length >= 3 || areas.length >= 3 || s.level === 'bedbound') flags.push('coordinator');
  if (s.urgency === 'today') flags.push('urgent');
  if ((s.living === 'alone' || s.carer === 'none') && (s.level === 'regular' || s.level === 'bedbound')) flags.push('aloneHighNeed');
  if (s.carer && s.carer !== 'none' && s.carerTime === 'daily' && (s.level === 'regular' || s.level === 'bedbound')) flags.push('carerStrain');
  if (lines.length - covered > 0) flags.push('gap');
  /* the calls this case needs: best matches grouped, so one contact can cover several needs */
  var contacts = [];
  lines.forEach(function (l) {
    if (!l.best) return;
    var c = contacts.filter(function (x) { return x.index === l.best.index; })[0];
    if (!c) { c = { index: l.best.index, record: l.best.record, items: [] }; contacts.push(c); }
    c.items.push(l.need.item);
  });
  contacts.sort(function (a, b) { return b.items.length - a.items.length || a.index - b.index; });
  return {
    version: VERSION, caseId: A.caseId(s), input: s, lines: lines, areas: areas, contacts: contacts,
    covered: covered, nearby: nearby, total: lines.length, flags: flags,
    fundHelper: moneyHelpers[0] || null, apply: A.applyPlan(s)
  };
};

/* ---------- Worked examples for the pitch ---------- */
A.examples = [
  { k: 'complex', l: t('Home from hospital, in bed', 'Baru keluar hospital, terlantar'),
    d: t('Man, 75 to 79, Kota Setar. Low income, cared for by his daughter.', 'Lelaki, 75 hingga 79, Kota Setar. Berpendapatan rendah, dijaga anak perempuan.'),
    s: { filler: 'helper', relation: 'child', age: '75-79', gender: 'man', district: 'Kota Setar', mukim: 'Alor Mengkudu', level: 'bedbound',
      difficulties: ['walking', 'transfer', 'bathing', 'toilet', 'hospital'], recentHospital: true, living: 'family', carer: 'children', carerTime: 'some',
      income: '800', supports: ['welfare'], pay: 'none', urgency: 'days',
      muslim: 'yes', citizen: 'yes', kedahYears: 'gt5', household: '3', earners: '1', house: 'family', chronic: ['stroke'], oku: 'applying', govtCare: 'yes',
      costs: ['medicine', 'transport'], bank: 'yes', online: 'helper', docs: ['ic', 'address'],
      needs: [{ item: 'hospitalBed', mode: 'borrow' }, { item: 'wheelchair', mode: 'borrow' }, { item: 'diapers', mode: 'monthly' }, { item: 'homeNursing', mode: 'service' }, { item: 'apptTransport', mode: 'service' }, { item: 'monthlyAid', mode: 'fund' }] } },
  { k: 'alone', l: t('Lives alone, walking is hard', 'Tinggal seorang, sukar berjalan'),
    d: t('Woman, 70 to 74, Baling. No regular income.', 'Perempuan, 70 hingga 74, Baling. Tiada pendapatan tetap.'),
    s: { filler: 'self', age: '70-74', gender: 'woman', district: 'Baling', mukim: 'Kuala Ketil', level: 'some', difficulties: ['walking', 'hospital', 'alone'],
      living: 'alone', carer: 'neighbour', carerTime: 'rarely', income: '0', supports: [], pay: 'none', urgency: 'weeks',
      muslim: 'yes', citizen: 'yes', kedahYears: 'gt5', household: '1', earners: '0', house: 'own', chronic: ['diabetes', 'pressure'], oku: 'no', govtCare: 'yes',
      costs: ['utilities', 'medicine'], bank: 'no', online: 'counter', docs: ['ic'],
      needs: [{ item: 'walker', mode: 'donate' }, { item: 'apptTransport', mode: 'service' }, { item: 'checkins', mode: 'service' }, { item: 'zakatAid', mode: 'fund' }] } },
  { k: 'oxygen', l: t('Needs oxygen at home', 'Perlukan oksigen di rumah'),
    d: t('Man, 80 to 84, Langkawi. Wife is his carer.', 'Lelaki, 80 hingga 84, Langkawi. Isteri menjadi penjaga.'),
    s: { filler: 'helper', relation: 'spouse', age: '80-84', gender: 'man', district: 'Langkawi', mukim: 'Kuah', level: 'regular', difficulties: ['walking', 'medicine', 'hospital'],
      living: 'spouse', carer: 'spouse', carerTime: 'daily', income: '1500', supports: ['pension'], pay: 'little', urgency: 'today',
      muslim: 'yes', citizen: 'yes', kedahYears: 'gt5', household: '2', earners: '1', house: 'own', chronic: ['heart'], oku: 'no', govtCare: 'yes',
      costs: ['medicine', 'transport'], bank: 'yes', online: 'helper', docs: [],
      needs: [{ item: 'oxyConcentrator', mode: 'rent' }, { item: 'respite', mode: 'service' }, { item: 'equipFund', mode: 'fund' }] } }
];

K.assist = A;
})(window.KSE);
