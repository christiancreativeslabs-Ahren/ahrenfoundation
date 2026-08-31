import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, ClipboardList } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorSubmissionsData } from "@/lib/mentorship";
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

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function MentorSubmissionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) redirect("/mentor/login");

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== "mentor") redirect("/mentor/login");

  const data = await getMentorSubmissionsData(member.id);
  if (!data) redirect("/mentor/login");

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentor workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">Workbook review queue</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Review Workbook answers from your assigned mentees and record feedback before your next session.
            </p>
          </div>
          <SignOutButton />
        </header>

        <MentorWorkspaceNav />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total submissions", value: data.rows.length },
            { label: "Needs review", value: data.needsReviewCount },
            { label: "Reviewed", value: data.rows.length - data.needsReviewCount },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          {data.rows.map((row) => (
            <article key={row.submission.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold">{row.mentee.fullName}</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Module {row.module.moduleNumber}: {row.module.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted {dateLabel(row.submission.submittedAt)}
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                  {statusLabel(row.reviewStatus)}
                </span>
              </div>
              {row.feedback ? (
                <p className="mt-4 rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm leading-6 text-slate-300">
                  {row.feedback}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/mentor/submissions/${row.submission.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#080d2e] hover:bg-slate-100"
                >
                  Review submission
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href={`/mentor/mentees/${row.mentee.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  View mentee
                </Link>
              </div>
            </article>
          ))}

          {!data.rows.length ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-slate-300">
              <ClipboardList className="mb-4 text-[#00ff9d]" />
              No Workbook submissions have been made by your assigned mentees yet.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
