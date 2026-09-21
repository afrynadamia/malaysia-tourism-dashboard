import React, { useState, useMemo } from 'react';
import { UserProfile, DestinationItem, Language } from '../types';
import { curatedDestinations, stateTourismStats } from '../data/dosmData';
import {
  Compass,
  Sliders,
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  Users,
  Check,
  Search,
  ExternalLink,
  Flame,
  Bookmark,
  Calendar,
} from 'lucide-react';

interface UserProfileAndRecommendationsTabProps {
  language: Language;
}

export const UserProfileAndRecommendationsTab: React.FC<UserProfileAndRecommendationsTabProps> = ({
  language,
}) => {
  const isBM = language === 'ms';

  // User Profile Form State (As described in Chat PDF page 2, 3, 4, 6)
  const [profile, setProfile] = useState<UserProfile>({
    budgetRM: 500,
    interest: 'gastronomi',
    durationDays: 2,
    originState: 'Selangor',
    preferredState: 'Semua / Fleksibel',
    travelType: 'keluarga',
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [filterCrowdAvoidance, setFilterCrowdAvoidance] = useState<boolean>(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // State options for dropdown
  const stateOptions = [
    'Semua / Fleksibel',
    ...stateTourismStats.map((s) => s.stateName),
  ];

  // Dynamic Destination Recommendation Matching Engine
  const recommendedDestinations: DestinationItem[] = useMemo(() => {
    return curatedDestinations
      .map((dest) => {
        let score = 70; // baseline

        // Interest alignment
        if (dest.suitableFor.includes(profile.interest)) {
          score += 20;
        }

        // Budget alignment
        const totalEstBudget = dest.estBudgetPerDayRM * profile.durationDays;
        if (totalEstBudget <= profile.budgetRM) {
          score += 10;
        } else if (totalEstBudget <= profile.budgetRM * 1.3) {
          score += 5;
        } else {
          score -= 15;
        }

        // Preferred State match
        if (profile.preferredState !== 'Semua / Fleksibel') {
          if (dest.state.toLowerCase() === profile.preferredState.toLowerCase()) {
            score += 15;
          } else {
            score -= 10;
          }
        }

        // Crowd avoidance filter (prefer destinations with lower TPI)
        if (filterCrowdAvoidance && dest.currentTPI > 60) {
          score -= 15;
        } else if (filterCrowdAvoidance && dest.currentTPI < 45) {
          score += 10;
        }

        // Clamp between 50 and 99
        const finalScore = Math.max(50, Math.min(99, score));

        return {
          ...dest,
          matchScore: finalScore,
        };
      })
      .filter((dest) => {
        if (
          profile.preferredState !== 'Semua / Fleksibel' &&
          dest.state.toLowerCase() !== profile.preferredState.toLowerCase()
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [profile, filterCrowdAvoidance]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-400 text-slate-900 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                {isBM ? 'Profil Pelancong & Cadangan Pintar' : 'User Profile & Smart Matcher'}
              </span>
              <span className="text-xs text-blue-200">DOSM Jadual 8A & 8B (Destinasi & Daerah Tumpuan)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {isBM ? 'Padanan Destinasi Berdasarkan Profil Anda' : 'Destination Matching Engine'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {isBM
                ? 'Masukkan bajet, minat, dan pilihan anda di sebelah kiri. Sistem akan memadankan destinasi tumpuan DOSM yang paling sesuai serta memberikan makluman tahap kesesakan (TPI).'
                : 'Enter your budget, interests, and duration. The system dynamically matches top DOSM focal destinations with real-time Tourism Pressure Index (TPI) crowding alerts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-300">{isBM ? 'Destinasi Sepadan' : 'Matched Places'}</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">
                {recommendedDestinations.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Profile (Left) + Destination Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Profile Builder */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {isBM ? 'Borang Profil Pelancong' : 'User Profile Form'}
              </h3>
            </div>
            <button
              onClick={() =>
                setProfile({
                  budgetRM: 500,
                  interest: 'gastronomi',
                  durationDays: 2,
                  originState: 'Selangor',
                  preferredState: 'Semua / Fleksibel',
                  travelType: 'keluarga',
                })
              }
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
            >
              {isBM ? 'Tetap Semula' : 'Reset'}
            </button>
          </div>

          {/* Budget Input (Slider) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                {isBM ? 'Anggaran Bajet Perjalanan:' : 'Trip Budget:'}
              </span>
              <span className="font-mono font-bold text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                RM {profile.budgetRM.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="2500"
              step="50"
              value={profile.budgetRM}
              onChange={(e) =>
                setProfile({ ...profile, budgetRM: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>RM 150 (Jimat)</span>
              <span>RM 1,000 (Sederhana)</span>
              <span>RM 2,500+ (Premium)</span>
            </div>
          </div>

          {/* Travel Interest */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              {isBM ? 'Minat Utama (Aktiviti):' : 'Primary Interest:'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'gastronomi', label: '🍜 Gastronomi & Makanan' },
                { id: 'eko_pantai', label: '🏖️ Eko & Pantai' },
                { id: 'beli_belah', label: '🛍️ Membeli-belah' },
                { id: 'warisan_sejarah', label: '🏛️ Warisan & Sejarah' },
                { id: 'hiburan_keluarga', label: '🎡 Santai & Tema' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setProfile({ ...profile, interest: item.id as any })
                  }
                  className={`px-2.5 py-2 text-xs rounded-xl border text-left font-medium transition-all ${
                    profile.interest === item.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration in Days */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {isBM ? 'Tempoh Percutian (Hari):' : 'Duration (Days):'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((days) => (
                <button
                  key={days}
                  onClick={() => setProfile({ ...profile, durationDays: days })}
                  className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    profile.durationDays === days
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {days === 4 ? `${days}+ Hari` : `${days} Hari`}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Preference */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              {isBM ? 'Pilihan Negeri Destinasi:' : 'Destination State:'}
            </label>
            <select
              value={profile.preferredState}
              onChange={(e) =>
                setProfile({ ...profile, preferredState: e.target.value })
              }
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {stateOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Companion */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              {isBM ? 'Kumpulan Melancong:' : 'Travel Group:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'solo', label: 'Solo / Bujang' },
                { id: 'pasangan', label: 'Pasangan' },
                { id: 'keluarga', label: 'Keluarga' },
                { id: 'rakan', label: 'Rakan-rakan' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setProfile({ ...profile, travelType: item.id as any })
                  }
                  className={`py-1.5 px-2 text-xs rounded-lg border text-center font-medium transition-all ${
                    profile.travelType === item.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crowd Avoidance Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={filterCrowdAvoidance}
                onChange={(e) => setFilterCrowdAvoidance(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-semibold">
                {isBM ? 'Utamakan tempat kurang sesak (TPI Rendah)' : 'Prefer less crowded (Low TPI)'}
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Matched Destinations Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                {isBM ? 'Destinasi Cadangan Sesuai' : 'Matched Destinations'}
              </h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                {recommendedDestinations.length}
              </span>
            </div>

            {bookmarkedIds.length > 0 && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {bookmarkedIds.length} {isBM ? 'Disimpan' : 'Bookmarked'}
              </span>
            )}
          </div>

          {recommendedDestinations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {isBM
                  ? 'Tiada destinasi sepadan dengan pilihan negeri ini.'
                  : 'No destinations match this selected state.'}
              </p>
              <button
                onClick={() =>
                  setProfile({ ...profile, preferredState: 'Semua / Fleksibel' })
                }
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                {isBM ? 'Pilih Semua Negeri' : 'Select All States'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedDestinations.map((dest) => {
                const isBookmarked = bookmarkedIds.includes(dest.id);
                const estTotalTrip = dest.estBudgetPerDayRM * profile.durationDays;
                const isWithinBudget = estTotalTrip <= profile.budgetRM;

                return (
                  <div
                    key={dest.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
                          {dest.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Match Score Badge */}
                          <span className="px-2 py-0.5 text-[11px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
                            {dest.matchScore}% {isBM ? 'Padan' : 'Match'}
                          </span>

                          <button
                            onClick={() => toggleBookmark(dest.id)}
                            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                            title={isBM ? 'Simpan' : 'Bookmark'}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Title & Location */}
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {dest.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>
                          {dest.district}, {dest.state}
                        </span>
                      </div>

                      {/* Highlights */}
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {dest.highlights}
                      </p>
                    </div>

                    {/* Meta Indicators */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {isBM ? 'Anggaran Kos Lawatan:' : 'Est. Trip Cost:'}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isWithinBudget ? 'text-slate-900' : 'text-amber-600'
                          }`}
                        >
                          RM {estTotalTrip} ({profile.durationDays} {isBM ? 'hari' : 'days'})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          {isBM ? 'Tahap Kesesakan (TPI):' : 'Crowd Pressure (TPI):'}
                        </span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            dest.currentTPI > 70
                              ? 'bg-rose-50 text-rose-700'
                              : dest.currentTPI > 40
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {dest.currentTPI.toFixed(1)} / 100
                        </span>
                      </div>

                      {/* Seasonality note */}
                      <div className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg mt-2">
                        💡 {dest.seasonality}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
