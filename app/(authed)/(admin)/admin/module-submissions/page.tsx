import Link from "next/link";
import { markSubmissionReviewed } from "@/actions/admin";
import {
  formatAdminDate,
  getModuleSubmissionReviewData,
} from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HiddenInput } from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function reviewSubmissionAction(formData: FormData) {
  "use server";
  await markSubmissionReviewed(initialActionState, formData);
}

export default async function AdminModuleSubmissionsPage() {
  const rows = await getModuleSubmissionReviewData();

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Module submissions
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Review submitted answers, completion state, and delivery context for each onboarding module.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {rows.map(({ submission, member, module, delivery, answers }) => (
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
                <span>Submitted: {formatAdminDate(submission.submittedAt)}</span>
                <span>Delivery status: {delivery.status}</span>
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

              <div className="flex flex-wrap gap-2">
                <form action={reviewSubmissionAction}>
                  <HiddenInput name="submission_id" value={submission.id} />
                  <HiddenInput name="status" value="reviewed" />
                  <Button type="submit" size="sm" variant="secondary">
                    Mark reviewed
                  </Button>
                </form>
                <form action={reviewSubmissionAction}>
                  <HiddenInput name="submission_id" value={submission.id} />
                  <HiddenInput name="status" value="follow_up_required" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    Mark follow-up
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
