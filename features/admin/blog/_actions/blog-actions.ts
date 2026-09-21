"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
// import { requireAdmin } from "@/lib/auth";

export type BlogActionState = {
  ok: boolean;
  message: string;
  postId?: string;
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

export async function saveBlogPostAction(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  // await requireAdmin();

  try {
    const postId = getString(formData, "post_id") || null;
    const title = getString(formData, "title");
    const excerpt = getString(formData, "excerpt") || null;
    const contentHtml = getString(formData, "content_html") || "";
    const coverImageUrl = getString(formData, "cover_image_url") || null;
    const coverImageCaption =
      getString(formData, "cover_image_caption") || null;
    const authorName = getString(formData, "author_name") || null;
    const status = getString(formData, "status") || "draft";
    let slug = getString(formData, "slug") || slugify(title);

    if (!title) return { ok: false, message: "Title is required." };
    if (!slug) return { ok: false, message: "Slug is required." };
    if (!["draft", "published", "archived"].includes(status)) {
      return { ok: false, message: "Invalid status." };
    }

    // unique slug (exclude self on edit)
    const [existingSlug] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (existingSlug && existingSlug.id !== postId) {
      slug = `${slug}-${createId().slice(0, 6)}`;
    }

    const publishedAt = status === "published" ? new Date() : null;

    if (postId) {
      await db
        .update(blogPosts)
        .set({
          title,
          slug,
          excerpt,
          contentHtml,
          coverImageUrl,
          coverImageCaption,
          authorName,
          status,
          publishedAt:
            status === "published"
              ? // keep existing publish date if already published — simplify: always set now on publish
                publishedAt
              : null,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, postId));

      revalidatePath("/admin/blog");
      revalidatePath(`/admin/blog/${postId}/edit`);
      return { ok: true, message: "Post saved.", postId };
    }

    const [row] = await db
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt,
        contentHtml,
        coverImageUrl,
        coverImageCaption,
        authorName,
        status,
        publishedAt,
      })
      .returning({ id: blogPosts.id });

    revalidatePath("/admin/blog");
    return { ok: true, message: "Post created.", postId: row.id };
  } catch (err) {
    console.error("saveBlogPostAction failed", err);
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Failed to save post.",
    };
  }
}
