import "dotenv/config";
import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { showcaseCategories, showcaseSubcategories } from "@/db/schema";

const taxonomy: Array<{
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
  subcategories: Array<{ slug: string; name: string; sortOrder: number }>;
}> = [
  {
    slug: "articles",
    name: "Articles & Write-ups",
    description: "Blog posts, devotionals, and thought pieces",
    sortOrder: 1,
    subcategories: [
      { slug: "devotionals", name: "Devotionals", sortOrder: 1 },
      { slug: "thought-pieces", name: "Thought pieces", sortOrder: 2 },
      { slug: "community-stories", name: "Community stories", sortOrder: 3 },
    ],
  },
  {
    slug: "artworks",
    name: "Artworks & Graphics",
    description: "Digital art, illustrations, and visual creations",
    sortOrder: 2,
    subcategories: [
      { slug: "digital-art", name: "Digital art", sortOrder: 1 },
      { slug: "illustration", name: "Illustration", sortOrder: 2 },
      { slug: "logo-design", name: "Logo design", sortOrder: 3 },
    ],
  },
  {
    slug: "music",
    name: "Songs & Music",
    description: "Original songs, instrumentals, and worship pieces",
    sortOrder: 3,
    subcategories: [
      { slug: "worship", name: "Worship", sortOrder: 1 },
      { slug: "instrumental", name: "Instrumental", sortOrder: 2 },
      { slug: "original-song", name: "Original song", sortOrder: 3 },
    ],
  },
  {
    slug: "videos",
    name: "Videos",
    description: "Short films, reels, testimonies (YouTube)",
    sortOrder: 4,
    subcategories: [
      { slug: "short-film", name: "Short film", sortOrder: 1 },
      { slug: "reel", name: "Reel", sortOrder: 2 },
      { slug: "testimony", name: "Testimony", sortOrder: 3 },
    ],
  },
  {
    slug: "podcasts",
    name: "Podcasts",
    description: "Audio episodes and conversations",
    sortOrder: 5,
    subcategories: [
      { slug: "episode", name: "Episode", sortOrder: 1 },
      { slug: "conversation", name: "Conversation", sortOrder: 2 },
    ],
  },
  {
    slug: "writing",
    name: "Poems & Creative Writing",
    description: "Poetry, short stories, and spoken word",
    sortOrder: 6,
    subcategories: [
      { slug: "poem", name: "Poem", sortOrder: 1 },
      { slug: "short-story", name: "Short story", sortOrder: 2 },
      { slug: "spoken-word", name: "Spoken word", sortOrder: 3 },
    ],
  },
  {
    slug: "design",
    name: "Designs & UI/UX Projects",
    description: "App designs, website mockups, product concepts",
    sortOrder: 7,
    subcategories: [
      { slug: "ui-ux", name: "UI/UX", sortOrder: 1 },
      { slug: "mockup", name: "Mockup", sortOrder: 2 },
      { slug: "product-concept", name: "Product concept", sortOrder: 3 },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    description: "Portraits and visual storytelling",
    sortOrder: 8,
    subcategories: [
      { slug: "portrait", name: "Portrait", sortOrder: 1 },
      { slug: "storytelling", name: "Storytelling", sortOrder: 2 },
      { slug: "event", name: "Event", sortOrder: 3 },
    ],
  },
  {
    slug: "tech",
    name: "Tech Projects & Apps",
    description: "Faith-based apps, tools, and digital solutions",
    sortOrder: 9,
    subcategories: [
      { slug: "app", name: "App", sortOrder: 1 },
      { slug: "tool", name: "Tool", sortOrder: 2 },
      { slug: "digital-solution", name: "Digital solution", sortOrder: 3 },
    ],
  },
  {
    slug: "animations",
    name: "Animations",
    description: "2D and 3D animated content",
    sortOrder: 10,
    subcategories: [
      { slug: "2d", name: "2D", sortOrder: 1 },
      { slug: "3d", name: "3D", sortOrder: 2 },
    ],
  },
] as const;

async function main() {
  for (const category of taxonomy) {
    const [existingCat] = await db
      .select({ id: showcaseCategories.id })
      .from(showcaseCategories)
      .where(eq(showcaseCategories.slug, category.slug))
      .limit(1);

    const categoryId = existingCat?.id ?? createId();

    if (!existingCat) {
      await db.insert(showcaseCategories).values({
        id: categoryId,
        slug: category.slug,
        name: category.name,
        description: category.description ?? null,
        sortOrder: category.sortOrder,
        isActive: true,
      });
      console.log(`+ category ${category.slug}`);
    } else {
      await db
        .update(showcaseCategories)
        .set({
          name: category.name,
          description: category.description ?? null,
          sortOrder: category.sortOrder,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(showcaseCategories.id, categoryId));
      console.log(`~ category ${category.slug}`);
    }

    for (const sub of category.subcategories) {
      const [existingSub] = await db
        .select({ id: showcaseSubcategories.id })
        .from(showcaseSubcategories)
        .where(
          and(
            eq(showcaseSubcategories.categoryId, categoryId),
            eq(showcaseSubcategories.slug, sub.slug),
          ),
        )
        .limit(1);

      if (!existingSub) {
        await db.insert(showcaseSubcategories).values({
          id: createId(),
          categoryId,
          slug: sub.slug,
          name: sub.name,
          sortOrder: sub.sortOrder,
          isActive: true,
        });
        console.log(`  + sub ${category.slug}/${sub.slug}`);
      } else {
        await db
          .update(showcaseSubcategories)
          .set({
            name: sub.name,
            sortOrder: sub.sortOrder,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(showcaseSubcategories.id, existingSub.id));
        console.log(`  ~ sub ${category.slug}/${sub.slug}`);
      }
    }
  }

  console.log("Showcase taxonomy seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
