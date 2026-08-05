"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { OpportunityListRow } from "@/lib/admin/opportunities";

export function formatOpportunityStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function opportunityStatusVariant(status: string) {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    default:
      return "outline";
  }
}

export function buildOpportunityColumns(input: {
  page: number;
  limit: number;
}): ColumnDef<OpportunityListRow>[] {
  return [
    {
      id: "serial",
      header: "S/N",
      cell: ({ row }) => {
        const offset = (input.page - 1) * input.limit;
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-[#00c9ff]">
            {offset + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Opportunity",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-semibold tracking-tight text-white">{row.original.title}</div>
          <div className="max-w-[32rem] text-xs leading-5 text-[#8892b0]">
            {row.original.summary || "No summary provided"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "audience",
      header: "Audience",
      cell: ({ row }) => (
        <Badge variant="outline" className="border-cyan-400/15 bg-[#00c9ff]/10 capitalize text-[#00c9ff]">
          {row.original.audience}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <span className="text-sm text-white">{row.original.type}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={opportunityStatusVariant(status)}
            className={
              status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : status === "draft"
                  ? "border-white/10 bg-white/[0.04] text-[#e8eeff]"
                  : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }
          >
            {formatOpportunityStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-[#8892b0]">
          {new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(row.original.createdAt))}
        </span>
      ),
    },
  ];
}
