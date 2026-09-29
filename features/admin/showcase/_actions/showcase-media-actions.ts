"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { showcaseMedia } from "@/db/schema";

const MEDIA_KINDS = ["image", "audio", "youtube", "link"] as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function addShowcaseMediaAction(formData: FormData) {
  const itemId = getString(formData, "item_id");
  const mediaKind = getString(formData, "media_kind");
  const caption = getString(formData, "caption") || null;
  const sortOrderRaw = getString(formData, "sort_order");
  const sortOrder = Number.parseInt(sortOrderRaw || "0", 10) || 0;
  let url = getString(formData, "url");
  const file = formData.get("file");

  if (!itemId) return { ok: false as const, message: "Missing item." };
  if (!MEDIA_KINDS.includes(mediaKind as (typeof MEDIA_KINDS)[number])) {
    return { ok: false as const, message: "Invalid media kind." };
  }

  try {
    if (
      (mediaKind === "image" || mediaKind === "audio") &&
      file instanceof File &&
      file.size > 0
    ) {
      if (file.size > 8 * 1024 * 1024) {
        return { ok: false as const, message: "File must be 8 MB or smaller." };
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const pathname = `showcase/${itemId}/${Date.now()}-${safeName}`;

      const blob = await put(pathname, file, {
        access: "public",
        token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
        contentType: file.type || undefined,
      });

      url = blob.url;
    }

    if (!url) {
      return { ok: false as const, message: "Provide a URL or file." };
    }

    await db.insert(showcaseMedia).values({
      itemId,
      mediaKind,
      url,
      caption,
      sortOrder,
    });

    revalidatePath(`/admin/showcase/${itemId}/edit`);
    revalidatePath("/admin/showcase");
    revalidatePath("/showcase");

    return { ok: true as const, message: "Media added." };
  } catch (err) {
    console.error("addShowcaseMediaAction failed", err);
    return {
      ok: false as const,
      message: err instanceof Error ? err.message : "Failed to add media.",
    };
  }
}

export async function deleteShowcaseMediaAction(formData: FormData) {
  const itemId = getString(formData, "item_id");
  const mediaId = getString(formData, "media_id");

  if (!itemId || !mediaId) {
    return { ok: false as const, message: "Missing ids." };
  }

  try {
    await db
      .delete(showcaseMedia)
      .where(
        and(eq(showcaseMedia.id, mediaId), eq(showcaseMedia.itemId, itemId)),
      );

    revalidatePath(`/admin/showcase/${itemId}/edit`);
    revalidatePath("/admin/showcase");
    revalidatePath("/showcase");

    return { ok: true as const, message: "Media removed." };
  } catch (err) {
    console.error("deleteShowcaseMediaAction failed", err);
    return {
      ok: false as const,
      message: err instanceof Error ? err.message : "Failed to delete media.",
    };
  }
}