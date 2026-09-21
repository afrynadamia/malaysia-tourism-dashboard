import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import { Language, ParsedSheetData, UploadedDataset } from '../types';
import { parseExcelFile, downloadSampleDOSMExcel } from '../utils/excelParser';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  uploadedDatasets: UploadedDataset[];
  onAddDataset: (dataset: UploadedDataset) => void;
  onRemoveDataset: (id: string) => void;
  onSelectDatasetForExplorer: (dataset: UploadedDataset, sheetName: string) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  language,
  uploadedDatasets,
  onAddDataset,
  onRemoveDataset,
  onSelectDatasetForExplorer,
}) => {
  const isBM = language === 'ms';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPreviewSheet, setSelectedPreviewSheet] = useState<ParsedSheetData | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
          setErrorMessage(
            isBM
              ? `Fail "${file.name}" bukan format disokong (.xlsx, .xls, .csv).`
              : `File "${file.name}" is not a supported format (.xlsx, .xls, .csv).`
          );
          continue;
        }

        const parsed = await parseExcelFile(file);
        if (parsed.sheets.length === 0) {
          setErrorMessage(
            isBM
              ? `Tiada data ditemui dalam fail "${file.name}".`
              : `No data rows found in "${file.name}".`
          );
          continue;
        }

        onAddDataset(parsed);
        if (parsed.sheets[0]) {
          setSelectedPreviewSheet(parsed.sheets[0]);
        }
      }
    } catch (err: any) {
      console.error('Error parsing excel file:', err);
      setErrorMessage(
        isBM
          ? `Gagal memproses fail Excel: ${err?.message || 'Sila semak struktur fail'}`
          : `Failed to process Excel file: ${err?.message || 'Please check file structure'}`
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isBM ? 'Muat Naik Fail Excel DOSM' : 'Upload DOSM Excel Files'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBM
                  ? 'Sokongan untuk lembaran kerja Excel (.xlsx, .xls) dan fail CSV pelancongan'
                  : 'Support for Excel (.xlsx, .xls) and CSV tourism sheets'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-upload-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {isBM
                ? 'Klik untuk pilih fail atau seret fail Excel / CSV ke sini'
                : 'Click to select or drag and drop Excel / CSV files here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isBM
                ? 'Format disokong: .xlsx, .xls, .csv (boleh muat naik lebih daripada satu fail / lembaran)'
                : 'Supported formats: .xlsx, .xls, .csv (multi-file & multi-sheet supported)'}
            </p>
            {isProcessing && (
              <p className="text-xs text-blue-600 font-medium mt-3 animate-pulse">
                {isBM ? 'Sedang memproses fail Excel...' : 'Processing Excel file...'}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sample template download prompt */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-900">
                {isBM ? 'Belum ada format fail yang sesuai?' : 'Need a standard DOSM Excel format?'}
              </p>
              <p className="text-xs text-amber-700/90 mt-0.5">
                {isBM
                  ? 'Muat turun templat Excel rasmi DOSM lengkap dengan 4 lembaran: Domestik, Negeri, Komponen & Antarabangsa.'
                  : 'Download official DOSM template formatted with 4 sheets: Domestic, State, Components & International.'}
              </p>
            </div>
            <button
              id="btn-modal-download-sample"
              onClick={downloadSampleDOSMExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBM ? 'Muat Turun Contoh .xlsx' : 'Download Sample .xlsx'}</span>
            </button>
          </div>

          {/* Uploaded Datasets List */}
          {uploadedDatasets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBM ? 'Fail Telah Dimuat Naik' : 'Uploaded Datasets'} ({uploadedDatasets.length})
                </h3>
              </div>

              <div className="space-y-2">
                {uploadedDatasets.map(ds => (
                  <div
                    key={ds.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{ds.fileName}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{ds.uploadDate}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            {ds.sheets.length} {isBM ? 'lembaran (sheets)' : 'sheets'}
                          </span>
                          <span>•</span>
                          <span>
                            {ds.sheets.reduce((acc, s) => acc + s.rowCount, 0)}{' '}
                            {isBM ? 'jumlah baris' : 'total rows'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {ds.sheets.map(sheet => (
                        <button
                          key={sheet.sheetName}
                          onClick={() => {
                            setSelectedPreviewSheet(sheet);
                            onSelectDatasetForExplorer(ds, sheet.sheetName);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{sheet.sheetName}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => onRemoveDataset(ds.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={isBM ? 'Padam fail' : 'Delete file'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Preview Table of Selected Sheet */}
          {selectedPreviewSheet && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {isBM ? 'Pratonton Lembaran' : 'Sheet Preview'}:{' '}
                  <span className="text-blue-700 font-bold">{selectedPreviewSheet.sheetName}</span> (
                  {selectedPreviewSheet.rowCount} {isBM ? 'baris' : 'rows'})
                </span>
                <span className="text-slate-500">
                  {selectedPreviewSheet.headers.length} {isBM ? 'lajur' : 'columns'}
                </span>
              </div>
              <div className="overflow-x-auto max-h-48">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0">
                    <tr>
                      {selectedPreviewSheet.headers.map((h, idx) => (
                        <th key={idx} className="px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedPreviewSheet.rows.slice(0, 5).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80">
                        {selectedPreviewSheet.headers.map((h, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                            {String(row[h] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isBM
                ? 'Semua data diproses secara selamat di pelayar anda'
                : 'All files parsed client-side in browser'}
            </span>
          </div>
          <button
            id="btn-finish-upload"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isBM ? 'Tutup & Teroka Papan Pemuka' : 'Done & Explore Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
