"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Download, FileText, FileSpreadsheet, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToExcel, generateExportFilename, type ExportFormat } from "./csv-utils";

export interface ExportConfig {
  emailThreshold?: number;
  filenamePrefix?: string;
  includeTimestamp?: boolean;
  toast?: {
    success: (message: string | ReactNode, options?: any) => void;
    error: (message: string | ReactNode) => void;
    info: (message: string | ReactNode) => void;
  };
}

export interface DataTableExportButtonProps<TData = any> {
  data: TData[];
  filteredData?: TData[];
  totalRows?: number;
  filters?: Record<string, any>;
  sorting?: Array<{ id: string; desc: boolean }>;
  search?: string;
  config?: ExportConfig;
  disabled?: boolean;
  columnMapping?: Record<string, string>;
}

export interface ExportDropdownConfig {
  currentPageCount: number;
  totalFilteredCount: number;
  onExportCurrentPage: (format: ExportFormat) => void;
  onExportAllFiltered: (format: ExportFormat) => void;
  isExporting?: boolean;
  formats?: ExportFormat[];
  emailThreshold?: number;
}

export function DataTableExportButton<TData = any>({
  data,
  filteredData,
  totalRows,
  config = {},
  disabled = false,
  columnMapping,
}: DataTableExportButtonProps<TData>) {
  const {
    emailThreshold = 5000,
    filenamePrefix = "export",
    includeTimestamp = true,
    toast,
  } = config;
  const [isExporting, setIsExporting] = useState(false);

  const showToast = useMemo(() => ({
    success: (msg: string | ReactNode) => toast?.success?.(msg),
    error: (msg: string | ReactNode) => toast?.error?.(msg),
    info: (msg: string | ReactNode) => toast?.info?.(msg),
  }), [toast]);

  const currentCount = data.length;
  const filteredCount = filteredData?.length ?? data.length;
  const totalCount = totalRows ?? filteredCount;
  const willEmail = totalCount >= emailThreshold;

  const downloadCurrent = async (type: "current" | "filtered" | "all") => {
    setIsExporting(true);
    try {
      let rows: TData[] = data;
      if (type === "filtered") rows = filteredData ?? data;
      if (type === "all") rows = filteredData ?? data;
      const filename = generateExportFilename(filenamePrefix, type, includeTimestamp);
      if (filename.endsWith(".xlsx")) {
        await exportToExcel(rows, filename);
      } else {
        exportToCSV(rows, filename, columnMapping);
      }
      showToast.success(`Exported ${rows.length.toLocaleString()} rows`);
    } catch {
      showToast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || isExporting || currentCount === 0}
      onClick={() => downloadCurrent("current")}
      className="h-9 gap-2 border-border bg-background"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting..." : "Export"}
      {willEmail ? <Mail className="h-3 w-3 opacity-60" /> : null}
    </Button>
  );
}

export type { ExportFormat } from "./csv-utils";

export function ExportDropdown({ config, disabled = false }: { config: ExportDropdownConfig; disabled?: boolean; }) {
  const [open, setOpen] = useState(false);
  const {
    currentPageCount,
    totalFilteredCount,
    onExportCurrentPage,
    onExportAllFiltered,
    isExporting = false,
    formats = ["csv", "xlsx"],
    emailThreshold = 5000,
  } = config;
  const willQueueAll = totalFilteredCount >= emailThreshold;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isExporting || currentPageCount === 0}
        onClick={() => setOpen((value) => !value)}
        className="h-9 gap-2 border-border bg-background"
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting..." : "Export"}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Current Page ({currentPageCount.toLocaleString()} rows)
          </div>
          {formats.map((format) => {
            const Icon = format === "csv" ? FileText : FileSpreadsheet;
            return (
              <button
                key={`current-${format}`}
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                onClick={() => onExportCurrentPage(format)}
              >
                <Icon className="h-4 w-4" />
                Download {format.toUpperCase()}
              </button>
            );
          })}

          <div className="my-2 h-px bg-border" />

          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            All Filtered ({totalFilteredCount.toLocaleString()} rows)
            {willQueueAll ? <span className="ml-1 text-primary">via email</span> : null}
          </div>
          {formats.map((format) => {
            const Icon = format === "csv" ? FileText : FileSpreadsheet;
            return (
              <button
                key={`all-${format}`}
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                onClick={() => onExportAllFiltered(format)}
              >
                {willQueueAll ? <Mail className="h-4 w-4 text-primary" /> : <Icon className="h-4 w-4" />}
                {willQueueAll ? "Email" : "Download"} {format.toUpperCase()}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
