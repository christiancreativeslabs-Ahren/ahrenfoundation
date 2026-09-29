import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { showcaseCategories, showcaseSubcategories } from "@/db/schema";
import { ShowcaseItemEditor } from "@/features/admin/showcase/_components/showcase-item-editor";

export const dynamic = "force-dynamic";

export default async function AdminShowcaseNewPage() {
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

  const taxonomy = categories.map((category) => ({
    ...category,
    subcategories: subcategories.filter(
      (sub) => sub.categoryId === category.id,
    ),
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/admin/showcase"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
      >
        <ArrowLeft size={14} />
        Back to Showcase
      </Link>

      <ShowcaseItemEditor categories={taxonomy} />
    </div>
  );
}
