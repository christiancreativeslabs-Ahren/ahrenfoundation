import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorMenteeDetailData } from "@/lib/mentorship";
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
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/mentor/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c9ff]"
            >
              <ArrowLeft size={14} />
              Back to mentor dashboard
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              {data.mentee.fullName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              This page shows the mentee assigned to you, along with their workbook progress and current assignment context.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Email", value: data.mentee.email },
            { label: "Status", value: data.mentee.status.replaceAll("_", " ") },
            { label: "Current step", value: data.mentee.currentStep.replaceAll("_", " ") },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Assignment
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>
                Assigned on: <span className="text-white">{dateLabel(data.assignment.assignedAt)}</span>
              </p>
              <p>
                Notes: <span className="text-white">{data.assignment.notes ?? "None"}</span>
              </p>
              <p>
                Mentor: <span className="text-white">{data.mentor.fullName}</span>
              </p>
              <p>
                Mentor email: <span className="text-white">{data.mentor.email}</span>
              </p>
              <p>
                Sessions scheduled: <span className="text-white">{data.sessions.length}</span>
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {data.sessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
                    Session {session.sessionNumber}
                  </p>
                  <p className="mt-2">
                    Status: <span className="text-white">{session.status.replaceAll("_", " ")}</span>
                  </p>
                  <p>
                    Scheduled: <span className="text-white">{dateLabel(session.scheduledAt)}</span>
                  </p>
                </div>
              ))}
              {!data.sessions.length ? (
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                  No mentorship sessions have been scheduled yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Workbook progress
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Modules: <span className="text-white">{data.workbook.modules.length}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Completed: <span className="text-white">{data.workbook.completedModuleIds.size}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Latest submission: <span className="text-white">{data.latestSubmission ? dateLabel(data.latestSubmission.submission.submittedAt) : "-"}</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {data.latestSubmission ? (
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
                    Latest module
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Module {data.latestSubmission.module.moduleNumber}: {data.latestSubmission.module.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted {dateLabel(data.latestSubmission.submission.submittedAt)}
                  </p>
                </div>
              ) : null}

              <div className="space-y-3">
                {data.answers.map((row) => (
                  <div key={row.answer.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                      Question {row.question.questionNumber}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{row.question.prompt}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {row.answer.answer}
                    </p>
                  </div>
                ))}
                {!data.answers.length && data.latestSubmission ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    This submission does not have saved answers yet.
                  </div>
                ) : null}
                {!data.latestSubmission ? (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    No workbook submissions have been made by this mentee yet.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
