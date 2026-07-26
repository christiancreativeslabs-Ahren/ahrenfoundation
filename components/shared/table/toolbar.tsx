"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Filter, Download, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ColumnVisibilityDropdown } from "./column-visibility";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onFilterClick?: () => void;
  onCreateClick?: () => void;
  onExportClick?: () => void;
  createButtonText?: string;
  exportButtonText?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showCreate?: boolean;
  showColumns?: boolean;
  showExport?: boolean;
  disabled?: boolean;
  getFriendlyColumnName?: (columnId: string) => string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  secondarySearchValue?: string;
  onSecondarySearchChange?: (value: string) => void;
  secondarySearchPlaceholder?: string;
  createButtonComponent?: ReactNode;
  title?: ReactNode;
  showRefresh?: boolean;
  onRefreshClick?: () => void;
  refreshButtonText?: string;
  isRefreshing?: boolean;
  filterTagsCount?: number;
  exportButtonComponent?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  onFilterClick,
  onCreateClick,
  onExportClick,
  createButtonText = "Create New",
  exportButtonText = "Export",
  searchPlaceholder = "Search...",
  showSearch = true,
  showFilter = true,
  showCreate = true,
  showColumns = true,
  showExport = false,
  disabled = false,
  getFriendlyColumnName,
  searchValue,
  onSearchChange,
  secondarySearchValue,
  onSecondarySearchChange,
  secondarySearchPlaceholder = "Search...",
  createButtonComponent,
  title,
  showRefresh = false,
  onRefreshClick,
  refreshButtonText = "Refresh",
  isRefreshing = false,
  filterTagsCount = 0,
  exportButtonComponent,
}: DataTableToolbarProps<TData>) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue ?? "");
  const [localSecondarySearchValue, setLocalSecondarySearchValue] = useState(
    secondarySearchValue ?? "",
  );

  useEffect(() => {
    setLocalSearchValue(searchValue ?? "");
  }, [searchValue]);

  useEffect(() => {
    setLocalSecondarySearchValue(secondarySearchValue ?? "");
  }, [secondarySearchValue]);

  useEffect(() => {
    if (!onSearchChange) return;
    const handle = window.setTimeout(() => {
      if (localSearchValue !== (searchValue ?? "")) {
        onSearchChange(localSearchValue);
      }
    }, 300);
    return () => window.clearTimeout(handle);
  }, [localSearchValue, onSearchChange, searchValue]);

  useEffect(() => {
    if (!onSecondarySearchChange) return;
    const handle = window.setTimeout(() => {
      if (localSecondarySearchValue !== (secondarySearchValue ?? "")) {
        onSecondarySearchChange(localSecondarySearchValue);
      }
    }, 300);
    return () => window.clearTimeout(handle);
  }, [
    localSecondarySearchValue,
    onSecondarySearchChange,
    secondarySearchValue,
  ]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="shrink-0">{title}</div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        {showSearch ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              onSearchChange ? localSearchValue : String(table.getState().globalFilter ?? "")
            }
            onChange={(event) => {
              if (onSearchChange) {
                setLocalSearchValue(event.target.value);
                return;
              }
              table.setGlobalFilter(event.target.value);
            }}
            className="h-9 w-full max-w-xs bg-background"
            disabled={disabled}
          />
        ) : null}

        {onSecondarySearchChange ? (
          <Input
            placeholder={secondarySearchPlaceholder}
            value={localSecondarySearchValue}
            onChange={(event) => setLocalSecondarySearchValue(event.target.value)}
            className="h-9 w-full max-w-[180px] bg-background"
            disabled={disabled}
          />
        ) : null}

        {showFilter && onFilterClick ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterClick}
            disabled={disabled}
            className="h-9 border-border bg-background"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(isFiltered || filterTagsCount > 0) ? (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {filterTagsCount || table.getState().columnFilters.length}
              </span>
            ) : null}
          </Button>
        ) : null}

        {showRefresh && onRefreshClick ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshClick}
            disabled={disabled || isRefreshing}
            className="h-9 border-border bg-background"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            {refreshButtonText}
          </Button>
        ) : null}

        {exportButtonComponent ? (
          exportButtonComponent
        ) : showExport && onExportClick ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportClick}
            disabled={disabled}
            className="h-9 border-border bg-background"
          >
            <Download className="mr-2 h-4 w-4" />
            {exportButtonText}
          </Button>
        ) : null}

        {showColumns ? (
          <ColumnVisibilityDropdown
            table={table}
            disabled={disabled}
            getFriendlyColumnName={getFriendlyColumnName}
          />
        ) : null}

        {showCreate ? (
          createButtonComponent ? (
            createButtonComponent
          ) : onCreateClick ? (
            <Button size="sm" onClick={onCreateClick} disabled={disabled} className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          ) : null
        ) : null}
      </div>
    </div>
  );
}
