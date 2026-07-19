import Link from "next/link";
import { asc, eq, inArray, or } from "drizzle-orm";
import {
  cancelModuleDeliveryAction,
  grantVerifiedStatus,
  issueCompletionCertificate,
  resendModuleDelivery,
  rescheduleModuleDeliveryAction,
  retryFailedModuleDelivery,
  syncMemberDeliveriesAction,
  updateMentorshipSession,
  updateMentorOnboardingMilestone,
} from "@/actions/admin";
import { db } from "@/db";
import {
  emailEvents,
  mentorAssignments,
  mentorshipSessions,
  moduleDeliveries,
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programEnrollments,
  programMembers,
  programModules,
} from "@/db/schema";
import { formatAdminDate } from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DateTimeInput,
  HiddenInput,
  Select,
  Textarea,
  UrlInput,
} from "@/components/ui/input-fields";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function updateSessionAction(formData: FormData) {
  "use server";
  await updateMentorshipSession(initialActionState, formData);
}

async function issueCertificateAction(formData: FormData) {
  "use server";
  await issueCompletionCertificate(initialActionState, formData);
}

async function grantVerifiedAction(formData: FormData) {
  "use server";
  await grantVerifiedStatus(initialActionState, formData);
}

async function updateMentorMilestoneAction(formData: FormData) {
  "use server";
  await updateMentorOnboardingMilestone(formData);
}

async function resendDeliveryAction(formData: FormData) {
  "use server";
  await resendModuleDelivery(initialActionState, formData);
}

async function retryDeliveryAction(formData: FormData) {
  "use server";
  await retryFailedModuleDelivery(initialActionState, formData);
}

async function cancelDeliveryAction(formData: FormData) {
  "use server";
  await cancelModuleDeliveryAction(initialActionState, formData);
}

async function rescheduleDeliveryAction(formData: FormData) {
  "use server";
  await rescheduleModuleDeliveryAction(initialActionState, formData);
}

