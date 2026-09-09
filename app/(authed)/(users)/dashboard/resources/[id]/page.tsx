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
    <div className="mx-auto">
      {pdf ? (
        <ResourcePdfViewerClient
          resourceId={resource.id}
          title={resource.title}
        />
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
  );
}
