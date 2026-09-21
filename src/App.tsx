/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, Language, UploadedDataset } from './types';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { DomesticTab } from './components/DomesticTab';
import { StateDeepDiveTab } from './components/StateDeepDiveTab';
import { CustomExcelExplorer } from './components/CustomExcelExplorer';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { TourismPressureTab } from './components/TourismPressureTab';
import { UserProfileAndRecommendationsTab } from './components/UserProfileAndRecommendationsTab';
import { OpportunityDetectorTab } from './components/OpportunityDetectorTab';
import { WhatIfSimulationTab } from './components/WhatIfSimulationTab';
import { AppsScriptBackendHub } from './components/AppsScriptBackendHub';
import { downloadSampleDOSMExcel } from './utils/excelParser';
import { FileSpreadsheet, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [language, setLanguage] = useState<Language>('ms');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [activeUploadedDataset, setActiveUploadedDataset] = useState<UploadedDataset | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string>('');

  const isBM = language === 'ms';

  const handleAddDataset = (dataset: UploadedDataset) => {
    setUploadedDatasets(prev => [dataset, ...prev]);
    setActiveUploadedDataset(dataset);
    if (dataset.sheets[0]) {
      setActiveSheetName(dataset.sheets[0].sheetName);
    }
  };

  const handleRemoveDataset = (id: string) => {
    setUploadedDatasets(prev => {
      const filtered = prev.filter(d => d.id !== id);
      if (activeUploadedDataset?.id === id) {
        setActiveUploadedDataset(filtered[0] || null);
        setActiveSheetName(filtered[0]?.sheets[0]?.sheetName || '');
      }
      return filtered;
    });
  };

  const handleSelectDatasetForExplorer = (dataset: UploadedDataset, sheetName: string) => {
    setActiveUploadedDataset(dataset);
    setActiveSheetName(sheetName);
    setActiveTab('excelExplorer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        uploadedDatasets={uploadedDatasets}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If user has uploaded datasets, show a quick notification pill */}
        {uploadedDatasets.length > 0 && activeTab !== 'excelExplorer' && (
          <div className="mb-4 bg-blue-50 border border-blue-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-700" />
              <span>
                {isBM
                  ? `Anda mempunyai ${uploadedDatasets.length} fail Excel aktif dimuat naik (${uploadedDatasets[0].fileName}).`
                  : `You have ${uploadedDatasets.length} active uploaded Excel file (${uploadedDatasets[0].fileName}).`}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('excelExplorer')}
              className="font-bold text-blue-700 hover:text-blue-900 underline shrink-0"
            >
              {isBM ? 'Buka dalam Visualizer →' : 'Open in Visualizer →'}
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <OverviewTab language={language} onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'tpi' && <TourismPressureTab language={language} />}

        {activeTab === 'recommendations' && (
          <UserProfileAndRecommendationsTab language={language} />
        )}

        {activeTab === 'opportunity' && <OpportunityDetectorTab language={language} />}

        {activeTab === 'simulation' && <WhatIfSimulationTab language={language} />}

        {activeTab === 'states' && <StateDeepDiveTab language={language} />}

        {activeTab === 'domestic' && <DomesticTab language={language} />}

        {activeTab === 'excelExplorer' && (
          <CustomExcelExplorer
            language={language}
            uploadedDatasets={uploadedDatasets}
            activeUploadedDataset={activeUploadedDataset}
            activeSheetName={activeSheetName}
            onSelectDatasetAndSheet={(ds, sh) => {
              setActiveUploadedDataset(ds);
              setActiveSheetName(sh);
            }}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'appsScript' && <AppsScriptBackendHub language={language} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {isBM
                ? 'Sumber Rujukan: Jabatan Perangkaan Malaysia (DOSM) & Tourism Malaysia'
                : 'Reference Source: Department of Statistics Malaysia (DOSM) & Tourism Malaysia'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={downloadSampleDOSMExcel}
              className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              {isBM ? 'Muat Turun Format Excel' : 'Download Excel Template'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isBM ? '+ Muat Naik Fail Anda' : '+ Upload Your File'}
            </button>
          </div>
        </div>
      </footer>

      {/* Excel Upload & Sheet Viewer Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        language={language}
        uploadedDatasets={uploadedDatasets}
        onAddDataset={handleAddDataset}
        onRemoveDataset={handleRemoveDataset}
        onSelectDatasetForExplorer={handleSelectDatasetForExplorer}
      />
    </div>
  );
}
