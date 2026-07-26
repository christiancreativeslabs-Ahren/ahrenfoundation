"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JoinApplicationListRow } from "@/lib/admin/join-applications";
import { formatStatus, statusVariant } from "./join-application.columns";

export function JoinApplicationCard({
  application,
  onViewDetails,
  onHover,
}: {
  application: JoinApplicationListRow;
  onViewDetails: (applicationId: string) => void;
  onHover?: (applicationId: string) => void;
}) {
  return (
    <div
      className="group overflow-hidden rounded-sm border border-border bg-background transition-all hover:border-primary/40 hover:shadow-sm"
      onMouseEnter={() => onHover?.(application.joinApplicationId)}
      onFocus={() => onHover?.(application.joinApplicationId)}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 bg-muted/40 px-4 py-4 text-left transition-colors group-hover:bg-muted/70"
        onClick={() => onViewDetails(application.joinApplicationId)}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold leading-5">{application.fullName}</h3>
            <Badge variant={statusVariant(application.status)} className="shrink-0 whitespace-nowrap">
              {formatStatus(application.status)}
            </Badge>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="truncate">{application.email}</span>
            <span>{application.applicationType}</span>
            <span>{application.consent ? "Consent yes" : "Consent no"}</span>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 border-y border-border bg-background">
        <div className="col-span-2 border-b border-border px-4 py-3">
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">Location</div>
          <div className="mt-1 truncate text-sm font-semibold">{application.location}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">Member</div>
          <div className="mt-1 text-sm font-semibold">
            {application.memberStatus ? formatStatus(application.memberStatus) : "Not created"}
          </div>
        </div>
        <div className="border-l border-border px-4 py-3">
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">Step</div>
          <div className="mt-1 text-sm font-semibold">
            {application.memberCurrentStep ? formatStatus(application.memberCurrentStep) : "-"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 space-y-1 text-xs text-muted-foreground">
          <div className="truncate">{application.phoneNumber}</div>
          <div className="truncate">
            Submitted:{" "}
            {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(application.createdAt),
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" className="h-8" onClick={() => onViewDetails(application.joinApplicationId)}>
          View
        </Button>
      </div>
    </div>
  );
}
