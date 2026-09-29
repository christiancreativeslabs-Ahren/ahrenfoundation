import Link from "next/link";
import type { Metadata } from "next";
import { asc, desc, eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { db } from "@/db";
import {
  showcaseCategories,
  showcaseItems,
  showcaseSubcategories,
} from "@/db/schema";

export const metadata: Metadata = {
  title: "The Showcase — Ahren Foundation",
  description:
    "Creative work from the community — art, music, video, writing, design, tech, and more.",
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

export default async function ShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const categories = await db
    .select({
      id: showcaseCategories.id,
      slug: showcaseCategories.slug,
      name: showcaseCategories.name,
    })
    .from(showcaseCategories)
    .where(eq(showcaseCategories.isActive, true))
    .orderBy(asc(showcaseCategories.sortOrder));

  const selectedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;

  const items = await db
    .select({
      id: showcaseItems.id,
      title: showcaseItems.title,
      slug: showcaseItems.slug,
      summary: showcaseItems.summary,
      coverImageUrl: showcaseItems.coverImageUrl,
      creatorName: showcaseItems.creatorName,
      publishedAt: showcaseItems.publishedAt,
      isFeatured: showcaseItems.isFeatured,
      categoryName: showcaseCategories.name,
      categorySlug: showcaseCategories.slug,
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
      selectedCategory
        ? eq(showcaseItems.categoryId, selectedCategory.id)
        : eq(showcaseItems.status, "published"),
    )
    .orderBy(desc(showcaseItems.isFeatured), desc(showcaseItems.publishedAt));

  // If filtering by category, still require published
  const publishedItems = selectedCategory
    ? (
        await db
          .select({
            id: showcaseItems.id,
            title: showcaseItems.title,
            slug: showcaseItems.slug,
            summary: showcaseItems.summary,
            coverImageUrl: showcaseItems.coverImageUrl,
            creatorName: showcaseItems.creatorName,
            publishedAt: showcaseItems.publishedAt,
            isFeatured: showcaseItems.isFeatured,
            categoryName: showcaseCategories.name,
            categorySlug: showcaseCategories.slug,
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
          .where(eq(showcaseItems.status, "published"))
          .orderBy(
            desc(showcaseItems.isFeatured),
            desc(showcaseItems.publishedAt),
          )
      ).filter((item) => item.categorySlug === categorySlug)
    : items.filter((item) => true);

  // Simpler: always filter published in SQL — fix query below in clean version
  const list = publishedItems;

  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="min-h-screen bg-[#080d2e] text-white">
          <section className="relative px-6 pb-12 pt-36">
            <div className="mx-auto max-w-6xl space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Community creativity
              </p>
              <h1
                className="font-bold leading-[1.05] text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 7vw, 72px)",
                  letterSpacing: "-0.03em",
                }}
              >
                The Showcase
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#8892b0]">
                Articles, art, music, video, design, photography, tech, and more
                from the Ahren community.
              </p>
            </div>
          </section>

          <section
            className="sticky top-[70px] z-20 border-b px-6 py-4"
            style={{
              background: "rgba(8,13,46,0.92)",
              backdropFilter: "blur(16px)",
              borderColor: "rgba(0,201,255,0.08)",
            }}
          >
            <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
              <Link
                href="/showcase"
                className="rounded-full px-4 py-2 text-xs font-bold transition"
                style={
                  !categorySlug
                    ? {
                        background: "linear-gradient(135deg,#00c9ff,#00ff9d)",
                        color: "#080d2e",
                      }
                    : {
                        background: "rgba(0,201,255,0.08)",
                        border: "1px solid rgba(0,201,255,0.15)",
                        color: "#8892b0",
                      }
                }
              >
                All
              </Link>
              {categories.map((cat) => {
                const active = categorySlug === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/showcase?category=${cat.slug}`}
                    className="rounded-full px-4 py-2 text-xs font-bold transition"
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg,#00c9ff,#00ff9d)",
                            color: "#080d2e",
                          }
                        : {
                            background: "rgba(0,201,255,0.08)",
                            border: "1px solid rgba(0,201,255,0.15)",
                            color: "#8892b0",
                          }
                    }
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="px-6 py-16">
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.length === 0 ? (
                <div
                  className="col-span-full rounded-[28px] px-8 py-16 text-center text-[#8892b0]"
                  style={{
                    border: "1px solid rgba(0,201,255,0.1)",
                    background: "rgba(17,24,80,0.5)",
                  }}
                >
                  No published showcase items yet.
                </div>
              ) : (
                list.map((item) => (
                  <Link
                    key={item.id}
                    href={`/showcase/${item.slug}`}
                    className="group overflow-hidden rounded-[24px] transition hover:-translate-y-1"
                    style={{
                      border: "1px solid rgba(0,201,255,0.12)",
                      background: "rgba(17,24,80,0.45)",
                    }}
                  >
                    {item.coverImageUrl ? (
                      <div className="aspect-[16/10] overflow-hidden border-b border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="space-y-3 p-6">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#00c9ff]"
                          style={{
                            background: "rgba(0,201,255,0.1)",
                            border: "1px solid rgba(0,201,255,0.2)",
                          }}
                        >
                          {item.categoryName}
                        </span>
                        {item.isFeatured ? (
                          <span
                            className="rounded-full px-2.5 py-1 text-[10px] font-bold text-[#00ff9d]"
                            style={{
                              background: "rgba(0,255,157,0.08)",
                              border: "1px solid rgba(0,255,157,0.2)",
                            }}
                          >
                            Featured
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-xl font-bold leading-snug text-white group-hover:text-[#00ff9d]">
                        {item.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-6 text-[#8892b0]">
                        {item.summary || "View work"}
                      </p>
                      <p className="text-xs text-[#8892b0]">
                        {item.creatorName || "Ahren community"}
                        {item.publishedAt
                          ? ` · ${formatDate(item.publishedAt)}`
                          : ""}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </main>
        <Footer />
      </>
    </PageTransition>
  );
}
