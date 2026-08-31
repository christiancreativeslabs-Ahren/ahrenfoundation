"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Search, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { assignMentorToYouthGroup } from "@/actions/admin";
import type { MentorListRow } from "@/lib/admin/mentors";
import type { MentorAssignmentMenteeCandidate } from "@/lib/admin/mentor-assignments";
import { Button } from "@/components/ui/button";
import { Checkbox, HiddenInput, Textarea, TextInput } from "@/components/ui/input-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialActionState = {
  ok: false,
  message: "",
};

export function MentorMenteeAssignmentDialog({
  mentor,
  mentees,
  open,
  onOpenChange,
}: {
  mentor: MentorListRow;
  mentees: MentorAssignmentMenteeCandidate[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedMenteeIds, setSelectedMenteeIds] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState(
    assignMentorToYouthGroup,
    initialActionState,
  );

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedMenteeIds([]);
  }, [open]);

  useEffect(() => {
    if (!state.ok) return;
    onOpenChange(false);
    router.refresh();
  }, [onOpenChange, router, state.ok]);

  const filteredMentees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mentees;

    return mentees.filter((mentee) => {
      return (
        mentee.fullName.toLowerCase().includes(query) ||
        mentee.email.toLowerCase().includes(query) ||
        mentee.status.toLowerCase().includes(query) ||
        mentee.currentStep.toLowerCase().includes(query) ||
        (mentee.assignedMentorName ?? "").toLowerCase().includes(query)
      );
    });
  }, [mentees, search]);

  const toggleMentee = (menteeId: string) => {
    setSelectedMenteeIds((current) =>
      current.includes(menteeId)
        ? current.filter((id) => id !== menteeId)
        : [...current, menteeId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-1.5rem)] w-[min(96vw,56rem)] flex-col overflow-hidden border border-white/10 bg-[#07102c] p-0 text-white sm:max-h-[calc(100vh-3rem)]">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <DialogTitle className="text-2xl">Assign mentees</DialogTitle>
          <DialogDescription className="sm:!max-w-4xl text-slate-300">
            Assign selected mentees to {mentor.fullName}.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <HiddenInput name="mentor_member_id" value={mentor.id} />
          {selectedMenteeIds.map((id) => (
            <HiddenInput key={id} name="youth_member_ids" value={id} />
          ))}

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Mentor
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{mentor.fullName}</p>
              <p className="mt-1 text-sm text-slate-300">{mentor.email}</p>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-slate-200">
                Search mentees
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, step, or assigned mentor"
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {filteredMentees.map((mentee) => (
                <Checkbox
                  key={mentee.id}
                  checked={selectedMenteeIds.includes(mentee.id)}
                  onCheckedChange={() => toggleMentee(mentee.id)}
                  label={mentee.fullName}
                  description={
                    <>
                      <span className="block">{mentee.email}</span>
                      <span className="mt-1 block">
                        {mentee.status.replaceAll("_", " ")}{" "}
                        {mentee.assignedMentorName
                          ? `- Assigned to ${mentee.assignedMentorName}`
                          : "- No mentor assigned"}
                      </span>
                    </>
                  }
                  containerClassName="items-start"
                />
              ))}

              {!filteredMentees.length ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  No mentees matched your search.
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Assignment notes
              </label>
              <Textarea
                name="notes"
                placeholder="Optional note for this assignment"
                className="min-h-28 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 bg-[#07102c] px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={state.ok ? "text-sm text-[#00ff9d]" : "text-sm text-slate-300"}>
                {state.message || `${selectedMenteeIds.length} mentee${selectedMenteeIds.length === 1 ? "" : "s"} selected.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending || !selectedMenteeIds.length}
                  className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
                >
                  <UserRoundPlus className="h-4 w-4" />
                  Assign mentees
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
