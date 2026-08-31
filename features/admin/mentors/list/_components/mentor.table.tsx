"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Download, LayoutGrid, Rows3, UserRoundCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination, DataTableToolbar, FilterTags, TableLoadingSkeleton } from "@/components/shared/table";
import { MemberRegistrationDialog } from "@/components/admin/member-registration-dialog";
import type { MentorListInput, MentorListResponse } from "@/lib/admin/mentors";
import type { MentorAssignmentMenteeCandidate } from "@/lib/admin/mentor-assignments";
import { cn } from "@/lib/utils";
import { useMentorList } from "../_hooks/use-mentor-list";
import { buildMentorColumns } from "./mentor.columns";
import { MentorCard } from "./mentor.card";
import { MentorFilterSheet, type MentorListFilterState } from "./mentor.filter.sheet";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

function statusLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function MentorTable({
  initialData,
  initialFilters,
  mentees,
}: {
  initialData: MentorListResponse;
  initialFilters: MentorListInput;
  mentees: MentorAssignmentMenteeCandidate[];
}) {
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
  } = useMentorList({ initialData, initialInput: initialFilters });

  const data = query.data;
  const records = data?.items ?? [];
  const isFetching = query.isFetching;

  const handleViewDetails = (memberId: string) => {
    router.push(`/admin/mentors/${memberId}`);
  };

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    if (currentInput.search) params.set("search", currentInput.search);
    if (currentInput.status && currentInput.status !== "all") {
      params.set("status", currentInput.status);
    }
    const query = params.toString();
    return query ? `/api/admin/mentors/export?${query}` : "/api/admin/mentors/export";
  }, [currentInput.search, currentInput.status]);

  const prefetchDetail = (memberId: string) => {
    router.prefetch(`/admin/mentors/${memberId}`);
  };

  const columns = useMemo(
    () =>
      buildMentorColumns({
        page: currentInput.page,
        limit: currentInput.limit,
        mentees,
        onViewDetails: handleViewDetails,
      }),
    [currentInput.page, currentInput.limit, mentees],
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
      currentInput.status && currentInput.status !== "all"
        ? {
            key: "status",
            label: "Status",
            value: statusLabel(currentInput.status),
            onRemove: () => updateFilters({ status: "all" }),
          }
        : null,
    ].filter(Boolean) as Array<{
      key: string;
      label: string;
      value: string;
      onRemove: () => void;
    }>;
  }, [currentInput.search, currentInput.status, updateFilters]);

  const summary = data?.summary ?? initialData.summary;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-white/[0.03] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="h-1 bg-gradient-to-r from-[#00c9ff] via-[#00ff9d] to-[#00c9ff]" />
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin review
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mentors
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Review mentor records, monitor mentee assignment counts, and assign mentees from the same table workflow.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <MemberRegistrationDialog role="mentor" label="New mentor" />
              <Link
                href={exportHref}
                prefetch={false}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-2 border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                <Download className="h-4 w-4" />
                Export all records
              </Link>
              <Link
                href="/admin/assignments"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Bulk assignments
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total mentors", value: summary.total },
            { label: "Verified", value: summary.verified },
            { label: "Approved", value: summary.approved },
            { label: "Active assignments", value: summary.activeAssignments },
            { label: "Total assignments", value: summary.totalAssignments },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{formatCount(item.value)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-white/10 bg-white/[0.03] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">Mentor directory</CardTitle>
          <CardDescription className="text-slate-300">
            Showing mentor records with cursor pagination and URL-backed filters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableToolbar
            table={table}
            title={
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-400/15 bg-[#00c9ff]/10 p-2 text-[#00c9ff]">
                  <UserRoundCheck size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Mentors [{formatCount(data?.totalCount ?? initialData.totalCount)}]
                </h2>
              </div>
            }
            searchValue={currentInput.search || ""}
            onSearchChange={(value) => updateFilters({ search: value || null })}
            searchPlaceholder="Search by name, email, status, step..."
            onFilterClick={() => setIsFilterOpen(true)}
            filterTagsCount={filterTags.length}
            showCreate={false}
            showExport={false}
          />

          <FilterTags
            tags={filterTags}
            onClearAll={() => updateFilters({ search: null, status: "all" })}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <Button
                type="button"
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-full p-0",
                  view === "table"
                    ? "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
                    : "text-white hover:bg-white/[0.08]",
                )}
                onClick={() => setView("table")}
                aria-label="Table view"
              >
                <Rows3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-full p-0",
                  view === "grid"
                    ? "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
                    : "text-white hover:bg-white/[0.08]",
                )}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-[#8892b0]">
              {isFetching ? "Refreshing..." : "Up to date"}
            </div>
          </div>

          <div className={cn("hidden", view === "table" && "md:block")}>
            <div className="relative w-full overflow-x-auto rounded-3xl border border-white/10 bg-[#07102c]">
              {isFetching ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#07102c]/80 backdrop-blur-sm">
                  <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white">
                    Loading...
                  </div>
                </div>
              ) : null}

              <Table>
                <TableHeader className="[&_tr]:border-b-white/10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-white/10">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="h-12 bg-[#091033] px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]"
                        >
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
                        className="cursor-pointer border-white/10 transition-colors hover:bg-white/[0.05]"
                        onClick={() => handleViewDetails(row.original.id)}
                        onMouseEnter={() => prefetchDetail(row.original.id)}
                        onFocus={() => prefetchDetail(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="border-white/10 px-4 py-4 align-top text-sm text-white"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-[#8892b0]">
                        No mentors found.
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
            {records.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                mentees={mentees}
                onViewDetails={handleViewDetails}
                onHover={prefetchDetail}
              />
            ))}
            {!isFetching && records.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-[#8892b0]">
                No mentors found.
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

      <MentorFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={{
          search: currentInput.search,
          status: currentInput.status,
        }}
        onApply={(filters: MentorListFilterState) =>
          updateFilters({
            search: filters.search ?? null,
            status: filters.status ?? "all",
          })
        }
        onReset={() => updateFilters({ search: null, status: "all" })}
      />
    </div>
  );
}
