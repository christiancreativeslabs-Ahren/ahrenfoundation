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
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:border-[#00c9ff]/30 hover:shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
      onMouseEnter={() => onHover?.(application.joinApplicationId)}
      onFocus={() => onHover?.(application.joinApplicationId)}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-4 py-4 text-left transition-colors group-hover:bg-white/[0.05]"
        onClick={() => onViewDetails(application.joinApplicationId)}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold leading-5 tracking-tight text-white group-hover:text-[#00ff9d]">
              {application.fullName}
            </h3>
            <Badge
              variant={statusVariant(application.status)}
              className={`shrink-0 whitespace-nowrap ${
                application.status === "approved"
                  ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                  : application.status === "rejected"
                    ? "bg-rose-500/15 text-rose-200"
                    : application.status === "reviewing"
                      ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                      : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
              }`}
            >
              {formatStatus(application.status)}
            </Badge>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 text-xs">
            <span className="truncate text-[#8892b0]">{application.email}</span>
            <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 font-medium text-[#00c9ff]">
              {application.applicationType === "youth" ? "Prospective mentee" : "Mentor"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-medium text-[#e8eeff]">
              {application.consent ? "Consent yes" : "Consent no"}
            </span>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 border-y border-white/10 bg-[#07102c]">
        <div className="col-span-2 border-b border-white/10 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Location</div>
          <div className="mt-1 truncate text-sm font-semibold text-white">{application.location}</div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Member</div>
          <div className="mt-2 text-sm font-semibold">
            {application.memberStatus ? (
              <span className="inline-flex rounded-full border border-[#00ff9d]/15 bg-[#00ff9d]/10 px-2.5 py-1 text-[#00ff9d]">
                {formatStatus(application.memberStatus)}
              </span>
            ) : (
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[#8892b0]">
                Not created
              </span>
            )}
          </div>
        </div>
        <div className="border-l border-white/10 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Step</div>
          <div className="mt-2 text-sm font-semibold text-white">
            {application.memberCurrentStep ? formatStatus(application.memberCurrentStep) : "-"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-[#091033] px-4 py-3">
        <div className="min-w-0 space-y-1 text-xs text-[#8892b0]">
          <div className="truncate">{application.phoneNumber}</div>
          <div className="truncate">
            Submitted:{" "}
            {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(application.createdAt),
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-9 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
          onClick={() => onViewDetails(application.joinApplicationId)}
        >
          View
        </Button>
      </div>
    </div>
  );
}
