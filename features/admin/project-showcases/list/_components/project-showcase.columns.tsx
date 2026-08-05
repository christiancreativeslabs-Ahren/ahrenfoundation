"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ProjectShowcaseListRow } from "@/lib/admin/project-showcases";

export function formatProjectShowcaseStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function projectShowcaseStatusVariant(status: string) {
  switch (status) {
    case "published":
      return "default";
    case "submitted":
      return "secondary";
    case "hidden":
      return "outline";
    case "draft":
    default:
      return "outline";
  }
}

export function buildProjectShowcaseColumns(input: { page: number; limit: number }): ColumnDef<ProjectShowcaseListRow>[] {
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
      header: "Project",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-semibold tracking-tight text-white">{row.original.title}</div>
          <div className="max-w-[32rem] text-xs leading-5 text-[#8892b0]">
            {row.original.summary}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={projectShowcaseStatusVariant(status)}
            className={
              status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : status === "submitted"
                  ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                  : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }
          >
            {formatProjectShowcaseStatus(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "memberName",
      header: "Member",
      cell: ({ row }) => (
        <span className="text-sm text-white">
          {row.original.memberName || row.original.authorName || "Unknown"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-[#8892b0]">
          {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.original.createdAt))}
        </span>
      ),
    },
  ];
}
