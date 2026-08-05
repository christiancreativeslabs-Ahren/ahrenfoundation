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
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-[#00c9ff]">
            {offset + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Event",
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
      accessorKey: "startsAt",
      header: "Starts",
      cell: ({ row }) => (
        <span className="text-sm text-[#8892b0]">
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
      cell: ({ row }) => <span className="text-sm text-white">{row.original.location || "-"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={eventStatusVariant(status)}
            className={
              status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }
          >
            {formatEventStatus(status)}
          </Badge>
        );
      },
    },
  ];
}
