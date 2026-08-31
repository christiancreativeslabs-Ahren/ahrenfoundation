import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, Users } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorDashboardData } from "@/lib/mentorship";
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

export default async function MentorMenteesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) redirect("/mentor/login");

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== "mentor") redirect("/mentor/login");

  const data = await getMentorDashboardData(member.id);
  if (!data) redirect("/mentor/login");

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentor workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">Assigned mentees</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Review each mentee relationship, their Workbook activity, and the sessions attached to your assignment.
            </p>
          </div>
          <SignOutButton />
        </header>

        <MentorWorkspaceNav />

        <section className="grid gap-5 lg:grid-cols-2">
          {data.assignments.map((row) => {
            const reviewed = row.latestSubmission?.submission.payload &&
              typeof row.latestSubmission.submission.payload === "object" &&
              row.latestSubmission.submission.payload.mentorReviewStatus === "reviewed";

            return (
              <article key={row.assignment.id} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{row.mentee.fullName}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                      <Mail size={14} />
                      {row.mentee.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                    {row.mentee.currentStep.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Assigned <span className="block text-white">{dateLabel(row.assignment.assignedAt)}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Sessions <span className="block text-white">{row.sessionCount}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                    Latest review{" "}
                    <span className="flex items-center gap-1 text-white">
                      {reviewed ? <CheckCircle2 size={14} className="text-[#00ff9d]" /> : null}
                      {reviewed ? "Reviewed" : row.latestSubmission ? "Needs review" : "No submission"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/mentor/mentees/${row.mentee.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#080d2e] hover:bg-slate-100"
                  >
                    Open progress
                    <ArrowRight size={14} />
                  </Link>
                  {row.latestSubmission ? (
                    <Link
                      href={`/mentor/submissions/${row.latestSubmission.submission.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                    >
                      Latest submission
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}

          {!data.assignments.length ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-slate-300">
              <Users className="mb-4 text-[#00ff9d]" />
              No mentees have been assigned to you yet.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
