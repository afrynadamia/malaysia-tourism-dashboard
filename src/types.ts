export type Language = 'ms' | 'en';

export interface DomesticYearlyStat {
  year: number;
  visitorsMillion: number; // Juta pelawat
  tripsMillion: number; // Juta perjalanan
  expenditureBillionRM: number; // RM Bilion
  avgSpendPerTripRM: number; // RM
  avgStayDays: number; // Purata hari menginap
}

export interface StateTourismStat {
  stateCode: string;
  stateName: string;
  visitorsMillion: number;
  expenditureBillionRM: number;
  hotelOccupancyRate: number; // % (AOR)
  avgStayDays: number;
  topPurpose: string;
  sharePercent: number;
}

export interface SpendingComponent {
  category: string;
  categoryEn: string;
  percentage: number;
  amountBillionRM: number;
  color: string;
}

export interface VisitPurpose {
  purpose: string;
  purposeEn: string;
  percentage: number;
  color: string;
}

export interface InternationalArrival {
  year: number;
  arrivalsMillion: number;
  receiptsBillionRM: number;
  perCapitaSpendRM: number;
  alosDays: number; // Average length of stay
}

export interface CountrySource {
  country: string;
  countryEn: string;
  region: string;
  arrivalsThousand: number;
  sharePercent: number;
  growthPercent: number;
  flag: string;
}

// User Profile & Recommendation Types (from Concept PDF)
export interface UserProfile {
  budgetRM: number;
  interest: 'gastronomi' | 'eko_pantai' | 'beli_belah' | 'warisan_sejarah' | 'hiburan_keluarga';
  durationDays: number;
  originState: string;
  preferredState: string; // or 'Semua / Fleksibel'
  travelType: 'solo' | 'pasangan' | 'keluarga' | 'rakan';
}

// Tourism Pressure Index (TPI) Types (Formula from PDF: (Visitors / Max) * 100)
export interface StateVisitorHistory {
  state: string;
  visitors: number[]; // 2018-2025 ('000)
}

export interface TPIEntry {
  state: string;
  visitorsThousand: number;
  tpi: number; // 0 - 100
  level: 'Kritikal' | 'Tinggi' | 'Sederhana' | 'Rendah';
  hotelOccupancyRate: number;
  roomCount: number;
  stressFactor: string;
}

// Recommended Destination (Jadual 8A & 8B)
export interface DestinationItem {
  id: string;
  name: string;
  state: string;
  district: string;
  category: string;
  suitableFor: string[];
  estBudgetPerDayRM: number;
  idealDurationDays: number;
  highlights: string;
  currentTPI: number;
  matchScore: number;
  seasonality: string;
}

// Opportunity Detector
export interface TourismOpportunity {
  id: string;
  state: string;
  title: string;
  type: 'high_yield' | 'underserved' | 'hotel_deficit' | 'gastronomy_hub' | 'eco_potential';
  score: number; // 0 - 100
  metricLabel: string;
  metricValue: string;
  opportunityDescription: string;
  actionRecommendation: string;
  priorityLevel: 'Tinggi' | 'Sederhana' | 'Bintang Terbit';
}

// What-If Tourism Flow Simulation (Jadual 10 Origin-Destination Matrix)
export interface FlowSimulationParams {
  sourceCluster: 'all_high_pressure' | 'selangor_kl' | 'johor' | 'penang';
  targetCluster: 'east_coast' | 'borneo' | 'northern_rural' | 'custom';
  divertPercentage: number; // 5% - 50%
  spendMultiplier: number; // 0.8x - 1.5x
  activeScenario: 'cuti_sekolah' | 'visit_state_campaign' | 'eco_diversion' | 'custom';
}

export interface SimulatedStateShift {
  state: string;
  baselineVisitorsThousand: number;
  simulatedVisitorsThousand: number;
  deltaVisitorsThousand: number;
  baselineTpi: number;
  simulatedTpi: number;
  deltaExpenditureMillionRM: number;
}

// Key Insights (DOSM 2018-2026 Analysis)
export interface KeyInsight {
  id: string;
  title: string;
  tag: 'Pertumbuhan' | 'Tekanan' | 'Peluang' | 'Demografi';
  stat: string;
  changeDirection: 'up' | 'down' | 'neutral';
  description: string;
  strategicNote: string;
}

export interface ParsedSheetData {
  sheetName: string;
  fileName: string;
  headers: string[];
  rows: Record<string, any>[];
  rowCount: number;
  detectedType?: 'domestic' | 'international' | 'state' | 'spending' | 'custom';
}

export interface UploadedDataset {
  id: string;
  fileName: string;
  uploadDate: string;
  sheets: ParsedSheetData[];
  activeSheet: string;
}

export type ActiveTab =
  | 'overview'
  | 'tpi'
  | 'recommendations'
  | 'opportunity'
  | 'simulation'
  | 'states'
  | 'domestic'
  | 'excelExplorer'
  | 'appsScript';

