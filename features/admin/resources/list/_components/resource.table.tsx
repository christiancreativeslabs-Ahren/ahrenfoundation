"use client";

import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { LayoutGrid, Rows3 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableToolbar, FilterTags, DataTablePagination, TableLoadingSkeleton } from "@/components/shared/table";
import type { ResourceListInput, ResourceListResponse } from "@/lib/admin/resources";
import { useResourceList } from "../_hooks/use-resource-list";
import { buildResourceColumns } from "./resource.columns";
import { ResourceCard } from "./resource.card";
import { ResourceFilterSheet, type ResourceListFilterState } from "./resource.filter.sheet";

interface ResourceTableProps {
  initialData: ResourceListResponse;
  initialFilters: ResourceListInput;
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

export function ResourceTable({ initialData, initialFilters }: ResourceTableProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<"table" | "grid">("table");

  const {
    currentInput,
    query,
    updateFilters,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    totalPages,
  } = useResourceList({
    initialData,
    initialInput: initialFilters,
  });

  const data = query.data;
  const records = data?.items ?? [];
  const isFetching = query.isFetching;

  const columns = useMemo(
    () =>
      buildResourceColumns({
        page: currentInput.page,
        limit: currentInput.limit,
      }),
    [currentInput.page, currentInput.limit],
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: currentInput.page - 1,
        pageSize: currentInput.limit,
      },
    },
    pageCount: totalPages,
  });

  const filterTags = useMemo(() => {
    return [
      currentInput.search
        ? {
            key: "search",
            label: "Search",
            value: currentInput.search,
            onRemove: () => updateFilters({ search: null }),
          }
        : null,
      currentInput.audience && currentInput.audience !== "all"
        ? {
            key: "audience",
            label: "Audience",
            value: currentInput.audience,
            onRemove: () => updateFilters({ audience: "all" }),
          }
        : null,
      currentInput.visibility && currentInput.visibility !== "all"
        ? {
            key: "visibility",
            label: "Visibility",
            value: currentInput.visibility,
            onRemove: () => updateFilters({ visibility: "all" }),
          }
        : null,
      currentInput.category
        ? {
            key: "category",
            label: "Category",
            value: currentInput.category,
            onRemove: () => updateFilters({ category: null }),
          }
        : null,
    ].filter(Boolean) as Array<{
      key: string;
      label: string;
      value: string;
      onRemove: () => void;
    }>;
  }, [currentInput, updateFilters]);

  const summary = data?.summary ?? initialData.summary;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin content
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Resources
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Fast cursor listing for dashboard resources, built on the shared table system.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/content"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Content hub
              </a>
              <a
                href="/dashboard"
                className={cn(
                  buttonVariants(),
                  "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                )}
              >
                Dashboard
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Total resources", value: summary?.total ?? data?.totalCount ?? initialData.totalCount },
            { label: "Published", value: summary?.published ?? 0 },
            { label: "Draft", value: summary?.draft ?? 0 },
            { label: "Youth", value: summary?.youth ?? 0 },
            { label: "Mentor", value: summary?.mentor ?? 0 },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-[#0d1538] p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{formatCount(item.value)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Resource queue</CardTitle>
          <CardDescription className="text-slate-300">
            Showing the current resource queue with cursor pagination and URL-backed filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableToolbar
            table={table}
            title={<h2 className="text-2xl font-bold">Resources [{formatCount(data?.totalCount ?? initialData.totalCount)}]</h2>}
            searchValue={currentInput.search || ""}
            onSearchChange={(value) => updateFilters({ search: value || null })}
            searchPlaceholder="Search title, summary, category..."
            onFilterClick={() => setIsFilterOpen(true)}
            filterTagsCount={filterTags.length}
            showCreate={false}
            showExport={false}
          />

          <FilterTags
            tags={filterTags}
            onClearAll={() =>
              updateFilters({
                search: null,
                audience: "all",
                visibility: "all",
                category: null,
              })
            }
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-md border p-1">
              <Button
                type="button"
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setView("table")}
                aria-label="Table view"
              >
                <Rows3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {isFetching ? "Refreshing..." : "Up to date"}
            </div>
          </div>

          <div className={cn("hidden", view === "table" && "md:block")}>
            <div className="relative w-full overflow-x-auto rounded-md border">
              {isFetching ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              ) : null}

              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No resources found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {isFetching ? (
                <Table className="hidden">
                  <TableBody>
                    <TableLoadingSkeleton columnCount={columns.length} rowCount={8} />
                  </TableBody>
                </Table>
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
              view === "grid" ? "md:grid" : "md:hidden",
              "grid",
            )}
          >
            {records.map((resource) => (
              <ResourceCard key={resource.resourceId} resource={resource} />
            ))}
            {!isFetching && records.length === 0 ? (
              <div className="col-span-full rounded-md border border-dashed p-8 text-center text-muted-foreground">
                No resources found.
              </div>
            ) : null}
          </div>

          <DataTablePagination
            table={table}
            totalCount={data?.totalCount ?? initialData.totalCount}
            onFirstPage={goToFirstPage}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            onLastPage={goToLastPage}
            onPageSizeChange={(pageSize) => updateFilters({ limit: pageSize })}
          />
        </CardContent>
      </Card>

      <ResourceFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={{
          search: currentInput.search,
          audience: currentInput.audience,
          visibility: currentInput.visibility,
          category: currentInput.category,
        }}
        onApply={(filters: ResourceListFilterState) =>
          updateFilters({
            search: filters.search ?? null,
            audience: filters.audience ?? "all",
            visibility: filters.visibility ?? "all",
            category: filters.category ?? null,
          })
        }
        onReset={() =>
          updateFilters({
            search: null,
            audience: "all",
            visibility: "all",
            category: null,
          })
        }
      />
    </div>
  );
}
