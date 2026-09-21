import React from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Upload,
  Download,
  Languages,
  Compass,
  Building2,
  Globe2,
  SlidersHorizontal,
  Flame,
  Lightbulb,
  Zap,
  Code2,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, Language, UploadedDataset } from '../types';
import { downloadSampleDOSMExcel } from '../utils/excelParser';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenUpload: () => void;
  uploadedDatasets: UploadedDataset[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenUpload,
  uploadedDatasets,
}) => {
  const isBM = language === 'ms';

  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: isBM ? 'Ringkasan Utama' : 'Executive Overview',
      icon: BarChart3,
    },
    {
      id: 'tpi' as ActiveTab,
      label: isBM ? 'Tourism Pressure Index' : 'Pressure Index (TPI)',
      icon: Flame,
    },
    {
      id: 'recommendations' as ActiveTab,
      label: isBM ? 'Profil & Cadangan' : 'Profile & Recommend',
      icon: Compass,
    },
    {
      id: 'opportunity' as ActiveTab,
      label: isBM ? 'Pengesan Peluang' : 'Opportunity Detector',
      icon: Lightbulb,
    },
    {
      id: 'simulation' as ActiveTab,
      label: isBM ? 'Simulasi Aliran' : 'What-If Flow Sim',
      icon: Zap,
    },
    {
      id: 'states' as ActiveTab,
      label: isBM ? 'Analisis 16 Negeri' : '16 State Analytics',
      icon: Building2,
    },
    {
      id: 'domestic' as ActiveTab,
      label: isBM ? 'Data Domestik DOSM' : 'DOSM Domestic Data',
      icon: FileSpreadsheet,
    },
    {
      id: 'excelExplorer' as ActiveTab,
      label: isBM ? 'Peneroka Excel' : 'Excel Explorer',
      icon: Upload,
      badge: uploadedDatasets.length > 0 ? `${uploadedDatasets.length}` : undefined,
    },
    {
      id: 'appsScript' as ActiveTab,
      label: isBM ? 'Apps Script / API' : 'Apps Script API',
      icon: Code2,
    },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      {/* Top Banner / Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-blue-400 text-sm tracking-wider">
                DOSM
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">
                {isBM ? 'Papan Pemuka Pelancongan Malaysia' : 'Malaysia Tourism Analytics'}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-blue-900/60 text-blue-300 border border-blue-700/50 rounded-full">
                DOSM Data Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isBM
                ? 'Jabatan Perangkaan Malaysia (DOSM) & Survei Pelancongan Kebangsaan'
                : 'Department of Statistics Malaysia (DOSM) & National Tourism Survey'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* Download Sample Excel Button */}
          <button
            id="btn-download-sample-excel"
            onClick={downloadSampleDOSMExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors"
            title={isBM ? 'Muat turun templat Excel DOSM' : 'Download sample DOSM Excel'}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isBM ? 'Templat DOSM' : 'DOSM Template'}</span>
            <span className="sm:hidden">Templat</span>
          </button>

          {/* Upload Excel Button */}
          <button
            id="btn-open-upload-modal"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isBM ? 'Muat Naik Excel' : 'Upload Excel'}</span>
            {uploadedDatasets.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-blue-800 rounded-full">
                {uploadedDatasets.length}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              id="btn-lang-ms"
              onClick={() => setLanguage('ms')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'ms'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BM
            </button>
            <button
              id="btn-lang-en"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/95 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-blue-500/20 text-blue-300 rounded-md border border-blue-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
