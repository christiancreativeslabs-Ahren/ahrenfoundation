import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, LockKeyhole } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import {
  getWorkbookMemberDashboard,
  getActiveWorkbookProgram,
} from "@/lib/workbook";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

function statusLabel(value?: string | null) {
  if (!value) return "Not started";
  return value.replaceAll("_", " ");
}

function dateLabel(value: Date | string | null | undefined) {
  if (!value) return "Not scheduled";

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function WorkbookDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/hub/login");
  }

  const [programMember] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!programMember) {
    redirect("/dashboard");
  }

  const [dashboard, activeProgram] = await Promise.all([
    getWorkbookMemberDashboard(programMember.id),
    getActiveWorkbookProgram(),
  ]);

  const totalModules = dashboard.modules.length;
  const completedModules = dashboard.completedModuleIds.size;

  // Find the current module's position in the available modules.
  const currentModuleIndex = dashboard.availableModules.findIndex(
    (module) => module.id === dashboard.currentModule?.id,
  );

  // Display modules up to and including the current module.
  // If no current module is identified, show all available modules.
  const visibleModules =
    currentModuleIndex >= 0
      ? dashboard.availableModules.slice(0, currentModuleIndex + 1)
      : dashboard.availableModules;

  const deliveryByModuleId = new Map(
    dashboard.deliveries.map((delivery) => [delivery.moduleId, delivery]),
  );

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook
          </p>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Your Workbook
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                Read each Workbook module inside the Hub, complete the
                assessment questions, and submit your answers when you are
                ready. Modules become available as you progress through your
                Workbook.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Program",
              value: activeProgram?.name ?? "Workbook not imported",
            },
            {
              label: "Available",
              value: `${visibleModules.length} / ${totalModules}`,
            },
            {
              label: "Completed",
              value: String(completedModules),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>

              <p className="mt-3 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Workbook content */}
        {!dashboard.program ? (
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LockKeyhole size={18} className="text-[#00ff9d]" />
                Workbook not yet published
              </CardTitle>

              <CardDescription className="text-slate-300">
                The Workbook content has not been imported yet. Once the admin
                uploads the Workbook structure, your modules will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="space-y-8">
            {visibleModules.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {visibleModules.map((module) => {
                  const completed = dashboard.completedModuleIds.has(module.id);

                  const current =
                    dashboard.currentModule?.id === module.id && !completed;

                  const delivery = deliveryByModuleId.get(module.id);

                  return (
                    <Link
                      key={module.id}
                      href={`/dashboard/workbook/${module.id}`}
                      className={`group rounded-[28px] border p-6 transition hover:-translate-y-1 ${
                        current
                          ? "border-[#00c9ff]/40 bg-[#00c9ff]/[0.06] hover:bg-[#00c9ff]/[0.09]"
                          : "border-white/10 bg-white/[0.04] hover:border-[#00c9ff]/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#00c9ff]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
                          Module {module.moduleNumber}
                        </span>

                        {completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#00ff9d]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                            <CheckCircle2 size={12} />
                            Submitted
                          </span>
                        ) : current ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#00c9ff]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00c9ff]">
                            Current
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                            {statusLabel(module.status)}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-5 text-2xl font-black tracking-tight">
                        {module.title}
                      </h2>

                      {module.subtitle ? (
                        <p className="mt-3 text-sm leading-6 text-[#7dd3fc]">
                          {module.subtitle}
                        </p>
                      ) : null}

                      {module.focus ? (
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {module.focus}
                        </p>
                      ) : null}

                      <p className="mt-4 text-xs text-slate-400">
                        Opened: {dateLabel(delivery?.scheduledFor)}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                        {completed
                          ? "Review module"
                          : current
                            ? "Continue module"
                            : "Open module"}

                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card className="border-white/10 bg-white/[0.03] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LockKeyhole size={18} className="text-[#00c9ff]" />
                    No modules available yet
                  </CardTitle>

                  <CardDescription className="text-slate-300">
                    Your Workbook modules will appear here when they become
                    available.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </section>
        )}

        {/* How the Workbook works */}
        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-[#00ff9d]" />

            <h2 className="text-xl font-bold">How this Workbook works</h2>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Read the Workbook module inside the app, with the same content
              delivered by email.
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Answer the assessment questions on the module page and submit your
              responses.
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Your progress is saved as part of your mentee journey and can be
              reviewed by admins.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
