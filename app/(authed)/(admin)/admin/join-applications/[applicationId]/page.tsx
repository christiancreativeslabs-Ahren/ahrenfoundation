import Link from "next/link";
import {
  cancelModuleDeliveryAction,
  issueCompletionCertificate,
  resendModuleDelivery,
  rescheduleModuleDeliveryAction,
  retryFailedModuleDelivery,
  grantVerifiedStatus,
  syncMemberWorkbookDeliveriesAction,
  updateMentorWorkflowMilestone,
  updateMentorshipSession,
  updateJoinApplicationStatus,
} from "@/actions/admin";
import {
  formatAdminDate,
  getFaithPayload,
  getJoinApplicationDetail,
  getProgramMemberJourneyData,
  getString,
  getStringArray,
} from "@/lib/admin/member-workflow";
import { getMentorAssignmentCandidates } from "@/lib/admin/mentor-assignments";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HiddenInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DateTimeInput,
  Select,
  Textarea,
  UrlInput,
} from "@/components/ui/input-fields";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResendWorkbookEmailDialog } from "@/components/admin/resend-workbook-email-dialog";
import { MentorAssignmentDialog } from "@/components/admin/mentor-assignment-dialog";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function reviewApplicationAction(formData: FormData) {
  "use server";
  await updateJoinApplicationStatus(initialActionState, formData);
}

async function syncDeliveriesAction(formData: FormData) {
  "use server";
  await syncMemberWorkbookDeliveriesAction(initialActionState, formData);
}

async function verifyMemberAction(formData: FormData) {
  "use server";
  await grantVerifiedStatus(initialActionState, formData);
}

async function issueCertificateAction(formData: FormData) {
  "use server";
  await issueCompletionCertificate(initialActionState, formData);
}

async function updateSessionAction(formData: FormData) {
  "use server";
  await updateMentorshipSession(initialActionState, formData);
}

