/* ==========================================================================
   Kedah Silver Economy: data layer
   Everything the pages show that is not layout: the organisation list, the
   case model, budget, reviewer comments and the Bahasa Melayu dictionary.
   Figures trace back to dokumen/ (application form + reply to reviewers).
   Loaded in <head> before kse-shell.js.
   Writing style: short sentences, everyday words, no em dashes.
   ========================================================================== */
window.KSE = window.KSE || {};

(function (K) {
'use strict';

/* ---------- Organisation list (sample, 30 records) ----------
   status keys stay as data values; labels are in K.status:
   Verified = Confirmed, Candidate = To check, Demo = Example            */
K.records = [
{name:'Masjid Sharifah Fatimah',type:'Mosque',district:'Kubang Pasu',cap:'Companion visits · food support · referral',status:'Candidate'},
{name:'Masjid Al-Bukhary Kedah',type:'Mosque',district:'Kota Setar',cap:'Community activities · transport coordination',status:'Candidate'},
{name:'Masjid Alor Merah',type:'Mosque',district:'Kota Setar',cap:'Food basket · volunteer mobilisation',status:'Candidate'},
{name:'Masjid Taman Ria',type:'Mosque',district:'Sungai Petani',cap:'Social support · befriending',status:'Candidate'},
{name:'Masjid Bandar Baharu',type:'Mosque',district:'Kulim',cap:'Community support · referral',status:'Candidate'},
{name:'Kedah Islamic Welfare Association',type:'NGO',district:'Kota Setar',cap:'Welfare navigation · home visits',status:'Candidate'},
{name:'WANIDA Kedah',type:'NGO',district:'Kota Setar',cap:'Volunteer mobilisation · welfare programmes',status:'Candidate'},
{name:'PERKIM Kedah',type:'NGO',district:'Kota Setar',cap:'Faith-based welfare · convert support',status:'Candidate'},
{name:'Kedah Senior Citizens Network',type:'NGO',district:'Sungai Petani',cap:'Befriending · community activities',status:'Demo'},
{name:'MAIK / Baitulmal',type:'Institution',district:'Kota Setar',cap:'Financial assistance · welfare assessment',status:'Candidate'},
{name:'LZNK',type:'Institution',district:'Kota Setar',cap:'Zakat eligibility · financial support',status:'Candidate'},
{name:'JKM Kedah',type:'Institution',district:'Kota Setar',cap:'Welfare assessment · care referrals',status:'Verified'},
{name:'PAWE Kubang Pasu',type:'Institution',district:'Kubang Pasu',cap:'Social activities · ageing in place',status:'Verified'},
{name:'PAWE Kota Setar',type:'Institution',district:'Kota Setar',cap:'Social activities · peer support',status:'Verified'},
{name:'PAWE Kulim',type:'Institution',district:'Kulim',cap:'Social activities · peer support',status:'Verified'},
{name:'PAWE Sungai Petani',type:'Institution',district:'Sungai Petani',cap:'Social activities · peer support',status:'Verified'},
{name:'Kedah Home Nursing 01',type:'Provider',district:'Kota Setar',cap:'Home nursing · wound care · daily living support',status:'Demo'},
{name:'Kedah Home Nursing 02',type:'Provider',district:'Sungai Petani',cap:'Home care · medication reminders',status:'Demo'},
{name:'Amanah Elderly Care Home 01',type:'Provider',district:'Kulim',cap:'Short stays · daily living support',status:'Demo'},
{name:'Amanah Elderly Care Home 02',type:'Provider',district:'Kota Setar',cap:'Residential care · caregiver support',status:'Demo'},
{name:'Kedah Community Transport 01',type:'Provider',district:'Kubang Pasu',cap:'Hospital transport · appointment escort',status:'Demo'},
{name:'Kedah Community Transport 02',type:'Provider',district:'Sungai Petani',cap:'Hospital transport · mobility support',status:'Demo'},
{name:'Meals-on-Wheels Kedah',type:'Provider',district:'Kota Setar',cap:'Meal delivery · food basket',status:'Demo'},
{name:'Neighbourhood Care Hub Kulim',type:'Provider',district:'Kulim',cap:'Help at home · shopping support',status:'Demo'},
{name:'Volunteer Pool Jitra',type:'Volunteer',district:'Kubang Pasu',cap:'Companion visits · hospital escort',status:'Demo'},
{name:'Volunteer Pool Alor Setar',type:'Volunteer',district:'Kota Setar',cap:'Phone check-ins · errands',status:'Demo'},
{name:'Volunteer Pool Sungai Petani',type:'Volunteer',district:'Sungai Petani',cap:'Transport · companionship',status:'Demo'},
{name:'Volunteer Pool Baling',type:'Volunteer',district:'Baling',cap:'Home visits · food delivery',status:'Demo'},
{name:'Volunteer Pool Langkawi',type:'Volunteer',district:'Langkawi',cap:'Community visits · referral',status:'Demo'},
{name:'Kedah Silver Economy Coordination Desk',type:'Institution',district:'Kota Setar',cap:'Intake · referral tracking · gap reports',status:'Demo'}
];

/* Contact fields are illustrative demo records for the pitch. They are never
   presented as confirmed live numbers or guaranteed aid. */
var demoAreaCodes = {'Kubang Pasu':'04-700 10','Kota Setar':'04-700 20','Sungai Petani':'04-700 30','Kulim':'04-700 40','Baling':'04-700 50','Langkawi':'04-700 60','Padang Terap':'04-700 70','Pokok Sena':'04-700 80','Pendang':'04-700 90','Sik':'04-700 11','Yan':'04-700 12','Bandar Baharu':'04-700 13'};
K.records.forEach(function (r, i) {
  r.phone = demoAreaCodes[r.district] + ' ' + String(i + 1).padStart(2, '0');
  r.contact = r.type === 'Institution' ? 'Kaunter bantuan' : r.type === 'Mosque' ? 'Penyelaras komuniti' : r.type === 'Provider' ? 'Meja khidmat' : 'Penyelaras sukarelawan';
  r.help = r.type === 'Institution' ? 'Semakan kelayakan dan rujukan' : r.type === 'Mosque' ? 'Lawatan, makanan dan sokongan komuniti' : r.type === 'Provider' ? 'Perkhidmatan penjagaan dan temujanji' : 'Teman, panggilan dan bantuan harian';
  r.aid = r.type === 'Institution' ? 'Bantuan tertakluk kepada semakan kelayakan' : r.type === 'Provider' ? 'Harga dan kapasiti perlu disahkan' : 'Sokongan percuma atau sumbangan, perlu disahkan';
  r.amount = r.name.indexOf('MAIK') === 0 || r.name.indexOf('LZNK') === 0 ? 'Contoh RM300–RM1,500; tertakluk kepada semakan' : r.name.indexOf('JKM') === 0 ? 'Skim dan jumlah ditentukan selepas semakan' : r.type === 'Provider' ? 'Harga atau kadar contoh; sahkan semasa panggilan' : 'Tiada bayaran atau sumbangan; sahkan dahulu';
  if (r.name.indexOf('PAWE') === 0) { r.help = 'Aktiviti sosial, sokongan rakan sebaya dan senaman ringan'; r.aid = 'Aktiviti komuniti; tempat dan syarat perlu disahkan'; }
  r.hours = 'Isnin–Jumaat · 9:00–16:30';
  /* English for the same sample fields; the page shows the one that matches the language */
  r.contactEn = r.type === 'Institution' ? 'Help counter' : r.type === 'Mosque' ? 'Community coordinator' : r.type === 'Provider' ? 'Service desk' : 'Volunteer coordinator';
  r.helpEn = r.name.indexOf('PAWE') === 0 ? 'Social activities, peer support and light exercise' : r.type === 'Institution' ? 'Eligibility check and referral' : r.type === 'Mosque' ? 'Visits, meals and community support' : r.type === 'Provider' ? 'Care services and appointments' : 'Company, calls and daily help';
  r.aidEn = r.name.indexOf('PAWE') === 0 ? 'Community activities; place and terms to be confirmed' : r.type === 'Institution' ? 'Help depends on an eligibility check' : r.type === 'Provider' ? 'Price and places to be confirmed' : 'Free or donation-based support, to be confirmed';
  r.amountEn = r.name.indexOf('MAIK') === 0 || r.name.indexOf('LZNK') === 0 ? 'Example RM300–RM1,500; subject to a check' : r.name.indexOf('JKM') === 0 ? 'Scheme and amount set after a check' : r.type === 'Provider' ? 'Sample price or rate; confirm when you call' : 'No fee or a donation; confirm first';
  r.demoContact = true;
});

/* c = colour slot (tokens --t1..5 / --b1..5). Order is fixed. */
K.types = {
Institution:{c:1,one:{en:'Agency',bm:'Agensi'},many:{en:'Agencies',bm:'Agensi'}},
NGO:{c:2,one:{en:'NGO',bm:'NGO'},many:{en:'NGOs',bm:'NGO'}},
Mosque:{c:3,one:{en:'Masjid',bm:'Masjid'},many:{en:'Masjids',bm:'Masjid'}},
Provider:{c:4,one:{en:'Care provider',bm:'Penyedia penjagaan'},many:{en:'Care providers',bm:'Penyedia'}},
Volunteer:{c:5,one:{en:'Volunteer group',bm:'Kumpulan sukarelawan'},many:{en:'Volunteers',bm:'Sukarelawan'}}
};
K.typeOrder = ['Institution','NGO','Mosque','Provider','Volunteer'];

/* ring = distance from the centre on the overview map (closer = more certain) */
K.status = {
Verified:{en:'Confirmed',bm:'Disahkan',ring:78,key:{en:'we have checked that it exists.',bm:'kami sudah semak ia wujud.'}},
Candidate:{en:'To check',bm:'Perlu disemak',ring:128,key:{en:'likely to fit, but its services are not checked yet.',bm:'mungkin sesuai, tetapi perkhidmatannya belum disemak.'}},
Demo:{en:'Example',bm:'Contoh',ring:178,key:{en:'a made-up record to show how the system works.',bm:'rekod rekaan untuk menunjukkan cara sistem berfungsi.'}}
};
K.statusOrder = ['Verified','Candidate','Demo'];
K.counts = {};
K.statusOrder.forEach(function (s) { K.counts[s] = K.records.filter(function (r) { return r.status === s; }).length; });

/* ---------- The three lists shown on the "How it works" page ---------- */
K.schema = [
{t:{en:'Organisation',bm:'Organisasi'},key:{5:{en:'On every record',bm:'Pada setiap rekod'}},
 f:[['Name','Nama'],['Type','Jenis'],['District','Daerah'],['Area covered','Kawasan liputan'],['Contact','Hubungan'],['Checked or not','Status semakan'],['Still active','Masih aktif']]},
{t:{en:'Services',bm:'Perkhidmatan'},key:{1:{en:'Used to match',bm:'Guna untuk padanan'},3:{en:'Used to match',bm:'Guna untuk padanan'},5:{en:'Used to match',bm:'Guna untuk padanan'}},
 f:[['Type of help','Jenis bantuan'],['Who qualifies','Siapa layak'],['Cost','Kos'],['Free places','Tempat kosong'],['Opening times','Waktu operasi'],['Referral needed','Perlu rujukan'],['At home or in hospital','Di rumah atau hospital']]},
{t:{en:'Volunteer',bm:'Sukarelawan'},key:{6:{en:'Required',bm:'Wajib'}},
 f:[['Location','Lokasi'],['Skills','Kemahiran'],['Has transport','Ada kenderaan'],['Free times','Masa lapang'],['Distance','Jarak'],['Training','Latihan'],['Background check','Semakan latar belakang']]}
];

/* ---------- "Try a case" model (sample logic, not real estimates) ---------- */
K.scenario = {
steps:{
  escort:{en:'Company or hospital escort',bm:'Teman atau iringan ke hospital'},
  commTransport:{en:'Community transport',bm:'Pengangkutan komuniti'},
  paweSocial:{en:'PAWE activities',bm:'Aktiviti PAWE'},
  welfareAssess:{en:'Welfare check',bm:'Semakan kebajikan'},
  food:{en:'Food help',bm:'Bantuan makanan'},
  homeAssist:{en:'Help at home',bm:'Bantuan di rumah'},
  hospTransport:{en:'Transport to hospital',bm:'Pengangkutan ke hospital'},
  medAssess:{en:'Medical check',bm:'Pemeriksaan perubatan'},
  homeNursing:{en:'Nursing at home',bm:'Rawatan di rumah'},
  welfareSupport:{en:'Welfare help',bm:'Bantuan kebajikan'},
  residential:{en:'Place in a care home',bm:'Tempat di rumah jagaan'},
  welfareElig:{en:'Check if they qualify for aid',bm:'Semak kelayakan bantuan'},
  foodMeal:{en:'Food or meal delivery',bm:'Makanan atau penghantaran makanan'}
},
stepInfo:{
  paweSocial:{
    en:'PAWE means Pusat Aktiviti Warga Emas. It provides regular social activities, peer support, light exercise and a place for older people to stay connected.',
    bm:'PAWE bermaksud Pusat Aktiviti Warga Emas. Ia menyediakan aktiviti sosial, sokongan rakan sebaya, senaman ringan dan ruang untuk warga emas terus berhubung.'
  }
},
/* m = name prefix into K.records. The page prefers a record in the chosen
   district, so "Who could help" names the real organisation on our list and
   takes its status from that record instead of repeating it here. */
nodes:{
  pawe:{n:'PAWE Kedah',s:'Verified',m:'PAWE'},
  volPool:{n:{en:'Volunteer group',bm:'Kumpulan sukarelawan'},s:'Demo',m:'Volunteer Pool'},
  mosqueNode:{n:{en:'Masjid or community group',bm:'Masjid atau kumpulan komuniti'},s:'Candidate',m:'Masjid'},
  maik:{n:'MAIK / Baitulmal',s:'Candidate',m:'MAIK'},
  jkmPawe:{n:'JKM / PAWE',s:'Verified',m:'JKM'},
  foodNet:{n:{en:'Food bank network',bm:'Rangkaian bank makanan'},s:'Demo',m:'Meals-on-Wheels'},
  jkmHealth:{n:{en:'JKM / health services',bm:'JKM / perkhidmatan kesihatan'},s:'Verified',m:'JKM'},
  homeCare:{n:{en:'Home care provider',bm:'Penyedia penjagaan di rumah'},s:'Demo',m:'Amanah Elderly Care'},
  transport:{n:'Kedah Community Transport',s:'Demo',m:'Kedah Community Transport'},
  nursing:{n:'Kedah Home Nursing',s:'Demo',m:'Kedah Home Nursing'},
  meals:{n:'Meals-on-Wheels Kedah',s:'Demo',m:'Meals-on-Wheels'}
},
profiles:{
  independent:{coverage:78,steps:3,path:['escort','commTransport','paweSocial'],nodes:['pawe','volPool','mosqueNode'],gap:'single'},
  vulnerable:{coverage:64,steps:4,path:['welfareAssess','food','homeAssist','hospTransport'],nodes:['maik','jkmPawe','foodNet'],gap:'eligibility'},
  highneed:{coverage:42,steps:5,path:['medAssess','homeNursing','welfareSupport','food','residential'],nodes:['jkmHealth','maik','homeCare'],gap:'coordinator'}
},
needs:{
  companion:{add:0,step:'escort',node:'volPool'},
  transport:{add:-4,step:'hospTransport',node:'transport'},
  homecare:{add:-11,step:'homeNursing',node:'nursing'},
  welfare:{add:3,step:'welfareElig',node:'maik'},
  food:{add:-2,step:'foodMeal',node:'meals'}
},
/* Kubang Pasu, not Jitra: Jitra is a town inside it. The organisation list
   and the district chart both count by district, so this matches them. */
districtAdj:{'Kubang Pasu':2,'Kota Setar':4,'Sungai Petani':1,'Kulim':0,'Baling':-8,'Langkawi':-10,'Padang Terap':0,'Pokok Sena':0,'Pendang':0,'Sik':0,'Yan':0,'Bandar Baharu':0},
mukimByDistrict:{
 'Kubang Pasu':['Jitra','Changlun','Kodiang','Jerlun','Sintok','Tunjang','Sanglang','Ayer Hitam','Bandar Darul Aman','Bukit Kayu Hitam'],
 'Kota Setar':['Alor Mengkudu','Anak Bukit','Mergong','Kangkong','Langgar','Pumpong','Tandop','Tebengau','Gunung Keriang','Hutan Kampung','Kuala Kedah','Kubang Rotan','Simpang Empat'],
 'Sungai Petani':['Sungai Petani','Bakar Arang','Sidam','Pantai Merdeka'],
 'Kulim':['Kulim','Lunas','Junjung','Karangan','Keladi','Mahang','Merbau Pulas','Padang Serai','Sungai Ular'],
 'Baling':['Baling','Kuala Ketil','Kuala Pegang','Tawar','Kupang','Bongor','Pulai','Bakai','Bayu'],
 'Langkawi':['Kuah','Bohor','Kedawang','Ayer Hangat','Pulau Tuba','Ulu Melaka','Padang Matsirat'],
 'Padang Terap':['Kuala Nerang','Padang Sanai','Belimbing','Naka','Nami','Pedu','Tekai','Terolak'],
 'Pokok Sena':['Pokok Sena','Gajah Mati','Jabi','Tualang','Lesong','Bukit Lada','Derang'],
 'Pendang':['Pendang','Ayer Putih','Bukit Jenun','Bukit Raya','Kubur Panjang','Sungai Tiang','Tanah Merah','Kobah','Rambai','Tobiar','Tokai'],
 'Sik':['Sik','Beris','Belantik','Gulau','Jeneri','Sok'],
 'Yan':['Yan','Guar Cempedak','Sungai Limau','Sungai Daun','Singkir','Dulang'],
 'Bandar Baharu':['Serdang','Relau','Selama','Bagan Samak','Kuala Selama','Permatang Pasir','Sungai Batu','Sungai Kechil']
},
gaps:{
  single:{en:'There is no single contact point across the agencies yet.',bm:'Belum ada satu tempat hubungan untuk semua agensi.'},
  eligibility:{en:'We must check who qualifies and who has space before a referral can go ahead.',bm:'Kita perlu semak siapa layak dan siapa ada kekosongan sebelum rujukan boleh dibuat.'},
  coordinator:{en:'People with high needs need one named person to organise their medical, welfare and community help.',bm:'Warga emas berkeperluan tinggi perlukan seorang penyelaras untuk bantuan perubatan, kebajikan dan komuniti.'},
  district:{en:'Our list has few organisations in this district. Phase 1 must check what help is really there.',bm:'Senarai kami ada sedikit organisasi di daerah ini. Fasa 1 perlu semak bantuan yang benar-benar ada.'},
  capacity:{en:'There may not be enough trained staff. We will check this in the interviews and the trial.',bm:'Mungkin tidak cukup kakitangan terlatih. Kami akan semak perkara ini dalam temu bual dan percubaan.'}
  ,multiple:{en:'Several needs need one coordinator to keep referrals from splitting across different services.',bm:'Beberapa keperluan perlukan seorang penyelaras supaya rujukan tidak berpecah antara perkhidmatan.'}
},
states:{good:{en:'Well covered',bm:'Dipenuhi dengan baik'},warn:{en:'Partly covered',bm:'Dipenuhi sebahagian'},crit:{en:'Poorly covered',bm:'Kurang dipenuhi'}},
presets:[
  {l:{en:'Manages alone · Kota Setar',bm:'Urus diri · Kota Setar'},persona:'independent',district:'Kota Setar',need:'companion',income:3500},
  {l:{en:'Needs some help · Baling',bm:'Perlu sedikit bantuan · Baling'},persona:'vulnerable',district:'Baling',need:'welfare',income:800},
  {l:{en:'Needs a lot of help · Langkawi',bm:'Perlu banyak bantuan · Langkawi'},persona:'highneed',district:'Langkawi',need:'homecare',income:1500}
]
};

/* ---------- Budget: section I of the revised application form ----------
   Vot 11000: RM2,000 x 9 months. Vot 21000: RM560 + 1,050 + 900 + 1,120
   + 425 + 226. Vot 29000: RM3,600 + 2,000 + 500 + 445 + 300 + 874.
   Total RM30,000.                                                        */
K.budget = [
{l:{en:'Salary & wages (RM2,000 x 9 months)',bm:'Gaji & upah (RM2,000 x 9 bulan)'},vot:'11000',v:18000},
{l:{en:'Travel: field visits, comparison visit, expert visit',bm:'Perjalanan: lawatan lapangan, lawatan perbandingan, lawatan pakar'},vot:'21000',v:4281},
{l:{en:'Two workshops (20 people each)',bm:'Dua bengkel (20 orang setiap satu)'},vot:'29000',v:3600},
{l:{en:'Tokens for workshop participants and interviewees',bm:'Token untuk peserta bengkel dan responden'},vot:'29000',v:2500},
{l:{en:'RMC admin fee (3% of RM29,126)',bm:'Yuran pentadbiran RMC (3% daripada RM29,126)'},vot:'29000',v:874},
{l:{en:'Printing and reports',bm:'Percetakan dan laporan'},vot:'29000',v:445},
{l:{en:'Copyright filing',bm:'Pemfailan hak cipta'},vot:'29000',v:300}
];

/* ---------- Overview: why Kedah, partners, team, earlier studies, plans ---------- */
K.why = [
{big:{en:'8.0%',bm:'8.0%'},t:{en:'of people in Malaysia were 65 or older in 2025, up from 7.6% in 2024.',bm:'penduduk Malaysia berumur 65 tahun ke atas pada 2025, naik daripada 7.6% pada 2024.'},src:{en:'DOSM, 2025',bm:'DOSM, 2025'}},
{big:{en:'Kedah',bm:'Kedah'},t:{en:'Mostly Muslim, a higher poverty rate, and strong zakat and waqf bodies. A good place to test the model.',bm:'Majoriti Muslim, kadar kemiskinan lebih tinggi, dan badan zakat serta wakaf yang kukuh. Tempat yang sesuai untuk menguji model ini.'},src:{en:'Application form',bm:'Borang permohonan'}},
{big:{en:'First',bm:'Pertama'},t:{en:'study of joined-up elderly care in Kedah.',bm:'kajian penjagaan warga emas bersepadu di Kedah.'},src:{en:'Reply to reviewers',bm:'Jawapan kepada penilai'}}
];
K.partners = [
{n:'PERKIM',s:'signed'},
{n:'WANIDA Kedah',s:'signed'},
{n:{en:'Waqf governance expert',bm:'Pakar tadbir urus wakaf'},s:'signed'},
{n:'MAIK',s:'talks'}
];
K.partnerStatus = {signed:{en:'Signed letter',bm:'Surat ditandatangani',c:'verified'},talks:{en:'In talks',bm:'Dalam perbincangan',c:'candidate'}};
K.team = [
{n:'Prof. Madya Dr. Shamzaeffa binti Samsudin',i:'SS',r:{en:'Project leader',bm:'Ketua projek'},cls:'lead'},
{n:'Prof. Madya Dr. Shazida Jan Mohd Khan',i:'SJ',r:{en:'Substitute leader',bm:'Ketua gantian'},cls:'sub'},
{n:'Prof. Madya Dr. Nur Hafizah Mohammad Ismail',i:'NH',r:{en:'Researcher',bm:'Penyelidik'}},
{n:'Prof. Madya Dr. Nur Syakiran Akmal Ismail',i:'NS',r:{en:'Researcher',bm:'Penyelidik'}},
{n:'Sharima Ruwaida Abbas',i:'SR',r:{en:'Researcher',bm:'Penyelidik'}},
{n:'Prof. Madya Dr. Mukhriz Izraf Azman Aziz',i:'MI',r:{en:'Researcher',bm:'Penyelidik'}}
];
K.track = [
{n:'1,414',t:{en:'older people in the northern region. Health care demand model (PBIT grant, done 2020).',bm:'warga emas di wilayah utara. Model permintaan penjagaan kesihatan (geran PBIT, siap 2020).'}},
{n:'1,153',t:{en:'adults aged 40 to 59 on where they want to live when old (FRGS, done 2018).',bm:'orang dewasa 40 hingga 59 tahun tentang pilihan tempat tinggal semasa tua (FRGS, siap 2018).'}},
{n:'399',t:{en:'older people in Kedah on their use of medical care (UUM grant, done 2013).',bm:'warga emas di Kedah tentang penggunaan rawatan perubatan (geran UUM, siap 2013).'}},
{n:'Takaful',t:{en:'young adults and takaful firms on paying for elderly care (industry grant, final report 2026).',bm:'golongan dewasa muda dan syarikat takaful tentang pembiayaan penjagaan warga emas (geran industri, laporan akhir 2026).'}}
];
K.plans = [
{n:{en:'13th Malaysia Plan 2026–2030',bm:'Rancangan Malaysia Ke-13 2026–2030'},t:{en:'Getting ready for an aged nation is one of its 27 priorities.',bm:'Persediaan ke arah negara tua ialah salah satu daripada 27 keutamaannya.'}},
{n:{en:'MADANI Economy',bm:'Ekonomi MADANI'},t:{en:'Big Bold: social protection reform.',bm:'Anjakan Besar: reformasi perlindungan sosial.'}},
{n:{en:'SDG 3',bm:'SDG 3'},t:{en:'Good health and well-being.',bm:'Kesihatan baik dan kesejahteraan.'}},
{n:{en:'Pelan Transformasi Al-Falah 2023–2027',bm:'Pelan Transformasi Al-Falah 2023–2027'},t:{en:'JAKIM pillar: Kesejahteraan Insan (human well-being).',bm:'Teras JAKIM: Kesejahteraan Insan.'}},
{n:{en:'MAIK Strategic Plan',bm:'Pelan Strategik MAIK'},t:{en:'Strategy 1.3: stronger social aid projects, programmes and packages.',bm:'Strategi 1.3: meningkatkan keupayaan pelaksanaan projek, program dan pakej bantuan sosial.'}},
{n:{en:'UUM priority area',bm:'Bidang tumpuan UUM'},t:{en:'Fiscal sustainability of an ageing society.',bm:'Kemampanan fiskal masyarakat menua.'}}
];

/* ---------- "How it works": Figure 2 of the application, in four layers ---------- */
K.fit = [
{t:{en:'RMK13 national agenda',bm:'Agenda nasional RMK13'},note:{en:'The national direction',bm:'Hala tuju negara'},
 items:[{en:'Getting ready for an ageing nation',bm:'Persediaan ke arah negara menua'},{en:'Stronger social protection and money security',bm:'Perlindungan sosial dan jaminan kewangan yang lebih kukuh'},{en:'Lasting long-term care',bm:'Penjagaan jangka panjang yang mampan'},{en:'Well-being and inclusion of older people',bm:'Kesejahteraan dan keterangkuman warga emas'}]},
{t:{en:'The national system we have now',bm:'Sistem negara sedia ada'},note:{en:'Stays the main system',bm:'Kekal sebagai sistem utama'},
 items:[{en:'Government welfare and aid',bm:'Kebajikan dan bantuan kerajaan'},{en:'Health and long-term care',bm:'Kesihatan dan penjagaan jangka panjang'},{en:'Family and community support',bm:'Sokongan keluarga dan komuniti'},{en:'Retirement and income protection',bm:'Persaraan dan perlindungan pendapatan'}]},
{t:{en:'Our Islamic care model for Kedah',bm:'Model penjagaan Islam kami untuk Kedah'},note:{en:'Extra and optional. Not a replacement.',bm:'Tambahan dan pilihan. Bukan pengganti.'},ours:true,
 cols:[
  {h:{en:'Who is in it',bm:'Siapa terlibat'},items:[{en:'Zakat, waqf, baitulmal, masjids, Islamic NGOs, takaful',bm:'Zakat, wakaf, baitulmal, masjid, NGO Islam, takaful'},{en:'Government and welfare agencies',bm:'Agensi kerajaan dan kebajikan'},{en:'Health and community providers',bm:'Penyedia kesihatan dan komuniti'},{en:'Families and older people',bm:'Keluarga dan warga emas'}]},
  {h:{en:'What it does',bm:'Apa yang dibuat'},items:[{en:'Find out what people need',bm:'Kenal pasti keperluan'},{en:'Refer and coordinate',bm:'Rujuk dan selaras'},{en:'Care and social support',bm:'Penjagaan dan sokongan sosial'},{en:'Raise resources, including sadaqah',bm:'Kumpul sumber, termasuk sedekah'},{en:'Follow up',bm:'Pantau dan susulan'}]},
  {h:{en:'What it adds',bm:'Apa yang ditambah'},items:[{en:'A Shariah-compliant path to help',bm:'Laluan bantuan patuh Syariah'},{en:'Better coordination between bodies',bm:'Koordinasi yang lebih baik antara badan'},{en:'More support and funding options',bm:'Lebih banyak pilihan bantuan dan dana'},{en:'More community involvement',bm:'Lebih banyak penglibatan komuniti'}]}
 ]},
{t:{en:'The Kedah trial and national policy',bm:'Percubaan Kedah dan dasar negara'},note:{en:'What comes out',bm:'Apa yang dihasilkan'},
 cols:[
  {h:{en:'The Kedah trial gives',bm:'Percubaan Kedah memberi'},items:[{en:'A checked model',bm:'Model yang telah disemak'},{en:'Lessons from running it',bm:'Pengajaran daripada pelaksanaan'},{en:'Feedback from the agencies',bm:'Maklum balas daripada agensi'},{en:'A how-to guide',bm:'Panduan pelaksanaan'}]},
  {h:{en:'How it helps the national system',bm:'Bagaimana ia membantu sistem negara'},items:[{en:'Adds to current services',bm:'Menambah perkhidmatan sedia ada'},{en:'Gives evidence for other states',bm:'Memberi bukti untuk negeri lain'},{en:'Helps agencies work together',bm:'Membantu agensi bekerjasama'},{en:'Informs RMK13 ageing and social protection work',bm:'Menyumbang kepada usaha penuaan dan perlindungan sosial RMK13'}]}
 ],
 foot:{en:'Growth beyond Kedah depends on readiness, governance, funding, agency commitment and good trial results.',bm:'Pengembangan ke luar Kedah bergantung pada kesediaan, tadbir urus, pembiayaan, komitmen agensi dan hasil percubaan yang baik.'}}
];

/* ---------- Reply to reviewers (28 Sep 2026) ----------
   s: Verified = done, Candidate = in progress, Demo = later             */
K.reviews = [
{area:{en:'Title',bm:'Tajuk'},s:'Demo',where:'-',
 asked:{en:'R1 suggested a new title: "Integrated Islamic Ecosystem for Muslim Elderly Care: A Proof-of-Concept Study in the State of Kedah". R2 asked for a clearer scope.',bm:'R1 cadangkan tajuk baharu: "Integrated Islamic Ecosystem for Muslim Elderly Care: A Proof-of-Concept Study in the State of Kedah". R2 minta skop yang lebih jelas.'},
 done:{en:'We kept the current title for now. We will decide on the new title with the agencies at the design workshop.',bm:'Kami kekalkan tajuk sekarang buat masa ini. Tajuk baharu akan diputuskan bersama agensi dalam bengkel reka bentuk.'}},
{area:{en:'Executive summary',bm:'Ringkasan eksekutif'},s:'Verified',where:{en:'Summary',bm:'Ringkasan'},
 asked:{en:'Give the number of experts, the sample sizes and the main outputs.',bm:'Nyatakan bilangan pakar, saiz sampel dan hasil utama.'},
 done:{en:'The summary now gives the size of the expert panel (10) and the main sample sizes, within the 150-word limit.',bm:'Ringkasan kini menyatakan saiz panel pakar (10) dan saiz sampel utama, dalam had 150 patah perkataan.'}},
{area:{en:'Background',bm:'Latar belakang'},s:'Verified',where:'p. 10',
 asked:{en:'Also discuss problems inside Islamic funding bodies, such as MAIK and LZNK roles that overlap and waqf assets that are hard to use. Add Kedah data.',bm:'Bincangkan juga masalah dalam badan kewangan Islam, seperti peranan MAIK dan LZNK yang bertindih dan aset wakaf yang sukar digunakan. Tambah data Kedah.'},
 done:{en:'Literature review updated. No study on joined-up care in Kedah exists yet.',bm:'Sorotan literatur dikemas kini. Belum ada kajian penjagaan bersepadu di Kedah.'}},
{area:{en:'Objectives',bm:'Objektif'},s:'Verified',where:'p. 14',
 asked:{en:'Objective 4 mixes working with the agencies and running the trial.',bm:'Objektif 4 mencampurkan kerja bersama agensi dan percubaan.'},
 done:{en:'Explained: 5 objectives in 4 phases. Objectives 4 and 5 are both in Phase 4.',bm:'Dijelaskan: 5 objektif dalam 4 fasa. Objektif 4 dan 5 kedua-duanya dalam Fasa 4.'}},
{area:{en:'Method',bm:'Metodologi'},s:'Verified',where:'pp. 14–15',
 asked:{en:'Explain Phase 4 in detail: how many experts, how validity is measured, sampling, ethics and the trial plan.',bm:'Terangkan Fasa 4 dengan terperinci: berapa pakar, cara kesahan diukur, persampelan, etika dan pelan percubaan.'},
 done:{en:'10 experts score the model (I-CVI and S-CVI/Ave) and add comments. Then a small trial of the referral process. Sample sizes added. Ethics will be handled before data collection.',bm:'10 pakar menilai model (I-CVI dan S-CVI/Ave) dan menulis ulasan. Kemudian percubaan kecil proses rujukan. Saiz sampel ditambah. Etika akan diuruskan sebelum pengumpulan data.'}},
{area:{en:'Expected results',bm:'Hasil dijangka'},s:'Verified',where:'-',
 asked:{en:'Prepare a policy brief or a practical guide for the state religious councils.',bm:'Sediakan ringkasan dasar atau panduan praktikal untuk majlis agama negeri.'},
 done:{en:'The model will come with a guide, included in the research brief and report.',bm:'Model akan disertakan panduan, dalam ringkasan penyelidikan dan laporan.'}},
{area:{en:'Impact',bm:'Impak'},s:'Verified',where:'pp. 16, 19',
 asked:{en:'Show how the Kedah trial could grow into national policy under the 13th Malaysia Plan, with clear measures.',bm:'Tunjukkan bagaimana percubaan Kedah boleh berkembang menjadi dasar nasional di bawah RMK-13, dengan ukuran yang jelas.'},
 done:{en:'Added a growth plan and clear measures. The model adds to national social protection. It does not replace it.',bm:'Pelan pengembangan dan ukuran yang jelas ditambah. Model ini menambah perlindungan sosial nasional, bukan menggantikannya.'}},
{area:{en:'Team',bm:'Pasukan'},s:'Verified',where:'p. 4',
 asked:{en:'Name a substitute leader (Ketua Gantian), as Section 3.1(h) requires.',bm:'Namakan Ketua Gantian seperti yang dikehendaki Seksyen 3.1(h).'},
 done:{en:'Substitute leader named in Section C(viii).',bm:'Ketua Gantian dinamakan dalam Seksyen C(viii).'}},
{area:{en:'Budget',bm:'Bajet'},s:'Verified',where:{en:'Budget',bm:'Bajet'},
 asked:{en:'Add the required 3% RMC fee under Vot 29000, and fix language errors.',bm:'Tambah yuran wajib 3% RMC di bawah Vot 29000, dan betulkan kesalahan bahasa.'},
 done:{en:'Added RM874 (3% of RM29,126) under Vot 29000. The total stays at RM30,000. Language checked.',bm:'RM874 (3% daripada RM29,126) ditambah di bawah Vot 29000. Jumlah kekal RM30,000. Bahasa telah disemak.'}},
{area:{en:'Risks',bm:'Risiko'},s:'Verified',where:'p. 21',
 asked:{en:'Add a risk plan: what if people drop out, who owns the model after the grant, and when to expand beyond Kedah.',bm:'Tambah pelan risiko: bagaimana jika peserta tarik diri, siapa pemilik model selepas geran, dan bila untuk berkembang ke luar Kedah.'},
 done:{en:'Added a risk section covering drop-outs, agencies not joining, delays, low turnout and trial problems. Each has a backup plan, such as finding a replacement from the same group.',bm:'Seksyen risiko ditambah: peserta tarik diri, agensi tidak menyertai, kelewatan, kehadiran rendah dan masalah percubaan. Setiap satu ada pelan sandaran, seperti mencari pengganti daripada kumpulan yang sama.'}},
{area:{en:'Partners',bm:'Rakan kerjasama'},s:'Candidate',where:'-',
 asked:{en:'Get a support letter from MAIK.',bm:'Dapatkan surat sokongan daripada MAIK.'},
 done:{en:'Meeting with MAIK set for October. We will add the letter when it is ready. Three partners have already agreed.',bm:'Pertemuan dengan MAIK ditetapkan pada Oktober. Surat akan ditambah apabila siap. Tiga rakan kerjasama telah bersetuju.'}}
];
K.reviewStatus = {
Verified:{en:'Done',bm:'Selesai'},
Candidate:{en:'In progress',bm:'Sedang dibuat'},
Demo:{en:'Later, at the workshop',bm:'Kemudian, di bengkel'}
};

/* ---------- Bahasa Melayu dictionary ----------
   English lives in the HTML; each [data-i18n] key maps to its BM text here. */
K.bm = {
  appWho:'Siapa yang menggunakan aplikasi ini?', appWhoBody:'Beberapa soalan mudah, satu demi satu.', appMyself:'Diri saya', appKAbout:'Tentang', appHowOld:'Berapakah umurnya?', appWhere:'Daerah', appKDaily:'Harian', appHard:'Apa yang sukar sekarang?', appHardBody:'Pilih semua yang berkaitan.', appDWalk:'Berjalan', appDBed:'Turun katil', appDBath:'Mandi', appDToilet:'Ke tandas', appKHelp:'Bantuan', appWhich:'Yang mana diperlukan?', appWhichBody:'Dicadangkan daripada jawapan. Pilih mana-mana.', appIBed:'Katil hospital', appSuggested:'Dicadangkan', appIChair:'Kerusi roda', appIDiapers:'Lampin dewasa', appINurse:'Rawatan di rumah', appKHow:'Cara', appHowCome:'Bagaimana setiap satu diperoleh?', appMBorrow:'Pinjam', appMRent:'Sewa', appMFund:'Bantuan bayaran', appMMonthly:'Bekalan bulanan', appMFree:'Percuma', appMakePlan:'Buat pelan', appKPlan:'Pelan anda', appMatched:'keperluan dipadankan', appPlanTitle:'Satu pelan untuk semuanya', appPlanBody:'3 tempat boleh meliputi semua 4 keperluan.', appCoord:'Seorang penyelaras memegang kes ini.', appSeeContacts:'Lihat siapa perlu dihubungi', appKContact:'Hubungi', appDirections:'Arah', appOpenMaps:'Buka di Google Maps', appPhoneLater:'Nombor telefon ditambah selepas semakan Fasa 1', appKTrip:'Satu perjalanan', appTripTitle:'Satu perjalanan ke semua tempat', appTripBody:'Satu perjalanan kereta boleh meliputi semua lawatan.', appR1:'Katil, kerusi roda, lampin', appR2:'Rawatan di rumah', appR3:'Bantuan sara hidup', appStartTrip:'Buka perjalanan di Maps', appKShare:'Keluarga', appShareBody:'Semua yang membantu melihat pelan yang sama.', appWhatsApp:'Hantar di WhatsApp', appListen:'Dengar pelan ini', appRemind3:'Ingatkan dalam 3 hari', appKFollow:'Susulan', appFollowTitle:'Bantuan dalam perjalanan', appTBed:'Katil hospital dipinjam', appTNurse:'Lawatan jururawat ditempah', appThursday:'Khamis', appTFollow:'Panggilan susulan', appIn3:'Dalam 3 hari',
  opt80:'80 dan ke atas', opt85:'85 dan ke atas', optLivesAlone:'Tinggal seorang diri', optWithFamily:'Bersama keluarga',
  modeGuided:'Soal jawab berpandu', modeQuick:'Demo pantas', wizDistrict:'Daerah', wizMukim:'Mukim / kawasan terdekat', fAgeBand:'Julat umur', fGender:'Jantina', fMukim:'Mukim / pekan', fLiving:'Cara tinggal', tryLabel:'Cuba:', appArea:'Kawasan', appTlReceived:'Permintaan diterima', appTlContacted:'Penyedia dihubungi', appTlArranged:'Bantuan diatur', appTlFollow:'Panggilan susulan', appTlCheckin:'Semakan selesai',
  wizAbout:'Tentang anda', wizAgeQ:'Berapakah umur anda?', wizAgeHelp:'Pilih julat umur. Anda tidak perlu ingat tarikh lahir yang tepat.',
  wiz85:'85 atau lebih', wizGenderQ:'Bagaimana kami patut merekod jantina anda?', wizWoman:'Perempuan',
  wizMan:'Lelaki', wizPreferNot:'Tidak mahu nyatakan', wizWhere:'Tempat tinggal anda',
  wizAreaQ:'Kawasan mana di Kedah?', wizAreaHelp:'Pilih daerah anda, kemudian mukim atau pekan yang paling dekat.', wizDaily:'Kehidupan harian',
  wizManageQ:'Bagaimana anda menguruskan kehidupan harian?', wizIndependent:'🟢 Saya boleh urus sendiri', wizSomeHelp:'🟡 Saya perlukan sedikit bantuan',
  wizRegularHelp:'🟠 Saya perlukan bantuan tetap', wizWhoQ:'Siapa yang ada untuk membantu anda?', wizLiveAlone:'Saya tinggal seorang diri',
  wizSpouse:'Suami / isteri', wizChildren:'Anak tinggal berdekatan', wizOtherFamily:'Ahli keluarga lain',
  wizFriends:'Kawan / jiran', wizNoHelp:'Tiada bantuan tetap', wizMoney:'Wang dan rumah',
  wizIncomeQ:'Berapakah anggaran pendapatan bulanan anda?', wizNoIncome:'Tiada pendapatan tetap', wizBelow1000:'Bawah RM1,000',
  wiz5000:'RM5,000 dan ke atas', wizFinQ:'Adakah anda menerima bantuan kewangan tetap?', wizPension:'Pencen',
  wizWelfare:'Bantuan kebajikan', wizChildFamily:'Anak / keluarga', wizZakat:'Zakat / Baitulmal',
  wizNoSupport:'Tiada sokongan tetap', wizLivingQ:'Di mana anda tinggal sekarang?', wizOwnAlone:'Rumah sendiri, seorang diri',
  wizWithSpouse:'Bersama suami / isteri', wizWithFamily:'Bersama anak / keluarga', wizCareHome:'Pusat jagaan',
  wizNeed:'Keperluan anda', wizNeedQ:'Apakah jenis bantuan yang anda cari?', wizNeedHelp:'Pilih satu atau lebih. Anda boleh ubah kemudian.',
  wizAccompany:'Orang untuk menemani saya', wizTransport:'Pengangkutan', wizHomeHelp:'Bantuan di rumah',
  wizFood:'Makanan / keperluan harian', wizFinHelp:'Bantuan kewangan / kebajikan', wizSoonQ:'Bilakah anda perlukan bantuan?',
  wizInfo:'Hanya mencari maklumat', wizWeeks:'Dalam beberapa minggu lagi', wizSoon:'Saya perlukan bantuan tidak lama lagi',
  wizUrgent:'Saya perlukan bantuan segera', wizBack:'Kembali', appChoiceHome:'Penjagaan di rumah',
  appChoiceTransport:'Pengangkutan', appChoiceFood:'Makanan / keperluan harian', appChoiceMoney:'Bantuan kewangan',
  appChoiceTalk:'Teman berbual', appSeeHelp:'Lihat bantuan yang ada', appPaweCap:'Aktiviti · sokongan rakan sebaya',
  appConfirmed:'✓ Disahkan', appJkmCap:'Penilaian · rujukan', appToCheck:'◐ Perlu disemak',
  appViewDetails:'Lihat butiran', appPaweLong:'Aktiviti sosial dan sokongan rakan sebaya', appPaweDays:'Alor Setar · Isn–Jum',
  appSampleNo:'04-700 2014 · Nombor contoh', appCallContact:'☎ Hubungi kenalan ini', appStartReferral:'Mulakan rujukan',
  appToday:'Hari ini', appPending:'Menunggu jawapan', appNotify:'Kami akan maklumkan anda',
  appKick7:'7 / 10 · Bantuan diterima', appHelpReceived:'Bantuan diterima', appOnWay:'Bantuan yang anda pilih sedang dalam perjalanan.',
  appWheelchair:'Bantuan kerusi roda', appProviderOk:'Penyedia telah mengesahkan permintaan anda.', appDelivery:'Penghantaran diatur bersama keluarga anda.',
  appKick8:'8 / 10 · Susulan', appStayUpdated:'Sentiasa dimaklumkan', appOnePlace:'Simpan permintaan dan mesej anda di satu tempat.',
  appNextWeek:'Minggu depan', appRemind:'Kami akan ingatkan anda', appKick9:'9 / 10 · Sokongan keluarga',
  appShareFamily:'Kongsi dengan keluarga', appTrusted:'Ahli keluarga yang dipercayai boleh membantu mengikuti permintaan.', appDaughter:'Anak perempuan ditambah',
  appCanView:'Boleh melihat kemas kini dan mesej penyedia.', appPrivacy:'Privasi kekal di bawah kawalan anda.', appKick10:'10 / 10 · Hari yang lebih baik',
  appLiveSupport:'Hidup dengan lebih banyak sokongan', appSmallSteps:'Langkah kecil boleh menjadikan hidup harian lebih selamat dan mudah.', wizNoteLabel:'Ada apa-apa lagi yang anda mahu kami tahu?',
  peopleTitle:'Bantuan harian, dekat dengan rumah', peopleSub:'Orang yang projek ini bantu, dan jenis bantuan yang patut sampai kepada mereka.',
  peopleEasyT:'Mudah untuk meminta', peopleEasyB:'Satu telefon, butang besar, perkataan mudah.',
  peopleFamilyT:'Keluarga tetap dekat', peopleFamilyB:'Anak-anak boleh membantu dari dekat atau jauh.',
  peopleCompanyT:'Ada teman berbual', peopleCompanyB:'Sukarelawan datang melawat dan mendengar.',
  peopleAdviceT:'Nasihat yang jelas', peopleAdviceB:'Pegawai menerangkan bantuan yang boleh diterima.',
  peoplePhoneT:'Bantuan guna telefon', peoplePhoneB:'Orang muda tunjukkan caranya kepada warga emas.',
  storyEcosystem:'Keperluan dan pembantu bertemu di satu meja.', storyNetwork:'Bantuan dipadankan ikut daerah, dekat dengan rumah.',
  storyScenario:'Seorang warga emas, satu keperluan, satu laluan yang jelas.', storyRoadmap:'Sembilan bulan, empat fasa, dirancang bersama.',
  storyEvidence:'Kami mula dengan mendengar warga emas.', storyData:'Rekod mudah yang sesiapa pun boleh semak.',
  storyApp:'Dibina untuk warga emas, dan keluarga yang membantu.',
  appReset:'Mula semula',
  appStatusContinue:'Teruskan',
  appWelcomeFamily:'Saya membantu orang lain',
  appWelcomeCta:'Cari bantuan',
  fSearch:'Cari',
  workedGo:'Cuba kes anda sendiri',
  workedLabel:'Tiga langkah yang sama untuk satu kes',
  appHelpTitle:'Bantuan di sebalik satu sentuhan', helpTransport:'Pengangkutan ke temu janji', helpMeals:'Makanan dihantar ke rumah', helpHome:'Bantuan di rumah', helpHealth:'Lawatan kesihatan', helpMasjid:'Masjid dan komuniti', helpCompany:'Teman berbual',
  metaGrant:'Geran', heroArtSoon:'Imej akan datang: pasangan warga emas Kedah di rumah',
/* overview */
eyebrow:'Geran Penyelidikan Scale-Up UUM 2026',
title:'Penjagaan Islam bersepadu untuk warga emas di Kedah',
lede:'Ramai warga emas perlukan bantuan daripada beberapa pihak serentak. Kami hubungkan mereka dengan badan Islam, agensi kebajikan, perkhidmatan kesihatan dan sukarelawan di Kedah, dan tunjukkan di mana hubungan itu putus.',
metaAsk:'Jumlah',metaDur:'Tempoh',metaDurV:'9 bulan',metaPeriod:'Tarikh',metaSite:'Lokasi',
officialLabel:'Tajuk rasmi:',
ctaWalk:'Lihat cara ia berfungsi',ctaScenario:'Cuba satu kes',
sceneCaption:'Bantuan patut sampai ke tempat mereka tinggal.',
consTitle:'Siapa boleh membantu seorang warga emas',
consCap:'Setiap titik ialah satu organisasi dalam senarai kami. Yang sudah disahkan berada dekat tengah. Gelang luar masih perlu disemak atau hanya contoh. Tekan satu keperluan untuk melihat siapa boleh membantu, atau klik titik untuk butiran.',
kpi1:'objektif kajian',kpi2:'fasa projek',kpi3:'warga emas ditemu bual',kpi4:'peserta bengkel reka bentuk',kpi5:'ahli panel penilai',
partnersLabel:'Rakan kerjasama',imgPeopleEyebrow:'Utamakan manusia',imgPeopleTitle:'Dashboard yang bermula dengan kehidupan sebenar',imgPeopleBody:'Orang yang berbeza perlukan jenis sokongan yang berbeza. Adegan ini memastikan warga emas kekal di tengah-tengah penyelidikan.',
caseEyebrow:'Apa yang kami ingin lakukan',objectivesLabel:'Apa yang kami ingin lakukan',dashboardIndexLabel:'Indeks dashboard',caseTitle:'Satukan bantuan untuk seorang warga emas',
caseSub:'Kami hubungkan agensi supaya seorang warga emas dapat bantuan yang betul.',
problemTag:'Masalah',problemQuote:'Seorang warga emas mungkin perlukan beberapa jenis bantuan. Setiap agensi hanya uruskan bahagiannya sendiri.',
problemBody:'Kedah sudah ada agensi dan programnya. Yang tiada ialah hubungan antara mereka, jadi keperluan tercicir apabila rujukan, syarat atau kekurangan kakitangan menghalang.',
responseTag:'Pelan kami',responseTitle:'Lima langkah ke arah model yang teruji',
responseBody:'Kami petakan siapa buat apa, dengar suara warga emas, reka model bersama agensi, kemudian uji dengan pakar dan satu percubaan kecil.',
step1:'Petakan',step1s:'Siapa buat apa sekarang',step2:'Dengar',step2s:'Keperluan warga emas',step3:'Reka',step3s:'Model bersama',step4:'Uji',step4s:'Pakar dan percubaan kecil',step5:'Baiki',step5s:'Sedia untuk negeri lain',
pitchEyebrow:'Apa yang akan kami hasilkan',pitchTitle:'Lima hasil, satu bagi setiap objektif',
pitchSub:'Setiap hasil siap pada akhir fasanya.',
due3:'Menjelang bulan 3',due5:'Menjelang bulan 5',due7:'Menjelang bulan 7',due8:'Bulan 8',due9:'Bulan 9',
o1title:'Peta perkhidmatan semasa',o1body:'Siapa yang aktif, apa yang ditawarkan, bagaimana mereka berhubung dan di mana jurangnya.',
o2title:'Keperluan warga emas',o2body:'Tema utama daripada temu bual dengan 8–10 warga emas Muslim.',
o3title:'Model penjagaan bersepadu',o3body:'Model yang dibina bersama agensi, menghubungkan bantuan Islam, kesihatan dan komuniti.',
o4title:'Laporan penilaian pakar',o4body:'Skor dan ulasan pakar tentang sama ada model ini relevan, boleh dilaksana dan sedia digunakan.',
o5title:'Model akhir dan pelan',o5body:'Model yang diperbaiki dan pelan untuk menggunakannya di luar Kedah.',
impactTag:'Matlamat kami',impactBody:'Penjagaan yang tersusun, sesuai dengan agama dan budaya warga emas, dan berkekalan.',
teamEyebrow:'Pasukan',teamTitle:'Enam penyelidik dari UUM',
teamSub:'Dari Pusat Pengajian Ekonomi, Kewangan dan Perbankan (SEFB), UUM. Kami telah mengkaji penuaan di Malaysia lebih sepuluh tahun.',
trackTitle:'Kami bina atas empat kajian terdahulu. Tiga daripadanya melibatkan 2,966 orang keseluruhannya.',
plansEyebrow:'Selari dengan dasar',plansTitle:'Ia menyokong pelan negara dan negeri ini',
plansSub:'Seperti yang ditanda dalam borang permohonan.',
walkEyebrow:'Seterusnya',walkTitle:'Indeks dashboard',
walkSub:'Setiap halaman menjawab satu soalan. Guna kekunci anak panah untuk beralih halaman.',

/* how it works */
ecoTitle:'Bagaimana warga emas dipadankan dengan bantuan',
ecoSub:'Tiga bahagian: apa keperluan warga emas, siapa boleh membantu, dan langkah yang memadankan keduanya. Ia juga menunjukkan bantuan yang masih tiada.',
ecoStat:'jenis data yang kami kumpul',
flowEyebrow:'Cara ia berfungsi',flowTitle:'Keperluan, padanan, bantuan',
demand:'Warga emas',profile:'Maklumat diri',profileSub:'Umur, daerah, pendapatan, isi rumah, kesihatan, kehendak',
needs:'Apa yang diperlukan',needsSub:'Pengangkutan, teman, makanan, penjagaan di rumah, kebajikan, kesihatan',
context:'Had',contextSub:'Kelayakan, jarak, tempat kosong, rujukan dan kos',
engineCircle:'PADAN',engineTitle:'Langkah padanan',engineBody:'Mencari siapa boleh membantu, ikut syarat, lokasi, tempat kosong dan tahap kecemasan.',
engineTipTitle:'Apa fungsi kotak ini',engineTipBody:'Ia menukar keperluan seseorang kepada senarai ringkas siapa boleh membantu, dan sebabnya.',
chipNeed:'Keperluan sesuai',chipDistrict:'Daerah sama',chipCapacity:'Ada kekosongan',chipReferral:'Rujukan',
supply:'Siapa boleh membantu',institutions:'Agensi',providers:'Penyedia penjagaan',providersSub:'Kesihatan · penjagaan di rumah · takaful · NGO · komuniti',
fitEyebrow:'Kedudukannya',fitTitle:'Ia menambah sistem negara, bukan menggantikannya',
fitSub:'Ini Rajah 2 dalam permohonan, dalam empat lapisan.',
volunteers:'Sukarelawan',volunteersSub:'Teman, pengangkutan, lawatan dan bantuan harian',
pathway:'Hasil',pathwaySub:'Bantuan yang sesuai, ke mana dirujuk, dan keperluan yang belum dipenuhi',
dataEyebrow:'Data',dataTitle:'Tiga senarai di sebalik padanan',
dataSub:'Senarai ini menyimpan semua yang diperlukan untuk padanan. Dalam Fasa 1 kami isikan dengan data yang telah disemak.',
dataNote:'Ini rekod contoh. Rekod yang masih perlu disemak atau hanya contoh ditanda dengan jelas.',

/* who can help */
netTitle:'30 organisasi yang boleh membantu',
netSub:'Senarai contoh untuk menunjukkan cara padanan berfungsi. Setiap satu ditanda disahkan, perlu disemak atau contoh, supaya tiada yang menyangka ia senarai lengkap Kedah.',
netStat:'disahkan setakat ini',
fType:'Jenis',fDistrict:'Daerah',fStatus:'Status',
optAllTypes:'Semua jenis',optInst:'Agensi',optNGO:'NGO',optMosque:'Masjid',optProvider:'Penyedia penjagaan',optVolunteer:'Kumpulan sukarelawan',
optAllDistricts:'Semua daerah',optAllStatus:'Semua status',optVerified:'Disahkan',optCandidate:'Perlu disemak',optDemo:'Contoh',
thOrg:'Organisasi',thType:'Jenis',thDistrict:'Daerah',thCap:'Apa yang mereka buat',thStatus:'Status',
pitchTipLabel:'Semasa membentang:',pitchTip:'mulakan dengan yang ditanda "perlu disemak". Fasa 1 menyemak perkhidmatan, kelayakan, tempat kosong, hubungan dan langkah rujukan setiap satu.',
chartTag:'Ikut daerah',chartTitle:'Organisasi di setiap daerah',chartNote:'Bar mengikut penapis di atas. Halakan tetikus pada bar untuk melihat bilangan.',
chainTag:'Apa yang akan diuji',chainTitle:'Bagaimana rujukan sepatutnya berjalan',
chain1:'Warga emas',chain1s:'Keperluan, daerah dan kelayakan mereka',chain2:'Seorang penyelaras',chain2s:'Satu tempat hubungan untuk bantuan kebajikan, kesihatan dan komuniti',
chain3:'Pasukan bantuan',chain3s:'Penyedia penjagaan, sukarelawan dan bantuan kewangan',chainLink:'Belum diuji',
chainNote:'Kami mahu tahu siapa yang ada, dan bagaimana seseorang dirujuk dari satu pihak ke pihak lain.',

/* try a case */
labTitle:'Gambarkan seorang warga emas. Dapatkan satu pelan.',labSub:'Jawab soalan mudah tentang seorang warga emas di Kedah. Setiap jawapan masuk ke dalam satu kes, dan kes itu menjadi pelan bantuan yang mungkin.',
labStat:'jenis bantuan yang boleh dipadankan',
presetLabel:'Contoh simulasi',
scoreTipTitle:'Cara skor dikira',scoreTipBody:'Mulakan dengan profil warga emas. Tambah atau tolak pelarasan bagi setiap keperluan, daerah dan pendapatan. Beberapa keperluan turut mengambil kira penyelarasan. Skor contoh akhir dihadkan antara 20 hingga 96.',
personaLabel:'Warga emas',districtLabel:'Daerah',needLabel:'Keperluan',incomeLabel:'Pendapatan isi rumah sebulan',
pIndependent:'Boleh urus diri sendiri',pVulnerable:'Perlukan sedikit bantuan',pHighneed:'Perlukan banyak bantuan',
nCompanion:'Teman atau iringan ke hospital',nTransport:'Pengangkutan',nHomecare:'Penjagaan di rumah',nWelfare:'Bantuan wang atau kebajikan',nFood:'Makanan',
coverageLabel:'Sejauh mana keperluan dipenuhi',demoTag:'Data contoh sahaja',matchedNeeds:'Keperluan yang ada bantuan',steps:'Bilangan rujukan',
noticeTitle:'Padanan di sini ialah contoh.',
noticeBody:'Nama organisasi datang daripada senarai kami, dan setiap satu kekal dengan statusnya (Disahkan, Perlu disemak atau Contoh). Apa yang setiap satu boleh tawarkan ialah contoh sehingga Fasa 1 menyemaknya. Pelan ini hanya menunjukkan padanan yang mungkin; ia tidak menjanjikan bantuan atau menentukan kelayakan.',
confirmedLabel:'Disahkan dalam senarai kami',
workingLabel:'Cara skor ini dibina',
compareLabel:'Setiap daerah',
caseRecordLabel:'Kes yang boleh diulang',caseRulesLabel:'Versi peraturan',caseCopy:'Salin ringkasan kes',caseCopied:'Ringkasan kes disalin',caseCopyError:'Tidak dapat menyalin. Pilih dan salin teks secara manual.',imgCaseEyebrow:'Cuba satu kes',imgCaseTitle:'Sokongan boleh terasa lebih manusiawi',imgCaseBody:'Gunakan soalan berpandu di bawah untuk menukar situasi sebenar kepada laluan yang jelas dan mudah diterangkan.',
methodNote:'Skor bermula daripada jenis warga emas, kemudian berubah ikut keperluan, daerah dan pendapatan. Ia menunjukkan cara logik berfungsi, bukan anggaran sebenar.',
pathLabel:'Langkah dicadangkan',providersLabel:'Siapa boleh membantu',gapLabel:'Masalah utama untuk disemak',routeTitle:'Laluan bantuan anda',routeIntro:'Pandangan ringkas daripada keperluan kepada hubungan yang boleh dicuba.',routeDemo:'Laluan contoh',routeRequest:'Permintaan anda',routeSteps:'Langkah dicadangkan',routeContacts:'Hubungan yang boleh dicuba',routeNote:'Ini ialah demonstrasi. Semak organisasi dan nombor hubungan sebelum membuat rujukan.',journeyLabel:'Perjalanan dalam satu gambar',journeyTitle:'Daripada satu sentuhan telefon kepada bantuan di rumah',journeyCaption:'Contoh ringkas untuk warga emas dan keluarga mereka.',
appTitle:'Aplikasi Silver Kami',appLede:'Cuba aplikasi simulasi untuk warga emas yang mencari bantuan.',appStat:'skrin simulasi interaktif',appBadge:'Idea aplikasi masa depan',appLaunch:'Mula simulasi',appBack:'Kembali',appNext:'Seterusnya',appDone:'Lihat hasil padanan',appIntroTitle:'Satu sentuhan lebih dekat kepada bantuan.',appIntroBody:'Cuba telefon di bawah. Ia menunjukkan aplikasi yang sedang dibina melalui dashboard ini.',appStoryboardLabel:'Papan cerita',appStoryboardTitle:'Inilah rupa aplikasi pada telefon',appStoryTitle:'Dibuat untuk warga emas.',appStoryBody:'Aliran yang sama seperti Cuba satu kes: butang besar, satu soalan pada satu masa, satu pelan untuk semua keperluan, dan tempat yang terus dibuka di Google Maps.',appStoryPoint1:'Bahasa Melayu dan Inggeris',appStoryPoint2:'Butang sentuhan besar',appStoryPoint3:'Kurang menaip',appStoryPoint4:'Status yang jelas',appWelcomePill:'SELAMAT DATANG',appWelcomeTitle:'Apa yang boleh memudahkan hari anda?',appWelcomeBody:'Pilih satu perkara. Kami bantu anda cari sokongan berdekatan.',appWelcomeTrust:'Mudah dan peribadi',appProfileTitle:'Maklumat diri',appProfileBody:'Maklumat ringkas membantu kami mencari bantuan yang dekat.',appNeedTitle:'Apa yang anda perlukan?',appNeedBody:'Pilih satu atau lebih keperluan.',appMatchTitle:'Padanan bantuan',appMatchBody:'Berdasarkan jawapan anda.',appProviderTitle:'Butiran penyedia',appProviderBody:'Semak perkhidmatan, status dan cara menghubungi.',appStatusTitle:'Status permohonan',appStatusBody:'Anda boleh ikuti rujukan anda di sini.',appMockNote:'Ini simulasi reka bentuk, bukan aplikasi sebenar. Data dan nombor telefon ialah contoh.',

/* plan & budget */
roadTitle:'Pelan 9 bulan',
roadLede:'Empat fasa dan satu hasil bagi setiap objektif, dengan RM30,000.',
roadStat:'selama 9 bulan',imgRoadEyebrow:'Daripada pelan kepada amalan',imgRoadTitle:'Jadikan kerja ini mudah dilihat',imgRoadBody:'Peta jalan menghubungkan pelan penyelidikan dengan orang dan sumber yang diperlukan untuk melaksanakannya.',
ganttEyebrow:'Garis masa',ganttTitle:'Apa berlaku setiap bulan',
mon1:'Nov',mon2:'Dis',mon5:'Mac',mon7:'Mei',
objN1:'Objektif 1',objN2:'Objektif 2',objN3:'Objektif 3',objN4:'Objektif 4',objN5:'Objektif 5',
ph1:'Fasa 1',ph2:'Fasa 2',ph3:'Fasa 3',ph4:'Fasa 4',
obj1:'Petakan perkhidmatan semasa',obj2:'Kenal pasti keperluan warga emas',obj3:'Reka model bersama agensi',obj4:'Uji model',obj5:'Baiki dan siapkan',
act1:'Baca dasar dan laporan, dan temu bual badan Islam, agensi kebajikan dan NGO',
act2:'Temu bual 8–10 warga emas Muslim dan kenal pasti tema utama',
act3:'Bengkel bersama 15–20 orang untuk bersetuju tentang peranan, pembiayaan, peraturan dan langkah rujukan',
act4:'Pakar menilai model, kemudian kami jalankan percubaan kecil proses rujukan',
act5:'Kemas kini model berdasarkan skor pakar dan hasil percubaan',
out1:'Peta perkhidmatan semasa',out2:'Keperluan dan masalah utama',out3:'Draf model',out4:'Model disemak dan maklum balas percubaan',out5:'Model akhir dan laporan',
lgActive:'Bulan bekerja',lgOutput:'Hasil siap',
roadSub:'Daripada Jadual 2 borang permohonan dan imej peta jalan. Objektif 4 dan 5 kedua-duanya dalam Fasa 4. Selangor dan Kuala Lumpur mungkin dijadikan perbandingan.',
wsTag:'Bengkel reka bentuk · Fasa 3',wsTitle:'Siapa yang terlibat',
wsBody:'15–20 orang daripada kumpulan ini. Mereka melihat dapatan, bersetuju tentang keutamaan, peranan, pembiayaan, peraturan dan langkah rujukan, kemudian membina model bersama.',
wsNgo:'NGO penjagaan warga emas',wsHealth:'Penyedia kesihatan',wsReligious:'Pemimpin agama',wsAcademic:'Ahli akademik',wsOlder:'Wakil warga emas',
valTag:'Penilaian pakar · Fasa 4',valTitle:'Bagaimana panel menilai model',
valBody:'Panel 10 orang daripada MAIK, LZNK, JKM, NGO, pemimpin komuniti, penyedia takaful dan universiti memberi skor untuk setiap bahagian model dan menulis ulasan.',
crit1:'Relevan',crit2:'Boleh dilaksana',crit3:'Praktikal',crit4:'Kesediaan agensi',
riskLabel:'Risiko utama: masa (sederhana)',
riskBody:'Orang yang sibuk mungkin terlepas bengkel. Jadi kami jemput lebih ramai dan lebih awal, sediakan wakil ganti dari setiap kumpulan, fleksibel tentang tarikh dan libatkan agensi utama sebagai rakan. Risiko teknikal dan bajet rendah.',
m1:'skor setiap item',m2:'purata untuk seluruh model',
pilotTag:'Percubaan kecil',pilotTitle:'Apa yang disemak dalam percubaan',
pilotBody:'Selepas penilaian pakar, kami cuba sebahagian model secara kecil, terutamanya cara agensi merujuk warga emas antara satu sama lain.',
pc1:'Adakah ia berfungsi',pc2:'Adakah ia diterima',pc3:'Adakah peranan jelas',pc4:'Apa yang menghalang',pc5:'Apa perlu diperbaiki',
budgetEyebrow:'Bajet',budgetTitle:'Bagaimana RM30,000 dibelanjakan',
budgetSub:'Sebahagian besar untuk membayar pasukan projek selama sembilan bulan. Bakinya untuk perjalanan, dua bengkel, token peserta, percetakan, pemfailan hak cipta dan yuran RMC 3%.',
totalLabel:'Jumlah',totalSub:'Untuk 9 bulan, 1 Nov 2026 hingga 31 Jul 2027',
budgetNote:'Angka daripada bahagian bajet (Bahagian I) borang permohonan yang disemak: Vot 11000, 21000 dan 29000.',

/* sources */
evTitle:'Dari mana fakta ini datang',
evLede:'Setiap angka di sini datang daripada permohonan yang disemak dan jawapan kami kepada penilai. Di bawah ialah dokumen tersebut, dan apa yang kami ubah selepas setiap ulasan.',
evStat:'ulasan penilai selesai',
srcEyebrow:'Dokumen',srcTitle:'Empat dokumen di sebalik dashboard ini',imgEvidenceEyebrow:'Bukti bermula dengan mendengar',imgEvidenceTitle:'Penyelidikan kekal dekat dengan pengalaman hidup',imgEvidenceBody:'Dokumen menunjukkan janji projek. Perbualan dengan komuniti menunjukkan sama ada model ini sesuai dengan kehidupan harian warga emas.',
srcSub:'Borang permohonan dan jawapan kepada penilai ialah sumber utama.',
kindForm:'Permohonan',kindReview:'Penilaian',kindConcept:'Idea',kindRoadmap:'Pelan',
src1d:'Disemak 28 September 2026 · 23 halaman',src2:'Jawapan kepada penilai',src2d:'28 September 2026 · 5 halaman',
src3:'Perbincangan idea awal',src3d:'Cara platform dan padanan sepatutnya berfungsi',
src4:'Imej peta jalan',src4d:'Daripada percubaan Kedah kepada dasar yang lebih luas',
revEyebrow:'Ulasan penilai',revTitle:'Apa penilai minta dan apa kami ubah',
revSub:'Daripada jadual jawapan bertarikh 28 September 2026. Nombor halaman merujuk kepada permohonan yang disemak.',
thNo:'Bil.',thArea:'Topik',thAsked:'Apa yang diminta',thDone:'Apa kami buat',thWhere:'Halaman',thState:'Status',
verdictTag:'Keputusan keseluruhan',
verdictQuote:'"Cadangan ini disyorkan dengan sedikit penambahbaikan pada metodologi, hasil projek, pelan pelaksanaan dan butiran bajet."',
verdictCite:'Penilai 2, ulasan keseluruhan (terjemahan)',

/* data blueprint */
dpTitle:'Apa yang dashboard perlukan untuk berfungsi',
dpLede:'Skor di sini guna logik contoh. Lembaran ini menyenaraikan data yang perlu kami kumpul, semak dan kemas kini sebelum ia boleh digunakan secara sebenar.',
dpStat:'lembaran workbook berkaitan',
dpNoticeTitle:'Data contoh sahaja',
dpNoticeBody:'Workbook ini mengandungi profil, keperluan, daerah, penyedia, hubungan dan rujukan contoh yang saling berkaitan. Nombor telefon dan jumlah bantuan ialah rekaan. Rekod sebenar hanya dimasukkan selepas persetujuan, peraturan data dan semakan sumber diluluskan.',
dpHeroLabel:'Muat turun workbook',dpHeroTitle:'Satu workbook yang menghubungkan setiap warga emas dengan bantuan di sekelilingnya.',
dpHeroBody:'Setiap lembaran menyatakan siapa yang mengisinya, berapa kerap ia dikemas kini dan bahagian dashboard yang menggunakannya.',
dpDownload:'Muat turun fail Excel',
dp1t:'Profil warga emas',dp1b:'Siapa yang minta bantuan, di mana mereka tinggal dan cara mereka mahu dihubungi.',dp1o:'Diurus oleh pasukan lapangan · dikemas kini semasa lawatan pertama',
dp2t:'Penilaian keperluan',dp2b:'Seorang warga emas boleh ada lebih daripada satu keperluan, setiap satu dengan tahap kecemasan dan buktinya.',dp2o:'Diurus oleh penilai · dikemas kini setiap kali disemak semula',
dp3t:'Isi rumah dan kelayakan',dp3b:'Pendapatan, sokongan keluarga, bantuan sedia ada dan syarat untuk menentukan siapa layak.',dp3o:'Diurus oleh rakan kebajikan · dikemas kini setiap 3 bulan',
dp4t:'Penyedia dan perkhidmatan',dp4b:'Siapa boleh membantu, apa yang mereka tawarkan, di mana mereka beroperasi dan sama ada mereka ada kekosongan.',dp4o:'Diurus oleh ketua rangkaian · dikemas kini setiap bulan',
dp5t:'Rujukan dan hasil',dp5b:'Setiap rujukan, maklum balas, masa menunggu dan hasil, supaya kami tahu sama ada padanan berjaya.',dp5o:'Diurus oleh penyelaras · dikemas kini selepas setiap rujukan',
dp6t:'Senarai dan pemarkahan',dp6b:'Senarai tetap dan pemberat terbuka yang menukar data yang disemak kepada skor.',dp6o:'Diurus oleh pasukan penyelidik · setiap perubahan diberi nombor versi',
dpMapLabel:'Peta lembaran',dpMapTitle:'Cara setiap lembaran menyumbang kepada dashboard',dpMapTag:'Baris contoh sahaja',
dpThSheet:'Lembaran workbook',dpThQ:'Soalan yang dijawab',dpThUse:'Digunakan dalam dashboard',dpThRef:'Dikemas kini sekurang-kurangnya',dpSheet1:'Profil warga emas',dpSheet2:'Penilaian keperluan',dpSheet3:'Kelayakan isi rumah',dpSheet4:'Penyedia dan perkhidmatan',dpSheet5:'Rujukan dan hasil',dpSheet6:'Rujukan pemberat',
dpR1q:'Siapa perlukan bantuan?',dpR1u:'Pilihan warga emas, peta daerah',dpR1r:'Semasa lawatan pertama',
dpR2q:'Apa yang warga emas ini perlukan?',dpR2u:'Pilihan keperluan, langkah dicadangkan',dpR2r:'Setiap kali disemak semula',
dpR3q:'Apakah had yang terpakai?',dpR3u:'Pelarasan skor, masalah utama',dpR3r:'Setiap 3 bulan',
dpR4q:'Siapa boleh membantu di sini?',dpR4u:'Siapa boleh membantu, bilangan disahkan',dpR4r:'Setiap bulan',
dpR5q:'Adakah bantuan sampai?',dpR5u:'Skor hasil, masa menunggu',dpR5r:'Selepas setiap rujukan',
dpR6q:'Bagaimana skor dikira?',dpR6u:'Semua skor dalam dashboard',dpR6r:'Setiap versi baharu'
};

})(window.KSE);

