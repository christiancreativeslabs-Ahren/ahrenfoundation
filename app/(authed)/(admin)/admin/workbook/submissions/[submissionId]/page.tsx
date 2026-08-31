import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getWorkbookSubmissionById } from "@/lib/workbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminWorkbookSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const data = await getWorkbookSubmissionById(submissionId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/workbook/submissions"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
      >
        <ArrowLeft size={14} />
        Back to submissions
      </Link>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook submission
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {data.member.fullName} - Module {data.module.moduleNumber}
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Full answer record for this Workbook submission.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Submission info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <p>Member: {data.member.fullName}</p>
            <p>Email: {data.member.email}</p>
            <p>Program: {data.program.name}</p>
            <p>Module: {data.module.title}</p>
            <p>Status: {data.submission.status}</p>
            <p>
              Submitted:{" "}
              {new Intl.DateTimeFormat("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(data.submission.submittedAt)}
            </p>
            <p>Submission id: {data.submission.id}</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.answers.map(({ answer, question }) => (
              <div key={answer.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">
                    {question.questionNumber}. {question.prompt}
                  </p>
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {question.responseType}
                  </Badge>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white">
                  {answer.answer}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
