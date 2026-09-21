import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Upload,
  BarChart2,
  Table as TableIcon,
  Search,
  Download,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Language, ParsedSheetData, UploadedDataset } from '../types';
import { exportSheetToFile, downloadSampleDOSMExcel } from '../utils/excelParser';
import { stateTourismStats, domesticYearlyStats, spendingComponents } from '../data/dosmData';

interface CustomExcelExplorerProps {
  language: Language;
  uploadedDatasets: UploadedDataset[];
  activeUploadedDataset: UploadedDataset | null;
  activeSheetName: string;
  onSelectDatasetAndSheet: (ds: UploadedDataset, sheetName: string) => void;
  onOpenUpload: () => void;
}

const COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#e11d48', '#0891b2', '#4b5563', '#10b981'];

export const CustomExcelExplorer: React.FC<CustomExcelExplorerProps> = ({
  language,
  uploadedDatasets,
  activeUploadedDataset,
  activeSheetName,
  onSelectDatasetAndSheet,
  onOpenUpload,
}) => {
  const isBM = language === 'ms';

  // Default fallback sheet if no Excel uploaded
  const defaultSheetData: ParsedSheetData = useMemo(() => {
    return {
      sheetName: 'Negeri_Pelancongan_DOSM',
      fileName: 'DOSM_Benchmark_Negeri.xlsx',
      headers: [
        'Kod',
        'Negeri',
        'Pelawat (Juta)',
        'Perbelanjaan (RM Bilion)',
        'Penghunian Hotel (%)',
        'Purata Hari Menginap',
        'Tujuan Utama',
      ],
      rows: stateTourismStats.map(s => ({
        'Kod': s.stateCode,
        'Negeri': s.stateName,
        'Pelawat (Juta)': s.visitorsMillion,
        'Perbelanjaan (RM Bilion)': s.expenditureBillionRM,
        'Penghunian Hotel (%)': s.hotelOccupancyRate,
        'Purata Hari Menginap': s.avgStayDays,
        'Tujuan Utama': s.topPurpose,
      })),
      rowCount: stateTourismStats.length,
      detectedType: 'state',
    };
  }, []);

  // Determine current active sheet
  const currentSheet: ParsedSheetData = useMemo(() => {
    if (!activeUploadedDataset || activeUploadedDataset.sheets.length === 0) {
      return defaultSheetData;
    }
    const found = activeUploadedDataset.sheets.find(s => s.sheetName === activeSheetName);
    return found || activeUploadedDataset.sheets[0] || defaultSheetData;
  }, [activeUploadedDataset, activeSheetName, defaultSheetData]);

  // Chart Builder State
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKey, setYAxisKey] = useState<string>('');

  // Table Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Identify numeric headers suitable for Y-axis
  const numericHeaders = useMemo(() => {
    if (!currentSheet || currentSheet.rows.length === 0) return [];
    return currentSheet.headers.filter(h => {
      // check if first few rows have numbers
      return currentSheet.rows.slice(0, 10).some(row => {
        const val = row[h];
        return typeof val === 'number' || (!isNaN(Number(val)) && val !== '' && val !== null);
      });
    });
  }, [currentSheet]);

  // Update default X and Y axis when sheet changes
  React.useEffect(() => {
    if (currentSheet && currentSheet.headers.length > 0) {
      // Prefer column like 'Negeri', 'Tahun', 'Kategori' for X
      const potentialX =
        currentSheet.headers.find(h =>
          /negeri|state|tahun|year|komponen|category|tujuan|purpose|bulan|month/i.test(h)
        ) || currentSheet.headers[0];
      setXAxisKey(potentialX);

      // Prefer numeric column for Y
      const potentialY =
        numericHeaders.find(h =>
          /pelawat|visitor|perbelanjaan|spend|ketibaan|arrival|jumlah|total|rate|kadar/i.test(h)
        ) || numericHeaders[0] || currentSheet.headers[1] || currentSheet.headers[0];
      setYAxisKey(potentialY);
    }
  }, [currentSheet, numericHeaders]);

  // Prepared chart data
  const chartData = useMemo(() => {
    if (!currentSheet || !xAxisKey || !yAxisKey) return [];
    return currentSheet.rows.slice(0, 30).map((row, idx) => {
      const rawY = row[yAxisKey];
      const parsedY = typeof rawY === 'number' ? rawY : parseFloat(String(rawY).replace(/[^0-9.-]/g, '')) || 0;
      return {
        name: String(row[xAxisKey] || `Item ${idx + 1}`),
        value: parsedY,
      };
    });
  }, [currentSheet, xAxisKey, yAxisKey]);

  // Filtered & Sorted Table Rows
  const processedRows = useMemo(() => {
    if (!currentSheet) return [];
    let rows = currentSheet.rows;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(q))
      );
    }

    if (sortColumn) {
      rows = [...rows].sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        const numA = Number(valA);
        const numB = Number(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }
        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  }, [currentSheet, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;
  const paginatedRows = processedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Sheet Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isBM ? 'Peneroka & Pembina Visual Excel' : 'Excel Data Explorer & Chart Builder'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentSheet.sheetName} ({currentSheet.rowCount} {isBM ? 'baris' : 'rows'})
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isBM
              ? `Fail Semasa: ${currentSheet.fileName}. Pilih lajur paksi untuk membina graf tersuai secara dinamik.`
              : `Current File: ${currentSheet.fileName}. Select axis columns to generate dynamic interactive charts.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-explorer-upload-more"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isBM ? 'Muat Naik Fail Baharu' : 'Upload More Files'}</span>
          </button>

          <button
            id="btn-explorer-export-sheet"
            onClick={() => exportSheetToFile(currentSheet, 'xlsx')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{isBM ? 'Eksport Lembaran (.xlsx)' : 'Export Sheet (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Available Sheets Bar (if multi-sheets or multi-files exist) */}
      {uploadedDatasets.length > 0 && (
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            {isBM ? 'Pilih Lembaran (Sheets):' : 'Select Sheet:'}
          </span>
          {uploadedDatasets.flatMap(ds =>
            ds.sheets.map(sh => {
              const isSelected =
                activeUploadedDataset?.id === ds.id && currentSheet.sheetName === sh.sheetName;
              return (
                <button
                  key={`${ds.id}-${sh.sheetName}`}
                  onClick={() => onSelectDatasetAndSheet(ds, sh.sheetName)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3 opacity-70" />
                  <span>{sh.sheetName}</span>
                  <span className="text-[10px] opacity-75">({sh.rowCount})</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Interactive Chart Generator Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>{isBM ? 'Penjana Graf Interaktif Dari Excel' : 'Interactive Chart Generator'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? 'Pilih jenis carta, lajur kategori (Paksi X), dan lajur nilai numerik (Paksi Y)'
                : 'Select chart type, category dimension (X-Axis), and numeric metric (Y-Axis)'}
            </p>
          </div>

          {/* Chart Controls Form */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Chart Type Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'bar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {isBM ? 'Bar' : 'Bar'}
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'line' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {isBM ? 'Garis' : 'Line'}
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'area' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {isBM ? 'Kawasan' : 'Area'}
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  chartType === 'pie' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {isBM ? 'Pai' : 'Pie'}
              </button>
            </div>

            {/* X-Axis Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">Paksi X:</span>
              <select
                value={xAxisKey}
                onChange={e => setXAxisKey(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
              >
                {currentSheet.headers.map(h => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Y-Axis Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">Paksi Y:</span>
              <select
                value={yAxisKey}
                onChange={e => setYAxisKey(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
              >
                {currentSheet.headers.map(h => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* The Live Chart */}
        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              {isBM ? 'Tiada data berangka untuk dipaparkan' : 'No numeric data to display'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    height={50}
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
                    formatter={(val: any) => [val, yAxisKey]}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    height={50}
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
                    formatter={(val: any) => [val, yAxisKey]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb' }}
                  />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    height={50}
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
                    formatter={(val: any) => [val, yAxisKey]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 10)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {chartData.slice(0, 10).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Raw Data Table with Search, Sort & Pagination */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600" />
              <span>{isBM ? 'Jadual Data Lengkap Lembaran' : 'Complete Sheet Data Table'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isBM
                ? `Menunjukkan ${paginatedRows.length} daripada ${processedRows.length} rekod`
                : `Showing ${paginatedRows.length} of ${processedRows.length} records`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={isBM ? 'Cari nilai dalam jadual...' : 'Search table cells...'}
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-slate-700"
            >
              <option value={10}>10 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5 text-slate-400 w-12">#</th>
                {currentSheet.headers.map(h => (
                  <th
                    key={h}
                    onClick={() => handleSort(h)}
                    className="px-3.5 py-2.5 cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>{h}</span>
                      {sortColumn === h && (
                        <span className="text-[10px] text-blue-600 font-mono">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentSheet.headers.length + 1}
                    className="text-center py-8 text-slate-400"
                  >
                    {isBM ? 'Tiada rekod sepadan ditemui' : 'No matching records found'}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2 text-slate-400 font-mono">
                      {(currentPage - 1) * pageSize + rIdx + 1}
                    </td>
                    {currentSheet.headers.map((h, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap">
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>
              {isBM
                ? `Halaman ${currentPage} daripada ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
