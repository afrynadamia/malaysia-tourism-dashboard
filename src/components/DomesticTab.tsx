import React, { useState } from 'react';
import {
  ShoppingBag,
  Utensils,
  Car,
  Hotel,
  Ticket,
  Search,
  ArrowUpDown,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Language } from '../types';
import {
  domesticYearlyStats,
  spendingComponents,
  visitPurposes,
  stateTourismStats,
} from '../data/dosmData';
import { MetricCard } from './MetricCard';

interface DomesticTabProps {
  language: Language;
}

export const DomesticTab: React.FC<DomesticTabProps> = ({ language }) => {
  const isBM = language === 'ms';
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'visitorsMillion' | 'expenditureBillionRM' | 'hotelOccupancyRate'>('visitorsMillion');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const selectedYearData =
    domesticYearlyStats.find(d => d.year === selectedYear) ||
    domesticYearlyStats[domesticYearlyStats.length - 1];

  // Filter & sort states
  const filteredStates = stateTourismStats
    .filter(st => st.stateName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const mult = sortOrder === 'asc' ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * mult;
    });

  const toggleSort = (field: 'visitorsMillion' | 'expenditureBillionRM' | 'hotelOccupancyRate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isBM ? 'Pilih Tahun Survei DOSM:' : 'Select DOSM Survey Year:'}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            {domesticYearlyStats.map(stat => (
              <button
                key={stat.year}
                onClick={() => setSelectedYear(stat.year)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedYear === stat.year
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {stat.year}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {isBM
            ? 'Survei Pelancongan Domestik (Domestic Tourism Survey - DTS)'
            : 'Domestic Tourism Survey (DTS) Official Statistics'}
        </div>
      </div>

      {/* Selected Year KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="stat-visitors"
          title={isBM ? `Pelawat Domestik (${selectedYear})` : `Domestic Visitors (${selectedYear})`}
          value={`${selectedYearData.visitorsMillion}M`}
          subtitle={isBM ? `${selectedYearData.tripsMillion}M jumlah perjalanan` : `${selectedYearData.tripsMillion}M total trips`}
          icon={ShoppingBag}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
        />

        <MetricCard
          id="stat-expenditure"
          title={isBM ? `Jumlah Perbelanjaan` : `Total Expenditure`}
          value={`RM ${selectedYearData.expenditureBillionRM}B`}
          subtitle={isBM ? `Sumbangan ekonomi tempatan` : `Local economic contribution`}
          icon={Utensils}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <MetricCard
          id="stat-avg-spend"
          title={isBM ? `Purata Per Trip` : `Average Spend Per Trip`}
          value={`RM ${selectedYearData.avgSpendPerTripRM}`}
          subtitle={isBM ? `Kos setiap kali perjalanan` : `Cost per travel trip`}
          icon={Car}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-700"
        />

        <MetricCard
          id="stat-stay"
          title={isBM ? `Purata Menginap` : `Average Length of Stay`}
          value={`${selectedYearData.avgStayDays} ${isBM ? 'Hari' : 'Days'}`}
          subtitle={isBM ? `Bermalam di destinasi` : `Overnight duration`}
          icon={Hotel}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-700"
        />
      </div>

      {/* Spending Breakdown & Purpose of Visit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Components Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Komponen Perbelanjaan Pelancongan Domestik' : 'Domestic Tourism Spending Components'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Pecahan perbelanjaan utama rakyat Malaysia (Membeli-belah mendahului 36.3%)'
                : 'Key expense breakdown (Shopping leads at 36.3%)'}
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingComponents}
                  dataKey="percentage"
                  nameKey={isBM ? 'category' : 'categoryEn'}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {spendingComponents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(val: any, name: any) => [`${val}% (RM ${(Number(val) * 0.986).toFixed(1)}B)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
            {spendingComponents.map(comp => (
              <div key={comp.category} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: comp.color }} />
                <span className="text-slate-600 truncate">{isBM ? comp.category : comp.categoryEn}:</span>
                <span className="font-bold text-slate-800">{comp.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose of Visit Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Tujuan Utama Lawatan Domestik' : 'Main Purpose of Domestic Trips'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Melawat saudara-mara (VFR) dan membeli-belah merangkumi >65% tujuan'
                : 'Visiting friends/relatives (VFR) and shopping account for >65%'}
            </p>
          </div>

          <div className="space-y-3 py-2">
            {visitPurposes.map(p => (
              <div key={p.purpose} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{isBM ? p.purpose : p.purposeEn}</span>
                  <span className="font-bold text-slate-900">{p.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.percentage * 2.5}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            {isBM
              ? '*Data bersandarkan Laporan Survei Pelancongan Domestik Jabatan Perangkaan Malaysia.'
              : '*Grounded in Department of Statistics Malaysia Domestic Tourism Survey publications.'}
          </div>
        </div>
      </div>

      {/* State-by-State Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBM ? 'Pencapaian Pelancongan Mengikut 16 Negeri' : 'Tourism Performance Across 16 States'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Klik tajuk lajur untuk susun semula atau gunakan carian untuk tapis negeri'
                : 'Click column headers to sort or search to filter states'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isBM ? 'Cari negeri...' : 'Search state...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{isBM ? 'Negeri / Wilayah' : 'State / Territory'}</th>
                <th
                  onClick={() => toggleSort('visitorsMillion')}
                  className="px-4 py-3 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isBM ? 'Pelawat (Juta)' : 'Visitors (M)'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('expenditureBillionRM')}
                  className="px-4 py-3 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isBM ? 'Perbelanjaan (RM Bilion)' : 'Spending (RM B)'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('hotelOccupancyRate')}
                  className="px-4 py-3 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isBM ? 'Penghunian Hotel (%)' : 'Hotel Occupancy (%)'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">{isBM ? 'Purata Menginap' : 'Avg Stay (Days)'}</th>
                <th className="px-4 py-3">{isBM ? 'Tarikan / Fokus Utama' : 'Key Focus'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStates.map((st, idx) => (
                <tr key={st.stateCode} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <span className="inline-block w-8 text-[11px] font-mono text-slate-400">
                      {st.stateCode}
                    </span>
                    {st.stateName}
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-700">
                    {st.visitorsMillion}M
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    RM {st.expenditureBillionRM}B
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.hotelOccupancyRate >= 60
                              ? 'bg-emerald-500'
                              : st.hotelOccupancyRate >= 50
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${st.hotelOccupancyRate}%` }}
                        />
                      </div>
                      <span className="font-semibold">{st.hotelOccupancyRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{st.avgStayDays} hari</td>
                  <td className="px-4 py-3 text-slate-500">{st.topPurpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
