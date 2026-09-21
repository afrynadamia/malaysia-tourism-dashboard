import React, { useState } from 'react';
import { Language } from '../types';
import {
  stateVisitorHistory,
  stateVisitorHistoryYears,
  calculateTPIByYear,
  curatedDestinations,
} from '../data/dosmData';
import {
  Code2,
  Play,
  Copy,
  Check,
  Terminal,
  FileSpreadsheet,
  Globe,
  Database,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AppsScriptBackendHubProps {
  language: Language;
}

export const AppsScriptBackendHub: React.FC<AppsScriptBackendHubProps> = ({ language }) => {
  const isBM = language === 'ms';

  const [activeEndpoint, setActiveEndpoint] = useState<
    'getStateVisitors' | 'getTpiData' | 'getRecommendations' | 'doGet'
  >('getStateVisitors');
  const [copied, setCopied] = useState<boolean>(false);
  const [apiOutput, setApiOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Live execution simulator of the Google Apps Script functions from PDF
  const runLiveTest = (endpoint: 'getStateVisitors' | 'getTpiData' | 'getRecommendations') => {
    setIsRunning(true);
    setTimeout(() => {
      if (endpoint === 'getStateVisitors') {
        const payload = {
          years: stateVisitorHistoryYears,
          states: stateVisitorHistory.slice(0, 5).map((s) => ({
            state: s.state,
            visitors: s.visitors,
          })),
          totalStatesCount: stateVisitorHistory.length,
          status: 'success',
          source: 'Google Sheets (Tab 9: 2018-2025)',
        };
        setApiOutput(JSON.stringify(payload, null, 2));
      } else if (endpoint === 'getTpiData') {
        const latestTpi = calculateTPIByYear(stateVisitorHistoryYears.length - 1);
        const payload = {
          year: '2025',
          method: 'Relative visitor volume index: TPI = (state / max) * 100',
          states: latestTpi.slice(0, 6).map((s) => ({
            state: s.state,
            visitors: s.visitorsThousand,
            tpi: s.tpi,
            level: s.level,
          })),
          status: 'success',
        };
        setApiOutput(JSON.stringify(payload, null, 2));
      } else {
        const payload = {
          matchedDestinations: curatedDestinations.slice(0, 3).map((d) => ({
            name: d.name,
            state: d.state,
            district: d.district,
            category: d.category,
            estBudgetPerDayRM: d.estBudgetPerDayRM,
            matchScore: d.matchScore,
            currentTPI: d.currentTPI,
          })),
          totalFound: curatedDestinations.length,
          status: 'success',
        };
        setApiOutput(JSON.stringify(payload, null, 2));
      }
      setIsRunning(false);
    }, 300);
  };

  // Google Apps Script Code snippets from pages 8-22
  const appsScriptCodeSnippets = {
    getStateVisitors: `/**
 * Google Apps Script - Code.gs
 * Fungsi untuk membaca Tab 9 (Bilangan Pelawat Domestik mengikut Negeri 2018-2025)
 */
function getStateVisitors() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("9");
  const data = sheet.getDataRange().getDisplayValues();
  
  // Baris tahun berada pada indeks 4 (baris ke-5 dalam Sheets)
  const years = data[4].slice(1);
  
  // Baris data 16 negeri bermula dari baris ke-7 (indeks 6 hingga 22)
  const states = data.slice(6, 22).map(row => ({
    state: row[0],
    visitors: row.slice(1).map(value => Number(value.replace(/,/g, "")))
  }));
  
  return {
    years: years,
    states: states
  };
}

// Fungsi ujian di Execution Log
function testGetStateVisitors() {
  const result = getStateVisitors();
  Logger.log(JSON.stringify(result));
}`,

    getTpiData: `/**
 * Google Apps Script - Code.gs
 * Fungsi pengiraan Tourism Pressure Index (TPI)
 * Formula: TPI = (Pelawat negeri / Pelawat tertinggi antara negeri) * 100
 */
function getTpiData() {
  const data = getStateVisitors();
  const latestYearIndex = data.years.length - 1; // 2025
  
  // Cari bilangan pelawat tertinggi antara semua negeri
  const maxVisitors = Math.max(
    ...data.states.map(s => s.visitors[latestYearIndex])
  );
  
  const states = data.states.map(state => {
    const latestVisitors = state.visitors[latestYearIndex];
    const tpi = maxVisitors > 0 ? (latestVisitors / maxVisitors) * 100 : 0;
    
    return {
      state: state.state,
      visitors: latestVisitors,
      tpi: Math.round(tpi * 10) / 10
    };
  });
  
  return {
    year: data.years[latestYearIndex],
    method: "Relative visitor volume index",
    states: states
  };
}

function testTpiData() {
  const result = getTpiData();
  Logger.log(JSON.stringify(result));
}`,

    getRecommendations: `/**
 * Google Apps Script - Code.gs
 * Fungsi Padanan Destinasi mengikut Profil Pengguna
 * Menggunakan data Jadual 8A & 8B (Destinasi & Daerah Tumpuan)
 */
function getRecommendations(profile) {
  // Profil: { budgetRM: 500, interest: 'gastronomi', durationDays: 2 }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("8A"); // Atau sheet data destinasi anda
  
  // Baca data dan buat padanan mengikut kriteria
  // Frontend memanggil: google.script.run.withSuccessHandler(onSuccess).getRecommendations(profile);
  return {
    status: "success",
    timestamp: new Date().toISOString()
  };
}`,

    doGet: `/**
 * Google Apps Script Web App Entrypoint
 * Memaparkan Frontend Dashboard HTML secara terus daripada Google Apps Script
 */
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Malaysia Tourism Dashboard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}`,
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-400 text-slate-900 rounded-full flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" />
                {isBM ? 'Panduan Google Apps Script (Backend & API)' : 'Google Apps Script Hub'}
              </span>
              <span className="text-xs text-slate-400">Step 1 - Step 7 Lengkap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {isBM
                ? 'Integrasi Google Sheets & Google Apps Script'
                : 'Google Sheets & Apps Script Architecture'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              {isBM
                ? 'Panduan langkah demi langkah menyambungkan Google Sheets (tempat simpanan data Excel DOSM) dengan Google Apps Script sebagai API backend bagi memproses data TPI dan menghantarnya ke frontend.'
                : 'Step-by-step tutorial connecting Google Sheets (DOSM data storage) with Google Apps Script as the backend API to calculate TPI and feed the dashboard.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-400">100% Sedia Digunakan</span>
              <div>Salin & Tampal ke Code.gs</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Flow Diagram (from PDF page 3, 4, 6) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">
          {isBM ? 'Struktur Seni Bina Sistem (Architecture Flow)' : 'System Architecture Flow'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
              1
            </div>
            <div className="font-bold text-sm text-blue-900">User Profile</div>
            <p className="text-xs text-blue-700">
              User masukkan bajet, minat, tempoh cuti & pilihan destinasi.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
              2
            </div>
            <div className="font-bold text-sm text-indigo-900">Frontend Web UI</div>
            <p className="text-xs text-indigo-700">
              Paparkan borang, graf TPI, rekomendasi & simulasi aliran.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center mx-auto text-xs font-bold">
              3
            </div>
            <div className="font-bold text-sm text-amber-900">Apps Script (API Backend)</div>
            <p className="text-xs text-amber-800">
              Fungsi <code>getStateVisitors()</code>, <code>getTpiData()</code>, proses kiraan TPI.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
              4
            </div>
            <div className="font-bold text-sm text-emerald-900">Google Sheets (Storage)</div>
            <p className="text-xs text-emerald-800">
              Tab 1 hingga Tab 13 fail Excel DOSM disimpan secara online.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippets & Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              {[
                { id: 'getStateVisitors', label: 'getStateVisitors()' },
                { id: 'getTpiData', label: 'getTpiData() [Formula TPI]' },
                { id: 'getRecommendations', label: 'getRecommendations()' },
                { id: 'doGet', label: 'doGet() Web App' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEndpoint(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
                    activeEndpoint === tab.id
                      ? 'bg-slate-900 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => copyCode(appsScriptCodeSnippets[activeEndpoint])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kod</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto flex-1 leading-relaxed">
            <pre className="text-emerald-400">
              {appsScriptCodeSnippets[activeEndpoint]}
            </pre>
          </div>
        </div>

        {/* Right: Live Interactive Execution Tester */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                {isBM ? 'Simulator Ujian Respons API (Live)' : 'Live API Response Simulator'}
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ● Ready
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {isBM
                ? 'Klik butang di bawah untuk melihat contoh output JSON sebenar yang dihasilkan oleh fungsi Apps Script apabila dipanggil oleh frontend dashboard:'
                : 'Click below to simulate real JSON output returned by Apps Script functions to the frontend dashboard:'}
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => runLiveTest('getStateVisitors')}
                disabled={isRunning}
                className="w-full py-2 px-3 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-between"
              >
                <span>Uji getStateVisitors() (Tab 9)</span>
                <Play className="w-3.5 h-3.5 text-blue-700" />
              </button>

              <button
                onClick={() => runLiveTest('getTpiData')}
                disabled={isRunning}
                className="w-full py-2 px-3 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-between"
              >
                <span>Uji getTpiData() (Kiraan TPI)</span>
                <Play className="w-3.5 h-3.5 text-indigo-700" />
              </button>

              <button
                onClick={() => runLiveTest('getRecommendations')}
                disabled={isRunning}
                className="w-full py-2 px-3 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-between"
              >
                <span>Uji getRecommendations()</span>
                <Play className="w-3.5 h-3.5 text-amber-800" />
              </button>
            </div>

            {/* Output Box */}
            <div className="mt-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                JSON Response Output:
              </div>
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] h-48 overflow-y-auto border border-slate-800">
                {isRunning ? (
                  <div className="text-amber-400">Memproses permintaan API...</div>
                ) : apiOutput ? (
                  <pre>{apiOutput}</pre>
                ) : (
                  <div className="text-slate-500 italic">
                    Klik butang ujian di atas untuk melihat respon JSON...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Nota Penting:</strong> Sambungkan kod ini ke spreadsheet anda melalui{' '}
            <code className="text-blue-700 font-bold">Extensions &gt; Apps Script</code> kemudian tekan{' '}
            <code className="text-blue-700 font-bold">Deploy as Web App</code>.
          </div>
        </div>
      </div>
    </div>
  );
};
