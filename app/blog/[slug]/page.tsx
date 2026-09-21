// app/blog/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { ArrowLeft, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { BlogShareBar } from "@/components/blog/blog-share-bar";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function getPublishedPost(slug: string) {
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
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);

  return post ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return { title: "Post not found — Ahren Foundation" };
  }

  return {
    title: `${post.title} — Ahren Foundation`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `/blog/${post.slug}`,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.ahrenfoundation.org"}/blog/${post.slug}`;
  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="min-h-screen bg-[#080d2e] text-white">
          <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
            <Link
              href="/blog"
              className="mb-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#8892b0] transition hover:text-white"
              style={{ border: "1px solid rgba(0,201,255,0.15)" }}
            >
              <ArrowLeft size={14} />
              Back to blog
            </Link>

            <header className="mb-10 space-y-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Blog
              </p>
              <h1
                className="text-white leading-[1.1]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-xs text-[#8892b0]">
                <span className="inline-flex items-center gap-1.5">
                  <User size={12} />
                  {post.authorName || "Ahren Foundation"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <div className="pt-2">
                <BlogShareBar title={post.title} url={shareUrl} />
              </div>

              {/* {post.excerpt ? (
                <p className="max-w-2xl text-base leading-relaxed text-[#8892b0]">
                  {post.excerpt}
                </p>
              ) : null} */}
            </header>

            {/* {post.coverImageUrl ? (
              <figure
                className="mb-12 overflow-hidden"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(0,201,255,0.1)",
                }}
              >
                <img
                  src={post.coverImageUrl}
                  alt={post.coverImageCaption || post.title}
                  className="w-full object-cover"
                />
                {post.coverImageCaption ? (
                  <figcaption
                    className="px-5 py-3 text-sm text-[#8892b0]"
                    style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
                  >
                    {post.coverImageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null} */}

            <div
              className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-[#8892b0] prose-p:leading-8 prose-a:text-[#00c9ff] prose-strong:text-white prose-li:text-[#8892b0] prose-blockquote:border-[#00ff9d]/40 prose-blockquote:text-[#c5d5e8] prose-img:rounded-2xl prose-figcaption:text-[#8892b0]"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            <div
              className="mt-16 flex flex-wrap gap-3 pt-10"
              style={{ borderTop: "1px solid rgba(0,201,255,0.1)" }}
            >
              <Link
                href="/blog"
                className="rounded-full px-6 py-3 text-sm font-semibold text-[#8892b0] transition hover:text-white"
                style={{ border: "1px solid rgba(0,201,255,0.15)" }}
              >
                More articles
              </Link>
              <Link
                href="/training/apply"
                className="grad-bg rounded-full px-6 py-3 text-sm font-bold text-[#080d2e]"
              >
                Join the Fellowship
              </Link>
            </div>
          </article>
        </main>
        <Footer />
      </>
    </PageTransition>
  );
}
