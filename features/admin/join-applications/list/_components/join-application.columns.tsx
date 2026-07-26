"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { JoinApplicationListRow } from "@/lib/admin/join-applications";

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
  onViewDetails: (applicationId: string) => void;
}): ColumnDef<JoinApplicationListRow>[] {
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
      id: "applicant",
      header: "Applicant",
      cell: ({ row }) => (
        <button
          type="button"
          className="w-full text-left"
          onClick={() => input.onViewDetails(row.original.joinApplicationId)}
        >
          <div className="font-semibold text-foreground">{row.original.fullName}</div>
          <div className="mt-1 text-xs text-muted-foreground">{row.original.email}</div>
        </button>
      ),
    },
    {
      accessorKey: "applicationType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.applicationType}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "memberStatus",
      header: "Member",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.memberStatus ? formatStatus(row.original.memberStatus) : "Not created"}
        </span>
      ),
    },
    {
      accessorKey: "memberCurrentStep",
      header: "Current Step",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.memberCurrentStep ? formatStatus(row.original.memberCurrentStep) : "-"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
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
