import React from 'react';
import {
  Plane,
  Coins,
  Clock,
  Globe,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { Language } from '../types';
import { internationalArrivals, countrySources } from '../data/dosmData';
import { MetricCard } from './MetricCard';

interface InternationalTabProps {
  language: Language;
}

export const InternationalTab: React.FC<InternationalTabProps> = ({ language }) => {
  const isBM = language === 'ms';
  const latest = internationalArrivals[internationalArrivals.length - 1];

  // Chart data for top countries
  const countryChartData = countrySources.map(c => ({
    name: isBM ? c.country : c.countryEn,
    arrivalsK: c.arrivalsThousand,
    arrivalsM: Number((c.arrivalsThousand / 1000).toFixed(2)),
    share: c.sharePercent,
    growth: c.growthPercent,
    flag: c.flag,
    region: c.region,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Policy highlight banner */}
      <div className="bg-emerald-950/90 text-emerald-100 border border-emerald-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 bg-emerald-800 text-emerald-200 rounded-xl shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              {isBM
                ? 'Lonjakan Ketibaan Pasca Pengecualian Visa 30 Hari'
                : 'Surge in Foreign Arrivals Post 30-Day Visa Liberalisation'}
            </h3>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-3xl">
              {isBM
                ? 'Dasar Liberalisasi Visa bagi pelancong dari China (+125.6%) dan India (+82.1%) telah mempercepat pemulihan pendapatan pelancongan antarabangsa melepasi RM102.3 Bilion pada 2024.'
                : 'The Visa Liberalisation plan for China (+125.6%) and India (+82.1%) travelers accelerated inbound tourism receipts to surpass RM102.3 Billion in 2024.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-900/80 border border-emerald-700/60 rounded-xl text-emerald-200 shrink-0 self-start md:self-auto">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{isBM ? 'Sasaran Melawat Malaysia' : 'Visit Malaysia Drive'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="stat-intl-arrivals-kpi"
          title={isBM ? 'Jumlah Ketibaan (2024)' : 'Total Arrivals (2024)'}
          value={`${latest.arrivalsMillion}M`}
          subtitle={isBM ? 'Sasaran 26M pra-pandemik dicapai' : 'Near 26M pre-pandemic level'}
          trend={{
            value: '+24.6%',
            isPositive: true,
            label: isBM ? 'berbanding 2023' : 'vs 2023',
          }}
          icon={Plane}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
        />

        <MetricCard
          id="stat-intl-receipts-kpi"
          title={isBM ? 'Pendapatan Pelancongan' : 'Tourism Receipts'}
          value={`RM ${latest.receiptsBillionRM}B`}
          subtitle={isBM ? 'Rekod tertinggi baharu Malaysia' : 'All-time historic high'}
          trend={{
            value: '+43.5%',
            isPositive: true,
            label: isBM ? 'pertumbuhan pendapatan' : 'receipts growth',
          }}
          icon={Coins}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <MetricCard
          id="stat-intl-per-capita"
          title={isBM ? 'Perbelanjaan Per Kapita' : 'Per Capita Expenditure'}
          value={`RM ${latest.perCapitaSpendRM}`}
          subtitle={isBM ? 'Purata belanja seorang pelancong' : 'Average spend per tourist'}
          trend={{
            value: '+15.1%',
            isPositive: true,
            label: isBM ? 'peningkatan kualiti' : 'quality spending',
          }}
          icon={TrendingUp}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-700"
        />

        <MetricCard
          id="stat-intl-alos"
          title={isBM ? 'Purata Tempoh Tinggal' : 'Avg Length of Stay (ALOS)'}
          value={`${latest.alosDays} ${isBM ? 'Hari' : 'Days'}`}
          subtitle={isBM ? 'Kadar tinggal di Malaysia' : 'Duration in Malaysia'}
          icon={Clock}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-700"
        />
      </div>

      {/* Top 10 Inbound Source Countries Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM
                ? '10 Pasaran Sumber Utama Pelancong Asing ke Malaysia (2024)'
                : 'Top 10 Inbound Source Markets to Malaysia (2024)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Singapura, Indonesia dan China merupakan 3 pasaran terbesar penyumbang pelancong'
                : 'Singapore, Indonesia, and China account for the largest inbound volume'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            {isBM ? 'Juta Orang Pelancong' : 'Million Tourist Arrivals'}
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countryChartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                unit="M"
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
                formatter={(val: any) => [`${val} Juta / Million Pelancong`, isBM ? 'Ketibaan' : 'Arrivals']}
              />
              <Bar dataKey="arrivalsM" fill="#2563eb" radius={[0, 6, 6, 0]}>
                {countryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#1d4ed8' : index === 1 ? '#2563eb' : index === 2 ? '#059669' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Receipts & ALOS Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipts Evolution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Evolusi Pendapatan Pelancongan (RM Bilion)' : 'Tourism Receipts Evolution (RM Billion)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM ? 'Pemulihan mendadak dari RM0.24B (2021) ke RM102.3B (2024)' : 'Rapid rebound from RM0.24B (2021) to RM102.3B (2024)'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internationalArrivals} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                  formatter={(val: any) => [`RM ${val} Bilion`, isBM ? 'Pendapatan' : 'Receipts']}
                />
                <Bar dataKey="receiptsBillionRM" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per Capita Spend & Stay Duration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Perbelanjaan Per Kapita Pelancong Asing (RM)' : 'Per Capita Foreign Spending Trend (RM)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM ? 'Purata perbelanjaan meningkat melepasi RM4,000 seorang' : 'Expenditure per tourist surpassed RM4,000 threshold'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={internationalArrivals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  formatter={(val: any) => [`RM ${val}`, isBM ? 'Perbelanjaan Purata' : 'Avg Spend']}
                />
                <Line
                  type="monotone"
                  dataKey="perCapitaSpendRM"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#d97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
