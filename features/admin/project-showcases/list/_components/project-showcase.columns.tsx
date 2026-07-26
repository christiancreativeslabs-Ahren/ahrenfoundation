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
        return <div className="w-12">{offset + row.index + 1}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{row.original.title}</div>
          <div className="max-w-[32rem] text-xs text-muted-foreground">
            {row.original.summary}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={projectShowcaseStatusVariant(row.original.status)}>
          {formatProjectShowcaseStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "memberName",
      header: "Member",
      cell: ({ row }) => row.original.memberName || row.original.authorName || "Unknown",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.original.createdAt))}
        </span>
      ),
    },
  ];
}
