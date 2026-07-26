import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { submitModuleAssignment } from "@/actions/onboarding";
import { db } from "@/db";
import { moduleDeliveries } from "@/db/schema";
import { moduleDefinitionFromPayload } from "@/lib/onboarding/email-shared";
import {
  getDeliveryByToken,
  getQuestionsForModule,
  getSubmissionsForDelivery,
  recordEngagementEvent,
} from "@/lib/onboarding/service";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Alert({
  type,
  children,
}: {
  type: "success" | "error";
  children: ReactNode;
}) {
  const styles =
    type === "success"
      ? "border-[#00ff9d]/25 bg-[#00ff9d]/10 text-[#d9fff0]"
      : "border-rose-300/25 bg-rose-500/10 text-rose-100";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles}`}>
      {children}
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm ${className}`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#00c9ff]">
        {eyebrow}
      </p>
      {title ? (
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
      ) : null}
      <div className={title ? "mt-5" : "mt-4"}>{children}</div>
    </section>
  );
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ deliveryId: string }>;
  searchParams: Promise<{ token?: string; submitted?: string; error?: string }>;
}) {
  const { deliveryId } = await params;
  const query = await searchParams;
  const token = query.token ?? "";

  if (!token) {
    notFound();
  }

  const row = await getDeliveryByToken(deliveryId, token);

  if (!row) {
    notFound();
  }

  const now = new Date();
  await db
    .update(moduleDeliveries)
    .set({
      assignmentStartedAt: row.delivery.assignmentStartedAt ?? now,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, row.delivery.id));

  await recordEngagementEvent({
    eventType: "lesson_viewed",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId: row.delivery.id,
    metadata: {
      moduleNumber: row.module.moduleNumber,
    },
  });

  if (!row.delivery.assignmentStartedAt) {
    await recordEngagementEvent({
      eventType: "assignment_started",
      programMemberId: row.member.id,
      enrollmentId: row.enrollment.id,
      moduleId: row.module.id,
      deliveryId: row.delivery.id,
      metadata: {
        moduleNumber: row.module.moduleNumber,
        source: "lesson_page",
      },
    });
  }

  const module = moduleDefinitionFromPayload(row.module);
  const questions = await getQuestionsForModule(row.module.id);
  const submissions = await getSubmissionsForDelivery(row.delivery.id);
  const submitted = query.submitted === "1";
  const hasSubmitted = submitted || submissions.length > 0;
  const completionCount = submissions.length;
  const progressLabel =
    hasSubmitted && module.moduleNumber === 12 ? "Final Module" : "Creative Lesson";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07102a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-[12rem] h-[20rem] w-[20rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[35%] h-[18rem] w-[18rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <section className="relative border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="/assets/logo-horizontal.png"
              alt="Ahren Foundation"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex flex-col gap-3 text-left md:items-end md:text-right">
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="rounded-full border border-[#00c9ff]/20 bg-[#00c9ff]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
                {row.program.name}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                {progressLabel}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Scheduled for {formatDate(row.delivery.scheduledFor)}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="space-y-8">
          <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#00c9ff]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
                Week {module.weekNumber}
              </span>
              <span className="rounded-full bg-[#00ff9d]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                Module {module.moduleNumber}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                {module.moduleNumber === 12 ? "Commissioning" : "Lesson"}
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
              {module.title}
            </h1>

            {module.subtitle ? (
              <p className="mt-4 max-w-2xl text-xl font-semibold leading-8 text-[#7dd3fc]">
                {module.subtitle}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Recipient
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {row.member.fullName}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Delivery
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {formatDate(row.delivery.scheduledFor)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Progress
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {completionCount} submission{completionCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </section>

          {submitted ? (
            <Alert type="success">
              Your assignment has been submitted. You can return to this page
              anytime to review the lesson and continue your journey.
            </Alert>
          ) : null}

          {query.error === "incomplete" ? (
            <Alert type="error">
              Please answer every question before submitting.
            </Alert>
          ) : null}

          <SectionCard eyebrow="Opening" title="Start with the lesson">
            <div className="space-y-5 text-[15px] leading-8 text-slate-200">
              {module.openingCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Scripture" title="Anchor verse">
            <div className="space-y-4">
              {module.scriptures.map((scripture) => (
                <blockquote
                  key={`${scripture.reference}-${scripture.text}`}
                  className="rounded-3xl border border-[#00c9ff]/15 bg-white/[0.03] p-5"
                >
                  <p className="text-lg font-semibold italic leading-8 text-white md:text-xl">
                    "{scripture.text}"
                  </p>
                  <footer className="mt-3 text-sm font-bold tracking-wide text-[#93c5fd]">
                    {scripture.reference}
                  </footer>
                </blockquote>
              ))}
            </div>
          </SectionCard>

          {[
            ["Reflection", module.reflection],
            ["This Week's Focus", module.focus],
            ["This Week's Action", module.action],
          ].map(([label, body], index) => (
            <SectionCard
              key={label}
              eyebrow={label}
              title={index === 0 ? "Think it through" : undefined}
            >
              <p className="text-[15px] leading-8 text-slate-200">{body}</p>
            </SectionCard>
          ))}

          {module.moduleNumber === 12 ? (
            <section className="rounded-[28px] border border-[#00ff9d]/20 bg-gradient-to-br from-[#00ff9d]/10 to-[#00c9ff]/10 p-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#00ff9d]">
                Congratulations
              </p>
              <p className="mt-3 max-w-3xl text-[15px] leading-8 text-slate-100">
                You have now completed the Ahren Foundation Christian
                Creativity Masterclass Program. Your certificate of completion
                and verified member access details will be sent to you shortly.
                Now go build something for eternity.
              </p>
            </section>
          ) : null}

          <SectionCard
            eyebrow="Assignment"
            title="Answer the questions and submit"
            className="border-[#00c9ff]/15 bg-[#07153c]/80"
          >
            {hasSubmitted ? (
              <div className="mb-6 rounded-2xl border border-[#00ff9d]/20 bg-[#00ff9d]/10 px-4 py-3 text-sm leading-6 text-[#d9fff0]">
                We have received {submissions.length} submission
                {submissions.length === 1 ? "" : "s"} for this module. You can
                submit again if you want to update your answers.
              </div>
            ) : null}

            <form action={submitModuleAssignment} className="space-y-6">
              <input type="hidden" name="delivery_id" value={row.delivery.id} />
              <input
                type="hidden"
                name="access_token"
                value={row.delivery.accessToken}
              />

              {questions.map((question) => (
                <div key={question.id}>
                  <input type="hidden" name="question_id" value={question.id} />
                  <label
                    htmlFor={`answer_${question.id}`}
                    className="mb-2 block text-sm font-semibold leading-6 text-white"
                  >
                    {question.questionNumber}. {question.prompt}
                  </label>
                  <textarea
                    id={`answer_${question.id}`}
                    name={`answer_${question.id}`}
                    required={question.isRequired}
                    rows={5}
                    className="w-full rounded-2xl border border-white/12 bg-[#030816] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/20"
                    placeholder="Write your answer here..."
                  />
                </div>
              ))}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-400">
                  Take your time, answer honestly, and submit when you are
                  ready.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] px-6 py-3 text-sm font-black text-[#07102a] transition hover:brightness-105"
                >
                  Submit assignment
                </button>
              </div>
            </form>
          </SectionCard>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentee
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {row.member.fullName}
            </p>
            <p className="mt-1 text-sm text-slate-300">{row.member.email}</p>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
              Progress
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Email status</dt>
                <dd className="font-semibold capitalize text-white">
                  {row.delivery.status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Opened</dt>
                <dd className="font-semibold text-white">
                  {row.delivery.openedAt ? "Yes" : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Clicked</dt>
                <dd className="font-semibold text-white">
                  {row.delivery.clickedAt ? "Yes" : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Lesson started</dt>
                <dd className="font-semibold text-white">
                  {row.delivery.assignmentStartedAt ? "Yes" : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Assignments</dt>
                <dd className="font-semibold text-white">{submissions.length}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
              Context
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>
                This lesson page includes the full module content, the
                assignment questions, and the submission flow.
              </p>
              <p>
                Email clicks go through the tracking route first, then redirect
                here with the access token.
              </p>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
