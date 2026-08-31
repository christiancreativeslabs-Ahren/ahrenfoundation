import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatAdminDate,
  getProgramMemberJourneyData,
} from "@/lib/admin/member-workflow";
import { getMentorAssignmentCandidates } from "@/lib/admin/mentor-assignments";
import { Badge } from "@/components/ui/badge";
import { MemberLoginLinkDialog } from "@/components/admin/member-login-link-dialog";
import { MentorAssignmentDialog } from "@/components/admin/mentor-assignment-dialog";
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

export const dynamic = "force-dynamic";

export default async function AdminMenteeDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const [journey, mentors] = await Promise.all([
    getProgramMemberJourneyData(memberId),
    getMentorAssignmentCandidates(),
  ]);

  if (!journey || journey.member.role !== "youth") {
    notFound();
  }

  const activeAssignment = journey.assignments.find(
    (assignment) => assignment.status === "active",
  );

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <Link
            href="/admin/mentees"
            className="text-sm font-medium text-[#00ff9d] hover:underline"
          >
            Back to mentees
          </Link>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {journey.member.fullName}
              </CardTitle>
              <CardDescription className="mt-2 text-slate-300">
                Mentee profile, mentor assignment, Workbook journey, and submission history.
              </CardDescription>
            </div>
            <MentorAssignmentDialog
              memberId={journey.member.id}
              applicantName={journey.member.fullName}
              applicantEmail={journey.member.email}
              triggerLabel="Assign mentor"
              mentors={mentors}
            />
            <MemberLoginLinkDialog
              member={{
                id: journey.member.id,
                fullName: journey.member.fullName,
                email: journey.member.email,
                role: journey.member.role,
                status: journey.member.status,
                currentStep: journey.member.currentStep,
                userId: journey.member.userId,
                verifiedAt: journey.member.verifiedAt?.toISOString() ?? null,
                loginCredentialsSentAt:
                  journey.member.loginCredentialsSentAt?.toISOString() ?? null,
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Email", journey.member.email],
            ["Status", journey.member.status.replaceAll("_", " ")],
            ["Current step", journey.member.currentStep.replaceAll("_", " ")],
            [
              "Completion",
              `${journey.completionPercentage}% (${journey.completedModules}/${journey.moduleProgress.length})`,
            ],
            ["Active mentor", activeAssignment?.mentorMemberId ? "Assigned" : "Unassigned"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-white">{value || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Workbook journey</CardTitle>
          <CardDescription className="text-slate-300">
            Deliveries, engagement, and latest assignment answers for this mentee.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Module</TableHead>
                <TableHead className="text-slate-400">Delivery</TableHead>
                <TableHead className="text-slate-400">Engagement</TableHead>
                <TableHead className="text-slate-400">Latest assignment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journey.moduleProgress.map((item) => {
                const latestSubmission = journey.latestSubmissionByModule.get(item.module.id);
                const latestAnswers = latestSubmission
                  ? journey.answersBySubmission.get(latestSubmission.id) ?? []
                  : [];

                return (
                  <TableRow key={item.delivery.id} className="border-white/10 align-top">
                    <TableCell className="whitespace-normal">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                        Week {item.module.weekNumber} - Module {item.module.moduleNumber}
                      </p>
                      <p className="mt-2 font-medium text-white">{item.module.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.module.subtitle || item.module.sendDayLabel}
                      </p>
                    </TableCell>
                    <TableCell className="space-y-2 whitespace-normal text-sm text-slate-300">
                      <Badge variant="outline" className="border-white/15 text-cyan-200">
                        {item.delivery.status}
                      </Badge>
                      <p>Scheduled: {formatAdminDate(item.delivery.scheduledFor)}</p>
                      <p>Sent: {formatAdminDate(item.delivery.sentAt)}</p>
                      <p>Failed: {formatAdminDate(item.delivery.failedAt)}</p>
                      <p>
                        Email status:{" "}
                        {journey.latestEmailEventByDelivery.get(item.delivery.id)?.status || "-"}
                      </p>
                    </TableCell>
                    <TableCell className="space-y-2 whitespace-normal text-sm text-slate-300">
                      <p>Opened: {formatAdminDate(item.delivery.openedAt)}</p>
                      <p>Clicked: {formatAdminDate(item.delivery.clickedAt)}</p>
                      <p>Started: {formatAdminDate(item.delivery.assignmentStartedAt)}</p>
                      <p>Submitted: {formatAdminDate(item.delivery.assignmentSubmittedAt)}</p>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {latestSubmission ? (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-[#00ff9d]">
                            Submitted {formatAdminDate(latestSubmission.submittedAt)}
                          </p>
                          {latestAnswers.map((answer) => (
                            <div key={`${answer.submissionId}-${answer.questionNumber}`} className="rounded-md border border-white/10 bg-[#080d2e] p-3">
                              <p className="text-xs font-semibold leading-5 text-slate-300">
                                {answer.questionNumber}. {answer.prompt}
                              </p>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
                                {answer.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No assignment submitted yet.</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!journey.moduleProgress.length ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">
                    No Workbook modules have been scheduled for this mentee.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
