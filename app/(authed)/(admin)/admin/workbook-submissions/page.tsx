import Link from "next/link";
import { getWorkbookSubmissionReviewData } from "@/lib/workbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminWorkbookSubmissionsPage() {
  const rows = await getWorkbookSubmissionReviewData();
  const typedRows = rows as Array<{
    submission: {
      id: string;
      status: string;
      submittedAt: Date;
    };
    member: {
      id: string;
      fullName: string;
      email: string;
    };
    module: {
      id: string;
      workbookProgramId: string;
      moduleNumber: number;
      title: string;
    };
    answers: Array<{
      answer: {
        id: string;
        answer: string;
      };
      question: {
        questionNumber: number;
        prompt: string;
      };
    }>;
  }>;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Workbook submissions
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Review workbook answers submitted by mentees. This gives admins a module-by-module view of the learning activity.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {typedRows.map(({ submission, member, module, answers }) => (
          <Card key={submission.id} className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <Link
                    href={`/admin/program-members/${member.id}`}
                    className="text-lg font-semibold text-white hover:text-[#00ff9d]"
                  >
                    {member.fullName}
                  </Link>
                  <CardDescription className="mt-2 text-slate-300">
                    {member.email} - Module {module.moduleNumber}: {module.title}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {submission.status}
                  </Badge>
                  <Badge variant="outline" className="border-white/15 text-white">
                    {answers.length} answers
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                <span>Submitted: {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(submission.submittedAt)}</span>
                <span>Program: {module.workbookProgramId}</span>
                <span>Submission id: {submission.id}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {answers.map(({ answer, question }) => (
                  <div
                    key={answer.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-200">
                      {question.questionNumber}. {question.prompt}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white">
                      {answer.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {!rows.length ? (
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardContent className="p-6 text-sm text-slate-300">
              No workbook submissions have been recorded yet.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
