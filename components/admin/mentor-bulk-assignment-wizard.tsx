"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Search, UserRoundPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { assignMentorToYouthGroup } from "@/actions/admin";
import type {
  MentorAssignmentCandidate,
  MentorAssignmentMenteeCandidate,
} from "@/lib/admin/mentor-assignments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox, HiddenInput, Textarea, TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
};

type MentorBulkAssignmentWizardProps = {
  mentors: MentorAssignmentCandidate[];
  mentees: MentorAssignmentMenteeCandidate[];
};

const steps = [
  { id: 1, title: "Select mentor" },
  { id: 2, title: "Select mentees" },
  { id: 3, title: "Review and assign" },
] as const;

export function MentorBulkAssignmentWizard({
  mentors,
  mentees,
}: MentorBulkAssignmentWizardProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    assignMentorToYouthGroup,
    initialActionState,
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mentorSearch, setMentorSearch] = useState("");
  const [menteeSearch, setMenteeSearch] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [selectedMenteeIds, setSelectedMenteeIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!state.ok) return;
    setStep(1);
    setSelectedMentorId("");
    setSelectedMenteeIds([]);
    setNotes("");
    setMentorSearch("");
    setMenteeSearch("");
    router.refresh();
  }, [router, state.ok]);

  const selectedMentor = useMemo(
    () => mentors.find((mentor) => mentor.id === selectedMentorId) ?? null,
    [mentors, selectedMentorId],
  );

  const filteredMentors = useMemo(() => {
    const query = mentorSearch.trim().toLowerCase();
    if (!query) return mentors;

    return mentors.filter((mentor) => {
      return (
        mentor.fullName.toLowerCase().includes(query) ||
        mentor.email.toLowerCase().includes(query) ||
        mentor.status.toLowerCase().includes(query) ||
        mentor.currentStep.toLowerCase().includes(query)
      );
    });
  }, [mentors, mentorSearch]);

  const filteredMentees = useMemo(() => {
    const query = menteeSearch.trim().toLowerCase();
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
  }, [mentees, menteeSearch]);

  const selectedMentees = useMemo(
    () => mentees.filter((mentee) => selectedMenteeIds.includes(mentee.id)),
    [mentees, selectedMenteeIds],
  );

  const canGoNextFromMentor = Boolean(selectedMentorId);
  const canGoNextFromMentees = selectedMenteeIds.length > 0;

  const toggleMentee = (menteeId: string) => {
    setSelectedMenteeIds((current) =>
      current.includes(menteeId)
        ? current.filter((id) => id !== menteeId)
        : [...current, menteeId],
    );
  };

  const selectAllFiltered = () => {
    setSelectedMenteeIds((current) => {
      const next = new Set(current);
      filteredMentees.forEach((mentee) => next.add(mentee.id));
      return Array.from(next);
    });
  };

  const clearFiltered = () => {
    const filteredIds = new Set(filteredMentees.map((mentee) => mentee.id));
    setSelectedMenteeIds((current) =>
      current.filter((id) => !filteredIds.has(id)),
    );
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Mentors", value: mentors.length },
          { label: "Mentees", value: mentees.length },
          { label: "Selected mentees", value: selectedMenteeIds.length },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border px-4 py-4",
              step >= item.id
                ? "border-[#00ff9d]/20 bg-[#00ff9d]/10"
                : "border-white/10 bg-white/[0.03]",
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Step {item.id}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
          </div>
        ))}
      </div>

      {step === 1 ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserRoundPlus className="h-5 w-5 text-[#00ff9d]" />
              Select a mentor
            </CardTitle>
            <CardDescription className="text-slate-300">
              Pick the mentor who should receive the selected mentees.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput
                value={mentorSearch}
                onChange={(event) => setMentorSearch(event.target.value)}
                placeholder="Search mentors by name or email"
                className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
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
                  </button>
                );
              })}

              {!filteredMentors.length ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  No mentors matched your search.
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                disabled={!canGoNextFromMentor}
                className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
                onClick={() => setStep(2)}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-5 w-5 text-[#00ff9d]" />
              Select mentees
            </CardTitle>
            <CardDescription className="text-slate-300">
              Search the full mentee list and select as many as you need. No page-by-page browsing required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  value={menteeSearch}
                  onChange={(event) => setMenteeSearch(event.target.value)}
                  placeholder="Search mentees by name, email, step, or assigned mentor"
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={selectAllFiltered}
              >
                Select visible
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={clearFiltered}
              >
                Clear visible
              </Button>
            </div>

            <Separator className="bg-white/10" />

            <div className="grid gap-3 lg:grid-cols-2">
              {filteredMentees.map((mentee) => {
                const checked = selectedMenteeIds.includes(mentee.id);

                return (
                  <Checkbox
                    key={mentee.id}
                    checked={checked}
                    onCheckedChange={() => toggleMentee(mentee.id)}
                    label={mentee.fullName}
                    description={
                      <>
                        <span className="block">{mentee.email}</span>
                        <span className="mt-1 block">
                          {mentee.status.replaceAll("_", " ")}{" "}
                          {mentee.assignedMentorName
                            ? `• Assigned to ${mentee.assignedMentorName}`
                            : "• No mentor assigned"}
                        </span>
                      </>
                    }
                    containerClassName="items-start"
                  />
                );
              })}

              {!filteredMentees.length ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  No mentees matched your search.
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={!canGoNextFromMentees}
                className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
                onClick={() => setStep(3)}
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-5 w-5 text-[#00ff9d]" />
              Review and assign
            </CardTitle>
            <CardDescription className="text-slate-300">
              Confirm the mentor and all selected mentees before you submit the assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <HiddenInput name="mentor_member_id" value={selectedMentorId} />
              {selectedMenteeIds.map((id) => (
                <HiddenInput key={id} name="youth_member_ids" value={id} />
              ))}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Mentor
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {selectedMentor?.fullName ?? "None selected"}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {selectedMentor?.email ?? "Go back and select a mentor"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Selected mentees
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {selectedMentees.length} selected
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    These mentees will all be assigned to the chosen mentor.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedMentees.map((mentee) => (
                  <div
                    key={mentee.id}
                    className="rounded-2xl border border-white/10 bg-[#0d1538] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{mentee.fullName}</p>
                        <p className="mt-1 text-sm text-slate-300">{mentee.email}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                        {mentee.currentStep.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Assignment notes</label>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional note for this assignment"
                  className="min-h-28 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                  name="notes"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                    onClick={() => {
                      setStep(1);
                      setSelectedMenteeIds([]);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={pending || !selectedMentorId || !selectedMenteeIds.length}
                    className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
                  >
                    Assign mentor
                  </Button>
                </div>
              </div>

              <p className={cn("text-sm", state.ok ? "text-[#00ff9d]" : "text-slate-300")}>
                {state.message || "Review the summary before confirming."}
              </p>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
