import {
  DomesticYearlyStat,
  StateTourismStat,
  SpendingComponent,
  VisitPurpose,
  InternationalArrival,
  CountrySource,
  StateVisitorHistory,
  TPIEntry,
  DestinationItem,
  TourismOpportunity,
  KeyInsight,
} from '../types';

// Data Tahunan Pelancongan Domestik Malaysia (DOSM Domestic Tourism Survey)
export const domesticYearlyStats: DomesticYearlyStat[] = [
  {
    year: 2019,
    visitorsMillion: 239.1,
    tripsMillion: 332.4,
    expenditureBillionRM: 103.2,
    avgSpendPerTripRM: 311,
    avgStayDays: 2.52,
  },
  {
    year: 2020,
    visitorsMillion: 131.7,
    tripsMillion: 147.0,
    expenditureBillionRM: 40.4,
    avgSpendPerTripRM: 275,
    avgStayDays: 2.36,
  },
  {
    year: 2021,
    visitorsMillion: 66.0,
    tripsMillion: 72.4,
    expenditureBillionRM: 18.4,
    avgSpendPerTripRM: 254,
    avgStayDays: 2.18,
  },
  {
    year: 2022,
    visitorsMillion: 171.6,
    tripsMillion: 207.8,
    expenditureBillionRM: 64.1,
    avgSpendPerTripRM: 308,
    avgStayDays: 2.55,
  },
  {
    year: 2023,
    visitorsMillion: 213.7,
    tripsMillion: 261.6,
    expenditureBillionRM: 84.9,
    avgSpendPerTripRM: 325,
    avgStayDays: 2.45,
  },
  {
    year: 2024,
    visitorsMillion: 242.4,
    tripsMillion: 301.2,
    expenditureBillionRM: 98.6,
    avgSpendPerTripRM: 327,
    avgStayDays: 2.48,
  },
];

