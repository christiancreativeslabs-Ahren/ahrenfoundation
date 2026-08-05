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
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-[#00c9ff]">
            {offset + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "body",
      header: "Post",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="line-clamp-2 font-semibold tracking-tight text-white">{row.original.body}</div>
          <div className="text-xs text-[#8892b0]">
            {row.original.authorName || row.original.memberName || "Anonymous"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => <span className="text-sm text-white">{row.original.channel}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={communityPostStatusVariant(status)}
            className={
              status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : status === "hidden"
                  ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                  : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }
          >
            {formatCommunityPostStatus(status)}
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
