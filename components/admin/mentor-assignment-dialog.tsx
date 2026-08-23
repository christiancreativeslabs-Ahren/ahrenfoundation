"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Search, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { assignMentorToYouth } from "@/actions/admin";
import type { MentorAssignmentCandidate } from "@/lib/admin/mentor-assignments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HiddenInput, Textarea, TextInput } from "@/components/ui/input-fields";
import { cn } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
};

type MentorAssignmentDialogProps = {
  memberId: string;
  applicantName: string;
  applicantEmail: string;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerSize?: "default" | "sm" | "lg";
  hideTrigger?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mentors: MentorAssignmentCandidate[];
};

export function MentorAssignmentDialog({
  memberId,
  applicantName,
  applicantEmail,
  triggerLabel,
  triggerClassName,
  triggerVariant = "outline",
  triggerSize = "sm",
  hideTrigger = false,
  open: controlledOpen,
  onOpenChange,
  mentors,
}: MentorAssignmentDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [state, formAction, pending] = useActionState(assignMentorToYouth, initialActionState);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedMentorId("");
  }, [open]);

  useEffect(() => {
    if (!state.ok) return;
    setOpen(false);
    router.refresh();
  }, [router, state.ok]);

  const filteredMentors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mentors;

    return mentors.filter((mentor) => {
      return (
        mentor.fullName.toLowerCase().includes(query) ||
        mentor.email.toLowerCase().includes(query) ||
        mentor.status.toLowerCase().includes(query) ||
        mentor.currentStep.toLowerCase().includes(query)
      );
    });
  }, [mentors, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {hideTrigger ? null : (
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          className={cn(
            "border-white/15 bg-transparent text-white hover:bg-white/10",
            triggerClassName,
          )}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(true);
          }}
        >
          <UserRoundPlus className="h-4 w-4" />
          {triggerLabel}
        </Button>
      )}

      <DialogContent className="flex max-h-[calc(100vh-1.5rem)] w-[min(96vw,56rem)] flex-col overflow-hidden border border-white/10 bg-[#07102c] p-0 text-white sm:max-h-[calc(100vh-3rem)]">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <DialogTitle className="text-2xl">Assign mentor</DialogTitle>
          <DialogDescription className="max-w-2xl text-slate-300">
            Assign one mentor directly to this applicant. Use the search box to quickly find a mentor.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
        <HiddenInput name="youth_member_id" value={memberId} />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Applicant
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{applicantName}</p>
                <p className="mt-1 text-sm text-slate-300">{applicantEmail}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Selected mentor
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {mentors.find((mentor) => mentor.id === selectedMentorId)?.fullName ?? "None selected"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {mentors.find((mentor) => mentor.id === selectedMentorId)?.email ?? "Search and choose a mentor"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-slate-200">
                Search mentors
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, status, or step"
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {filteredMentors.map((mentor) => {
                const active = mentor.id === selectedMentorId;

                return (
                  <button
                    key={mentor.id}
                    type="button"
                    onClick={() => setSelectedMentorId(mentor.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition",
                      active
                        ? "border-[#00ff9d]/30 bg-[#00ff9d]/10"
                        : "border-white/10 bg-white/[0.03] hover:border-[#00c9ff]/30 hover:bg-white/[0.05]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{mentor.fullName}</p>
                        <p className="mt-1 text-sm text-slate-300">{mentor.email}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                        {mentor.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {mentor.currentStep.replaceAll("_", " ")}
                    </p>
                  </button>
                );
              })}

              {!filteredMentors.length ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  No mentors matched your search.
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-slate-200">Assignment notes</label>
              <Textarea
                name="notes"
                placeholder="Optional notes about this assignment"
                className="min-h-28 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </div>

            <HiddenInput name="mentor_member_id" value={selectedMentorId} />
          </div>

          <DialogFooter className="border-t border-white/10 bg-[#07102c] px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={cn("text-sm", state.ok ? "text-[#00ff9d]" : "text-slate-300")}>
                {state.message || "Select one mentor to continue."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending || !selectedMentorId}
                  className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
                >
                  Assign mentor
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