// Data Pecahan Mengikut 16 Negeri/Wilayah Persekutuan (DOSM 2023-2024 Baseline)
export const stateTourismStats: StateTourismStat[] = [
  {
    stateCode: 'SGR',
    stateName: 'Selangor',
    visitorsMillion: 27.6,
    expenditureBillionRM: 12.8,
    hotelOccupancyRate: 58.4,
    avgStayDays: 2.1,
    topPurpose: 'Membeli-belah & Percutian',
    sharePercent: 12.9,
  },
  {
    stateCode: 'KUL',
    stateName: 'W.P. Kuala Lumpur',
    visitorsMillion: 22.2,
    expenditureBillionRM: 14.5,
    hotelOccupancyRate: 64.2,
    avgStayDays: 2.4,
    topPurpose: 'Membeli-belah & Perniagaan',
    sharePercent: 10.4,
  },
  {
    stateCode: 'SWK',
    stateName: 'Sarawak',
    visitorsMillion: 17.9,
    expenditureBillionRM: 7.9,
    hotelOccupancyRate: 52.8,
    avgStayDays: 3.2,
    topPurpose: 'Melawat Saudara & Eko-pelancongan',
    sharePercent: 8.4,
  },
  {
    stateCode: 'PRK',
    stateName: 'Perak',
    visitorsMillion: 17.1,
    expenditureBillionRM: 6.8,
    hotelOccupancyRate: 51.5,
    avgStayDays: 2.2,
    topPurpose: 'Melawat Saudara & Gastronomi',
    sharePercent: 8.0,
  },
  {
    stateCode: 'PHG',
    stateName: 'Pahang',
    visitorsMillion: 16.0,
    expenditureBillionRM: 7.6,
    hotelOccupancyRate: 67.8,
    avgStayDays: 2.6,
    topPurpose: 'Percutian Tanah Tinggi & Pantai',
    sharePercent: 7.5,
  },
  {
    stateCode: 'JHR',
    stateName: 'Johor',
    visitorsMillion: 15.8,
    expenditureBillionRM: 7.4,
    hotelOccupancyRate: 54.1,
    avgStayDays: 2.3,
    topPurpose: 'Taman Tema & Membeli-belah',
    sharePercent: 7.4,
  },
  {
    stateCode: 'PNG',
    stateName: 'Pulau Pinang',
    visitorsMillion: 14.9,
    expenditureBillionRM: 8.2,
    hotelOccupancyRate: 65.7,
    avgStayDays: 2.7,
    topPurpose: 'Warisan, Gastronomi & Kesihatan',
    sharePercent: 7.0,
  },
  {
    stateCode: 'SBH',
    stateName: 'Sabah',
    visitorsMillion: 13.8,
    expenditureBillionRM: 6.9,
    hotelOccupancyRate: 56.3,
    avgStayDays: 3.4,
    topPurpose: 'Eko-pelancongan, Pulau & Gunung',
    sharePercent: 6.5,
  },
  {
    stateCode: 'MLK',
    stateName: 'Melaka',
    visitorsMillion: 12.4,
    expenditureBillionRM: 5.6,
    hotelOccupancyRate: 62.0,
    avgStayDays: 2.1,
    topPurpose: 'Tahun Melawat Melaka & Sejarah',
    sharePercent: 5.8,
  },
  {
    stateCode: 'KDH',
    stateName: 'Kedah',
    visitorsMillion: 11.7,
    expenditureBillionRM: 4.8,
    hotelOccupancyRate: 53.6,
    avgStayDays: 2.5,
    topPurpose: 'Langkawi & Santai Luar Bandar',
    sharePercent: 5.5,
  },
  {
    stateCode: 'TRG',
    stateName: 'Terengganu',
    visitorsMillion: 10.5,
    expenditureBillionRM: 4.1,
    hotelOccupancyRate: 50.2,
    avgStayDays: 2.6,
    topPurpose: 'Pulau Peranginan & Budaya',
    sharePercent: 4.9,
  },
  {
    stateCode: 'KTN',
    stateName: 'Kelantan',
    visitorsMillion: 9.8,
    expenditureBillionRM: 3.4,
    hotelOccupancyRate: 46.9,
    avgStayDays: 2.0,
    topPurpose: 'Melawat Saudara & Makanan Tradisi',
    sharePercent: 4.6,
  },
  {
    stateCode: 'NSN',
    stateName: 'Negeri Sembilan',
    visitorsMillion: 9.2,
    expenditureBillionRM: 3.2,
    hotelOccupancyRate: 48.7,
    avgStayDays: 2.0,
    topPurpose: 'Port Dickson & Santai Keluarga',
    sharePercent: 4.3,
  },
  {
    stateCode: 'PLS',
    stateName: 'Perlis',
    visitorsMillion: 3.1,
    expenditureBillionRM: 0.9,
    hotelOccupancyRate: 43.1,
    avgStayDays: 1.8,
    topPurpose: 'Agro-pelancongan & Transit Sempadan',
    sharePercent: 1.5,
  },
  {
    stateCode: 'PJY',
    stateName: 'W.P. Putrajaya',
    visitorsMillion: 2.4,
    expenditureBillionRM: 0.8,
    hotelOccupancyRate: 59.2,
    avgStayDays: 1.6,
    topPurpose: 'MICE, Lawatan Kerajaan & Rekreasi',
    sharePercent: 1.1,
  },
  {
    stateCode: 'LBN',
    stateName: 'W.P. Labuan',
    visitorsMillion: 1.4,
    expenditureBillionRM: 0.6,
    hotelOccupancyRate: 47.5,
    avgStayDays: 2.3,
    topPurpose: 'Perniagaan Luar Pesisir & Bebas Cukai',
    sharePercent: 0.7,
  },
];

// Komponen Perbelanjaan Pelancongan Domestik (DOSM)
export const spendingComponents: SpendingComponent[] = [
  {
    category: 'Membeli-belah',
    categoryEn: 'Shopping',
    percentage: 36.3,
    amountBillionRM: 35.8,
    color: '#2563eb', // Blue
  },
  {
    category: 'Makanan & Minuman',
    categoryEn: 'Food & Beverage',
    percentage: 16.3,
    amountBillionRM: 16.1,
    color: '#059669', // Emerald
  },
  {
    category: 'Bahan Api Kenderaan / Petrol',
    categoryEn: 'Automotive Fuel',
    percentage: 14.8,
    amountBillionRM: 14.6,
    color: '#d97706', // Amber
  },
  {
    category: 'Penginapan',
    categoryEn: 'Accommodation',
    percentage: 13.7,
    amountBillionRM: 13.5,
    color: '#7c3aed', // Purple
  },
  {
    category: 'Pengangkutan Lain & Tiket',
    categoryEn: 'Other Transport',
    percentage: 9.4,
    amountBillionRM: 9.3,
    color: '#0891b2', // Cyan
  },
  {
    category: 'Aktiviti Hiburan & Rekreasi',
    categoryEn: 'Entertainment & Recreation',
    percentage: 5.5,
    amountBillionRM: 5.4,
    color: '#e11d48', // Rose
  },
  {
    category: 'Pakej Pelancongan & Pelbagai',
    categoryEn: 'Travel Packages & Misc',
    percentage: 4.0,
    amountBillionRM: 3.9,
    color: '#64748b', // Slate
  },
];