async function syncDeliveriesAction(formData: FormData) {
  "use server";
  await syncMemberDeliveriesAction(initialActionState, formData);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDateTimeLocal(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function ProgramMemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (!member) {
    return (
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Program member not found</CardTitle>
          <CardDescription className="text-slate-300">
            This member may have been removed or the link is invalid.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const moduleProgress = await db
    .select({
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
      module: programModules,
    })
    .from(moduleDeliveries)
    .innerJoin(programEnrollments, eq(programEnrollments.id, moduleDeliveries.enrollmentId))
    .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
    .where(eq(moduleDeliveries.programMemberId, member.id))
    .orderBy(asc(programModules.moduleNumber));

  const submissions = await db
    .select()
    .from(moduleSubmissions)
    .where(eq(moduleSubmissions.programMemberId, member.id))
    .orderBy(asc(moduleSubmissions.submittedAt));

  const latestSubmissionByModule = new Map<string, typeof submissions[number]>();
  for (const submission of submissions) {
    latestSubmissionByModule.set(submission.moduleId, submission);
  }

  const latestSubmissionIds = Array.from(latestSubmissionByModule.values()).map(
    (submission) => submission.id,
  );

  const answers = latestSubmissionIds.length
    ? await db
        .select({
          submissionId: moduleSubmissionAnswers.submissionId,
          answer: moduleSubmissionAnswers.answer,
          questionNumber: moduleQuestions.questionNumber,
          prompt: moduleQuestions.prompt,
        })
        .from(moduleSubmissionAnswers)
        .innerJoin(moduleQuestions, eq(moduleQuestions.id, moduleSubmissionAnswers.questionId))
        .where(inArray(moduleSubmissionAnswers.submissionId, latestSubmissionIds))
        .orderBy(asc(moduleQuestions.questionNumber))
    : [];

  const deliveryIds = moduleProgress.map((item) => item.delivery.id);
  const deliveryEmailEvents = deliveryIds.length
    ? await db
        .select()
        .from(emailEvents)
        .where(inArray(emailEvents.deliveryId, deliveryIds))
        .orderBy(asc(emailEvents.createdAt))
    : [];

  const latestEmailEventByDelivery = new Map<string, typeof deliveryEmailEvents[number]>();
  for (const event of deliveryEmailEvents) {
    if (event.deliveryId) {
      latestEmailEventByDelivery.set(event.deliveryId, event);
    }
  }

  type AnswerRow = (typeof answers)[number];
  const answersBySubmission = new Map<string, AnswerRow[]>();
  for (const answer of answers) {
    const existing = answersBySubmission.get(answer.submissionId) ?? [];
    existing.push(answer);
    answersBySubmission.set(answer.submissionId, existing);
  }

  const assignments = await db
    .select()
    .from(mentorAssignments)
    .where(
      or(
        eq(mentorAssignments.youthMemberId, member.id),
        eq(mentorAssignments.mentorMemberId, member.id),
      ),
    )
    .orderBy(asc(mentorAssignments.createdAt));

  const sessions = assignments.length
    ? await db
        .select()
        .from(mentorshipSessions)
        .where(eq(mentorshipSessions.assignmentId, assignments[0].id))
        .orderBy(asc(mentorshipSessions.sessionNumber))
    : [];

  const completedModules = moduleProgress.filter(
    (item) => item.delivery.assignmentSubmittedAt,
  ).length;
  const completionPercentage = moduleProgress.length
    ? Math.round((completedModules / moduleProgress.length) * 100)
    : 0;
  const currentModule = moduleProgress.find(
    (item) => !item.delivery.assignmentSubmittedAt,
  );
  const nextScheduled = moduleProgress.find(
    (item) =>
      item.delivery.status === "scheduled" ||
      item.delivery.status === "failed" ||
      item.delivery.status === "cancelled",
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                href="/admin/join-applications"
                className="text-sm font-medium text-[#00ff9d] hover:underline"
              >
                Back to applications
              </Link>
              <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
                {member.fullName}
              </CardTitle>
              <CardDescription className="mt-2 text-slate-300">
                {member.email} - {member.role} - {member.currentStep.replaceAll("_", " ")}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={issueCertificateAction}>
                <HiddenInput name="program_member_id" value={member.id} />
                <Button type="submit" variant="secondary">
                  Issue certificate
                </Button>
              </form>
              <form action={grantVerifiedAction}>
                <HiddenInput name="program_member_id" value={member.id} />
                <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                  Grant verified access
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Role", value: member.role },
            { label: "Status", value: member.status.replaceAll("_", " ") },
            { label: "Verified", value: member.verifiedAt ? formatDate(member.verifiedAt) : "No" },
            { label: "Certificate", value: member.certificateIssuedAt ? formatDate(member.certificateIssuedAt) : "Not issued" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold capitalize">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Onboarding progress summary</CardTitle>
          <CardDescription className="text-slate-300">
            Delivery timeline, current module, next scheduled send, and completion state.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Scheduled modules", value: String(moduleProgress.length) },
            { label: "Submitted modules", value: String(completedModules) },
            { label: "Completion", value: `${completionPercentage}%` },
            {
              label: "Current module",
              value: currentModule
                ? `M${currentModule.module.moduleNumber} ${currentModule.module.title}`
                : "Completed",
            },
            {
              label: "Next scheduled",
              value: nextScheduled
                ? formatDate(nextScheduled.delivery.scheduledFor)
                : "No pending send",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </CardContent>
        {member.role === "youth" ? (
          <CardContent className="pt-0">
            <form action={syncDeliveriesAction}>
              <HiddenInput name="program_member_id" value={member.id} />
              <Button type="submit" variant="secondary">
                Create missing deliveries
              </Button>
            </form>
          </CardContent>
        ) : null}
      </Card>

      {member.role === "mentor" ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Mentor onboarding</CardTitle>
            <CardDescription className="text-slate-300">
              Move mentors through executive review, agreement, orientation,
              assignment screening, and verified access.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Executive meeting done",
                milestone: "executive_meeting_completed",
                detail: "Moves the mentor to agreement signing.",
              },
              {
                label: "Agreement signed",
                milestone: "mentor_agreement_signed",
                detail: member.mentorAgreementSignedAt
                  ? `Signed ${formatDate(member.mentorAgreementSignedAt)}`
                  : "Records the digital agreement date.",
              },
              {
                label: "Orientation completed",
                milestone: "mentor_orientation_completed",
                detail: member.orientationCompletedAt
                  ? `Completed ${formatDate(member.orientationCompletedAt)}`
                  : "Unlocks matching readiness.",
              },
              {
                label: "Post-assignment screening",
                milestone: "post_assignment_screening",
                detail: "Marks mentor ready for final verification review.",
              },
            ].map((item) => (
              <form
                key={item.milestone}
                action={updateMentorMilestoneAction}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <HiddenInput name="program_member_id" value={member.id} />
                <HiddenInput name="milestone" value={item.milestone} />
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-2 min-h-10 text-xs leading-relaxed text-slate-400">
                  {item.detail}
                </p>
                <Button type="submit" size="sm" variant="secondary" className="mt-4">
                  Save milestone
                </Button>
              </form>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Onboarding modules</CardTitle>
          <CardDescription className="text-slate-300">
            Track dynamic module delivery, engagement, and assignment
            submissions for this member.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Module</TableHead>
                <TableHead className="text-slate-400">Delivery</TableHead>
                <TableHead className="text-slate-400">Engagement</TableHead>
                <TableHead className="min-w-[360px] text-slate-400">
                  Latest assignment
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleProgress.map((item) => {
                const latestSubmission = latestSubmissionByModule.get(item.module.id);
                const latestAnswers = latestSubmission
                  ? answersBySubmission.get(latestSubmission.id) ?? []
                  : [];

                return (
                  <TableRow key={item.delivery.id} className="border-white/10 align-top">
                    <TableCell>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                        Week {item.module.weekNumber} - Module {item.module.moduleNumber}
                      </p>
                      <p className="mt-2 font-medium">{item.module.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.module.subtitle || item.module.sendDayLabel}
                      </p>
                    </TableCell>
                    <TableCell className="space-y-2 text-sm text-slate-300">
                      <Badge variant="outline" className="border-white/15 text-cyan-200">
                        {item.delivery.status}
                      </Badge>
                      <p>Scheduled: {formatDate(item.delivery.scheduledFor)}</p>
                      <p>Sent: {formatDate(item.delivery.sentAt)}</p>
                      <p>Failed: {formatDate(item.delivery.failedAt)}</p>
                      <p>Email status: {latestEmailEventByDelivery.get(item.delivery.id)?.status || "-"}</p>
                    </TableCell>
                    <TableCell className="space-y-2 text-sm text-slate-300">
                      <p>Opened: {item.delivery.openedAt ? formatDate(item.delivery.openedAt) : "No"}</p>
                      <p>Clicked: {item.delivery.clickedAt ? formatDate(item.delivery.clickedAt) : "No"}</p>
                      <p>
                        Started:{" "}
                        {item.delivery.assignmentStartedAt
                          ? formatDate(item.delivery.assignmentStartedAt)
                          : "No"}
                      </p>
                      <p>
                        Submitted:{" "}
                        {item.delivery.assignmentSubmittedAt
                          ? formatDate(item.delivery.assignmentSubmittedAt)
                          : "No"}
                      </p>
                      <p>
                        Last email:{" "}
                        {formatAdminDate(
                          latestEmailEventByDelivery.get(item.delivery.id)?.sentAt ||
                            latestEmailEventByDelivery.get(item.delivery.id)?.createdAt,
                        )}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <form action={resendDeliveryAction}>
                            <HiddenInput name="delivery_id" value={item.delivery.id} />
                            <Button type="submit" size="sm" variant="secondary">
                              Resend
                            </Button>
                          </form>
                          <form action={retryDeliveryAction}>
                            <HiddenInput name="delivery_id" value={item.delivery.id} />
                            <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                              Retry
                            </Button>
                          </form>
                          <form action={cancelDeliveryAction}>
                            <HiddenInput name="delivery_id" value={item.delivery.id} />
                            <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                              Cancel
                            </Button>
                          </form>
                        </div>
                        <form action={rescheduleDeliveryAction} className="flex flex-wrap gap-2">
                          <HiddenInput name="delivery_id" value={item.delivery.id} />
                          <DateTimeInput
                            name="scheduled_for"
                            defaultValue={toDateTimeLocal(item.delivery.scheduledFor)}
                            className="h-8 rounded-md text-xs"
                          />
                          <Button type="submit" size="sm" variant="secondary">
                            Reschedule
                          </Button>
                        </form>
                        {latestSubmission ? (
                          <div className="space-y-3">
                          <p className="text-xs font-semibold text-[#00ff9d]">
                            Submitted {formatDate(latestSubmission.submittedAt)}
                          </p>
                          <div className="space-y-3">
                            {latestAnswers.map((answer) => (
                              <div
                                key={`${answer.submissionId}-${answer.questionNumber}`}
                                className="rounded-md border border-white/10 bg-[#080d2e] p-3"
                              >
                                <p className="text-xs font-semibold leading-5 text-slate-300">
                                  {answer.questionNumber}. {answer.prompt}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
                                  {answer.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">
                            No assignment submitted yet.
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!moduleProgress.length ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">
                    No onboarding modules have been scheduled for this member.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Monthly virtual sessions</CardTitle>
          <CardDescription className="text-slate-300">
            Track the 3 monthly mentor sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <form
              key={session.id}
              action={updateSessionAction}
              className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-[80px_1fr_1fr_1fr_auto]"
            >
              <HiddenInput name="session_id" value={session.id} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#00c9ff]">
                  Session
                </p>
                <p className="mt-1 font-semibold">{session.sessionNumber}</p>
              </div>
              <DateTimeInput
                name="scheduled_at"
                className="h-9 rounded-md"
              />
              <UrlInput
                name="meeting_url"
                defaultValue={session.meetingUrl ?? ""}
                className="h-9 rounded-md"
                placeholder="Meeting URL"
              />
              <Select
                name="status"
                defaultValue={session.status}
                triggerClassName="h-9 rounded-md"
                options={[
                  { value: "scheduled", label: "Scheduled" },
                  { value: "completed", label: "Completed" },
                  { value: "missed", label: "Missed" },
                  { value: "rescheduled", label: "Rescheduled" },
                ]}
              />
              <Button type="submit" size="sm" variant="secondary">
                Save
              </Button>
              <Textarea
                name="notes"
                defaultValue={session.notes ?? ""}
                className="min-h-20 rounded-md md:col-span-5"
                placeholder="Check-in, lesson discussion, project refinement, prayer, and next steps"
              />
            </form>
          ))}
          {!sessions.length ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
              No mentor sessions have been created yet. Assign a mentor from the
              applications page first.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Link
        href="/admin/join-applications"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "border-white/15 bg-transparent text-white hover:bg-white/10",
        )}
      >
        Back to join applications
      </Link>
    </div>
  );
}
