import React, { useState } from 'react';
import { tourismOpportunities } from '../data/dosmData';
import { Language, TourismOpportunity } from '../types';
import {
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Building,
  TreePine,
  Utensils,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface OpportunityDetectorTabProps {
  language: Language;
}

export const OpportunityDetectorTab: React.FC<OpportunityDetectorTabProps> = ({ language }) => {
  const isBM = language === 'ms';
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredOpportunities = tourismOpportunities.filter((item) => {
    if (selectedType === 'all') return true;
    return item.type === selectedType;
  });

  const getTypeIcon = (type: TourismOpportunity['type']) => {
    switch (type) {
      case 'hotel_deficit':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'high_yield':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'underserved':
        return <TreePine className="w-5 h-5 text-amber-600" />;
      case 'gastronomy_hub':
        return <Utensils className="w-5 h-5 text-rose-600" />;
      default:
        return <Target className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority: TourismOpportunity['priorityLevel']) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Bintang Terbit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                {isBM ? 'Pengesan Peluang Pelancongan (DOSM)' : 'Tourism Opportunity Detector'}
              </span>
              <span className="text-xs text-slate-500 font-medium">Data DOSM Jadual 6 & 7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isBM
                ? 'Kenal Pasti Jurang Permintaan & Potensi Pelaburan'
                : 'Identify Demand Gaps & Investment Opportunities'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {isBM
                ? 'Menganalisis corak perbelanjaan, purata tempoh menginap (ALOS), dan kadar penghunian hotel (AOR) untuk mengesan kawasan pelancongan bernilai tinggi serta defisit penginapan yang belum diterokai.'
                : 'Analysing spending components, average length of stay (ALOS), and hotel occupancy (AOR) to detect high-value tourism clusters and accommodation capacity deficits.'}
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1.5 rounded-xl self-start lg:self-center">
            {[
              { id: 'all', label: isBM ? 'Semua Peluang' : 'All' },
              { id: 'hotel_deficit', label: isBM ? 'Defisit Hotel' : 'Hotel Deficit' },
              { id: 'high_yield', label: isBM ? 'Pulangan Tinggi' : 'High Yield' },
              { id: 'underserved', label: isBM ? 'Destinasi Tenang' : 'Underserved' },
              { id: 'gastronomy_hub', label: isBM ? 'Gastronomi' : 'Gastronomy' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedType(btn.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedType === btn.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Metric Callout Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              {isBM ? 'Potensi Nilai Tinggi (Borneo)' : 'High-Yield Opportunity'}
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">3.4 Hari</div>
          <p className="text-xs text-slate-600 mt-1">
            {isBM
              ? 'Purata menginap di Sabah & Sarawak 60% lebih lama berbanding Semenanjung.'
              : 'ALOS in Sabah & Sarawak is 60% longer than Peninsular average.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 border border-purple-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">
              {isBM ? 'Tekanan Defisit Bilik' : 'Room Supply Deficit'}
            </span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">67.8% AOR</div>
          <p className="text-xs text-slate-600 mt-1">
            {isBM
              ? 'Pahang & Penang mencatat kadar penghunian tertinggi, melonjak melepasi 85% musim cuti.'
              : 'Pahang & Penang report highest hotel occupancy, exceeding 85% during holidays.'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-5 border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              {isBM ? 'Kapasiti Melimpah' : 'Unsaturated Capacity'}
            </span>
            <TreePine className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">TPI 9.9%</div>
          <p className="text-xs text-slate-600 mt-1">
            {isBM
              ? 'Perlis & Kedah luar bandar sedia menampung limpahan pelancong tanpa kesesakan.'
              : 'Perlis & rural Kedah ready to absorb tourist diversion without bottleneck.'}
          </p>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOpportunities.map((opp) => {
          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header line */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {getTypeIcon(opp.type)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {opp.state}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{opp.title}</h3>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${getPriorityBadge(
                      opp.priorityLevel
                    )}`}
                  >
                    {opp.priorityLevel}
                  </span>
                </div>

                {/* Metric Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">{opp.metricLabel}</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {opp.metricValue}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {opp.opportunityDescription}
                </p>
              </div>

              {/* Action Recommendation */}
              <div className="pt-4 border-t border-slate-100 bg-amber-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                      {isBM ? 'Tindakan Strategik Disyorkan:' : 'Recommended Strategic Action:'}
                    </div>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                      {opp.actionRecommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
