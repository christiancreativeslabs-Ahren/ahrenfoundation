import Link from "next/link";
import { notFound } from "next/navigation";
import { getMentorDashboardData } from "@/lib/mentorship";
import { formatAdminDate, getProgramMemberJourneyData } from "@/lib/admin/member-workflow";
import { MemberLoginLinkDialog } from "@/components/admin/member-login-link-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

function reviewStatus(payload: Record<string, unknown> | null | undefined) {
  if (!payload || typeof payload !== "object") return "needs review";
  return String(payload.mentorReviewStatus ?? "needs_review").replaceAll("_", " ");
}

export default async function AdminMentorDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const [journey, dashboard] = await Promise.all([
    getProgramMemberJourneyData(memberId),
    getMentorDashboardData(memberId),
  ]);

  if (!journey || journey.member.role !== "mentor" || !dashboard) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <Link href="/admin/mentors" className="text-sm font-medium text-[#00ff9d] hover:underline">
            Back to mentors
          </Link>
          <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
            {journey.member.fullName}
          </CardTitle>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <CardDescription className="text-slate-300">
              Mentor profile, assignment load, mentee submissions, and session activity.
            </CardDescription>
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
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["Email", journey.member.email],
            ["Status", journey.member.status.replaceAll("_", " ")],
            ["Current step", journey.member.currentStep.replaceAll("_", " ")],
            ["Mentees", String(dashboard.totalAssignments)],
            ["Submissions", String(dashboard.totalSubmissions)],
            ["Sessions", `${dashboard.completedSessions}/${dashboard.totalSessions}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">{label}</p>
              <p className="mt-2 text-sm leading-6 text-white">{value || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Assigned mentees</CardTitle>
          <CardDescription className="text-slate-300">
            Active mentee assignments and latest Workbook review context.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Mentee</TableHead>
                <TableHead className="text-slate-400">Assignment</TableHead>
                <TableHead className="text-slate-400">Latest Workbook</TableHead>
                <TableHead className="text-slate-400">Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.assignments.map((row) => (
                <TableRow key={row.assignment.id} className="border-white/10 align-top">
                  <TableCell>
                    <Link href={`/admin/mentees/${row.mentee.id}`} className="font-semibold text-white hover:text-[#00ff9d]">
                      {row.mentee.fullName}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">{row.mentee.email}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    <p>Assigned: {formatAdminDate(row.assignment.assignedAt)}</p>
                    <p>Status: {row.assignment.status.replaceAll("_", " ")}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    {row.latestSubmission ? (
                      <>
                        <Link href={`/admin/workbook/submissions/${row.latestSubmission.submission.id}`} className="font-semibold text-white hover:text-[#00ff9d]">
                          Module {row.latestSubmission.module.moduleNumber}: {row.latestSubmission.module.title}
                        </Link>
                        <p className="mt-1">Submitted: {formatAdminDate(row.latestSubmission.submission.submittedAt)}</p>
                        <p className="mt-1">Review: {reviewStatus(row.latestSubmission.submission.payload)}</p>
                      </>
                    ) : (
                      "No Workbook submission yet."
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-300">
                    <p>{row.sessionCount} session{row.sessionCount === 1 ? "" : "s"}</p>
                    <p>{row.sessions.filter((session) => session.status === "completed").length} completed</p>
                  </TableCell>
                </TableRow>
              ))}
              {!dashboard.assignments.length ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-slate-400">
                    No mentees are assigned to this mentor yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Mentor sessions</CardTitle>
          <CardDescription className="text-slate-300">
            Sessions attached to this mentor's active assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {dashboard.assignments.flatMap((assignment) =>
            assignment.sessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">
                  Session {session.sessionNumber} - {assignment.mentee.fullName}
                </p>
                <p className="mt-2">Status: {session.status.replaceAll("_", " ")}</p>
                <p>Scheduled: {formatAdminDate(session.scheduledAt)}</p>
                <p>Completed: {formatAdminDate(session.completedAt)}</p>
                {session.meetingUrl ? (
                  <Link href={session.meetingUrl} className="mt-2 inline-flex text-[#00c9ff] hover:text-[#00ff9d]">
                    Meeting link
                  </Link>
                ) : null}
              </div>
            )),
          )}
          {!dashboard.totalSessions ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
              No sessions have been created for this mentor yet.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
