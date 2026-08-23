import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Users } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorDashboardData } from "@/lib/mentorship";
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

export default async function MentorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/mentor/login");
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== "mentor") {
    redirect("/mentor/login");
  }

  const data = await getMentorDashboardData(member.id);

  if (!data) {
    redirect("/mentor/login");
  }

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentor workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">
              Welcome, {session.user.name || "mentor"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              You now have a mentor-specific view of your assigned mentees and their workbook progress.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Assigned mentees", value: String(data.totalAssignments) },
            { label: "Mentor status", value: member.status.replaceAll("_", " ") },
            { label: "Current step", value: member.currentStep.replaceAll("_", " ") },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold capitalize">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-[#00ff9d]" />
            <h2 className="text-xl font-bold">Your assigned mentees</h2>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {data.assignments.map((row) => (
              <div key={row.assignment.id} className="rounded-2xl border border-white/10 bg-[#0d1538] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{row.mentee.fullName}</p>
                    <p className="mt-1 text-sm text-slate-300">{row.mentee.email}</p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                    {row.mentee.currentStep.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#00c9ff]">Assigned</span>
                    {dateLabel(row.assignment.assignedAt)}
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#00c9ff]">Sessions</span>
                    {row.sessionCount}
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#00c9ff]">Latest workbook</span>
                    {row.latestSubmission
                      ? `Module ${row.latestSubmission.module.moduleNumber}`
                      : "No submission yet"}
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-[#00c9ff]">Submitted</span>
                    {row.latestSubmission ? dateLabel(row.latestSubmission.submission.submittedAt) : "-"}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/mentor/mentees/${row.mentee.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#080d2e] transition-transform hover:scale-[1.02]"
                  >
                    View mentee
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/dashboard/workbook"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                  >
                    Open workbook context
                  </Link>
                </div>
              </div>
            ))}

            {!data.assignments.length ? (
              <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-5 text-sm leading-6 text-slate-300">
                No mentees have been assigned to you yet. Once admin links a mentee to your account, they will appear here.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
