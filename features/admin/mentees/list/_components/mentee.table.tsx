"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Download, LayoutGrid, Rows3, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination, DataTableToolbar, FilterTags, TableLoadingSkeleton } from "@/components/shared/table";
import { MemberRegistrationDialog } from "@/components/admin/member-registration-dialog";
import type { MenteeListInput, MenteeListResponse } from "@/lib/admin/mentees";
import type { MentorAssignmentCandidate } from "@/lib/admin/mentor-assignments";
import { cn } from "@/lib/utils";
import { useMenteeList } from "../_hooks/use-mentee-list";
import { buildMenteeColumns } from "./mentee.columns";
import { MenteeFilterSheet, type MenteeListFilterState } from "./mentee.filter.sheet";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

function statusLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function MenteeTable({
  initialData,
  initialFilters,
  mentors,
}: {
  initialData: MenteeListResponse;
  initialFilters: MenteeListInput;
  mentors: MentorAssignmentCandidate[];
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
  } = useMenteeList({ initialData, initialInput: initialFilters });

  const data = query.data;
  const records = data?.items ?? [];
  const isFetching = query.isFetching;
  const columns = useMemo(
    () =>
      buildMenteeColumns({
        page: currentInput.page,
        limit: currentInput.limit,
        mentors,
        onViewDetails: (memberId) => router.push(`/admin/mentees/${memberId}`),
      }),
    [currentInput.page, currentInput.limit, mentors, router],
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
    ].filter(Boolean) as Array<{ key: string; label: string; value: string; onRemove: () => void }>;
  }, [currentInput.search, currentInput.status, updateFilters]);
  const summary = data?.summary ?? initialData.summary;
  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    if (currentInput.search) params.set("search", currentInput.search);
    if (currentInput.status && currentInput.status !== "all") {
      params.set("status", currentInput.status);
    }
    const query = params.toString();
    return query ? `/api/admin/mentees/export?${query}` : "/api/admin/mentees/export";
  }, [currentInput.search, currentInput.status]);

  const viewDetails = (memberId: string) => {
    router.push(`/admin/mentees/${memberId}`);
  };
  const prefetchDetail = (memberId: string) => {
    router.prefetch(`/admin/mentees/${memberId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-white/[0.03] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="h-1 bg-gradient-to-r from-[#00c9ff] via-[#00ff9d] to-[#00c9ff]" />
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">Admin members</p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">Mentees</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Manage mentee member records, mentor assignments, and Workbook progress outside the applicant queue.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <MemberRegistrationDialog role="youth" label="New mentee" />
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total mentees", value: summary.total },
            { label: "Verified", value: summary.verified },
            { label: "Approved", value: summary.approved },
            { label: "Completed", value: summary.completed },
            { label: "Assigned", value: summary.assigned },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">{item.label}</div>
              <div className="mt-3 text-2xl font-bold text-white">{formatCount(item.value)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-white/10 bg-white/[0.03] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">Mentee directory</CardTitle>
          <CardDescription className="text-slate-300">
            Search, filter, assign mentors, and open member detail from this list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableToolbar
            table={table}
            title={
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-400/15 bg-[#00c9ff]/10 p-2 text-[#00c9ff]">
                  <Users size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Mentees [{formatCount(data?.totalCount ?? initialData.totalCount)}]
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
          <FilterTags tags={filterTags} onClearAll={() => updateFilters({ search: null, status: "all" })} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <Button type="button" variant={view === "table" ? "default" : "ghost"} size="sm" className={cn("h-9 w-9 rounded-full p-0", view === "table" ? "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]" : "text-white hover:bg-white/[0.08]")} onClick={() => setView("table")} aria-label="Table view">
                <Rows3 className="h-4 w-4" />
              </Button>
              <Button type="button" variant={view === "grid" ? "default" : "ghost"} size="sm" className={cn("h-9 w-9 rounded-full p-0", view === "grid" ? "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]" : "text-white hover:bg-white/[0.08]")} onClick={() => setView("grid")} aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-[#8892b0]">{isFetching ? "Refreshing..." : "Up to date"}</div>
          </div>
          <div className={cn("hidden", view === "table" && "md:block")}>
            <div className="relative w-full overflow-x-auto rounded-3xl border border-white/10 bg-[#07102c]">
              {isFetching ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#07102c]/80 backdrop-blur-sm">
                  <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white">Loading...</div>
                </div>
              ) : null}
              <Table>
                <TableHeader className="[&_tr]:border-b-white/10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-white/10">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 bg-[#091033] px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="cursor-pointer border-white/10 transition-colors hover:bg-white/[0.05]" onClick={() => viewDetails(row.original.id)} onMouseEnter={() => prefetchDetail(row.original.id)} onFocus={() => prefetchDetail(row.original.id)}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="border-white/10 px-4 py-4 align-top text-sm text-white">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-[#8892b0]">No mentees found.</TableCell>
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
          <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", view === "grid" ? "md:grid" : "md:hidden", "grid")}>
            {records.map((mentee) => (
              <div key={mentee.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <button type="button" className="w-full text-left" onClick={() => viewDetails(mentee.id)}>
                  <h3 className="text-lg font-semibold text-white">{mentee.fullName}</h3>
                  <p className="mt-1 text-sm text-[#8892b0]">{mentee.email}</p>
                </button>
                <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <p>Mentor <span className="block text-white">{mentee.assignedMentorName ?? "Unassigned"}</span></p>
                  <p>Workbook <span className="block text-white">{mentee.completedModuleCount}/{mentee.totalModuleCount}</span></p>
                  <p>Status <span className="block text-white">{statusLabel(mentee.status)}</span></p>
                  <p>Step <span className="block text-white">{statusLabel(mentee.currentStep)}</span></p>
                </div>
              </div>
            ))}
            {!isFetching && records.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-[#8892b0]">No mentees found.</div>
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
      <MenteeFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={{ search: currentInput.search, status: currentInput.status }}
        onApply={(filters: MenteeListFilterState) => updateFilters({ search: filters.search ?? null, status: filters.status ?? "all" })}
        onReset={() => updateFilters({ search: null, status: "all" })}
      />
    </div>
  );
}
