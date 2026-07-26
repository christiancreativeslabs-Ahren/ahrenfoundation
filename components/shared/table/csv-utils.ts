export type ExportFormat = "csv" | "xlsx";

export function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function convertToCSV<T = any>(
  data: T[],
  columnMapping?: Record<string, string>,
): string {
  if (data.length === 0) return "";

  let headers: string[];
  let rows: any[];

  if (columnMapping) {
    headers = Object.values(columnMapping);
    rows = data.map((row) => {
      const mappedRow: Record<string, any> = {};
      Object.entries(columnMapping).forEach(([key, label]) => {
        mappedRow[label] = (row as any)[key];
      });
      return mappedRow;
    });
  } else {
    const firstRow = data[0] as any;
    headers = Object.keys(firstRow);
    rows = data;
  }

  const csvHeaders = headers.map(escapeCSVValue).join(",");
  const csvRows = rows
    .map((row) => headers.map((header) => escapeCSVValue(row[header])).join(","))
    .join("\n");

  return `${csvHeaders}\n${csvRows}`;
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function generateExportFilename(
  prefix: string,
  suffix?: string,
  includeTimestamp = true,
  format: ExportFormat = "csv",
): string {
  const timestamp = includeTimestamp ? `-${new Date().toISOString().split("T")[0]}` : "";
  const suffixStr = suffix ? `-${suffix}` : "";
  return `${prefix}${suffixStr}${timestamp}.${format}`;
}

export function exportToCSV<T = any>(
  data: T[],
  filename: string,
  columnMapping?: Record<string, string>,
): void {
  const csv = convertToCSV(data, columnMapping);
  downloadCSV(csv, filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToExcel<T = any>(
  data: T[],
  filename: string,
  sheetName = "Sheet1",
): Promise<void> {
  if (data.length === 0) return;

  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename);
}

export function downloadBase64File(
  base64Data: string,
  filename: string,
  mimeType: string,
): void {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  downloadBlob(blob, filename);
}
