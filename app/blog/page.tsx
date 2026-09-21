import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/sections/BlogPage";
import PageTransition from "@/components/PageTransition";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export const metadata: Metadata = {
  title: "Blog — Ahren Foundation",
  description:
    "Stories, reflections, and insights from the intersection of faith, creativity, and technology.",
};

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function Blog() {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      coverImageUrl: blogPosts.coverImageUrl,
      authorName: blogPosts.authorName,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  const posts = rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    coverImageUrl: row.coverImageUrl,
    author: row.authorName || "Ahren Foundation",
    date: formatDate(row.publishedAt),
    tag: "Blog",
    readTime: "Read",
  }));

  return (
    <PageTransition>
      <>
        <Navbar />
        <BlogPage posts={posts} />
        <Footer />
      </>
    </PageTransition>
  );
}
