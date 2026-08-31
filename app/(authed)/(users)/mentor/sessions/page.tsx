import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import { getMentorSessionsData } from "@/lib/mentorship";
import { MentorSessionForm } from "@/components/mentor/mentor-session-form";
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

export default async function MentorSessionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) redirect("/mentor/login");

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== "mentor") redirect("/mentor/login");

  const data = await getMentorSessionsData(member.id);
  if (!data) redirect("/mentor/login");

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Mentor workspace
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">Mentorship sessions</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Schedule calls, attach meeting links, mark sessions complete, and keep private session notes.
            </p>
          </div>
          <SignOutButton />
        </header>

        <MentorWorkspaceNav />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total sessions", value: data.sessions.length },
            { label: "Open sessions", value: data.scheduledCount },
            { label: "Completed", value: data.completedCount },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {data.sessions.map(({ session: item, mentee }) => (
            <article key={item.id} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Session {item.sessionNumber}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">{mentee.fullName}</h2>
                  <p className="mt-2 text-sm text-slate-300">{mentee.email}</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#00ff9d]">
                  {item.status.replaceAll("_", " ")}
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                  Scheduled <span className="block text-white">{dateLabel(item.scheduledAt)}</span>
                </p>
                <p className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 text-sm text-slate-300">
                  Completed <span className="block text-white">{dateLabel(item.completedAt)}</span>
                </p>
              </div>
              <div className="mt-5">
                <MentorSessionForm session={item} />
              </div>
              <Link
                href={`/mentor/mentees/${mentee.id}`}
                className="mt-4 inline-flex text-sm font-semibold text-[#00c9ff] hover:text-[#00ff9d]"
              >
                View mentee progress
              </Link>
            </article>
          ))}

          {!data.sessions.length ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-6 text-slate-300">
              <CalendarDays className="mb-4 text-[#00ff9d]" />
              No mentorship sessions have been created for your assignments yet.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