// Tujuan Utama Lawatan Domestik (DOSM)
export const visitPurposes: VisitPurpose[] = [
  {
    purpose: 'Melawat Saudara-mara & Rakan (VFR)',
    purposeEn: 'Visiting Friends & Relatives',
    percentage: 33.6,
    color: '#3b82f6',
  },
  {
    purpose: 'Membeli-belah',
    purposeEn: 'Shopping',
    percentage: 32.6,
    color: '#10b981',
  },
  {
    purpose: 'Percutian / Santai / Rehat',
    purposeEn: 'Holiday / Leisure',
    percentage: 16.2,
    color: '#f59e0b',
  },
  {
    purpose: 'Rawatan Perubatan & Kesihatan',
    purposeEn: 'Medical & Healthcare',
    percentage: 5.4,
    color: '#ef4444',
  },
  {
    purpose: 'Hiburan / Sukan / Acara',
    purposeEn: 'Entertainment / Sports / Events',
    percentage: 4.8,
    color: '#8b5cf6',
  },
  {
    purpose: 'Urusan Perniagaan / Persidangan / Kerja',
    purposeEn: 'Business / MICE / Work',
    percentage: 4.1,
    color: '#06b6d4',
  },
  {
    purpose: 'Lain-lain (Pendidikan / Keagamaan)',
    purposeEn: 'Others (Education / Religious)',
    percentage: 3.3,
    color: '#94a3b8',
  },
];

// Pelancong Antarabangsa ke Malaysia (Tourism Malaysia & DOSM)
export const internationalArrivals: InternationalArrival[] = [
  {
    year: 2019,
    arrivalsMillion: 26.1,
    receiptsBillionRM: 86.1,
    perCapitaSpendRM: 3300,
    alosDays: 7.4,
  },
  {
    year: 2020,
    arrivalsMillion: 4.33,
    receiptsBillionRM: 12.69,
    perCapitaSpendRM: 2928,
    alosDays: 4.2,
  },
  {
    year: 2021,
    arrivalsMillion: 0.13,
    receiptsBillionRM: 0.24,
    perCapitaSpendRM: 1846,
    alosDays: 3.8,
  },
  {
    year: 2022,
    arrivalsMillion: 10.07,
    receiptsBillionRM: 28.23,
    perCapitaSpendRM: 2803,
    alosDays: 6.9,
  },
  {
    year: 2023,
    arrivalsMillion: 20.14,
    receiptsBillionRM: 71.31,
    perCapitaSpendRM: 3540,
    alosDays: 7.6,
  },
  {
    year: 2024,
    arrivalsMillion: 25.10,
    receiptsBillionRM: 102.30,
    perCapitaSpendRM: 4075,
    alosDays: 7.8,
  },
];

