"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { ResourceListRow } from "@/lib/admin/resources";
import { ResourceRowActions } from "./resource-row-actions";

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
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-[#00c9ff]">
            {offset + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Resource",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-semibold tracking-tight text-white">
            {row.original.title}
          </div>
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
        <Badge
          variant="outline"
          className="border-cyan-400/15 bg-[#00c9ff]/10 capitalize text-[#00c9ff]"
        >
          {row.original.audience}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-white">{row.original.category}</span>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Visibility",
      cell: ({ row }) => {
        const published = row.original.isPublished;
        return (
          <Badge
            variant={resourceStatusVariant(published)}
            className={
              published
                ? "border-[#00ff9d]/15 bg-[#00ff9d]/10 text-[#00ff9d]"
                : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }
          >
            {formatResourceStatus(published)}
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ResourceRowActions
          resourceId={row.original.resourceId}
          isPublished={row.original.isPublished}
          title={row.original.title}
          url={row.original.url}
        />
      ),
    },
  ];
}
