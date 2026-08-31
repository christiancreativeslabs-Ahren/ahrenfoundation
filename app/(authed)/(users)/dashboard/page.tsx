import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, ShieldCheck, Users } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getWorkbookMemberDashboard } from "@/lib/workbook";
import { getMenteeWorkspaceData } from "@/lib/mentorship";
import SignOutButton from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

function statusLabel(status?: string | null) {
  if (!status) return "Not started";
  return status.replaceAll("_", " ");
}

function dateLabel(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function MemberDashboardPage() {
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
    redirect("/hub/login");
  }

  if (member.role === "mentor") {
    redirect("/mentor/dashboard");
  }

  const isVerified = member.status === "verified_member";

  if (!isVerified) {
    return (
      <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Ahren Creative
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Welcome, {session.user.name || "member"}
              </h1>
            </div>
            <SignOutButton />
          </header>
          <section className="rounded-[28px] border border-cyan-500/20 bg-cyan-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00c9ff] text-[#080d2e]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Verified dashboard pending</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
                  Your profile is still under review. Once approved, you will see your Workbook, your assigned mentor, and only the information tied to your journey.
                </p>
                <Link
                  href="/training/apply"
                  className="mt-4 inline-flex rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Return to join form
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const [workspace, workbook] = await Promise.all([
    getMenteeWorkspaceData(member.id),
    getWorkbookMemberDashboard(member.id),
  ]);

  if (!workspace) {
    redirect("/hub/login");
  }

  const completedModules = workbook.completedModuleIds.size;
  const totalModules = workbook.modules.length;
  const nextModule = workbook.currentModule;

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Ahren Creative
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">
              Welcome, {session.user.name || "member"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Your dashboard now shows only your assigned mentor and Workbook journey.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Role", value: member.role },
            { label: "Status", value: statusLabel(member.status) },
            { label: "Current step", value: statusLabel(member.currentStep) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold capitalize">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-[#00ff9d]" />
              <h2 className="text-xl font-bold">Your assigned mentor</h2>
            </div>
            {workspace.assignment ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Mentor
                  </p>
                  <p className="mt-2 text-lg font-semibold">{workspace.assignment.mentor.fullName}</p>
                  <p className="mt-1 text-sm text-slate-300">{workspace.assignment.mentor.email}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Assigned: <span className="text-white">{dateLabel(workspace.assignment.assignment.assignedAt)}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Sessions: <span className="text-white">{workspace.assignment.sessions.length}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Notes: <span className="text-white">{workspace.assignment.assignment.notes ? "Available" : "None"}</span>
                  </div>
                </div>
                <Link
                  href="/dashboard/mentor"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e] transition-transform hover:scale-[1.02]"
                >
                  View assignment details
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
                Your mentor assignment has not been created yet. Once admin links you to a mentor, the details will show here.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-[#00ff9d]" />
              <h2 className="text-xl font-bold">Workbook progress</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Program: <span className="text-white">{workbook.program?.name ?? "Workbook not published"}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Available: <span className="text-white">{workbook.availableModules.length} / {totalModules}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                Completed: <span className="text-white">{completedModules}</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Next Workbook module
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {nextModule
                    ? `Module ${nextModule.moduleNumber}: ${nextModule.title}`
                    : workbook.availableModules.length
                      ? "You have completed every available Workbook module."
                      : "Your first Workbook module is not open yet."}
                </p>
              </div>
              <Link
                href="/dashboard/workbook"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Open Workbook
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