// Pasaran Sumber Utama Pelancong Antarabangsa (Top 10 Source Countries)
export const countrySources: CountrySource[] = [
  {
    country: 'Singapura',
    countryEn: 'Singapore',
    region: 'ASEAN',
    arrivalsThousand: 8300,
    sharePercent: 33.1,
    growthPercent: 18.4,
    flag: '🇸🇬',
  },
  {
    country: 'Indonesia',
    countryEn: 'Indonesia',
    region: 'ASEAN',
    arrivalsThousand: 3550,
    sharePercent: 14.1,
    growthPercent: 24.2,
    flag: '🇮🇩',
  },
  {
    country: 'China',
    countryEn: 'China',
    region: 'Asia Timur',
    arrivalsThousand: 3280,
    sharePercent: 13.1,
    growthPercent: 125.6, // Pemulihan pasca pengecualian visa
    flag: '🇨🇳',
  },
  {
    country: 'Thailand',
    countryEn: 'Thailand',
    region: 'ASEAN',
    arrivalsThousand: 1720,
    sharePercent: 6.9,
    growthPercent: 12.3,
    flag: '🇹🇭',
  },
  {
    country: 'Brunei',
    countryEn: 'Brunei',
    region: 'ASEAN',
    arrivalsThousand: 1210,
    sharePercent: 4.8,
    growthPercent: 19.5,
    flag: '🇧🇳',
  },
  {
    country: 'India',
    countryEn: 'India',
    region: 'Asia Selatan',
    arrivalsThousand: 1140,
    sharePercent: 4.5,
    growthPercent: 82.1,
    flag: '🇮🇳',
  },
  {
    country: 'Korea Selatan',
    countryEn: 'South Korea',
    region: 'Asia Timur',
    arrivalsThousand: 520,
    sharePercent: 2.1,
    growthPercent: 42.0,
    flag: '🇰🇷',
  },
  {
    country: 'Australia',
    countryEn: 'Australia',
    region: 'Australasia',
    arrivalsThousand: 410,
    sharePercent: 1.6,
    growthPercent: 16.5,
    flag: '🇦🇺',
  },
  {
    country: 'United Kingdom',
    countryEn: 'United Kingdom',
    region: 'Eropah',
    arrivalsThousand: 375,
    sharePercent: 1.5,
    growthPercent: 14.2,
    flag: '🇬🇧',
  },
  {
    country: 'Filipina',
    countryEn: 'Philippines',
    region: 'ASEAN',
    arrivalsThousand: 360,
    sharePercent: 1.4,
    growthPercent: 21.0,
    flag: '🇵🇭',
  },
];

// Jadual 9: Bilangan Pelawat Domestik mengikut Negeri Dikunjungi 2018 - 2025 ('000)
// Sumber: DOSM (Sebagaimana dalam rekod output Apps Script)
export const stateVisitorHistoryYears = [
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
];

export const stateVisitorHistory: StateVisitorHistory[] = [
  {
    state: 'Johor',
    visitors: [13487, 14274, 7243, 3658, 12376, 15805, 17138, 18197],
  },
  {
    state: 'Kedah',
    visitors: [14480, 14831, 10108, 4023, 11186, 13444, 14651, 15608],
  },
  {
    state: 'Kelantan',
    visitors: [9846, 10986, 6058, 1921, 6627, 7549, 10514, 12062],
  },
  {
    state: 'Melaka',
    visitors: [13123, 13979, 7275, 3878, 11757, 15559, 19128, 20832],
  },
  {
    state: 'Negeri Sembilan',
    visitors: [9840, 10650, 5840, 2410, 8950, 10840, 11950, 12840],
  },
  {
    state: 'Pahang',
    visitors: [13450, 14980, 7850, 3920, 12450, 15870, 17450, 18920],
  },
  {
    state: 'Pulau Pinang',
    visitors: [14890, 15820, 8420, 4120, 12980, 16240, 18150, 19680],
  },
  {
    state: 'Perak',
    visitors: [15210, 16450, 8910, 4420, 13780, 17120, 18950, 20450],
  },
  {
    state: 'Perlis',
    visitors: [2780, 3050, 1620, 780, 2140, 2680, 3090, 3420],
  },
  {
    state: 'Selangor',
    visitors: [22450, 24890, 12940, 6850, 21350, 27600, 31200, 34500],
  },
  {
    state: 'Terengganu',
    visitors: [9120, 10150, 5420, 2140, 7820, 9480, 11200, 12450],
  },
  {
    state: 'Sabah',
    visitors: [10240, 11420, 5890, 2460, 8740, 11250, 13800, 15200],
  },
  {
    state: 'Sarawak',
    visitors: [13820, 15420, 7950, 3210, 11450, 14890, 17900, 19450],
  },
  {
    state: 'W.P. Kuala Lumpur',
    visitors: [19850, 21840, 11250, 5940, 18450, 22200, 25800, 28400],
  },
  {
    state: 'W.P. Labuan',
    visitors: [1180, 1290, 680, 320, 980, 1240, 1410, 1580],
  },
  {
    state: 'W.P. Putrajaya',
    visitors: [1950, 2120, 1120, 580, 1820, 2280, 2560, 2820],
  },
];

