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
      ? "border-[#00ff9d]/25 bg-[#00ff9d]/10 text-[#c8ffe8]"
      : "border-red-300/25 bg-red-400/10 text-red-100";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
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

  return (
    <main className="min-h-screen bg-[#080d2e] text-white">
      <section className="border-b border-white/10 bg-[#0b1238]">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="/assets/logo-horizontal.png"
              alt="Ahren Foundation"
              className="h-10 w-auto"
            />
          </Link>
          <div className="text-left md:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              {row.program.name}
            </p>
            <p className="mt-1 text-sm text-[#8892b0]">
              Scheduled for {formatDate(row.delivery.scheduledFor)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <article className="space-y-8">
          <header>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ff9d]">
              Week {module.weekNumber} - Module {module.moduleNumber}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              {module.title}
            </h1>
            {module.subtitle ? (
              <p className="mt-3 text-xl font-semibold text-[#00c9ff]">
                {module.subtitle}
              </p>
            ) : null}
          </header>

          {submitted ? (
            <Alert type="success">
              Your assignment has been submitted. Thank you for engaging with
              the module.
            </Alert>
          ) : null}
          {query.error === "incomplete" ? (
            <Alert type="error">
              Please answer every question before submitting.
            </Alert>
          ) : null}

          <section className="space-y-4 text-base leading-8 text-[#d9e4ff]">
            {module.openingCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="rounded-lg border border-[#00c9ff]/20 bg-white/[0.04] p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Key Scripture
            </p>
            <div className="space-y-5">
              {module.scriptures.map((scripture) => (
                <blockquote key={`${scripture.reference}-${scripture.text}`}>
                  <p className="text-lg font-semibold italic leading-8 text-white">
                    "{scripture.text}"
                  </p>
                  <footer className="mt-2 text-sm font-bold text-[#8892b0]">
                    {scripture.reference}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          {[
            ["Reflection", module.reflection],
            ["This Week's Focus", module.focus],
            ["This Week's Action", module.action],
          ].map(([label, body]) => (
            <section
              key={label}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
                {label}
              </p>
              <p className="text-base leading-8 text-[#d9e4ff]">{body}</p>
            </section>
          ))}

          {module.moduleNumber === 12 ? (
            <section className="rounded-lg border border-[#00ff9d]/25 bg-[#00ff9d]/10 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
                Congratulations
              </p>
              <p className="text-base leading-8 text-[#d9e4ff]">
                You have now completed the Ahren Foundation Christian
                Creativity Masterclass Program. Your certificate of completion
                and verified member access details will be sent to you shortly.
                Now go build something for eternity.
              </p>
            </section>
          ) : null}

          <section className="rounded-lg border border-[#00c9ff]/20 bg-[#0d1542] p-6">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Assignment Questions
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Save your reflection
              </h2>
            </div>

            {hasSubmitted ? (
              <div className="mb-6 rounded-lg border border-[#00ff9d]/20 bg-[#00ff9d]/10 p-4 text-sm leading-6 text-[#c8ffe8]">
                We have received {submissions.length} submission
                {submissions.length === 1 ? "" : "s"} for this module. You can
                submit again if you want to update your answers.
              </div>
            ) : null}

            <form action={submitModuleAssignment} className="space-y-5">
              <input type="hidden" name="delivery_id" value={row.delivery.id} />
              <input type="hidden" name="access_token" value={row.delivery.accessToken} />
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
                    rows={4}
                    className="w-full rounded-lg border border-white/15 bg-[#080d2e] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[#00c9ff]"
                    placeholder="Write your answer here..."
                  />
                </div>
              ))}

              <button
                type="submit"
                className="inline-flex rounded-lg bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] px-5 py-3 text-sm font-black text-[#080d2e] transition hover:opacity-90"
              >
                Submit assignment
              </button>
            </form>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentee
            </p>
            <p className="mt-2 text-lg font-bold text-white">{row.member.fullName}</p>
            <p className="mt-1 text-sm text-[#8892b0]">{row.member.email}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
              Progress
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#8892b0]">Email status</dt>
                <dd className="font-semibold capitalize text-white">
                  {row.delivery.status}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8892b0]">Opened</dt>
                <dd className="font-semibold text-white">
                  {row.delivery.openedAt ? "Yes" : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8892b0]">Clicked</dt>
                <dd className="font-semibold text-white">
                  {row.delivery.clickedAt ? "Yes" : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8892b0]">Assignments</dt>
                <dd className="font-semibold text-white">{submissions.length}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </main>
  );
}
