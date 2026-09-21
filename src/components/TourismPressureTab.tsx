import React, { useState, useMemo } from 'react';
import {
  stateVisitorHistory,
  stateVisitorHistoryYears,
  calculateTPIByYear,
} from '../data/dosmData';
import { Language, TPIEntry } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  AlertTriangle,
  Info,
  Layers,
  ArrowUpDown,
  Filter,
  Flame,
  CheckCircle2,
  Hotel,
  TrendingUp,
} from 'lucide-react';

interface TourismPressureTabProps {
  language: Language;
}

export const TourismPressureTab: React.FC<TourismPressureTabProps> = ({ language }) => {
  const isBM = language === 'ms';
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(
    stateVisitorHistoryYears.length - 1
  ); // Default 2025 (latest)
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedYear = stateVisitorHistoryYears[selectedYearIndex];

  // Calculate TPI based on formula from PDF: (Pelawat negeri / Pelawat tertinggi) * 100
  const tpiData: TPIEntry[] = useMemo(() => {
    return calculateTPIByYear(selectedYearIndex);
  }, [selectedYearIndex]);

  const filteredData = useMemo(() => {
    return tpiData.filter((item) => {
      const matchSearch = item.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [tpiData, searchQuery, selectedLevel]);

  const maxVisitorsInYear = tpiData[0]?.visitorsThousand || 1;

  // Chart data formatted
  const chartData = useMemo(() => {
    return tpiData.slice(0, 10).map((d) => ({
      name: d.state,
      tpi: d.tpi,
      visitors: d.visitorsThousand,
      level: d.level,
    }));
  }, [tpiData]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Kritikal':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          bar: '#e11d48',
          dot: 'bg-rose-500',
        };
      case 'Tinggi':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: '#f59e0b',
          dot: 'bg-amber-500',
        };
      case 'Sederhana':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          bar: '#3b82f6',
          dot: 'bg-blue-500',
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: '#10b981',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-800 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                {isBM ? 'Konsep Teras Dari Perbincangan DOSM' : 'Core Concept from DOSM Chat'}
              </span>
              <span className="text-xs text-slate-500 font-medium">Jadual 9 (2018–2025)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isBM ? 'Tourism Pressure Index (TPI) Malaysia' : 'Malaysia Tourism Pressure Index'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {isBM
                ? 'Indeks relatif mengukur kepekatan pelawat domestik berbanding negeri tertinggi pada tahun yang dipilih. Nilai 100 menandakan negeri dengan kemasukan pelawat tertinggi.'
                : 'A relative index measuring domestic visitor concentration against the peak state for the selected year. A value of 100 represents the state with highest visitor inflow.'}
            </p>
          </div>

          {/* Year Selector Dropdown */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
            <span className="text-xs font-semibold text-slate-700">
              {isBM ? 'Pilih Tahun Data:' : 'Select Data Year:'}
            </span>
            <div className="flex items-center gap-1">
              {stateVisitorHistoryYears.map((yr, idx) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYearIndex(idx)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedYearIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Explainer Pill */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {isBM ? 'Formula Pengiraan TPI:' : 'TPI Calculation Formula:'}{' '}
              <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                TPI = (Pelawat Negeri / {maxVisitorsInYear.toLocaleString()} '000) × 100
              </code>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              {isBM ? 'Kritikal (≥80)' : 'Critical (≥80)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              {isBM ? 'Tinggi (50-79)' : 'High (50-79)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              {isBM ? 'Sederhana (25-49)' : 'Moderate (25-49)'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {isBM ? 'Rendah (<25)' : 'Low (<25)'}
            </span>
          </div>
        </div>
      </div>

      {/* Top 10 States TPI Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isBM
                ? `10 Negeri Teratas Berdasarkan TPI (${selectedYear})`
                : `Top 10 States by TPI (${selectedYear})`}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Perbandingan kepekatan pelancong & risiko kesesakan'
                : 'Comparison of tourist concentration & crowding risk'}
            </p>
          </div>
          <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
            Tahun Rujukan: {selectedYear}
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 500 }}
                width={85}
              />
              <Tooltip
                formatter={(val: any) => [`${Number(val).toFixed(1)} / 100`, 'TPI Score']}
                labelFormatter={(label) => `Negeri: ${label}`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="tpi" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getLevelColor(entry.level).bar} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Table with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder={isBM ? 'Cari nama negeri...' : 'Search state name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">
              {isBM ? 'Tahap Tekanan:' : 'Pressure Level:'}
            </span>
            {['all', 'Kritikal', 'Tinggi', 'Sederhana', 'Rendah'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl === 'all' ? (isBM ? 'Semua' : 'All') : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 font-semibold">{isBM ? 'Negeri' : 'State'}</th>
                <th className="py-3 px-4 text-right">
                  {isBM ? `Pelawat ('000)` : `Visitors ('000)`}
                </th>
                <th className="py-3 px-4 text-center font-bold text-blue-900">
                  TPI ({selectedYear})
                </th>
                <th className="py-3 px-4 text-center">{isBM ? 'Tahap Tekanan' : 'Pressure Level'}</th>
                <th className="py-3 px-4 text-right">
                  {isBM ? 'Kadar Bilik Hotel (AOR)' : 'Hotel Occupancy'}
                </th>
                <th className="py-3 px-4">{isBM ? 'Impak & Kesan Kapasiti' : 'Capacity & Impact'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, index) => {
                const colorConfig = getLevelColor(item.level);
                return (
                  <tr key={item.state} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorConfig.dot}`}></span>
                      {item.state}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800 font-mono">
                      {item.visitorsThousand.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        <span>{item.tpi.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorConfig.bg}`}
                      >
                        {item.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 font-mono">
                      {item.hotelOccupancyRate}%
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{item.stressFactor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {isBM
              ? `Memaparkan ${filteredData.length} daripada 16 negeri/wilayah bagi tahun ${selectedYear}.`
              : `Showing ${filteredData.length} of 16 states/territories for year ${selectedYear}.`}
          </span>
          <span className="text-[11px] text-slate-400">
            Sumber Data: DOSM Jadual 9 & Survei Pelancongan Domestik
          </span>
        </div>
      </div>
    </div>
  );
};
