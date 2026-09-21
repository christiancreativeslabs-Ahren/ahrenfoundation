import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { blogPosts, users } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  if (status === "archived") {
    return "border-white/10 bg-white/[0.04] text-slate-300";
  }
  return "border-white/10 bg-white/[0.04] text-[#e8eeff]";
}

export default async function AdminBlogPage() {
  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      status: blogPosts.status,
      excerpt: blogPosts.excerpt,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: blogPosts.authorName,
      creatorName: users.name,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.createdByUserId, users.id))
    .orderBy(desc(blogPosts.createdAt));

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

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
                Blog
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Create and manage foundation blog posts with images, captions,
                and links.
              </CardDescription>
            </div>

            <Link
              href="/admin/blog/new"
              className={cn(
                buttonVariants(),
                "gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
              )}
            >
              <Plus className="h-4 w-4" />
              New post
            </Link>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total posts", value: posts.length },
            { label: "Published", value: publishedCount },
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
          <CardTitle className="text-lg font-semibold">Posts</CardTitle>
          <CardDescription className="text-slate-300">
            Newest first. Edit a post to update content, cover image, or status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-300">
              No blog posts yet. Create your first post.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold text-white">
                      {post.title}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusClass(post.status))}
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-300">
                    {post.excerpt || "No excerpt"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {post.authorName || post.creatorName || "Admin"} · updated{" "}
                    {formatDate(post.updatedAt)}
                    {post.publishedAt
                      ? ` · published ${formatDate(post.publishedAt)}`
                      : ""}
                  </p>
                </div>

                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "shrink-0 border-white/15 bg-transparent text-white hover:bg-white/10",
                  )}
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
