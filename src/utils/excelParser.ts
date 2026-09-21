import * as XLSX from 'xlsx';
import { ParsedSheetData, UploadedDataset } from '../types';
import { domesticYearlyStats, stateTourismStats, spendingComponents, internationalArrivals } from '../data/dosmData';

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file into structured sheets and rows
 */
export async function parseExcelFile(file: File): Promise<UploadedDataset> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const parsedSheets: ParsedSheetData[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) continue;

    // Convert sheet to JSON rows with header
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: '',
      raw: false,
    });

    if (jsonData.length === 0) continue;

    const headers = Object.keys(jsonData[0] || {});

    // Try detecting type of DOSM data
    const lowerHeaders = headers.map(h => h.toLowerCase());
    let detectedType: ParsedSheetData['detectedType'] = 'custom';

    if (lowerHeaders.some(h => h.includes('negeri') || h.includes('state'))) {
      detectedType = 'state';
    } else if (
      lowerHeaders.some(h => h.includes('komponen') || h.includes('kategori') || h.includes('component'))
    ) {
      detectedType = 'spending';
    } else if (
      lowerHeaders.some(h => h.includes('antarabangsa') || h.includes('international') || h.includes('country') || h.includes('negara'))
    ) {
      detectedType = 'international';
    } else if (
      lowerHeaders.some(h => h.includes('pelawat') || h.includes('domestik') || h.includes('domestic') || h.includes('tahun'))
    ) {
      detectedType = 'domestic';
    }

    parsedSheets.push({
      sheetName,
      fileName: file.name,
      headers,
      rows: jsonData,
      rowCount: jsonData.length,
      detectedType,
    });
  }

  return {
    id: `${Date.now()}-${file.name}`,
    fileName: file.name,
    uploadDate: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    sheets: parsedSheets,
    activeSheet: parsedSheets[0]?.sheetName || '',
  };
}

/**
 * Generates and triggers download of an authentic sample DOSM Excel (.xlsx) file
 * with multiple pre-configured sheets:
 * 1. Pelancongan_Domestik
 * 2. Mengikut_Negeri
 * 3. Komponen_Perbelanjaan
 * 4. Pelancong_Antarabangsa
 */
export function downloadSampleDOSMExcel() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Domestic Tourism
  const domesticRows = domesticYearlyStats.map(item => ({
    'Tahun': item.year,
    'Pelawat Domestik (Juta)': item.visitorsMillion,
    'Perjalanan Pelancongan (Juta)': item.tripsMillion,
    'Jumlah Perbelanjaan (RM Bilion)': item.expenditureBillionRM,
    'Purata Perbelanjaan per Trip (RM)': item.avgSpendPerTripRM,
    'Purata Hari Menginap (Hari)': item.avgStayDays,
  }));
  const ws1 = XLSX.utils.json_to_sheet(domesticRows);
  XLSX.utils.book_append_sheet(wb, ws1, 'Pelancongan_Domestik');

  // Sheet 2: State Breakdown
  const stateRows = stateTourismStats.map(item => ({
    'Kod': item.stateCode,
    'Negeri': item.stateName,
    'Pelawat (Juta)': item.visitorsMillion,
    'Perbelanjaan (RM Bilion)': item.expenditureBillionRM,
    'Kadar Penghunian Hotel (%)': item.hotelOccupancyRate,
    'Purata Menginap (Hari)': item.avgStayDays,
    'Tujuan Utama': item.topPurpose,
    'Syer (%)': item.sharePercent,
  }));
  const ws2 = XLSX.utils.json_to_sheet(stateRows);
  XLSX.utils.book_append_sheet(wb, ws2, 'Mengikut_Negeri');

  // Sheet 3: Spending Components
  const spendingRows = spendingComponents.map(item => ({
    'Komponen Perbelanjaan': item.category,
    'Component (English)': item.categoryEn,
    'Syer Perbelanjaan (%)': item.percentage,
    'Nilai Anggaran (RM Bilion)': item.amountBillionRM,
  }));
  const ws3 = XLSX.utils.json_to_sheet(spendingRows);
  XLSX.utils.book_append_sheet(wb, ws3, 'Komponen_Perbelanjaan');

  // Sheet 4: International Arrivals
  const intlRows = internationalArrivals.map(item => ({
    'Tahun': item.year,
    'Ketibaan Pelancong (Juta)': item.arrivalsMillion,
    'Pendapatan Pelancongan (RM Bilion)': item.receiptsBillionRM,
    'Perbelanjaan per Kapita (RM)': item.perCapitaSpendRM,
    'Purata Tempoh Menginap (Hari)': item.alosDays,
  }));
  const ws4 = XLSX.utils.json_to_sheet(intlRows);
  XLSX.utils.book_append_sheet(wb, ws4, 'Pelancong_Antarabangsa');

  // Trigger download
  XLSX.writeFile(wb, 'DOSM_Tourism_Malaysia_Sample.xlsx');
}

/**
 * Export any sheet data to XLSX or CSV
 */
export function exportSheetToFile(sheet: ParsedSheetData, format: 'xlsx' | 'csv' = 'xlsx') {
  const ws = XLSX.utils.json_to_sheet(sheet.rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName.substring(0, 31));

  const filename = `${sheet.sheetName.replace(/\s+/g, '_')}_export.${format}`;
  XLSX.writeFile(wb, filename, { bookType: format });
}
