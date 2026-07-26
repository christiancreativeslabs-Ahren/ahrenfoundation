"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CommunityPostListRow } from "@/lib/admin/community-posts";

export function formatCommunityPostStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function communityPostStatusVariant(status: string) {
  switch (status) {
    case "published":
      return "default";
    case "hidden":
      return "secondary";
    default:
      return "outline";
  }
}

export function buildCommunityPostColumns(input: {
  page: number;
  limit: number;
}): ColumnDef<CommunityPostListRow>[] {
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
      accessorKey: "body",
      header: "Post",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="line-clamp-2 font-semibold text-foreground">{row.original.body}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.authorName || row.original.memberName || "Anonymous"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => row.original.channel,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={communityPostStatusVariant(row.original.status)}>
          {formatCommunityPostStatus(row.original.status)}
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
