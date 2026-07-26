"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { LayoutGrid, Rows3, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableToolbar, FilterTags, DataTablePagination, TableLoadingSkeleton } from "@/components/shared/table";
import type {
  JoinApplicationListInput,
  JoinApplicationListResponse,
  JoinApplicationListRow,
} from "@/lib/admin/join-applications";
import { useJoinApplicationList } from "../_hooks/use-join-application-list";
import { buildJoinApplicationColumns } from "./join-application.columns";
import { JoinApplicationCard } from "./join-application.card";
import { JoinApplicationFilterSheet, type JoinApplicationListFilterState } from "./join-application.filter.sheet";

interface JoinApplicationTableProps {
  initialData: JoinApplicationListResponse;
  initialFilters: JoinApplicationListInput;
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

export function JoinApplicationTable({ initialData, initialFilters }: JoinApplicationTableProps) {
  const router = useRouter();
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
  } = useJoinApplicationList({
    initialData,
    initialInput: initialFilters,
  });

  const data = query.data;
  const records = data?.items ?? [];
  const isFetching = query.isFetching;

  const handleViewDetails = (applicationId: string) => {
    router.push(`/admin/join-applications/${applicationId}`);
  };

  const prefetchDetail = (applicationId: string) => {
    router.prefetch(`/admin/join-applications/${applicationId}`);
  };

  const columns = useMemo(
    () =>
      buildJoinApplicationColumns({
        page: currentInput.page,
        limit: currentInput.limit,
        onViewDetails: handleViewDetails,
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
      currentInput.applicationType && currentInput.applicationType !== "all"
        ? {
            key: "applicationType",
            label: "Type",
            value: currentInput.applicationType === "youth" ? "Prospective mentee" : "Mentor applicant",
            onRemove: () => updateFilters({ applicationType: "all" }),
          }
        : null,
      currentInput.status
        ? {
            key: "status",
            label: "Status",
            value: currentInput.status,
            onRemove: () => updateFilters({ status: null }),
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
                Admin review
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join applications
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Fast cursor listing for applicants, built with a shared table system and a projection-backed dataset.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/join"
                className={cn(
                  buttonVariants(),
                  "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                )}
              >
                Join page
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "Total applicants", value: summary?.total ?? data?.totalCount ?? initialData.totalCount },
            { label: "Approved", value: summary?.approved ?? 0 },
            { label: "Rejected", value: summary?.rejected ?? 0 },
            { label: "Reviewing", value: summary?.reviewing ?? 0 },
            { label: "Prospective mentees", value: summary?.youth ?? 0 },
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
          <CardTitle className="text-lg font-semibold">Applicant queue</CardTitle>
          <CardDescription className="text-slate-300">
            Showing the current applicant queue with cursor pagination and URL-backed filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableToolbar
            table={table}
            title={
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5">
                  <Users size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">
                  Applicants [{formatCount(data?.totalCount ?? initialData.totalCount)}]
                </h2>
              </div>
            }
            searchValue={currentInput.search || ""}
            onSearchChange={(value) => updateFilters({ search: value || null })}
            searchPlaceholder="Search by name, email, phone, location..."
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
                applicationType: "all",
                status: null,
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
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewDetails(row.original.joinApplicationId)}
                        onMouseEnter={() => prefetchDetail(row.original.joinApplicationId)}
                        onFocus={() => prefetchDetail(row.original.joinApplicationId)}
                      >
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
                        No join applications found.
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
            {records.map((application) => (
              <JoinApplicationCard
                key={application.joinApplicationId}
                application={application}
                onViewDetails={handleViewDetails}
                onHover={prefetchDetail}
              />
            ))}
            {!isFetching && records.length === 0 ? (
              <div className="col-span-full rounded-md border border-dashed p-8 text-center text-muted-foreground">
                No join applications found.
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

      <JoinApplicationFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={{
          search: currentInput.search,
          applicationType: currentInput.applicationType,
          status: currentInput.status,
        }}
        onApply={(filters: JoinApplicationListFilterState) =>
          updateFilters({
            search: filters.search ?? null,
            applicationType: filters.applicationType ?? "all",
            status:
              filters.status && filters.status !== "all"
                ? filters.status
                : null,
          })
        }
        onReset={() =>
          updateFilters({
            search: null,
            applicationType: "all",
            status: null,
          })
        }
      />
    </div>
  );
}
