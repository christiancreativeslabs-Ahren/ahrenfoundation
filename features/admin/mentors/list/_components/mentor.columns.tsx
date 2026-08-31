"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { MentorListRow } from "@/lib/admin/mentors";
import type { MentorAssignmentMenteeCandidate } from "@/lib/admin/mentor-assignments";
import { formatStatus, statusVariant } from "@/features/admin/join-applications/list/_components/join-application.columns";
import { MentorListActions } from "./mentor.actions";

export function buildMentorColumns(input: {
  page: number;
  limit: number;
  mentees: MentorAssignmentMenteeCandidate[];
  onViewDetails: (memberId: string) => void;
}): ColumnDef<MentorListRow>[] {
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
      id: "mentor",
      header: "Mentor",
      cell: ({ row }) => (
        <button
          type="button"
          className="group w-full text-left"
          onClick={() => input.onViewDetails(row.original.id)}
        >
          <div className="font-semibold tracking-tight text-white transition-colors group-hover:text-[#00ff9d]">
            {row.original.fullName}
          </div>
          <div className="mt-1 text-xs text-[#8892b0]">{row.original.email}</div>
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={statusVariant(row.original.status)}
          className={
            row.original.status === "verified_mentor"
              ? "bg-[#00ff9d]/15 text-[#00ff9d]"
              : row.original.status === "approved"
                ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
          }
        >
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "currentStep",
      header: "Current Step",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-[#e8eeff]">
          {formatStatus(row.original.currentStep)}
        </span>
      ),
    },
    {
      accessorKey: "activeMenteeCount",
      header: "Mentees",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">{row.original.activeMenteeCount}</div>
          <div className="text-xs text-[#8892b0]">
            {row.original.totalMenteeCount} total assignment{row.original.totalMenteeCount === 1 ? "" : "s"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "verifiedAt",
      header: "Verified",
      cell: ({ row }) => (
        <span className="text-sm text-[#8892b0]">
          {row.original.verifiedAt
            ? new Intl.DateTimeFormat("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(row.original.verifiedAt))
            : "-"}
        </span>
      ),
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
        <MentorListActions
          mentor={row.original}
          mentees={input.mentees}
          onViewDetails={input.onViewDetails}
        />
      ),
    },
  ];
}