// Helper: Calculate TPI (Tourism Pressure Index) for a given year index
// Formula exact from PDF: TPI = (Pelawat negeri / Pelawat tertinggi antara negeri) * 100
export function calculateTPIByYear(yearIndex: number): TPIEntry[] {
  const safeYearIdx = Math.max(0, Math.min(yearIndex, stateVisitorHistoryYears.length - 1));
  const maxVisitors = Math.max(...stateVisitorHistory.map((s) => s.visitors[safeYearIdx] || 0));

  return stateVisitorHistory
    .map((s) => {
      const visitors = s.visitors[safeYearIdx] || 0;
      const tpi = maxVisitors > 0 ? (visitors / maxVisitors) * 100 : 0;
      const roundedTpi = Math.round(tpi * 10) / 10;

      let level: 'Kritikal' | 'Tinggi' | 'Sederhana' | 'Rendah' = 'Rendah';
      if (roundedTpi >= 80) level = 'Kritikal';
      else if (roundedTpi >= 50) level = 'Tinggi';
      else if (roundedTpi >= 25) level = 'Sederhana';

      // Correlate with hotel state statistics
      const stateStat = stateTourismStats.find(
        (st) => st.stateName.toLowerCase() === s.state.toLowerCase()
      );
      const hotelOccupancy = stateStat?.hotelOccupancyRate || 50;
      const roomCount = Math.round(visitors * 1.8);

      let stressFactor = 'Trafik lancar, kapasiti bilik selesa';
      if (level === 'Kritikal') {
        stressFactor = 'Kesesakan hujung minggu & kadar tempahan hotel >60%';
      } else if (level === 'Tinggi') {
        stressFactor = 'Tumpuan pelawat tinggi di zon tumpuan bandar/pantai';
      } else if (level === 'Sederhana') {
        stressFactor = 'Kapasiti seimbang dengan aliran pelancong';
      }

      return {
        state: s.state,
        visitorsThousand: visitors,
        tpi: roundedTpi,
        level,
        hotelOccupancyRate: hotelOccupancy,
        roomCount,
        stressFactor,
      };
    })
    .sort((a, b) => b.tpi - a.tpi);
}

