"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { MenteeListRow } from "@/lib/admin/mentees";
import type { MentorAssignmentCandidate } from "@/lib/admin/mentor-assignments";
import { formatStatus, statusVariant } from "@/features/admin/join-applications/list/_components/join-application.columns";
import { MenteeActions } from "./mentee.actions";

export function buildMenteeColumns(input: {
  page: number;
  limit: number;
  mentors: MentorAssignmentCandidate[];
  onViewDetails: (memberId: string) => void;
}): ColumnDef<MenteeListRow>[] {
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
      id: "mentee",
      header: "Mentee",
      cell: ({ row }) => (
        <button type="button" className="group w-full text-left" onClick={() => input.onViewDetails(row.original.id)}>
          <div className="font-semibold tracking-tight text-white transition-colors group-hover:text-[#00ff9d]">{row.original.fullName}</div>
          <div className="mt-1 text-xs text-[#8892b0]">{row.original.email}</div>
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)} className="border-white/10 bg-white/[0.04] text-[#e8eeff]">
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "assignedMentorName",
      header: "Mentor",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-white">{row.original.assignedMentorName ?? "Unassigned"}</div>
          <div className="text-xs text-[#8892b0]">{row.original.assignedMentorEmail ?? "No active mentor"}</div>
        </div>
      ),
    },
    {
      id: "workbook",
      header: "Workbook",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-bold text-white">
            {row.original.completedModuleCount} / {row.original.totalModuleCount}
          </div>
          <div className="text-xs text-[#8892b0]">
            Latest:{" "}
            {row.original.latestSubmissionAt
              ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(row.original.latestSubmissionAt))
              : "-"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "currentStep",
      header: "Current Step",
      cell: ({ row }) => <span className="text-sm font-medium text-[#e8eeff]">{formatStatus(row.original.currentStep)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <MenteeActions
          mentee={row.original}
          mentors={input.mentors}
          onViewDetails={input.onViewDetails}
        />
      ),
    },
  ];
}
