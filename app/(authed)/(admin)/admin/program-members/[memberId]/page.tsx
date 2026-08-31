import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import {
  formatAdminDate,
  getProgramMemberJourneyData,
} from "@/lib/admin/member-workflow";
import { Badge } from "@/components/ui/badge";
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

export default async function ProgramMemberRedirectPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const [member] = await db
    .select({
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (!member) {
    notFound();
  }

  if (member.joinApplicationId) {
    redirect(`/admin/join-applications/${member.joinApplicationId}`);
  }

  const journey = await getProgramMemberJourneyData(memberId);
  if (!journey) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <Link
            href="/admin/join-applications"
            className="text-sm font-medium text-[#00ff9d] hover:underline"
          >
            Back to join applications
          </Link>
          <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
            {journey.member.fullName}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Program member record without a linked join application.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Email", journey.member.email],
            ["Role", journey.member.role],
            ["Status", journey.member.status?.replaceAll("_", " ")],
            [
              "Completion",
              `${journey.completionPercentage}% (${journey.completedModules}/${journey.moduleProgress.length})`,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {label}
              </p>
              <p className="mt-2 text-sm leading-6 text-white">
                {value || "-"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Workbook journey</CardTitle>
          <CardDescription className="text-slate-300">
            Deliveries, engagement, and latest assignment answers for this member.
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
                const latestSubmission = journey.latestSubmissionByModule.get(
                  item.module.id,
                );
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
                      ) : (
                        <p className="text-sm text-slate-400">
                          No assignment submitted yet.
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!journey.moduleProgress.length ? (
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
    </div>
  );
}
