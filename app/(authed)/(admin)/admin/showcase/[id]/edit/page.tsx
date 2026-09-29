import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import {
  showcaseCategories,
  showcaseItems,
  showcaseMedia,
  showcaseSubcategories,
} from "@/db/schema";
import { ShowcaseItemEditor } from "@/features/admin/showcase/_components/showcase-item-editor";
import { ShowcaseMediaManager } from "@/features/admin/showcase/_components/showcase-media-manager";

export const dynamic = "force-dynamic";

export default async function AdminShowcaseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item] = await db
    .select({
      id: showcaseItems.id,
      title: showcaseItems.title,
      slug: showcaseItems.slug,
      summary: showcaseItems.summary,
      bodyHtml: showcaseItems.bodyHtml,
      categoryId: showcaseItems.categoryId,
      subcategoryId: showcaseItems.subcategoryId,
      status: showcaseItems.status,
      creatorName: showcaseItems.creatorName,
      coverImageUrl: showcaseItems.coverImageUrl,
      coverImageCaption: showcaseItems.coverImageCaption,
      isFeatured: showcaseItems.isFeatured,
    })
    .from(showcaseItems)
    .where(eq(showcaseItems.id, id))
    .limit(1);

  if (!item) notFound();

  const categories = await db
    .select({
      id: showcaseCategories.id,
      name: showcaseCategories.name,
      slug: showcaseCategories.slug,
    })
    .from(showcaseCategories)
    .where(eq(showcaseCategories.isActive, true))
    .orderBy(asc(showcaseCategories.sortOrder));

  const subcategories = await db
    .select({
      id: showcaseSubcategories.id,
      name: showcaseSubcategories.name,
      slug: showcaseSubcategories.slug,
      categoryId: showcaseSubcategories.categoryId,
    })
    .from(showcaseSubcategories)
    .where(eq(showcaseSubcategories.isActive, true))
    .orderBy(asc(showcaseSubcategories.sortOrder));

  const media = await db
    .select({
      id: showcaseMedia.id,
      mediaKind: showcaseMedia.mediaKind,
      url: showcaseMedia.url,
      caption: showcaseMedia.caption,
      sortOrder: showcaseMedia.sortOrder,
    })
    .from(showcaseMedia)
    .where(eq(showcaseMedia.itemId, id))
    .orderBy(asc(showcaseMedia.sortOrder));

  const primary = media[0] ?? null;

  const taxonomy = categories.map((category) => ({
    ...category,
    subcategories: subcategories.filter((s) => s.categoryId === category.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/showcase"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <ArrowLeft size={14} />
          Back to Showcase
        </Link>
        {item.status === "published" ? (
          <Link
            href={`/showcase/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[#00c9ff] hover:underline"
          >
            View public page
          </Link>
        ) : null}
      </div>

      <ShowcaseItemEditor
        categories={taxonomy}
        initialItem={{
          id: item.id,
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          bodyHtml: item.bodyHtml,
          categoryId: item.categoryId,
          subcategoryId: item.subcategoryId,
          status: item.status,
          creatorName: item.creatorName,
          coverImageUrl: item.coverImageUrl,
          coverImageCaption: item.coverImageCaption,
          isFeatured: item.isFeatured,
        }}
        initialPrimaryMedia={
          primary
            ? {
                mediaKind: primary.mediaKind,
                url: primary.url,
                caption: primary.caption,
              }
            : null
        }
      />

      <ShowcaseMediaManager itemId={item.id} media={media} />
    </div>
  );
}
