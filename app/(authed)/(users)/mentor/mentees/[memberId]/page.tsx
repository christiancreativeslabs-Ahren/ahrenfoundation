import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorMenteeDetailData } from "@/lib/mentorship";
import { MentorReviewForm } from "@/components/mentor/mentor-review-form";
import { MentorSessionForm } from "@/components/mentor/mentor-session-form";
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

function payloadText(payload: Record<string, unknown> | null | undefined, key: string) {
  if (!payload || typeof payload !== "object") return "";
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function MentorMenteeDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/mentor/login");
  }

  const [mentor] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!mentor || mentor.role !== "mentor") {
    redirect("/mentor/login");
  }

  const data = await getMentorMenteeDetailData(mentor.id, memberId);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/mentor/mentees"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c9ff]"
            >
              <ArrowLeft size={14} />
              Back to mentees
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              {data.mentee.fullName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Review this mentee's Workbook progress, submission answers, feedback, and mentorship sessions.
            </p>
          </div>
          <SignOutButton />
        </header>

        <MentorWorkspaceNav />

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Email", value: data.mentee.email },
            { label: "Status", value: data.mentee.status.replaceAll("_", " ") },
            { label: "Completed", value: `${data.workbook.completedModuleIds.size}/${data.workbook.modules.length}` },
            { label: "Sessions", value: String(data.sessions.length) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Assignment
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p>Assigned on: <span className="text-white">{dateLabel(data.assignment.assignedAt)}</span></p>
                <p>Notes: <span className="text-white">{data.assignment.notes ?? "None"}</span></p>
                <p>Current step: <span className="text-white">{data.mentee.currentStep.replaceAll("_", " ")}</span></p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Sessions
                  </p>
                  <h2 className="mt-2 text-xl font-bold">Mentorship sessions</h2>
                </div>
                <Link href="/mentor/sessions" className="text-sm font-semibold text-[#00ff9d]">
                  All sessions
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                {data.sessions.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">Session {item.sessionNumber}</p>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                        {item.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">Scheduled: {dateLabel(item.scheduledAt)}</p>
                    <div className="mt-4">
                      <MentorSessionForm session={item} />
                    </div>
                  </div>
                ))}
                {!data.sessions.length ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    No mentorship sessions have been scheduled yet.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Workbook journey
            </p>
            <h2 className="mt-2 text-2xl font-bold">Module-by-module progress</h2>

            <div className="mt-5 space-y-4">
              {data.moduleJourney.map((item) => {
                const submission = item.submission;
                const answers = submission
                  ? data.answersBySubmission.get(submission.submission.id) ?? []
                  : [];
                const feedback = payloadText(submission?.submission.payload, "mentorFeedback");

                return (
                  <article key={item.module.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                          Module {item.module.moduleNumber}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-white">{item.module.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          Opens {dateLabel(item.delivery?.scheduledFor)} - {item.delivery?.status ?? "not synced"}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                        {submission ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                        {submission ? item.reviewStatus.replaceAll("_", " ") : "Not submitted"}
                      </span>
                    </div>

                    {submission ? (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-slate-300">
                          Submitted {dateLabel(submission.submission.submittedAt)}
                        </p>
                        {answers.slice(0, 2).map((row) => (
                          <div key={row.answer.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-xs font-semibold text-slate-300">
                              {row.question.questionNumber}. {row.question.prompt}
                            </p>
                            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-white">
                              {row.answer.answer}
                            </p>
                          </div>
                        ))}
                        {feedback ? (
                          <p className="rounded-xl border border-[#00ff9d]/20 bg-[#00ff9d]/10 p-3 text-sm leading-6 text-slate-100">
                            {feedback}
                          </p>
                        ) : null}
                        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                          <Link
                            href={`/mentor/submissions/${submission.submission.id}`}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[#080d2e] hover:bg-slate-100"
                          >
                            Open full review
                            <ArrowRight size={14} />
                          </Link>
                          <MentorReviewForm
                            submissionId={submission.submission.id}
                            defaultFeedback={feedback}
                            defaultStatus={item.reviewStatus}
                          />
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
