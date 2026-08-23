import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMenteeWorkspaceData } from "@/lib/mentorship";
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

export default async function MenteeAssignmentPage() {
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

  if (!member || member.role !== "youth") {
    redirect("/dashboard");
  }

  const data = await getMenteeWorkspaceData(member.id);

  if (!data) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c9ff]"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">Your assignment</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              This page shows the mentor and workbook information connected to your current journey.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Role", value: data.mentee.role },
            { label: "Status", value: data.mentee.status.replaceAll("_", " ") },
            { label: "Current step", value: data.mentee.currentStep.replaceAll("_", " ") },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold capitalize">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-[#00ff9d]" />
              <h2 className="text-xl font-bold">Assigned mentor</h2>
            </div>

            {data.assignment ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4">
                  <p className="text-lg font-semibold">{data.assignment.mentor.fullName}</p>
                  <p className="mt-1 text-sm text-slate-300">{data.assignment.mentor.email}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Assigned on: <span className="text-white">{dateLabel(data.assignment.assignment.assignedAt)}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Sessions: <span className="text-white">{data.assignment.sessions.length}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
                  {data.assignment.assignment.notes ?? "No assignment notes yet."}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
                You have not been assigned a mentor yet.
              </div>
            )}
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
                Program: <span className="text-white">{data.workbook.program?.name ?? "-"}</span>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/dashboard/workbook"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e] transition-transform hover:scale-[1.02]"
              >
                Open workbook
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
