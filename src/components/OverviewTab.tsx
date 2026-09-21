import React from 'react';
import {
  Users,
  Wallet,
  PlaneTakeoff,
  TrendingUp,
  MapPin,
  Calendar,
  Building,
  Award,
  Sparkles,
  Flame,
  Lightbulb,
  Zap,
  Code2,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Language } from '../types';
import {
  domesticYearlyStats,
  internationalArrivals,
  stateTourismStats,
  countrySources,
  spendingComponents,
  keyInsightsList,
} from '../data/dosmData';
import { MetricCard } from './MetricCard';

interface OverviewTabProps {
  language: Language;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ language, onNavigateToTab }) => {
  const isBM = language === 'ms';

  // Latest 2024 figures
  const latestDomestic = domesticYearlyStats[domesticYearlyStats.length - 1];
  const prevDomestic = domesticYearlyStats[domesticYearlyStats.length - 2];
  const domesticGrowth = (
    ((latestDomestic.visitorsMillion - prevDomestic.visitorsMillion) /
      prevDomestic.visitorsMillion) *
    100
  ).toFixed(1);

  const latestIntl = internationalArrivals[internationalArrivals.length - 1];
  const prevIntl = internationalArrivals[internationalArrivals.length - 2];
  const intlGrowth = (
    ((latestIntl.arrivalsMillion - prevIntl.arrivalsMillion) / prevIntl.arrivalsMillion) *
    100
  ).toFixed(1);

  // Combine trend data for chart
  const combinedTrend = domesticYearlyStats.map(d => {
    const intl = internationalArrivals.find(i => i.year === d.year);
    return {
      year: d.year.toString(),
      domesticVisitors: d.visitorsMillion,
      intlArrivals: intl ? intl.arrivalsMillion : 0,
      domesticSpend: d.expenditureBillionRM,
      intlReceipts: intl ? intl.receiptsBillionRM : 0,
      totalSpend: d.expenditureBillionRM + (intl ? intl.receiptsBillionRM : 0),
    };
  });

  const topStates = [...stateTourismStats].sort((a, b) => b.visitorsMillion - a.visitorsMillion).slice(0, 5);
  const topCountries = [...countrySources].slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Alert / Context */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isBM
                ? 'Pencapaian Pelancongan Malaysia Pasca-Pemulihan (DOSM 2024)'
                : 'Post-Pandemic Tourism Trajectory (DOSM 2024)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isBM
              ? 'Pertumbuhan Teguh Pelancongan Domestik & Antarabangsa'
              : 'Robust Growth in Domestic & International Tourism'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isBM
              ? 'Berdasarkan Survei Pelancongan Domestik (DTS) DOSM dan rekod ketibaan Tourism Malaysia, sektor pelancongan menjana lebih RM200 Bilion jumlah perbelanjaan gabungan pada 2024 dengan 242.4 juta pelawat domestik.'
              : 'According to DOSM Domestic Tourism Survey (DTS) and Tourism Malaysia arrival registries, combined tourism expenditure surpassed RM200 Billion in 2024 with 242.4 million domestic visitors.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateToTab('tpi')}
            className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            {isBM ? 'Tourism Pressure Index' : 'Tourism Pressure Index'}
          </button>
          <button
            onClick={() => onNavigateToTab('recommendations')}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            {isBM ? 'Padanan Destinasi' : 'Destination Matcher'}
          </button>
          <button
            onClick={() => onNavigateToTab('appsScript')}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            {isBM ? 'Apps Script Hub' : 'Apps Script Hub'}
          </button>
        </div>
      </div>

      {/* 5 Core Feature Launchpad (Directly from User's Chat Concept) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {isBM ? 'Modul Analisis Pelancongan Bersepadu' : 'Integrated Tourism Modules'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {isBM ? 'Pilih mana-mana modul untuk mula' : 'Select any module to explore'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigateToTab('tpi')}
            className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/70 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Flame className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition-colors">
                Tourism Pressure Index
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isBM ? 'Indeks kepekatan pelawat 16 negeri' : '16-state visitor pressure index'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-700 mt-3 block">Jadual 9 (2018-2025) →</span>
          </button>

          <button
            onClick={() => onNavigateToTab('recommendations')}
            className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Compass className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                {isBM ? 'Profil & Cadangan' : 'Smart Recommender'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isBM ? 'Padanan bajet & minat pelancong' : 'Personalized destination matching'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-700 mt-3 block">Jadual 8A & 8B →</span>
          </button>

          <button
            onClick={() => onNavigateToTab('opportunity')}
            className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isBM ? 'Pengesan Peluang' : 'Opportunity Detector'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isBM ? 'Defisit bilik hotel & zon bernilai tinggi' : 'High yield & hotel deficit gaps'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-3 block">Jadual 6 & 7 →</span>
          </button>

          <button
            onClick={() => onNavigateToTab('simulation')}
            className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/70 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Zap className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                {isBM ? 'Simulasi Aliran (What-If)' : 'What-If Flow Sim'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isBM ? 'Uji pengalihan trafik & impak tunai' : 'Simulate tourist shifts & cash flow'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 mt-3 block">Jadual 10 Matriks →</span>
          </button>

          <button
            onClick={() => onNavigateToTab('appsScript')}
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Code2 className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800 transition-colors">
                Apps Script & API
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                {isBM ? 'Salin Code.gs & uji API secara live' : 'Copy Code.gs & test live JSON'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-3 block">Step 1 - 7 Panduan →</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-domestic-visitors"
          title={isBM ? 'Pelawat Domestik (2024)' : 'Domestic Visitors (2024)'}
          value={`${latestDomestic.visitorsMillion}M`}
          subtitle={isBM ? 'Survei Pelancongan Domestik' : 'Domestic Tourism Survey'}
          trend={{
            value: `+${domesticGrowth}%`,
            isPositive: true,
            label: isBM ? 'berbanding 2023' : 'vs 2023',
          }}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
        />

        <MetricCard
          id="metric-domestic-expenditure"
          title={isBM ? 'Perbelanjaan Domestik' : 'Domestic Spending'}
          value={`RM ${latestDomestic.expenditureBillionRM}B`}
          subtitle={isBM ? `Purata RM ${latestDomestic.avgSpendPerTripRM}/trip` : `Avg RM ${latestDomestic.avgSpendPerTripRM}/trip`}
          trend={{
            value: `+${(((latestDomestic.expenditureBillionRM - prevDomestic.expenditureBillionRM) / prevDomestic.expenditureBillionRM) * 100).toFixed(1)}%`,
            isPositive: true,
            label: isBM ? 'RM98.6B' : 'RM98.6B',
          }}
          icon={Wallet}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <MetricCard
          id="metric-intl-arrivals"
          title={isBM ? 'Ketibaan Antarabangsa' : 'International Arrivals'}
          value={`${latestIntl.arrivalsMillion}M`}
          subtitle={isBM ? 'Pelancong Asing Melawat M\'sia' : 'Foreign Tourists to M\'sia'}
          trend={{
            value: `+${intlGrowth}%`,
            isPositive: true,
            label: isBM ? 'berbanding 2023' : 'vs 2023',
          }}
          icon={PlaneTakeoff}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-700"
        />

        <MetricCard
          id="metric-intl-receipts"
          title={isBM ? 'Pendapatan Pelancongan' : 'Tourism Receipts'}
          value={`RM ${latestIntl.receiptsBillionRM}B`}
          subtitle={isBM ? `Per kapita: RM ${latestIntl.perCapitaSpendRM}` : `Per capita: RM ${latestIntl.perCapitaSpendRM}`}
          trend={{
            value: `+${(((latestIntl.receiptsBillionRM - prevIntl.receiptsBillionRM) / prevIntl.receiptsBillionRM) * 100).toFixed(1)}%`,
            isPositive: true,
            label: isBM ? 'hasil masuk asing' : 'foreign receipts',
          }}
          icon={TrendingUp}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-700"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Trajectory Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {isBM
                  ? 'Trajektori Pemulihan Pelancong (2019 - 2024)'
                  : 'Tourism Recovery Trajectory (2019 - 2024)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBM
                  ? 'Perbandingan bilangan pelawat domestik vs ketibaan antarabangsa (Juta Orang)'
                  : 'Comparison of domestic visitors vs international arrivals (Million Pax)'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto">
              {isBM ? 'Sumber: DOSM & Tourism Malaysia' : 'Source: DOSM & Tourism Malaysia'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDomestic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorIntl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} Juta / Million`,
                    name === 'domesticVisitors'
                      ? isBM
                        ? 'Pelawat Domestik'
                        : 'Domestic Visitors'
                      : isBM
                      ? 'Ketibaan Antarabangsa'
                      : 'International Arrivals',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  formatter={value =>
                    value === 'domesticVisitors'
                      ? isBM
                        ? 'Pelawat Domestik (Juta)'
                        : 'Domestic Visitors (Million)'
                      : isBM
                      ? 'Ketibaan Antarabangsa (Juta)'
                      : 'International Arrivals (Million)'
                  }
                />
                <Area
                  type="monotone"
                  dataKey="domesticVisitors"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDomestic)"
                />
                <Area
                  type="monotone"
                  dataKey="intlArrivals"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIntl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Spending Breakdown (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Sumbangan Perbelanjaan Pelancongan' : 'Tourism Expenditure Contribution'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM ? 'Jumlah RM200.9 Bilion pada 2024' : 'Total RM200.9 Billion in 2024'}
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={combinedTrend.slice(-3)}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(val: any, name: any) => [
                    `RM ${val} Bilion`,
                    name === 'domesticSpend'
                      ? isBM
                        ? 'Domestik'
                        : 'Domestic'
                      : isBM
                      ? 'Antarabangsa'
                      : 'International',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  formatter={value =>
                    value === 'domesticSpend'
                      ? isBM
                        ? 'Domestik (RM Bilion)'
                        : 'Domestic (RM B)'
                      : isBM
                      ? 'Antarabangsa (RM Bilion)'
                      : 'Intl Receipts (RM B)'
                  }
                />
                <Bar dataKey="domesticSpend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="intlReceipts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{isBM ? 'KDNK Pelancongan (TSA)' : 'Tourism GDP (TSA)'}</span>
            <span className="font-semibold text-slate-800">~13.3% KDNK Kebangsaan</span>
          </div>
        </div>
      </div>

      {/* Snapshot Tables: Top States & Top Source Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Destination States */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {isBM ? '5 Negeri Teratas Pelancongan Domestik' : 'Top 5 Domestic Destination States'}
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('states')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {isBM ? 'Lihat Semua Negeri →' : 'View All States →'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topStates.map((st, idx) => (
              <div key={st.stateCode} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{st.stateName}</h4>
                    <p className="text-[11px] text-slate-500">{st.topPurpose}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {st.visitorsMillion}M {isBM ? 'Pelawat' : 'Visitors'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    RM {st.expenditureBillionRM}B ({st.hotelOccupancyRate}% AOR)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 International Source Markets */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {isBM
                  ? 'Pasaran Sumber Utama Antarabangsa'
                  : 'Top International Source Markets'}
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('international')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {isBM ? 'Lihat 10 Pasaran →' : 'View Top 10 →'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topCountries.map((c, idx) => (
              <div key={c.country} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.flag}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {isBM ? c.country : c.countryEn}
                    </h4>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      {c.region}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {(c.arrivalsThousand / 1000).toFixed(2)}M {isBM ? 'Ketibaan' : 'Pax'}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold">
                    {c.sharePercent}% {isBM ? 'Syer Pasaran' : 'Share'} (+{c.growthPercent}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