// Jadual 8A & 8B: Destinasi dan Daerah Tumpuan Pelawat Domestik 2025
export const curatedDestinations: DestinationItem[] = [
  {
    id: 'dest-1',
    name: 'George Town UNESCO Heritage & Batu Ferringhi',
    state: 'Pulau Pinang',
    district: 'Timur Laut',
    category: 'Warisan & Gastronomi',
    suitableFor: ['gastronomi', 'warisan_sejarah', 'eko_pantai'],
    estBudgetPerDayRM: 180,
    idealDurationDays: 3,
    highlights: 'Jalan warisan, mural seni, makanan jalanan Char Kway Teow & pantai matahari terbenam.',
    currentTPI: 57.0,
    matchScore: 94,
    seasonality: 'Sepanjang tahun (paling sibuk cuti sekolah & hujung minggu)',
  },
  {
    id: 'dest-2',
    name: 'Cameron Highlands (Tanah Rata & Brinchang)',
    state: 'Pahang',
    district: 'Cameron Highlands',
    category: 'Tanah Tinggi & Santai',
    suitableFor: ['eko_pantai', 'hiburan_keluarga'],
    estBudgetPerDayRM: 150,
    idealDurationDays: 2,
    highlights: 'Ladang Teh BOH Sungai Palas, petik strawberi segar, cuaca sejuk dan pasar malam Brinchang.',
    currentTPI: 54.8,
    matchScore: 91,
    seasonality: 'Waktu terbaik hari biasa untuk elak kesesakan trafik genting',
  },
  {
    id: 'dest-3',
    name: 'Pekan Lama Ipoh & Concubine Lane',
    state: 'Perak',
    district: 'Kinta',
    category: 'Gastronomi & Sejarah',
    suitableFor: ['gastronomi', 'warisan_sejarah'],
    estBudgetPerDayRM: 130,
    idealDurationDays: 2,
    highlights: 'Kopi putih asli, ayam tauge, lorong seni Concubine Lane, dan gua batu kapur Sam Poh Tong.',
    currentTPI: 59.3,
    matchScore: 89,
    seasonality: 'Sangat popular semasa cuti panjang & festival perayaan',
  },
  {
    id: 'dest-4',
    name: 'Jonker Walk & Banda Hilir Warisan Dunia',
    state: 'Melaka',
    district: 'Melaka Tengah',
    category: 'Warisan & Beli-belah',
    suitableFor: ['warisan_sejarah', 'beli_belah', 'gastronomi'],
    estBudgetPerDayRM: 160,
    idealDurationDays: 2,
    highlights: 'A Famosa, Stadthuys merah, Melaka River Cruise, dan cendol durian gula Melaka.',
    currentTPI: 60.4,
    matchScore: 88,
    seasonality: 'Tahun Melawat Melaka (kemasukan pelawat meningkat 24%)',
  },
  {
    id: 'dest-5',
    name: 'Bukit Bintang, KLCC & Pasar Seni',
    state: 'W.P. Kuala Lumpur',
    district: 'Bukit Bintang / KLCC',
    category: 'Beli-belah & Hiburan Moden',
    suitableFor: ['beli_belah', 'hiburan_keluarga', 'gastronomi'],
    estBudgetPerDayRM: 250,
    idealDurationDays: 2,
    highlights: 'Pavilion KL, Menara Berkembar Petronas, kraf tempatan Pasar Seni & kafe hipster.',
    currentTPI: 82.3,
    matchScore: 92,
    seasonality: 'Sepanjang tahun, jualan mega akhir tahun dan festival beli-belah',
  },
  {
    id: 'dest-6',
    name: 'Taman Negara Kinabalu & Kundasang',
    state: 'Sabah',
    district: 'Ranau',
    category: 'Eko-pelancongan Alam Semulajadi',
    suitableFor: ['eko_pantai', 'hiburan_keluarga'],
    estBudgetPerDayRM: 210,
    idealDurationDays: 4,
    highlights: 'Pemandangan Gunung Kinabalu, Desa Cattle Dairy Farm bak New Zealand, dan mata air panas Poring.',
    currentTPI: 44.1,
    matchScore: 95,
    seasonality: 'Cuaca terbaik Mac hingga September untuk aktiviti mendaki dan trekking',
  },
  {
    id: 'dest-7',
    name: 'Kuching Waterfront & Bako National Park',
    state: 'Sarawak',
    district: 'Kuching',
    category: 'Budaya & Eko-pelancongan',
    suitableFor: ['eko_pantai', 'warisan_sejarah', 'gastronomi'],
    estBudgetPerDayRM: 170,
    idealDurationDays: 3,
    highlights: 'Laksa Sarawak asli, Mee Kolok, monyet belanda proboscis di Bako, dan Muzium Budaya Borneo.',
    currentTPI: 56.4,
    matchScore: 90,
    seasonality: 'Festival Hujan Tropika Dunia (RWMF) bulan Jun/Julai',
  },
  {
    id: 'dest-8',
    name: 'Pulau Perhentian & Pasar Payang',
    state: 'Terengganu',
    district: 'Besut & Kuala Terengganu',
    category: 'Pantai & Kraftangan',
    suitableFor: ['eko_pantai', 'gastronomi', 'beli_belah'],
    estBudgetPerDayRM: 190,
    idealDurationDays: 3,
    highlights: 'Snorkeling penyu & terumbu karang air jernih, keropok lekor panas, dan kain songket sutera.',
    currentTPI: 36.1,
    matchScore: 87,
    seasonality: 'Mac hingga Oktober (elak musim tengkujuh November-Januari)',
  },
  {
    id: 'dest-9',
    name: 'Desaru Coast & Bandar JB',
    state: 'Johor',
    district: 'Kota Tinggi & Johor Bahru',
    category: 'Resort Pantai & Taman Tema',
    suitableFor: ['hiburan_keluarga', 'eko_pantai', 'beli_belah'],
    estBudgetPerDayRM: 240,
    idealDurationDays: 3,
    highlights: 'Adventure Waterpark Desaru, pantai peribadi resort mewah, Legoland Malaysia & JPO shopping.',
    currentTPI: 52.7,
    matchScore: 86,
    seasonality: 'Sangat diminati keluarga hujung minggu & pelancong seberang Tambak',
  },
  {
    id: 'dest-10',
    name: 'Gua Kelam & Padang Besar',
    state: 'Perlis',
    district: 'Padang Besar / Kangar',
    category: 'Kembara Tenang & Beli-belah Murah',
    suitableFor: ['eko_pantai', 'beli_belah', 'gastronomi'],
    estBudgetPerDayRM: 95,
    idealDurationDays: 2,
    highlights: 'Laluan kayu dalam gua batu kapur purba, mangga Harum Manis mekar, dan beli-belah zon bebas cukai.',
    currentTPI: 9.9,
    matchScore: 84,
    seasonality: 'Musim buah Harum Manis April hingga Jun',
  },
];

