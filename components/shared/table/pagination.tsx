"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  className?: string;
  darkBackground?: boolean;
  onFirstPage?: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  totalCount = 0,
  className,
  darkBackground = false,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 px-4 py-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between",
        darkBackground ? "bg-[#0b1234]" : "bg-white/[0.03]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <p className="hidden text-sm font-medium text-[#e8eeff] md:inline-block">Rows Per Page</p>
          <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            const pageSize = Number(value);
            if (onPageSizeChange) {
              onPageSizeChange(pageSize);
              return;
            }
            table.setPageSize(pageSize);
          }}
        >
          <SelectTrigger className="h-9 w-[80px] border-white/10 bg-[#080d2e] text-white">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="border-white/10 bg-[#091033] text-white">
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-[180px] flex-col items-center justify-center space-y-1 text-sm font-medium text-white">
        <p>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <p className="text-[#8892b0]">Total: {totalCount}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-9 w-9 border-white/10 bg-white/[0.04] p-0 text-white hover:bg-white/[0.08] lg:flex"
          onClick={() => (onFirstPage ? onFirstPage() : table.setPageIndex(0))}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 border-white/10 bg-white/[0.04] p-0 text-white hover:bg-white/[0.08]"
          onClick={() => (onPrevPage ? onPrevPage() : table.previousPage())}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-9 w-9 border-white/10 bg-white/[0.04] p-0 text-white hover:bg-white/[0.08]"
          onClick={() => (onNextPage ? onNextPage() : table.nextPage())}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-9 w-9 border-white/10 bg-white/[0.04] p-0 text-white hover:bg-white/[0.08] lg:flex"
          onClick={() =>
            onLastPage ? onLastPage() : table.setPageIndex(table.getPageCount() - 1)
          }
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
