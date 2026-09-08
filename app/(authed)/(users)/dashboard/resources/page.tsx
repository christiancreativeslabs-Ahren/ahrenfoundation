import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq, or } from "drizzle-orm";
import { FileText, Library } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { dashboardResources, programMembers } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function MemberResourcesPage() {
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

  if (!member || member.status !== "verified_member") {
    redirect("/dashboard");
  }

  // Youth sees audience "all" + "youth"; mentors would use "all" + "mentor"
  const audienceFilter =
    member.role === "mentor"
      ? or(
          eq(dashboardResources.audience, "all"),
          eq(dashboardResources.audience, "mentor"),
        )
      : or(
          eq(dashboardResources.audience, "all"),
          eq(dashboardResources.audience, "youth"),
        );

  const resources = await db
    .select({
      id: dashboardResources.id,
      title: dashboardResources.title,
      summary: dashboardResources.summary,
      category: dashboardResources.category,
      audience: dashboardResources.audience,
      url: dashboardResources.url,
      createdAt: dashboardResources.createdAt,
    })
    .from(dashboardResources)
    .where(and(eq(dashboardResources.isPublished, true), audienceFilter))
    .orderBy(desc(dashboardResources.createdAt));

  function isPdf(url: string | null) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith(".pdf") || lower.includes(".pdf?");
  }

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Resources
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Active resources
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                Published materials available for your role. PDFs open in a
                secure viewer inside the Hub.
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

        {resources.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-slate-300">
            <Library className="mx-auto mb-3 h-8 w-8 text-[#00c9ff]" />
            No resources published yet.
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {resources.map((resource) => (
              <article
                key={resource.id}
                className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 capitalize text-[#00c9ff]">
                    {resource.audience}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[#e8eeff]">
                    {resource.category}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight">
                  {resource.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">
                  {resource.summary || "No summary provided."}
                </p>

                <div className="mt-5">
                  {resource.url && isPdf(resource.url) ? (
                    <Link
                      href={`/dashboard/resources/${resource.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#080d2e]"
                    >
                      <FileText size={14} />
                      View PDF
                    </Link>
                  ) : resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Open link
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
