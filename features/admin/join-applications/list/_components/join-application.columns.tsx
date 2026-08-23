"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { JoinApplicationListRow } from "@/lib/admin/join-applications";
import type { MentorAssignmentCandidate } from "@/lib/admin/mentor-assignments";
import { JoinApplicationActions } from "./join-application.actions";

export function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function statusVariant(status: string) {
  switch (status) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "reviewing":
      return "secondary";
    default:
      return "outline";
  }
}

export function buildJoinApplicationColumns(input: {
  page: number;
  limit: number;
  mentors: MentorAssignmentCandidate[];
  onViewDetails: (applicationId: string) => void;
}): ColumnDef<JoinApplicationListRow>[] {
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
      id: "applicant",
      header: "Applicant",
      cell: ({ row }) => (
        <button
          type="button"
          className="group w-full text-left"
          onClick={() => input.onViewDetails(row.original.joinApplicationId)}
        >
          <div className="font-semibold tracking-tight text-white transition-colors group-hover:text-[#00ff9d]">
            {row.original.fullName}
          </div>
          <div className="mt-1 text-xs text-[#8892b0]">{row.original.email}</div>
        </button>
      ),
    },
    {
      accessorKey: "applicationType",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="border-cyan-400/15 bg-[#00c9ff]/10 capitalize text-[#00c9ff]"
        >
          {row.original.applicationType === "youth" ? "Prospective mentee" : "Mentor"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={statusVariant(row.original.status)}
          className={
            row.original.status === "approved"
              ? "bg-[#00ff9d]/15 text-[#00ff9d]"
              : row.original.status === "rejected"
                ? "bg-rose-500/15 text-rose-200"
                : row.original.status === "reviewing"
                  ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                  : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
          }
        >
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "memberStatus",
      header: "Member",
      cell: ({ row }) => (
        <span
          className={
            row.original.memberStatus
              ? "inline-flex rounded-full border border-[#00ff9d]/15 bg-[#00ff9d]/10 px-3 py-1 text-sm font-medium text-[#00ff9d]"
              : "inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-medium text-[#8892b0]"
          }
        >
          {row.original.memberStatus ? formatStatus(row.original.memberStatus) : "Not created"}
        </span>
      ),
    },
    {
      accessorKey: "memberCurrentStep",
      header: "Current Step",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-[#e8eeff]">
          {row.original.memberCurrentStep ? formatStatus(row.original.memberCurrentStep) : "-"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
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
        <JoinApplicationActions
          application={row.original}
          mentors={input.mentors}
          onViewDetails={input.onViewDetails}
        />
      ),
    },
  ];
}
