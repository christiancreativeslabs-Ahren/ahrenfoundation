"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { EventListRow } from "@/lib/admin/events";

export function formatEventStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function eventStatusVariant(status: string) {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    default:
      return "outline";
  }
}

export function buildEventColumns(input: {
  page: number;
  limit: number;
}): ColumnDef<EventListRow>[] {
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
      header: "Event",
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
      accessorKey: "startsAt",
      header: "Starts",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(row.original.startsAt))}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={eventStatusVariant(row.original.status)}>
          {formatEventStatus(row.original.status)}
        </Badge>
      ),
    },
  ];
}
