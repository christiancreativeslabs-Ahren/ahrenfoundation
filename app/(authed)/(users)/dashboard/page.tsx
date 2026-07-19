import Link from "next/link";
import { and, eq, or } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Handshake,
  Lightbulb,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { createCommunityPost, createProjectShowcase } from "@/actions/member";
import { db } from "@/db";
import {
  communityEvents,
  communityPosts,
  dashboardResources,
  opportunities,
  programMembers,
  projectShowcases,
} from "@/db/schema";
import SignOutButton from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

function statusLabel(status?: string) {
  if (!status) return "Application pending";
  return status.replaceAll("_", " ");
}

export default async function MemberDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/login");
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  const isVerified =
    member?.status === "verified_member" || member?.status === "verified_mentor";

  const resources = member
    ? await db
        .select()
        .from(dashboardResources)
        .where(
          and(
            eq(dashboardResources.isPublished, true),
            or(
              eq(dashboardResources.audience, "all"),
              eq(dashboardResources.audience, member.role),
            ),
          ),
        )
        .limit(12)
    : [];

  const showcases = member
    ? await db
        .select()
        .from(projectShowcases)
        .where(eq(projectShowcases.programMemberId, member.id))
        .limit(6)
    : [];

  const posts = isVerified
    ? await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.status, "published"))
        .limit(6)
    : [];

  const events = isVerified && member
    ? await db
        .select()
        .from(communityEvents)
        .where(
          and(
            eq(communityEvents.status, "published"),
            or(
              eq(communityEvents.audience, "all"),
              eq(communityEvents.audience, member.role),
            ),
          ),
        )
        .limit(6)
    : [];

  const publishedOpportunities = isVerified && member
    ? await db
        .select()
        .from(opportunities)
        .where(
          and(
            eq(opportunities.status, "published"),
            or(
              eq(opportunities.audience, "all"),
              eq(opportunities.audience, member.role),
            ),
          ),
        )
        .limit(6)
    : [];

  const mentors = isVerified
    ? await db
        .select()
        .from(programMembers)
        .where(eq(programMembers.status, "verified_mentor"))
        .limit(8)
    : [];

  const modules = [
    {
      title: "Community feed",
      text: "Connect with verified Ahren creatives and mentors.",
      icon: MessageSquare,
    },
    {
      title: "Resource library",
      text: "Videos, books, templates, links, and toolkits.",
      icon: BookOpen,
    },
    {
      title: "Incubation access",
      text: "Build and refine your Kingdom project idea.",
      icon: Rocket,
    },
    {
      title: "Upcoming events",
      text: "Meet-ups, conferences, and virtual sessions.",
      icon: CalendarDays,
    },
    {
      title: "Project showcase",
      text: "Prepare your project for visibility and support.",
      icon: Lightbulb,
    },
    {
      title: "Partnerships",
      text: "Browse funding and collaboration opportunities.",
      icon: Handshake,
    },
    {
      title: "Mentor directory",
      text: "Advanced help for verified members.",
      icon: Users,
    },
  ];

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Ahren Creative
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal">
              Welcome, {session.user.name || "member"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Your dashboard access reflects your current journey state with
              Ahren Foundation.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Program", value: member?.role ?? "Not enrolled" },
            { label: "Status", value: statusLabel(member?.status) },
            { label: "Current step", value: statusLabel(member?.currentStep) },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold capitalize">{item.value}</p>
            </div>
          ))}
        </section>

        {!isVerified ? (
          <section className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00c9ff] text-[#080d2e]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Verified dashboard pending</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
                  Complete the required mentorship steps and wait for Ahren
                  Foundation review. Once verified, the community, resources,
                  events, project showcase, and mentor directory will unlock here.
                </p>
                <Link
                  href="/join"
                  className="mt-4 inline-flex rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Return to join form
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.title}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5"
                  >
                    <Icon size={20} className="text-[#00ff9d]" />
                    <h2 className="mt-4 text-lg font-semibold">{module.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {module.text}
                    </p>
                  </div>
                );
              })}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Community feed</h2>
                <form action={createCommunityPost} className="mt-4 space-y-3">
                  <textarea
                    name="body"
                    className="min-h-24 w-full rounded-md border border-white/15 bg-[#080d2e] px-3 py-2 text-sm text-white"
                    placeholder="Share an update with verified members"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-[#00c9ff] px-4 py-2 text-sm font-semibold text-[#080d2e]"
                  >
                    Post update
                  </button>
                </form>
                <div className="mt-4 space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="rounded-md border border-white/10 p-4">
                      <p className="text-sm leading-relaxed text-slate-300">
                        {post.body}
                      </p>
                    </div>
                  ))}
                  {!posts.length ? (
                    <p className="text-sm text-slate-400">
                      Community posts will appear here when published.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Resource library</h2>
                <div className="mt-4 space-y-3">
                  {resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url ?? "#"}
                      className="block rounded-md border border-white/10 p-4 hover:bg-white/5"
                    >
                      <p className="text-sm font-semibold">{resource.title}</p>
                      {resource.summary ? (
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {resource.summary}
                        </p>
                      ) : null}
                    </a>
                  ))}
                  {!resources.length ? (
                    <p className="text-sm text-slate-400">
                      Resources will appear here once published by the team.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Upcoming events</h2>
                <div className="mt-4 space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="rounded-md border border-white/10 p-4">
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Intl.DateTimeFormat("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(event.startsAt)}
                      </p>
                      {event.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          {event.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                  {!events.length ? (
                    <p className="text-sm text-slate-400">
                      Upcoming events will appear here.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Funding and partnerships</h2>
                <div className="mt-4 space-y-3">
                  {publishedOpportunities.map((item) => (
                    <a
                      key={item.id}
                      href={item.url ?? "#"}
                      className="block rounded-md border border-white/10 p-4 hover:bg-white/5"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#00c9ff]">
                        {item.type}
                      </p>
                      {item.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          {item.summary}
                        </p>
                      ) : null}
                    </a>
                  ))}
                  {!publishedOpportunities.length ? (
                    <p className="text-sm text-slate-400">
                      Funding and partnership opportunities will appear here.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Project showcase</h2>
                <form action={createProjectShowcase} className="mt-4 space-y-3">
                  <input
                    name="title"
                    className="h-10 w-full rounded-md border border-white/15 bg-[#080d2e] px-3 text-sm text-white"
                    placeholder="Project title"
                  />
                  <textarea
                    name="summary"
                    className="min-h-24 w-full rounded-md border border-white/15 bg-[#080d2e] px-3 py-2 text-sm text-white"
                    placeholder="What does your project do, and who does it serve?"
                  />
                  <input
                    name="project_url"
                    className="h-10 w-full rounded-md border border-white/15 bg-[#080d2e] px-3 text-sm text-white"
                    placeholder="Project link"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-[#00c9ff] px-4 py-2 text-sm font-semibold text-[#080d2e]"
                  >
                    Submit project
                  </button>
                </form>
                <div className="mt-4 space-y-3">
                  {showcases.map((project) => (
                    <div key={project.id} className="rounded-md border border-white/10 p-4">
                      <p className="text-sm font-semibold">{project.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {project.summary}
                      </p>
                    </div>
                  ))}
                  {!showcases.length ? (
                    <p className="text-sm text-slate-400">
                      Your project showcase entries will appear here.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-semibold">Mentor directory</h2>
                <div className="mt-4 space-y-3">
                  {mentors.map((mentor) => (
                    <div key={mentor.id} className="rounded-md border border-white/10 p-4">
                      <p className="text-sm font-semibold">{mentor.fullName}</p>
                      <p className="mt-1 text-xs text-slate-400">{mentor.email}</p>
                    </div>
                  ))}
                  {!mentors.length ? (
                    <p className="text-sm text-slate-400">
                      Verified mentors will appear here as the directory grows.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