// Tourism Opportunities (Peluang Pelancongan Berpotensi Tinggi)
export const tourismOpportunities: TourismOpportunity[] = [
  {
    id: 'opp-1',
    state: 'Perlis & Kedah Luar Bandar',
    title: 'Agro-Pelancongan & Percutian Santai Kos Rendah',
    type: 'underserved',
    score: 88,
    metricLabel: 'TPI Rendah / Pertumbuhan Potensi',
    metricValue: 'TPI 9.9% (Kapasiti Melimpah)',
    opportunityDescription:
      'Perlis mempunyai indeks tekanan terendah di Semenanjung tetapi menawarkan daya tarikan agro (Harum Manis) dan kembara gua yang tulen tanpa kesesakan.',
    actionRecommendation:
      'Wujudkan pakej glamping sawah padi dan laluan transit keretapi ETS terus dari Lembah Klang untuk mengalihkan pelancong yang penat sesak.',
    priorityLevel: 'Bintang Terbit',
  },
  {
    id: 'opp-2',
    state: 'Pahang & Perak',
    title: 'Defisit Bilik Penginapan di Zon Peranginan Puncak',
    type: 'hotel_deficit',
    score: 93,
    metricLabel: 'Purata Penghunian Hotel (AOR)',
    metricValue: '67.8% (Pahang) & 65.7% (Penang)',
    opportunityDescription:
      'Kadar penghunian hotel di Pahang dan Pulau Pinang melebihi 65% purata tahunan dan melonjak melepasi 88% semasa cuti sekolah, menandakan kekurangan bilik premium.',
    actionRecommendation:
      'Peluang pelaburan untuk hotel butik mesra alam, homestay bertauliah, dan resort berkonsepkan kesihatan (wellness).',
    priorityLevel: 'Tinggi',
  },
  {
    id: 'opp-3',
    state: 'Sabah & Sarawak',
    title: 'Pelancongan Nilai Tinggi (High Yield Eco-Tourism)',
    type: 'high_yield',
    score: 91,
    metricLabel: 'Purata Tempoh Menginap (ALOS)',
    metricValue: '3.4 Hari (Sabah) & 3.2 Hari (Sarawak)',
    opportunityDescription:
      'Pelancong ke Borneo menginap paling lama (3.2 - 3.4 hari vs purata Semenanjung 2.1 hari) dan membelanjakan 40% lebih banyak setiap perjalanan untuk aktiviti alam semula jadi.',
    actionRecommendation:
      'Tingkatkan laluan penerbangan terus domestik dan tawarkan pakej immersi komuniti Orang Asal berlesen.',
    priorityLevel: 'Tinggi',
  },
  {
    id: 'opp-4',
    state: 'Kelantan & Terengganu',
    title: 'Kuasa Beli Gastronomi & Kraftangan Tradisional',
    type: 'gastronomy_hub',
    score: 85,
    metricLabel: 'Perbelanjaan Makanan & Beli-belah',
    metricValue: '52.6% Daripada Jumlah Belanja',
    opportunityDescription:
      'Pantai Timur mempunyai tarikan gastronomi unik yang menarik segmen pelancong tegar. Lebih separuh perbelanjaan disalurkan terus kepada PKS dan peniaga pasar tempatan.',
    actionRecommendation:
      'Membangunkan jejak kulinari digital (digital food trail) dan kemudahan pembayaran tanpa tunai (DuitNow QR) di pasar tradisional.',
    priorityLevel: 'Sederhana',
  },
];

