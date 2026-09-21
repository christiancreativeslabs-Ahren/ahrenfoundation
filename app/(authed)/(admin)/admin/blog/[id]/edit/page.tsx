// app/(authed)/(admin)/admin/blog/[id]/edit/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { BlogPostEditor } from "@/features/admin/blog/_components/blog-post-editor";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      contentHtml: blogPosts.contentHtml,
      coverImageUrl: blogPosts.coverImageUrl,
      coverImageCaption: blogPosts.coverImageCaption,
      authorName: blogPosts.authorName,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </div>

      <BlogPostEditor
        initialPost={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentHtml: post.contentHtml,
          coverImageUrl: post.coverImageUrl,
          coverImageCaption: post.coverImageCaption,
          authorName: post.authorName,
          status: post.status,
        }}
      />
    </div>
  );
}
