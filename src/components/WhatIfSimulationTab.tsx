import React, { useState, useMemo } from 'react';
import { Language, SimulatedStateShift } from '../types';
import {
  stateVisitorHistory,
  stateVisitorHistoryYears,
  calculateTPIByYear,
} from '../data/dosmData';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface WhatIfSimulationTabProps {
  language: Language;
}

export const WhatIfSimulationTab: React.FC<WhatIfSimulationTabProps> = ({ language }) => {
  const isBM = language === 'ms';

  // Preset Scenarios
  const [activeScenario, setActiveScenario] = useState<'diversion' | 'holiday' | 'borneo' | 'custom'>(
    'diversion'
  );

  // Simulation Parameters
  const [divertPercent, setDivertPercent] = useState<number>(15); // 15% diversion
  const [sourceCluster, setSourceCluster] = useState<'selangor_kl' | 'penang' | 'johor'>(
    'selangor_kl'
  );
  const [targetCluster, setTargetCluster] = useState<'east_coast' | 'borneo' | 'northern_rural'>(
    'east_coast'
  );
  const [avgSpendPerTripRM, setAvgSpendPerTripRM] = useState<number>(330);

  // Baseline 2025 Data
  const baselineTpiList = useMemo(() => calculateTPIByYear(7), []); // 2025 index

  // Compute Simulation Shifts
  const simulationResults = useMemo(() => {
    // 1. Identify donor states
    let donorStateNames: string[] = [];
    if (sourceCluster === 'selangor_kl') {
      donorStateNames = ['Selangor', 'W.P. Kuala Lumpur'];
    } else if (sourceCluster === 'penang') {
      donorStateNames = ['Pulau Pinang'];
    } else {
      donorStateNames = ['Johor'];
    }

    // 2. Identify receiver states
    let receiverStateNames: string[] = [];
    if (targetCluster === 'east_coast') {
      receiverStateNames = ['Terengganu', 'Kelantan', 'Pahang'];
    } else if (targetCluster === 'borneo') {
      receiverStateNames = ['Sabah', 'Sarawak'];
    } else {
      receiverStateNames = ['Perlis', 'Kedah'];
    }

    // Calculate diverted pool
    let totalDivertedThousand = 0;
    donorStateNames.forEach((dName) => {
      const stateObj = baselineTpiList.find((s) => s.state === dName);
      if (stateObj) {
        totalDivertedThousand += Math.round(stateObj.visitorsThousand * (divertPercent / 100));
      }
    });

    const perReceiverDiverted =
      receiverStateNames.length > 0
        ? Math.round(totalDivertedThousand / receiverStateNames.length)
        : 0;

    // Calculate state shifts
    const stateShifts: SimulatedStateShift[] = baselineTpiList.map((st) => {
      let delta = 0;
      if (donorStateNames.includes(st.state)) {
        delta = -Math.round(st.visitorsThousand * (divertPercent / 100));
      } else if (receiverStateNames.includes(st.state)) {
        delta = perReceiverDiverted;
      }

      const simulatedVisitors = Math.max(0, st.visitorsThousand + delta);
      // delta expenditure in RM Millions = delta * 1,000 * avgSpend / 1,000,000
      const deltaExpenditure = Math.round((delta * avgSpendPerTripRM) / 1000);

      return {
        state: st.state,
        baselineVisitorsThousand: st.visitorsThousand,
        simulatedVisitorsThousand: simulatedVisitors,
        deltaVisitorsThousand: delta,
        baselineTpi: st.tpi,
        simulatedTpi: 0, // calculated below
        deltaExpenditureMillionRM: deltaExpenditure,
      };
    });

    // Re-calculate simulated TPI
    const simulatedMax = Math.max(...stateShifts.map((s) => s.simulatedVisitorsThousand));
    stateShifts.forEach((s) => {
      s.simulatedTpi =
        simulatedMax > 0
          ? Math.round((s.simulatedVisitorsThousand / simulatedMax) * 1000) / 10
          : 0;
    });

    const economicImpactTotalMillionRM = Math.round(
      (totalDivertedThousand * avgSpendPerTripRM) / 1000
    );

    return {
      stateShifts,
      totalDivertedThousand,
      economicImpactTotalMillionRM,
      donorStateNames,
      receiverStateNames,
    };
  }, [sourceCluster, targetCluster, divertPercent, avgSpendPerTripRM, baselineTpiList]);

  // Chart data for states directly impacted
  const chartData = useMemo(() => {
    const impactedStates = [
      ...simulationResults.donorStateNames,
      ...simulationResults.receiverStateNames,
    ];
    return simulationResults.stateShifts
      .filter((s) => impactedStates.includes(s.state))
      .map((s) => ({
        name: s.state,
        Asal: s.baselineVisitorsThousand,
        Simulasi: s.simulatedVisitorsThousand,
        TpiAsal: s.baselineTpi,
        TpiBaru: s.simulatedTpi,
      }));
  }, [simulationResults]);

  const applyPreset = (preset: 'diversion' | 'holiday' | 'borneo') => {
    setActiveScenario(preset);
    if (preset === 'diversion') {
      setDivertPercent(15);
      setSourceCluster('selangor_kl');
      setTargetCluster('east_coast');
      setAvgSpendPerTripRM(330);
    } else if (preset === 'holiday') {
      setDivertPercent(25);
      setSourceCluster('selangor_kl');
      setTargetCluster('northern_rural');
      setAvgSpendPerTripRM(380);
    } else if (preset === 'borneo') {
      setDivertPercent(10);
      setSourceCluster('selangor_kl');
      setTargetCluster('borneo');
      setAvgSpendPerTripRM(550);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                {isBM ? 'Simulasi Aliran Pelancongan (What-If)' : 'What-If Flow Simulator'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Matriks Aliran Asal-Tujuan (Jadual 10)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isBM
                ? 'Simulasi Pengalihan Aliran Pelancong & Kesan Ekonomi'
                : 'Simulate Tourist Redistribution & Economic Impact'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {isBM
                ? 'Uji senario dasar: apakah yang berlaku sekiranya sebahagian pelancong dari kawasan sesak (Lembah Klang / Johor) dialihkan ke destinasi sekunder seperti Pantai Timur, Perlis, atau Borneo?'
                : 'Test policy scenarios: what happens if tourist traffic from congested clusters (Klang Valley / Johor) is shifted to secondary destinations like the East Coast, Perlis, or Borneo?'}
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1.5 rounded-xl self-start lg:self-center">
            <button
              onClick={() => applyPreset('diversion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeScenario === 'diversion'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Pengalihan Ke Pantai Timur (15%)' : 'Shift to East Coast (15%)'}
            </button>
            <button
              onClick={() => applyPreset('holiday')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeScenario === 'holiday'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Limpahan Cuti Sekolah (25%)' : 'School Holiday Surge (25%)'}
            </button>
            <button
              onClick={() => applyPreset('borneo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeScenario === 'borneo'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isBM ? 'Lonjakan Eko Borneo (10%)' : 'Borneo Eco Surge (10%)'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Impact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBM ? 'Pelancong Dialihkan' : 'Tourists Shifted'}</span>
            <TrendingDown className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 font-mono">
            {simulationResults.totalDivertedThousand.toLocaleString()} '000
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBM
              ? `Kelegaan trafik di ${simulationResults.donorStateNames.join(' & ')}`
              : `Traffic relief in ${simulationResults.donorStateNames.join(' & ')}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBM ? 'Suntikan Tunai Komuniti' : 'Local Cash Injection'}</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            +RM {simulationResults.economicImpactTotalMillionRM.toLocaleString()} Juta
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBM
              ? `Manfaat ekonomi baru kepada peniaga di negeri penerima`
              : `Direct economic benefit to businesses in receiving states`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{isBM ? 'Purata Belanja Setiap Trip' : 'Spend Assumption'}</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 font-mono">
            RM {avgSpendPerTripRM}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBM ? 'Berasaskan benchmark DOSM 2024' : 'Based on DOSM 2024 benchmark'}
          </p>
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              {isBM ? 'Parameter Simulasi' : 'Simulation Parameters'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Sim v1.0</span>
          </div>

          {/* Divert Percentage Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{isBM ? 'Peratusan Pengalihan Aliran:' : 'Diversion Rate:'}</span>
              <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                {divertPercent}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={divertPercent}
              onChange={(e) => {
                setDivertPercent(Number(e.target.value));
                setActiveScenario('custom');
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5% (Ringan)</span>
              <span>20% (Sederhana)</span>
              <span>40% (Maksimum)</span>
            </div>
          </div>

          {/* Cluster Source (Asal) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              {isBM ? 'Zon Asal (Pengurangan Kesesakan):' : 'Source Cluster (Relief):'}
            </label>
            <select
              value={sourceCluster}
              onChange={(e) => {
                setSourceCluster(e.target.value as any);
                setActiveScenario('custom');
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
            >
              <option value="selangor_kl">Lembah Klang (Selangor & KL - TPI Tinggi)</option>
              <option value="penang">Pulau Pinang (TPI 57.0% - Sesak Pulau)</option>
              <option value="johor">Johor (TPI 52.7% - Tumpuan Selatan)</option>
            </select>
          </div>

          {/* Cluster Target (Penerima) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              {isBM ? 'Zon Sasaran Penerima Aliran:' : 'Target Receiver Cluster:'}
            </label>
            <select
              value={targetCluster}
              onChange={(e) => {
                setTargetCluster(e.target.value as any);
                setActiveScenario('custom');
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
            >
              <option value="east_coast">Pantai Timur (Terengganu, Kelantan, Pahang)</option>
              <option value="northern_rural">Utara Tenang (Perlis & Kedah Luar Bandar)</option>
              <option value="borneo">Borneo (Sabah & Sarawak - Tempoh Menginap Lama)</option>
            </select>
          </div>

          {/* Spend Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{isBM ? 'Purata Perbelanjaan (RM/Trip):' : 'Spend Assumption:'}</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                RM {avgSpendPerTripRM}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="600"
              step="25"
              value={avgSpendPerTripRM}
              onChange={(e) => {
                setAvgSpendPerTripRM(Number(e.target.value));
                setActiveScenario('custom');
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Explainer Callout */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
            💡{' '}
            {isBM
              ? 'Model simulasi ini mengira semula skor TPI secara dinamik dengan membahagikan volum baru terhadap negeri pelawat tertinggi semasa.'
              : 'The model dynamically recalibrates TPI scores by recalculating visitor distributions relative to the newly adjusted peak state.'}
          </div>
        </div>

        {/* Right: Visualization & Comparison Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Comparison Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isBM
                    ? 'Perubahan Bilangan Pelawat: Asal vs Simulasi'
                    : 'Visitor Volume: Baseline vs Simulated'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBM ? `Unit: Ribu Pelawat ('000)` : `Unit: Thousand Visitors ('000)`}
                </p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#475569' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any) => [`${Number(val).toLocaleString()} ('000)`, 'Pelawat']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Asal" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulasi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* State Shift Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {isBM ? 'Perincian Perubahan Mengikut Negeri Terpilih' : 'State Impact Details'}
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">{isBM ? 'Negeri' : 'State'}</th>
                    <th className="py-2.5 px-4 text-right">
                      {isBM ? `Asal ('000)` : `Baseline ('000)`}
                    </th>
                    <th className="py-2.5 px-4 text-right">
                      {isBM ? `Simulasi ('000)` : `Simulated ('000)`}
                    </th>
                    <th className="py-2.5 px-4 text-right">{isBM ? 'Perubahan' : 'Change'}</th>
                    <th className="py-2.5 px-4 text-center">TPI (Asal → Baru)</th>
                    <th className="py-2.5 px-4 text-right">
                      {isBM ? 'Impak Ekonomi' : 'Economic Shift'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {simulationResults.stateShifts
                    .filter((s) => s.deltaVisitorsThousand !== 0)
                    .map((item) => {
                      const isDonor = item.deltaVisitorsThousand < 0;
                      return (
                        <tr key={item.state} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{item.state}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-500">
                            {item.baselineVisitorsThousand.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                            {item.simulatedVisitorsThousand.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <span
                              className={`font-semibold ${
                                isDonor ? 'text-rose-600' : 'text-emerald-600'
                              }`}
                            >
                              {item.deltaVisitorsThousand > 0 ? '+' : ''}
                              {item.deltaVisitorsThousand.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-mono text-slate-500 text-[11px]">
                              {item.baselineTpi}%
                            </span>{' '}
                            →{' '}
                            <span className="font-mono font-bold text-blue-700">
                              {item.simulatedTpi}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            <span className={isDonor ? 'text-slate-500' : 'text-emerald-700'}>
                              {item.deltaExpenditureMillionRM > 0 ? '+' : ''}RM{' '}
                              {item.deltaExpenditureMillionRM.toLocaleString()}M
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
