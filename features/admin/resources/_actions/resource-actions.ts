"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { db } from "@/db";
import { dashboardResources } from "@/db/schema";
// import { requireAdmin } from "@/lib/auth";

export type ResourceActionState = {
  ok: boolean;
  message: string;
};

function extractBlobPathname(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("blob.vercel-storage.com")) return null;
    return parsed.pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

export async function deleteResourceAction(
  resourceId: string,
): Promise<ResourceActionState> {
  // await requireAdmin();

  if (!resourceId) return { ok: false, message: "Missing resource id." };

  try {
    const [row] = await db
      .select({
        id: dashboardResources.id,
        url: dashboardResources.url,
      })
      .from(dashboardResources)
      .where(eq(dashboardResources.id, resourceId))
      .limit(1);

    if (!row) return { ok: false, message: "Resource not found." };

    const pathname = extractBlobPathname(row.url);
    if (pathname) {
      try {
        await del(pathname);
      } catch (err) {
        console.error("Failed to delete blob:", pathname, err);
      }
    }

    await db
      .delete(dashboardResources)
      .where(eq(dashboardResources.id, resourceId));

    revalidatePath("/admin/resources");
    return { ok: true, message: "Resource deleted." };
  } catch (err) {
    console.error("deleteResourceAction failed", err);
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Failed to delete resource.",
    };
  }
}

export async function setResourcePublishedAction(
  resourceId: string,
  isPublished: boolean,
): Promise<ResourceActionState> {
  // await requireAdmin();

  if (!resourceId) return { ok: false, message: "Missing resource id." };

  try {
    const [row] = await db
      .select({ id: dashboardResources.id })
      .from(dashboardResources)
      .where(eq(dashboardResources.id, resourceId))
      .limit(1);

    if (!row) return { ok: false, message: "Resource not found." };

    await db
      .update(dashboardResources)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(dashboardResources.id, resourceId));

    revalidatePath("/admin/resources");
    return {
      ok: true,
      message: isPublished ? "Resource published." : "Resource unpublished.",
    };
  } catch (err) {
    console.error("setResourcePublishedAction failed", err);
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Failed to update visibility.",
    };
  }
}
