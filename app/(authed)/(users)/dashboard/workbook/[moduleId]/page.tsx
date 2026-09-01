import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { submitWorkbookModuleAnswers } from "@/actions/workbook";
import { AHREN_WORKBOOK_PROGRAM } from "@/lib/workbook/content";
import {
  getWorkbookModulePageData,
  renderWorkbookModuleHtml,
} from "@/lib/workbook";
import { recordEngagementEvent } from "@/lib/workbook/service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HiddenInput, Textarea } from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

function Alert({
  type,
  children,
}: {
  type: "success" | "error";
  children: ReactNode;
}) {
  const styles =
    type === "success"
      ? "border-[#00ff9d]/20 bg-[#00ff9d]/10 text-[#d9fff0]"
      : "border-rose-300/20 bg-rose-500/10 text-rose-100";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function dateLabel(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function submitWorkbookAction(formData: FormData) {
  "use server";
  await submitWorkbookModuleAnswers(initialActionState, formData);
}

export default async function WorkbookModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { moduleId } = await params;
  const query = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/hub/login");
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member) {
    redirect("/dashboard");
  }

  const data = await getWorkbookModulePageData(moduleId, member.id);

  if (!data) {
    notFound();
  }

  await recordEngagementEvent({
    eventType: "workbook_viewed",
    programMemberId: member.id,
    enrollmentId: data.delivery?.enrollmentId,
    moduleId: data.module.id,
    deliveryId: data.delivery?.id,
    metadata: {
      workbookModuleId: data.module.id,
      workbookModuleNumber: data.module.moduleNumber,
      source: "dashboard_workbook",
    },
  });

  const answersByQuestionId = new Map(
    data.answers.map((answer) => [answer.questionId, answer.answer]),
  );
  const questionsById = new Map(
    data.questions.map((question) => [question.id, question]),
  );

  // console.log("Workbook module page data:", { data });

  const loadedModule = (module: typeof data.module) => {
    // console.log("Loaded module:", module);
    if (module.moduleKey === "module-1") {
      const loadedModule = AHREN_WORKBOOK_PROGRAM.modules[0];
      // console.log("Loaded module content:", { loadedModule, module });
      return loadedModule;
    } else if (module.moduleKey === "module-2") {
      const loadedModule = AHREN_WORKBOOK_PROGRAM.modules[1];
      // console.log("Loaded module content:", { loadedModule, module });
      return loadedModule;
    }

    return module;
  };

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/workbook"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            Back to Workbook
          </Link>
          <span className="rounded-full border border-[#00c9ff]/20 bg-[#00c9ff]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
            Module {data.module.moduleNumber}
          </span>
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook module
          </p>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                {data.module.title}
              </h1>
              {data.module.subtitle ? (
                <p className="mt-3 max-w-3xl text-lg leading-8 text-[#7dd3fc]">
                  {data.module.subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                {data.program.name}
              </span>
              <span className="rounded-full bg-[#00ff9d]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                {data.submission ? "Submitted" : "In progress"}
              </span>
            </div>
          </div>
        </section>

        {query.submitted === "1" ? (
          <Alert type="success">
            Your Workbook answers have been submitted successfully.
          </Alert>
        ) : null}

        {query.error ? <Alert type="error">{query.error}</Alert> : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen size={18} className="text-[#00ff9d]" />
                  Workbook content
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Read the Workbook module carefully before answering the
                  assessment questions below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-invert max-w-none prose-p:leading-8 prose-p:text-slate-200 prose-headings:text-white prose-strong:text-white"
                  dangerouslySetInnerHTML={{
                    __html: renderWorkbookModuleHtml(loadedModule(data.module)),
                  }}
                />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-lg">Assessment questions</CardTitle>
                <CardDescription className="text-slate-300">
                  Answer each question carefully. Your response will be saved to
                  your Workbook record.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={submitWorkbookAction} className="space-y-5">
                  <HiddenInput name="module_id" value={data.module.id} />
                  <HiddenInput
                    name="return_to"
                    value={`/dashboard/workbook/${data.module.id}`}
                  />

                  <div className="space-y-4">
                    {data.questions.map((question) => (
                      <label key={question.id} className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {question.questionNumber}. {question.prompt}
                        </span>
                        <Textarea
                          name={`answer_${question.id}`}
                          defaultValue={
                            answersByQuestionId.get(question.id) ?? ""
                          }
                          className="min-h-32 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                          placeholder="Write your answer here"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Workbook
                    </Button>
                    <p className="text-sm text-slate-400">
                      You can review this page after submission if you need to
                      revisit your answers.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </article>

          <aside className="space-y-6">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-lg">Your status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <p>Module: {data.module.moduleNumber}</p>
                <p>Status: {data.submission ? "Submitted" : "Not submitted"}</p>
                <p>Opened: {dateLabel(data.delivery?.scheduledFor)}</p>
                <p>Delivery: {data.delivery?.status ?? "Not synced"}</p>
                <p>Questions: {data.questions.length}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-lg">Latest submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                {data.submission ? (
                  <>
                    <p>
                      Submitted on:{" "}
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(data.submission.submittedAt)}
                    </p>
                    <div className="space-y-3">
                      {data.answers.map((answer) => {
                        const question = questionsById.get(answer.questionId);
                        if (!question) {
                          return null;
                        }

                        return (
                          <div
                            key={answer.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                              Question {question.questionNumber}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-100">
                              {question.prompt}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
                              {answer.answer}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p>No submission has been saved for this module yet.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
