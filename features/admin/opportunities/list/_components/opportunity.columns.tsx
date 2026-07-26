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
        return <div className="w-12">{offset + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Opportunity",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{row.original.title}</div>
          <div className="max-w-[32rem] text-xs text-muted-foreground">
            {row.original.summary || "No summary provided"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "audience",
      header: "Audience",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.audience}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.type,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={opportunityStatusVariant(row.original.status)}>
          {formatOpportunityStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(row.original.createdAt))}
        </span>
      ),
    },
  ];
}