// Key Insights (DOSM 2018 - 2026 Trend Analysis)
export const keyInsightsList: KeyInsight[] = [
  {
    id: 'insight-1',
    title: 'Pemulihan Penuh Melepasi Paras Pra-Pandemik',
    tag: 'Pertumbuhan',
    stat: '242.4 Juta Pelawat (2024)',
    changeDirection: 'up',
    description:
      'Bilangan pelawat domestik mencatatkan rekod tertinggi melepasi paras 239.1 juta pada 2019, dijana oleh pembukaan semula ekonomi dan mobiliti jalan raya yang mantap.',
    strategicNote:
      'Fokus beralih daripada pemulihan volum kepada peningkatan kualiti perbelanjaan setiap pelawat.',
  },
  {
    id: 'insight-2',
    title: 'Konsentrasi 55% Aliran di 4 Negeri Utama',
    tag: 'Tekanan',
    stat: 'TPI Lembah Klang & Selatan >75%',
    changeDirection: 'neutral',
    description:
      'Selangor, Kuala Lumpur, Johor dan Perak terus menjadi penerima terbesar pelawat domestik, menyebabkan bebanan infrastruktur jalan raya semasa musim cuti umum.',
    strategicNote:
      'Diperlukan insentif potongan cukai pelancongan bagi percutian luar musim dan ke destinasi sekunder.',
  },
  {
    id: 'insight-3',
    title: 'Makanan & Beli-Belah Kuasai RM51.9 Bilion',
    tag: 'Peluang',
    stat: '52.6% Daripada Dompet Pelancong',
    changeDirection: 'up',
    description:
      'Komponen F&B dan membeli-belah kekal sebagai magnet utama yang menjana ekonomi tunai segera kepada komuniti tempatan berbanding penginapan semata-mata.',
    strategicNote:
      'Peniaga mikro dan pasar tani merupakan pemacu ekonomi terbesar pelancongan domestik.',
  },
  {
    id: 'insight-4',
    title: 'Mobiliti Kenderaan Persendirian Mendominasi 88.4%',
    tag: 'Demografi',
    stat: '88.4% Menggunakan Kereta Sendiri',
    changeDirection: 'neutral',
    description:
      'Hampir 9 daripada 10 pelancong domestik menggunakan kereta sendiri, membolehkan fleksibiliti perjalanan keluarga tetapi meningkatkan kebergantungan kepada lebuh raya PLUS & LPT.',
    strategicNote:
      'Peluang memperluaskan stesen pengecasan EV dan kawasan Rehat & Rawat (R&R) bersepadu.',
  },
];

// Jadual A: Suku Tahunan 2021 - 2026 (DOSM Quarterly Series)
export interface QuarterlyStat {
  quarter: string;
  year: number;
  visitorsMillion: number;
  expenditureBillionRM: number;
  qoqGrowth: number;
  yoyGrowth: number;
}

export const dosmQuarterlySeries: QuarterlyStat[] = [
  { quarter: '2023 Q1', year: 2023, visitorsMillion: 48.6, expenditureBillionRM: 19.2, qoqGrowth: -2.1, yoyGrowth: 33.7 },
  { quarter: '2023 Q2', year: 2023, visitorsMillion: 54.4, expenditureBillionRM: 21.8, qoqGrowth: 11.9, yoyGrowth: 20.3 },
  { quarter: '2023 Q3', year: 2023, visitorsMillion: 53.4, expenditureBillionRM: 20.1, qoqGrowth: -1.8, yoyGrowth: 19.2 },
  { quarter: '2023 Q4', year: 2023, visitorsMillion: 57.3, expenditureBillionRM: 23.8, qoqGrowth: 7.3, yoyGrowth: 15.5 },
  { quarter: '2024 Q1', year: 2024, visitorsMillion: 58.6, expenditureBillionRM: 24.1, qoqGrowth: 2.3, yoyGrowth: 20.6 },
  { quarter: '2024 Q2', year: 2024, visitorsMillion: 61.2, expenditureBillionRM: 25.3, qoqGrowth: 4.4, yoyGrowth: 12.5 },
  { quarter: '2024 Q3', year: 2024, visitorsMillion: 60.1, expenditureBillionRM: 24.2, qoqGrowth: -1.8, yoyGrowth: 12.5 },
  { quarter: '2024 Q4', year: 2024, visitorsMillion: 62.5, expenditureBillionRM: 25.0, qoqGrowth: 4.0, yoyGrowth: 9.1 },
];

