import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Hotel,
  Clock,
  Compass,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Language, StateTourismStat } from '../types';
import { stateTourismStats } from '../data/dosmData';
import { MetricCard } from './MetricCard';

interface StateDeepDiveTabProps {
  language: Language;
}

export const StateDeepDiveTab: React.FC<StateDeepDiveTabProps> = ({ language }) => {
  const isBM = language === 'ms';
  const [selectedStateCode, setSelectedStateCode] = useState<string>('MLK'); // Melaka default (or Selangor)
  const [comparisonMetric, setComparisonMetric] = useState<
    'visitorsMillion' | 'expenditureBillionRM' | 'hotelOccupancyRate'
  >('visitorsMillion');

  const selectedState =
    stateTourismStats.find(s => s.stateCode === selectedStateCode) || stateTourismStats[0];

  // Sorted list for comparison
  const sortedStates = [...stateTourismStats].sort((a, b) => b[comparisonMetric] - a[comparisonMetric]);
  const stateRank = sortedStates.findIndex(s => s.stateCode === selectedState.stateCode) + 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* State Selector Pill Cloud */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isBM ? 'Pilih Negeri Untuk Analisis Terperinci:' : 'Select State for Deep-Dive Analysis:'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            16 {isBM ? 'Negeri & Wilayah Persekutuan' : 'States & Federal Territories'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stateTourismStats.map(st => {
            const isSelected = st.stateCode === selectedState.stateCode;
            return (
              <button
                key={st.stateCode}
                id={`btn-state-${st.stateCode}`}
                onClick={() => setSelectedStateCode(st.stateCode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st.stateName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected State Overview Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md">
                {selectedState.stateCode}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">{selectedState.stateName}</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>
                  {isBM ? `Kedudukan Ke-${stateRank}` : `Rank #${stateRank}`}
                </span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isBM
                ? `Menyumbang ${selectedState.sharePercent}% daripada keseluruhan pasaran pelancongan domestik Malaysia.`
                : `Accounts for ${selectedState.sharePercent}% of Malaysia's total domestic tourism volume.`}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
              {isBM ? 'Fokus & Tarikan Utama' : 'Key Focus & Attractions'}
            </span>
            <span className="font-semibold text-white">{selectedState.topPurpose}</span>
          </div>
        </div>

        {/* 4 State Core KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div>
            <p className="text-xs text-slate-400 font-medium">
              {isBM ? 'Pelawat Domestik' : 'Domestic Visitors'}
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {selectedState.visitorsMillion}M
            </p>
            <p className="text-[11px] text-blue-400 mt-0.5">
              {selectedState.sharePercent}% {isBM ? 'syer nasional' : 'national share'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">
              {isBM ? 'Perbelanjaan Di Negeri' : 'State Expenditure'}
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              RM {selectedState.expenditureBillionRM}B
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isBM ? 'Hasil ekonomi tempatan' : 'Local economic impact'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">
              {isBM ? 'Kadar Penghunian Hotel (AOR)' : 'Hotel Occupancy (AOR)'}
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {selectedState.hotelOccupancyRate}%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {selectedState.hotelOccupancyRate >= 60 ? (isBM ? 'Permintaan tinggi' : 'High demand') : (isBM ? 'Sederhana' : 'Moderate')}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">
              {isBM ? 'Purata Tempoh Menginap' : 'Average Stay (ALOS)'}
            </p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {selectedState.avgStayDays} {isBM ? 'Hari' : 'Days'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isBM ? 'Bermalam di penginapan' : 'Overnight length'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Bar Chart across All 16 States */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM
                ? 'Perbandingan Penanda Aras Antara 16 Negeri'
                : 'Benchmark Comparison Across 16 States'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Pilih metrik untuk menyusun dan membandingkan prestasi negeri secara langsung'
                : 'Select metric to rank and compare state performance directly'}
            </p>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => setComparisonMetric('visitorsMillion')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                comparisonMetric === 'visitorsMillion'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Pelawat (Juta)' : 'Visitors (M)'}
            </button>
            <button
              onClick={() => setComparisonMetric('expenditureBillionRM')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                comparisonMetric === 'expenditureBillionRM'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Perbelanjaan (RM B)' : 'Spending (RM B)'}
            </button>
            <button
              onClick={() => setComparisonMetric('hotelOccupancyRate')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                comparisonMetric === 'hotelOccupancyRate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Hotel AOR (%)' : 'Hotel AOR (%)'}
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedStates}
              margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="stateName"
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: '#475569' }}
                height={60}
              />
              <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
                formatter={(val: any) => [
                  comparisonMetric === 'visitorsMillion'
                    ? `${val} Juta Pelawat`
                    : comparisonMetric === 'expenditureBillionRM'
                    ? `RM ${val} Bilion`
                    : `${val}% AOR`,
                  isBM ? 'Nilai' : 'Value',
                ]}
              />
              <Bar dataKey={comparisonMetric} radius={[4, 4, 0, 0]}>
                {sortedStates.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.stateCode === selectedState.stateCode ? '#d97706' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