async function updateMentorMilestoneAction(formData: FormData) {
  "use server";
  await updateMentorWorkflowMilestone(formData);
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

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
        {value || "-"}
      </p>
    </div>
  );
}
function DetailList({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.length ? (
          values.map((value) => (
            <Badge key={value} variant="outline" className="border-white/15 text-white">
              {value}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </div>
    </div>
  );
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

export default async function JoinApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const detail = await getJoinApplicationDetail(applicationId);

  if (!detail) {
    return (
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Applicant not found</CardTitle>
          <CardDescription className="text-slate-300">
            This application may have been removed or the link is invalid.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const payload = (detail.application.payload ?? {}) as Record<string, unknown>;
  const faith = getFaithPayload(payload);
  const isYouth = detail.application.applicationType === "youth";
  const member = detail.member;
  const memberJourney = detail.member
    ? await getProgramMemberJourneyData(detail.member.id)
    : null;
  const mentors = detail.member ? await getMentorAssignmentCandidates() : [];
  const moduleDeliveries = memberJourney
    ? memberJourney.moduleProgress.map((item) => ({
        deliveryId: item.delivery.id,
        label: `Week ${item.module.weekNumber} - Module ${item.module.moduleNumber}: ${item.module.title}`,
        status: item.delivery.status,
        scheduledFor: formatDate(item.delivery.scheduledFor),
        sentAt: item.delivery.sentAt ? formatDate(item.delivery.sentAt) : null,
        failedAt: item.delivery.failedAt ? formatDate(item.delivery.failedAt) : null,
      }))
    : [];

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                href="/admin/join-applications"
                className="text-sm font-medium text-[#00ff9d] hover:underline"
              >
                Back to join applications
              </Link>
              <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
                {detail.application.fullName}
              </CardTitle>
              <CardDescription className="mt-2 text-slate-300">
                {detail.application.applicationType === "youth"
                  ? "Prospective mentee"
                  : "Mentor applicant"}{" "}
                review and member handoff.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="approved" />
                <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                  Approve
                </Button>
              </form>
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="reviewing" />
                <Button type="submit" variant="secondary">
                  Mark reviewing
                </Button>
              </form>
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="rejected" />
                <Button type="submit" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  Reject
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <DetailItem label="Application status" value={detail.application.status} />
          <DetailItem label="Applicant type" value={detail.application.applicationType} />
          <DetailItem
            label="Current step"
            value={detail.member?.currentStep?.replaceAll("_", " ") ?? "Application review"}
          />
          <DetailItem
            label="Member decision"
            value={detail.member?.status?.replaceAll("_", " ") ?? "No member record yet"}
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Application record</CardTitle>
          <CardDescription className="text-slate-300">
            Full review context for this applicant before active mentee flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Full name" value={detail.application.fullName} />
          <DetailItem label="Email address" value={detail.application.email} />
          <DetailItem label="Phone number" value={detail.application.phoneNumber} />
          <DetailItem label="Location" value={detail.application.location} />
          <DetailItem
            label="Consent"
            value={detail.application.consent ? "Yes" : "No"}
          />
          <DetailItem
            label="Created"
            value={formatAdminDate(detail.application.createdAt)}
          />
          <DetailItem
            label="Updated"
            value={formatAdminDate(detail.application.updatedAt)}
          />
          <DetailItem
            label="Linked user"
            value={detail.linkedUser?.email ?? "No linked user record"}
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">
            {isYouth ? "Prospective mentee profile" : "Mentor application profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isYouth ? (
            <>
              <DetailItem label="Age range" value={getString(payload.ageRange)} />
              <DetailItem label="Sex" value={getString(payload.sex)} />
              <DetailList label="Current skills and interests" values={getStringArray(payload.skills)} />
              <DetailItem label="Other skill" value={getString(payload.skillsOther)} />
              <DetailItem label="Skills to learn" value={getString(payload.skillsToLearn)} />
              <DetailList label="Availability" values={getStringArray(payload.availability)} />
              <DetailItem label="Why they want to join" value={getString(payload.whyJoin)} />
            </>
          ) : (
            <>
              <DetailItem label="Profession or industry" value={getString(payload.profession)} />
              <DetailItem label="Years of experience" value={getString(payload.yearsExperience)} />
              <DetailList label="Areas of expertise" values={getStringArray(payload.expertise)} />
              <DetailItem label="Other expertise" value={getString(payload.otherExpertise)} />
              <DetailItem label="Why they want to mentor" value={getString(payload.mentorshipReason)} />
              <DetailItem label="Commitment level" value={getString(payload.commitment)} />
              <DetailItem label="Preferred mentorship format" value={getString(payload.preferredFormat)} />
            </>
          )}

          {isYouth ? (
            <>
              <DetailItem label="Born again response" value={faith.bornAgain} />
              <DetailItem label="Holy Spirit response" value={faith.holySpirit} />
              <DetailItem label="Testimony" value={getString(payload.testimony)} />
            </>
          ) : (
            <>
              <DetailItem label="Born again response" value={faith.bornAgain} />
              <DetailItem label="Holy Spirit response" value={faith.holySpirit} />
              <DetailItem label="Dependence on the Holy Spirit" value={faith.dependency} />
              <DetailItem label="Testimony" value={getString(payload.testimony)} />
              <DetailItem label="Church or ministry" value={getString(payload.church)} />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Operational workflow</CardTitle>
          <CardDescription className="text-slate-300">
            Bridge application review into Workbook and member operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem
              label="Program member"
              value={detail.member ? detail.member.id : "Not created"}
            />
            <DetailItem
              label="Program enrollments"
              value={detail.enrollments.length ? String(detail.enrollments.length) : "None"}
            />
            <DetailItem
              label="Welcome emails"
              value={
                detail.welcomeEmails.length
                  ? `${detail.welcomeEmails.length} logged`
                  : "No email events yet"
              }
            />
            <DetailItem
              label="Latest welcome email"
              value={formatAdminDate(detail.welcomeEmails[0]?.createdAt)}
            />
          </div>

          {detail.member ? (
            <>
              <Separator className="bg-white/10" />
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#member-journey"
                  className={cn(
                    buttonVariants(),
                    "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                  )}
                >
                  Jump to member journey
                </Link>
                {detail.member.role === "youth" ? (
                  <form action={syncDeliveriesAction}>
                    <HiddenInput
                      name="program_member_id"
                      value={detail.member.id}
                    />
                    <Button type="submit" variant="secondary">
                      Sync deliveries
                    </Button>
                  </form>
                ) : null}
                <form action={issueCertificateAction}>
                  <HiddenInput
                    name="program_member_id"
                    value={detail.member.id}
                  />
                  <Button type="submit" variant="secondary">
                    Issue certificate
                  </Button>
                </form>
                <ResendWorkbookEmailDialog
                  deliveries={moduleDeliveries}
                  resendAction={resendDeliveryAction}
                  disabled={!moduleDeliveries.length}
                />
                <form action={verifyMemberAction}>
                  <HiddenInput
                    name="program_member_id"
                    value={detail.member.id}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    Send login link
                  </Button>
                </form>
                {detail.member.role === "youth" ? (
                  <MentorAssignmentDialog
                    memberId={detail.member.id}
                    applicantName={detail.member.fullName}
                    applicantEmail={detail.member.email}
                    triggerLabel="Assign mentor"
                    mentors={mentors}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              This applicant has not yet been converted into an active program
              member, so the next action is application review and approval.
            </div>
          )}
        </CardContent>
      </Card>

      {memberJourney && member ? (
        <Card
          id="member-journey"
          className="border-white/10 bg-white/[0.03] text-white"
        >
          <CardHeader>
            <CardTitle className="text-lg">Member journey</CardTitle>
            <CardDescription className="text-slate-300">
              Active Workbook progress, deliveries, submissions, and follow-up actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <DetailItem label="Role" value={member.role} />
            <DetailItem label="Status" value={member.status?.replaceAll("_", " ")} />
            <DetailItem label="Verified" value={member.verifiedAt ? formatDate(member.verifiedAt) : "No"} />
            <DetailItem
              label="Certificate"
              value={member.certificateIssuedAt ? formatDate(member.certificateIssuedAt) : "Not issued"}
            />
            <DetailItem
              label="Completion"
              value={`${memberJourney.completionPercentage}% (${memberJourney.completedModules}/${memberJourney.moduleProgress.length})`}
            />
            <DetailItem
              label="Current module"
              value={
                memberJourney.currentModule
                  ? `M${memberJourney.currentModule.module.moduleNumber} ${memberJourney.currentModule.module.title}`
                  : "Completed"
              }
            />
            <DetailItem
              label="Next scheduled"
              value={memberJourney.nextScheduled ? formatDate(memberJourney.nextScheduled.delivery.scheduledFor) : "No pending send"}
            />
            <DetailItem
              label="Enrollments"
              value={detail.enrollments.length ? String(detail.enrollments.length) : "None"}
            />
            <DetailItem
              label="Welcome emails"
              value={detail.welcomeEmails.length ? `${detail.welcomeEmails.length} logged` : "No email events yet"}
            />
            <DetailItem
              label="Latest welcome email"
              value={formatAdminDate(detail.welcomeEmails[0]?.createdAt)}
            />
          </CardContent>

          {member.role === "mentor" ? (
            <>
              <CardContent className="pt-0">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                </div>
              </CardContent>
            </>
          ) : null}

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-400">Module</TableHead>
                  <TableHead className="text-slate-400">Delivery</TableHead>
                  <TableHead className="text-slate-400">Engagement</TableHead>
                  <TableHead className="min-w-[360px] text-slate-400">Latest assignment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberJourney.moduleProgress.map((item) => {
                  const latestSubmission = memberJourney.latestSubmissionByModule.get(item.module.id);
                  const latestAnswers = latestSubmission
                    ? memberJourney.answersBySubmission.get(latestSubmission.id) ?? []
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
                        <p>Email status: {memberJourney.latestEmailEventByDelivery.get(item.delivery.id)?.status || "-"}</p>
                      </TableCell>
                      <TableCell className="space-y-2 text-sm text-slate-300">
                        <p>Opened: {item.delivery.openedAt ? formatDate(item.delivery.openedAt) : "No"}</p>
                        <p>Clicked: {item.delivery.clickedAt ? formatDate(item.delivery.clickedAt) : "No"}</p>
                        <p>Started: {item.delivery.assignmentStartedAt ? formatDate(item.delivery.assignmentStartedAt) : "No"}</p>
                        <p>Submitted: {item.delivery.assignmentSubmittedAt ? formatDate(item.delivery.assignmentSubmittedAt) : "No"}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
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
                            <p className="text-sm text-slate-400">No assignment submitted yet.</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!memberJourney.moduleProgress.length ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">
                      No Workbook modules have been scheduled for this member.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {memberJourney && member && member.role === "mentor" ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Monthly virtual sessions</CardTitle>
            <CardDescription className="text-slate-300">
              Track the 3 monthly mentor sessions without leaving this applicant record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {memberJourney.sessions.map((session) => (
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
                <DateTimeInput name="scheduled_at" className="h-9 rounded-md" />
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
                  placeholder="Check-in, Workbook discussion, project refinement, prayer, and next steps"
                />
              </form>
            ))}
            {!memberJourney.sessions.length ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                No mentor sessions have been created yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Email history</CardTitle>
          <CardDescription className="text-slate-300">
            Welcome and application-related email activity tied to this applicant email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.welcomeEmails.length ? (
            detail.welcomeEmails.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {event.templateKey}
                  </Badge>
                  <Badge variant="outline" className="border-white/15 text-white">
                    {event.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Sent: {formatAdminDate(event.sentAt || event.createdAt)}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Provider: {event.providerId || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Error: {event.error || "-"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No email events logged for this applicant yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
