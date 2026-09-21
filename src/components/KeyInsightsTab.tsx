import React from 'react';
import { Language } from '../types';
import {
  keyInsightsList,
  dosmQuarterlySeries,
  domesticYearlyStats,
} from '../data/dosmData';
import {
  TrendingUp,
  Sparkles,
  Car,
  Users,
  PieChart as PieChartIcon,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Building2,
  DollarSign,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface KeyInsightsTabProps {
  language: Language;
}

export const KeyInsightsTab: React.FC<KeyInsightsTabProps> = ({ language }) => {
  const isBM = language === 'ms';

  const quarterlyChartData = dosmQuarterlySeries.map((q) => ({
    name: q.quarter,
    visitors: q.visitorsMillion,
    spend: q.expenditureBillionRM,
    growth: q.yoyGrowth,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {isBM ? 'Rumusan Eksekutif (Key Insights)' : 'Executive Key Insights'}
          </span>
          <span className="text-xs text-slate-500 font-medium">DOSM 2018 - 2026</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isBM
            ? 'Penemuan Utama Survei Pelancongan Domestik Kebangsaan'
            : 'National Domestic Tourism Survey Key Findings'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          {isBM
            ? 'Daftar penemuan strategik berasaskan statistik rasmi DOSM merangkumi trajektori pemulihan, corak bermusim suku tahunan, demografi kuasa beli, dan tingkah laku mobiliti pelawat.'
            : 'Strategic findings from official DOSM statistics covering recovery trajectories, quarterly seasonality, purchasing power demographics, and visitor mobility behaviors.'}
        </p>
      </div>

      {/* 4 Core Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {keyInsightsList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-700 rounded-full">
                  {item.tag}
                </span>
                <span className="text-xs font-extrabold text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.stat}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                {isBM ? 'Implikasi Polisi & Industri:' : 'Policy & Industry Implication:'}
              </span>
              <p className="text-xs text-slate-600 mt-0.5">{item.strategicNote}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quarterly Seasonality (Jadual A Suku Tahunan) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              {isBM
                ? 'Kesan Bermusim: Prestasi Suku Tahunan (Jadual A, 2023 - 2024)'
                : 'Quarterly Seasonality Performance (Table A, 2023 - 2024)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Lonjakan ketara pada Q2 & Q4 sempena musim cuti persekolahan dan perayaan perpaduan'
                : 'Significant surges in Q2 & Q4 driven by school breaks and national festivals'}
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
            Pertumbuhan YoY Purata: +16.7%
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quarterlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="M"
                label={{ value: 'Juta Pelawat', angle: -90, position: 'insideLeft', fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#64748b' }}
                unit="B"
                label={{ value: 'RM Bilion', angle: 90, position: 'insideRight', fontSize: 10 }}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  name === 'visitors' ? `${val} Juta Pelawat` : `RM ${val} Bilion`,
                  name === 'visitors' ? 'Bilangan Pelawat' : 'Perbelanjaan',
                ]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar yAxisId="left" dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics & Household Income (Jadual 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Household Income Distribution (B40, M40, T20) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {isBM
                  ? 'Taburan Pendapatan Isi Rumah Pelawat (Jadual 13)'
                  : 'Visitor Household Income Tiers (Table 13)'}
              </h4>
              <p className="text-xs text-slate-500">
                {isBM ? 'Kuasa beli pelancong domestik' : 'Domestic tourist spending power'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                tier: 'M40 (RM5,250 - RM11,819)',
                share: 44.6,
                color: 'bg-blue-600',
                note: 'Segmen terbesar; mengutamakan penginapan mesra keluarga & santai hujung minggu',
              },
              {
                tier: 'B40 (< RM5,250)',
                share: 41.2,
                color: 'bg-emerald-600',
                note: 'Melawat saudara mara (VFR), perkelahan pantai dan lawatan harian jimat kos',
              },
              {
                tier: 'T20 (> RM11,820)',
                share: 14.2,
                color: 'bg-amber-500',
                note: 'Perbelanjaan tinggi di resort premium, gastronomi butik & penerbangan domestik',
              },
            ].map((inc) => (
              <div key={inc.tier} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{inc.tier}</span>
                  <span className="font-mono">{inc.share}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${inc.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${inc.share}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">{inc.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Modes (Jadual 11 & 12) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {isBM
                  ? 'Mod Pengangkutan Utama (Jadual 11 & 12)'
                  : 'Primary Transport Modes (Table 11 & 12)'}
              </h4>
              <p className="text-xs text-slate-500">
                {isBM ? 'Keutamaan logistik pengembara' : 'Traveler mobility preferences'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                mode: isBM ? 'Kenderaan Persendirian (Kereta/Van)' : 'Private Vehicles (Car/Van)',
                share: 88.4,
                color: 'bg-indigo-600',
                desc: 'Membolehkan mobiliti keluarga & akses ke destinasi luar bandar',
              },
              {
                mode: isBM ? 'Pengangkutan Udara (Penerbangan)' : 'Air Flights',
                share: 5.6,
                color: 'bg-cyan-600',
                desc: 'Sambungan utama Semenanjung ke Sabah, Sarawak & Langkawi',
              },
              {
                mode: isBM ? 'Bas Awam / Sewa Khas' : 'Buses / Express Coaches',
                share: 3.8,
                color: 'bg-amber-600',
                desc: 'Pilihan jimat untuk pelajar, rombongan & warga emas',
              },
              {
                mode: isBM ? 'Kereta Api (ETS / Komuter) & Bot' : 'Rail (ETS) & Ferries',
                share: 2.2,
                color: 'bg-slate-600',
                desc: 'Pertumbuhan tinggi di koridor KL-Ipoh-Penang-Padang Besar',
              },
            ].map((tr) => (
              <div key={tr.mode} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{tr.mode}</span>
                  <span className="font-mono">{tr.share}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${tr.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${tr.share}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">{tr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
