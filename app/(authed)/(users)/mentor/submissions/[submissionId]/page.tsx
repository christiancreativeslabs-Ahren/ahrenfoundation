import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorSubmissionDetailData } from "@/lib/mentorship";
import { MentorReviewForm } from "@/components/mentor/mentor-review-form";
import { MentorWorkspaceNav } from "@/components/mentor/mentor-workspace-nav";
import SignOutButton from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

function dateLabel(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function MentorSubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) redirect("/mentor/login");

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== "mentor") redirect("/mentor/login");

  const data = await getMentorSubmissionDetailData(member.id, submissionId);
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/mentor/submissions" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c9ff]">
              <ArrowLeft size={14} />
              Back to review queue
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-normal">
              Module {data.module.moduleNumber} Review
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              {data.mentee.fullName} submitted this Workbook assignment on {dateLabel(data.submission.submittedAt)}.
            </p>
          </div>
          <SignOutButton />
        </header>

        <MentorWorkspaceNav />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Workbook submission
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">{data.module.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{data.mentee.email}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                  {data.reviewStatus === "reviewed" ? <CheckCircle2 size={13} /> : null}
                  {statusLabel(data.reviewStatus)}
                </span>
              </div>
            </article>

            {data.answers.map(({ answer, question }) => (
              <article key={answer.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Question {question.questionNumber}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-7">{question.prompt}</h3>
                <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-7 text-slate-200">
                  {answer.answer}
                </p>
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Review
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>Status: <span className="text-white">{statusLabel(data.reviewStatus)}</span></p>
                <p>Reviewed: <span className="text-white">{dateLabel(data.reviewedAt)}</span></p>
                <p>Delivery: <span className="text-white">{data.delivery.status}</span></p>
              </div>
              <div className="mt-5">
                <MentorReviewForm
                  submissionId={data.submission.id}
                  defaultFeedback={data.feedback}
                  defaultStatus={data.reviewStatus}
                />
              </div>
            </div>

            <Link
              href={`/mentor/mentees/${data.mentee.id}`}
              className="flex items-center justify-center rounded-2xl border border-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              View full mentee journey
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
