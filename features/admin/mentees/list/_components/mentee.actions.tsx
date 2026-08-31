"use client";

import { useState } from "react";
import { ChevronDown, PencilLine, UserRoundPlus } from "lucide-react";
import type { MenteeListRow } from "@/lib/admin/mentees";
import type { MentorAssignmentCandidate } from "@/lib/admin/mentor-assignments";
import { MentorAssignmentDialog } from "@/components/admin/mentor-assignment-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MenteeActions({
  mentee,
  mentors,
  onViewDetails,
  className,
}: {
  mentee: MenteeListRow;
  mentors: MentorAssignmentCandidate[];
  onViewDetails: (memberId: string) => void;
  className?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div className={cn("relative inline-flex", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((value) => !value);
        }}
      >
        Actions
        <ChevronDown className="h-4 w-4" />
      </Button>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#07102c] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/[0.08]"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen(false);
                onViewDetails(mentee.id);
              }}
            >
              <PencilLine className="h-4 w-4 text-[#00c9ff]" />
              View details
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/[0.08]"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen(false);
                setAssignOpen(true);
              }}
            >
              <UserRoundPlus className="h-4 w-4 text-[#00ff9d]" />
              Assign mentor
            </button>
          </div>
        </>
      ) : null}

      <MentorAssignmentDialog
        memberId={mentee.id}
        applicantName={mentee.fullName}
        applicantEmail={mentee.email}
        hideTrigger
        open={assignOpen}
        onOpenChange={setAssignOpen}
        mentors={mentors}
      />
    </div>
  );
}
