import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { db } from "@/db";
import {
  showcaseCategories,
  showcaseItems,
  showcaseMedia,
  showcaseSubcategories,
} from "@/db/schema";
import { BlogShareBar } from "@/components/blog/blog-share-bar"; // reuse share bar

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

function youtubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
    if (u.pathname.startsWith("/embed/")) return url;
  } catch {
    /* ignore */
  }
  return null;
}

async function getPublishedItem(slug: string) {
  const [item] = await db
    .select({
      id: showcaseItems.id,
      title: showcaseItems.title,
      slug: showcaseItems.slug,
      summary: showcaseItems.summary,
      bodyHtml: showcaseItems.bodyHtml,
      coverImageUrl: showcaseItems.coverImageUrl,
      coverImageCaption: showcaseItems.coverImageCaption,
      creatorName: showcaseItems.creatorName,
      publishedAt: showcaseItems.publishedAt,
      categoryName: showcaseCategories.name,
      subcategoryName: showcaseSubcategories.name,
    })
    .from(showcaseItems)
    .innerJoin(
      showcaseCategories,
      eq(showcaseItems.categoryId, showcaseCategories.id),
    )
    .leftJoin(
      showcaseSubcategories,
      eq(showcaseItems.subcategoryId, showcaseSubcategories.id),
    )
    .where(
      and(eq(showcaseItems.slug, slug), eq(showcaseItems.status, "published")),
    )
    .limit(1);

  if (!item) return null;

  const media = await db
    .select({
      id: showcaseMedia.id,
      mediaKind: showcaseMedia.mediaKind,
      url: showcaseMedia.url,
      caption: showcaseMedia.caption,
      sortOrder: showcaseMedia.sortOrder,
    })
    .from(showcaseMedia)
    .where(eq(showcaseMedia.itemId, item.id))
    .orderBy(asc(showcaseMedia.sortOrder));

  return { item, media };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublishedItem(slug);
  if (!data) return { title: "Not found — Ahren Foundation" };

  return {
    title: `${data.item.title} — Showcase — Ahren Foundation`,
    description: data.item.summary || data.item.title,
    openGraph: {
      title: data.item.title,
      description: data.item.summary || data.item.title,
      images: data.item.coverImageUrl
        ? [{ url: data.item.coverImageUrl }]
        : undefined,
    },
  };
}

export default async function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedItem(slug);
  if (!data) notFound();

  const { item, media } = data;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.ahrenfoundation.org"}/showcase/${item.slug}`;

  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="min-h-screen bg-[#080d2e] text-white">
          <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
            <Link
              href="/showcase"
              className="mb-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#8892b0] transition hover:text-white"
              style={{ border: "1px solid rgba(0,201,255,0.15)" }}
            >
              <ArrowLeft size={14} />
              Back to Showcase
            </Link>

            <header className="mb-10 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  {item.categoryName}
                </span>
                {item.subcategoryName ? (
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8892b0]">
                    · {item.subcategoryName}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col">
                <h1
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(32px, 5vw, 52px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.title}
                </h1>
                <p className="text-sm text-[#8892b0] -mt-0.5">
                  {item.creatorName || "Ahren community"}
                  {item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
                </p>
              </div>
              {/* {item.summary ? (
                <p className="text-base leading-relaxed text-[#8892b0]">
                  {item.summary}
                </p>
              ) : null} */}
              <BlogShareBar title={item.title} url={shareUrl} />
            </header>

            {item.coverImageUrl ? (
              <figure
                className="mb-10 overflow-hidden"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(0,201,255,0.1)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImageUrl}
                  alt={item.coverImageCaption || item.title}
                  className="w-full object-cover"
                />
                {item.coverImageCaption ? (
                  <figcaption className="px-5 py-3 text-sm text-[#8892b0]">
                    {item.coverImageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {/* Media embeds */}
            <div className="mb-12 space-y-8">
              {media.map((m) => {
                if (m.mediaKind === "youtube") {
                  const embed = youtubeEmbedUrl(m.url);
                  if (!embed) {
                    return (
                      <a
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00c9ff] underline"
                      >
                        {m.caption || "Watch video"}
                      </a>
                    );
                  }
                  return (
                    <div key={m.id} className="space-y-2">
                      <div
                        className="aspect-video overflow-hidden"
                        style={{ borderRadius: 20 }}
                      >
                        <iframe
                          src={embed}
                          title={m.caption || item.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {m.caption ? (
                        <p className="text-sm text-[#8892b0]">{m.caption}</p>
                      ) : null}
                    </div>
                  );
                }

                if (m.mediaKind === "image") {
                  return (
                    <figure key={m.id} className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.caption || item.title}
                        className="w-full rounded-2xl object-cover"
                      />
                      {m.caption ? (
                        <figcaption className="text-sm text-[#8892b0]">
                          {m.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                }

                if (m.mediaKind === "audio") {
                  return (
                    <div key={m.id} className="space-y-2">
                      <audio controls className="w-full" src={m.url}>
                        Your browser does not support audio.
                      </audio>
                      {m.caption ? (
                        <p className="text-sm text-[#8892b0]">{m.caption}</p>
                      ) : null}
                    </div>
                  );
                }

                // link
                return (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-[#080d2e]"
                    style={{
                      background: "linear-gradient(135deg,#00c9ff,#00ff9d)",
                    }}
                  >
                    {m.caption || "Open link"}
                  </a>
                );
              })}
            </div>

            {item.bodyHtml ? (
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-[#8892b0] prose-p:leading-8 prose-a:text-[#00c9ff] prose-strong:text-white prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
              />
            ) : null}

            <div
              className="mt-16 pt-8"
              style={{ borderTop: "1px solid rgba(0,201,255,0.1)" }}
            >
              <Link
                href="/showcase"
                className="text-sm font-semibold text-[#00c9ff] hover:underline"
              >
                ← More from the Showcase
              </Link>
            </div>
          </article>
        </main>
        <Footer />
      </>
    </PageTransition>
  );
}
