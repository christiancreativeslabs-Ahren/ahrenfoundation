"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { showcaseItems, showcaseMedia } from "@/db/schema";

export type ShowcaseActionState = {
  ok: boolean;
  message: string;
  itemId?: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function upsertPrimaryMedia(input: {
  itemId: string;
  mediaKind: string | null;
  url: string | null;
  caption: string | null;
}) {
  const { itemId, mediaKind, url, caption } = input;

  if (!mediaKind || !url) return;
  if (!["image", "audio", "youtube", "link"].includes(mediaKind)) return;

  const [existing] = await db
    .select({ id: showcaseMedia.id })
    .from(showcaseMedia)
    .where(eq(showcaseMedia.itemId, itemId))
    .limit(1);

  if (existing) {
    await db
      .update(showcaseMedia)
      .set({
        mediaKind,
        url,
        caption,
        sortOrder: 0,
        updatedAt: new Date(),
      })
      .where(eq(showcaseMedia.id, existing.id));
    return;
  }

  await db.insert(showcaseMedia).values({
    itemId,
    mediaKind,
    url,
    caption,
    sortOrder: 0,
  });
}

export async function saveShowcaseItemAction(
  _prev: ShowcaseActionState,
  formData: FormData,
): Promise<ShowcaseActionState> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const itemId = getString(formData, "item_id") || null;
    const title = getString(formData, "title");
    const summary = getString(formData, "summary") || null;
    const bodyHtml = getString(formData, "body_html") || "";
    const categoryId = getString(formData, "category_id");
    const subcategoryId = getString(formData, "subcategory_id") || null;
    const status = getString(formData, "status") || "draft";
    const creatorName = getString(formData, "creator_name") || null;
    const coverImageUrl = getString(formData, "cover_image_url") || null;
    const coverImageCaption =
      getString(formData, "cover_image_caption") || null;
    const isFeatured = formData.get("is_featured") === "true";
    let slug = getString(formData, "slug") || slugify(title);
    const primaryMediaKind = getString(formData, "primary_media_kind") || null;
    const primaryMediaUrl = getString(formData, "primary_media_url") || null;
    const primaryMediaCaption =
      getString(formData, "primary_media_caption") || null;

    if (!title) return { ok: false, message: "Title is required." };
    if (!slug) return { ok: false, message: "Slug is required." };
    if (!categoryId) return { ok: false, message: "Category is required." };
    if (!["draft", "review", "published"].includes(status)) {
      return { ok: false, message: "Invalid status." };
    }

    const [existingSlug] = await db
      .select({ id: showcaseItems.id })
      .from(showcaseItems)
      .where(eq(showcaseItems.slug, slug))
      .limit(1);

    if (existingSlug && existingSlug.id !== itemId) {
      slug = `${slug}-${createId().slice(0, 6)}`;
    }

    const publishedAt = status === "published" ? new Date() : null;

    if (itemId) {
      await db
        .update(showcaseItems)
        .set({
          title,
          slug,
          summary,
          bodyHtml,
          categoryId,
          subcategoryId,
          status,
          publishedAt,
          coverImageUrl,
          coverImageCaption,
          creatorName,
          isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(showcaseItems.id, itemId));

      await upsertPrimaryMedia({
        itemId,
        mediaKind: primaryMediaKind,
        url: primaryMediaUrl,
        caption: primaryMediaCaption,
      });

      revalidatePath("/admin/showcase");
      revalidatePath(`/admin/showcase/${itemId}/edit`);
      revalidatePath("/showcase");
      revalidatePath(`/showcase/${slug}`);

      return { ok: true, message: "Showcase item saved.", itemId };
    }

    const [row] = await db
      .insert(showcaseItems)
      .values({
        title,
        slug,
        summary,
        bodyHtml,
        categoryId,
        subcategoryId,
        status,
        publishedAt,
        coverImageUrl,
        coverImageCaption,
        creatorName,
        isFeatured,
        createdByUserId: session?.user?.id ?? null,
      })
      .returning({ id: showcaseItems.id });

    await upsertPrimaryMedia({
      itemId: row.id,
      mediaKind: primaryMediaKind,
      url: primaryMediaUrl,
      caption: primaryMediaCaption,
    });

    revalidatePath("/admin/showcase");
    revalidatePath("/showcase");
    revalidatePath(`/showcase/${slug}`);

    return {
      ok: true,
      message: "Showcase item created.",
      itemId: row.id,
    };
  } catch (err) {
    console.error("saveShowcaseItemAction failed", err);
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Failed to save showcase item.",
    };
  }
}
