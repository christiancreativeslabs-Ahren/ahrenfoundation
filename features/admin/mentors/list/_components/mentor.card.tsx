"use client";

import { Badge } from "@/components/ui/badge";
import type { MentorListRow } from "@/lib/admin/mentors";
import type { MentorAssignmentMenteeCandidate } from "@/lib/admin/mentor-assignments";
import { formatStatus, statusVariant } from "@/features/admin/join-applications/list/_components/join-application.columns";
import { MentorListActions } from "./mentor.actions";

export function MentorCard({
  mentor,
  mentees,
  onViewDetails,
  onHover,
}: {
  mentor: MentorListRow;
  mentees: MentorAssignmentMenteeCandidate[];
  onViewDetails: (memberId: string) => void;
  onHover?: (memberId: string) => void;
}) {
  return (
    <div
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:border-[#00c9ff]/30 hover:shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
      onMouseEnter={() => onHover?.(mentor.id)}
      onFocus={() => onHover?.(mentor.id)}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-4 py-4 text-left transition-colors group-hover:bg-white/[0.05]"
        onClick={() => onViewDetails(mentor.id)}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold leading-5 tracking-tight text-white group-hover:text-[#00ff9d]">
              {mentor.fullName}
            </h3>
            <Badge
              variant={statusVariant(mentor.status)}
              className={`shrink-0 whitespace-nowrap ${
                mentor.status === "verified_mentor"
                  ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                  : mentor.status === "approved"
                    ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                    : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
              }`}
            >
              {formatStatus(mentor.status)}
            </Badge>
          </div>
          <div className="truncate text-xs text-[#8892b0]">{mentor.email}</div>
        </div>
      </button>

      <div className="grid grid-cols-2 border-y border-white/10 bg-[#07102c]">
        <div className="px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Active mentees</div>
          <div className="mt-2 text-2xl font-bold text-white">{mentor.activeMenteeCount}</div>
        </div>
        <div className="border-l border-white/10 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Total assignments</div>
          <div className="mt-2 text-2xl font-bold text-white">{mentor.totalMenteeCount}</div>
        </div>
        <div className="col-span-2 border-t border-white/10 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">Current step</div>
          <div className="mt-1 truncate text-sm font-semibold text-white">{formatStatus(mentor.currentStep)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-[#091033] px-4 py-3">
        <div className="min-w-0 space-y-1 text-xs text-[#8892b0]">
          <div className="truncate">
            Verified:{" "}
            {mentor.verifiedAt
              ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(mentor.verifiedAt))
              : "-"}
          </div>
          <div className="truncate">
            Created:{" "}
            {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(mentor.createdAt))}
          </div>
        </div>
        <MentorListActions
          mentor={mentor}
          mentees={mentees}
          onViewDetails={onViewDetails}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
