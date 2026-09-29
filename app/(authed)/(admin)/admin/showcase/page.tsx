import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import {
  showcaseCategories,
  showcaseItems,
  showcaseSubcategories,
} from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusClass(status: string) {
  if (status === "published") {
    return "border-[#00ff9d]/15 bg-[#00ff9d]/10 text-[#00ff9d]";
  }
  if (status === "review") {
    return "border-[#00c9ff]/20 bg-[#00c9ff]/10 text-[#00c9ff]";
  }
  return "border-white/10 bg-white/[0.04] text-[#e8eeff]";
}

export default async function AdminShowcasePage() {
  const items = await db
    .select({
      id: showcaseItems.id,
      title: showcaseItems.title,
      slug: showcaseItems.slug,
      status: showcaseItems.status,
      isFeatured: showcaseItems.isFeatured,
      summary: showcaseItems.summary,
      creatorName: showcaseItems.creatorName,
      publishedAt: showcaseItems.publishedAt,
      updatedAt: showcaseItems.updatedAt,
      categoryName: showcaseCategories.name,
      subcategoryName: showcaseSubcategories.name,
    })
    .from(showcaseItems)
    .leftJoin(
      showcaseCategories,
      eq(showcaseItems.categoryId, showcaseCategories.id),
    )
    .leftJoin(
      showcaseSubcategories,
      eq(showcaseItems.subcategoryId, showcaseSubcategories.id),
    )
    .orderBy(desc(showcaseItems.updatedAt));

  const publishedCount = items.filter((i) => i.status === "published").length;
  const reviewCount = items.filter((i) => i.status === "review").length;
  const draftCount = items.filter((i) => i.status === "draft").length;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin content
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                The Showcase
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Curate community creative work — articles, art, music, video,
                design, tech, and more. Admin-only publishing with draft,
                review, and published states.
              </CardDescription>
            </div>

            <Link
              href="/admin/showcase/new"
              className={cn(
                buttonVariants(),
                "gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
              )}
            >
              <Plus className="h-4 w-4" />
              New item
            </Link>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total items", value: items.length },
            { label: "Published", value: publishedCount },
            { label: "In review", value: reviewCount },
            { label: "Drafts", value: draftCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-[#0d1538] p-4"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </div>
              <div className="mt-3 text-2xl font-bold text-white">
                {item.value}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Showcase queue
          </CardTitle>
          <CardDescription className="text-slate-300">
            Newest updates first. Open an item to edit content, media, and
            status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-300">
              <p>No showcase items yet.</p>
              <Link
                href="/admin/showcase/new"
                className="mt-4 inline-flex text-sm font-semibold text-[#00c9ff] hover:underline"
              >
                Create the first item
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold text-white">
                      {item.title}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusClass(item.status))}
                    >
                      {item.status}
                    </Badge>
                    {item.isFeatured ? (
                      <Badge
                        variant="outline"
                        className="border-[#00ff9d]/20 bg-[#00ff9d]/10 text-[#00ff9d]"
                      >
                        Featured
                      </Badge>
                    ) : null}
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-300">
                    {item.summary || "No summary"}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 text-[#00c9ff]">
                      {item.categoryName || "Uncategorized"}
                    </span>
                    {item.subcategoryName ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[#e8eeff]">
                        {item.subcategoryName}
                      </span>
                    ) : null}
                    <span>
                      {item.creatorName || "No creator credit"} · updated{" "}
                      {formatDate(item.updatedAt)}
                      {item.publishedAt
                        ? ` · published ${formatDate(item.publishedAt)}`
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {item.status === "published" ? (
                    <Link
                      href={`/showcase/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "border-white/15 bg-transparent text-white hover:bg-white/10",
                      )}
                    >
                      View public
                    </Link>
                  ) : null}
                  <Link
                    href={`/admin/showcase/${item.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "border-white/15 bg-transparent text-white hover:bg-white/10",
                    )}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
