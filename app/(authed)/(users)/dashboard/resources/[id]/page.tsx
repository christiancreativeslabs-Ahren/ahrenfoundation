import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, eq, or } from "drizzle-orm";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { dashboardResources, programMembers } from "@/db/schema";
import { ResourcePdfViewerClient } from "./resource-pdf-viewer-client";

export const dynamic = "force-dynamic";

function isPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.endsWith(".pdf") || lower.includes(".pdf?");
}

export default async function MemberResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const [resource] = await db
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
    .where(
      and(
        eq(dashboardResources.id, id),
        eq(dashboardResources.isPublished, true),
        audienceFilter,
      ),
    )
    .limit(1);

  if (!resource) {
    notFound();
  }

  const pdf = isPdfUrl(resource.url);

  return (
    <main className="min-h-screen bg-[#080d2e] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/resources"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            Back to resources
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>

        {/* <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Resource
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {resource.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 capitalize text-[#00c9ff]">
              {resource.audience}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[#e8eeff]">
              {resource.category}
            </span>
          </div>

          {resource.summary ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {resource.summary}
            </p>
          ) : null}
        </section> */}

        {pdf ? (
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-sm text-slate-300">
              <FileText size={16} className="text-[#00c9ff]" />
              Secure PDF viewer
            </div>
            <div className="p-3 md:p-4">
              <ResourcePdfViewerClient
                resourceId={resource.id}
                title={resource.title}
              />
            </div>
          </section>
        ) : resource.url ? (
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-300">
              This resource is an external link.
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e]"
            >
              <ExternalLink size={14} />
              Open resource
            </a>
          </section>
        ) : (
          <section className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-slate-300">
            No file or link is attached to this resource.
          </section>
        )}
      </div>
    </main>
  );
}