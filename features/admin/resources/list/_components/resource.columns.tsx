"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ResourceListRow } from "@/lib/admin/resources";

export function formatResourceStatus(isPublished: boolean) {
  return isPublished ? "Published" : "Draft";
}

export function resourceStatusVariant(isPublished: boolean) {
  return isPublished ? "default" : "secondary";
}

export function buildResourceColumns(input: {
  page: number;
  limit: number;
}): ColumnDef<ResourceListRow>[] {
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
      header: "Resource",
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category,
    },
    {
      accessorKey: "isPublished",
      header: "Visibility",
      cell: ({ row }) => (
        <Badge variant={resourceStatusVariant(row.original.isPublished)}>
          {formatResourceStatus(row.original.isPublished)}
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
