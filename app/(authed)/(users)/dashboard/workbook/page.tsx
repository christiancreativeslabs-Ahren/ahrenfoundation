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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function statusLabel(value?: string | null) {
  if (!value) return "Not started";
  return value.replaceAll("_", " ");
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

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Your workbook</h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                Read each workbook lesson inside the Hub, complete the assessment questions, and submit your answers when you are ready.
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

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Program", value: activeProgram?.name ?? "Workbook not imported" },
            { label: "Modules", value: String(totalModules) },
            { label: "Completed", value: String(completedModules) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        {!dashboard.program ? (
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LockKeyhole size={18} className="text-[#00ff9d]" />
                Workbook not yet published
              </CardTitle>
              <CardDescription className="text-slate-300">
                The workbook content has not been imported yet. Once the admin uploads the workbook structure, your lessons will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {dashboard.modules.map((module) => {
              const completed = dashboard.completedModuleIds.has(module.id);

              return (
                <Link
                  key={module.id}
                  href={`/dashboard/workbook/${module.id}`}
                  className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#00c9ff]/30 hover:bg-white/[0.06]"
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
                    ) : (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                        {statusLabel(module.status)}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 text-2xl font-black tracking-tight">{module.title}</h2>
                  {module.subtitle ? (
                    <p className="mt-3 text-sm leading-6 text-[#7dd3fc]">{module.subtitle}</p>
                  ) : null}
                  {module.summary ? (
                    <p className="mt-3 text-sm leading-7 text-slate-300">{module.summary}</p>
                  ) : null}
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Open lesson
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-[#00ff9d]" />
            <h2 className="text-xl font-bold">How this workbook works</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Read the workbook lesson inside the app, just like a blog post or lesson page.
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Answer the assessment questions on the module page and submit your responses.
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
              Your progress is saved as part of your mentee journey and can be reviewed by admins.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
