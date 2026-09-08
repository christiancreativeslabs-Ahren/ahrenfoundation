"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { dashboardResources } from "@/db/schema";
import { sql } from "drizzle-orm";
// import { requireAdmin } from "@/lib/auth";

type ActionState = {
  ok: boolean;
  message: string;
};

export type CreateResourceActionState = {
  ok: boolean;
  message: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createResourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // await requireAdmin();

  try {
    const title = getString(formData, "title");
    const summary = getString(formData, "summary") || null;
    const audience = getString(formData, "audience") as
      | "all"
      | "youth"
      | "mentor";
    const category = getString(formData, "category");
    const externalUrl = getString(formData, "external_url");
    const isPublished = formData.get("is_published") === "true";
    const file = formData.get("file");

    if (!title) return { ok: false, message: "Title is required." };
    if (!category) return { ok: false, message: "Category is required." };
    if (!["all", "youth", "mentor"].includes(audience)) {
      return { ok: false, message: "Invalid audience." };
    }

    // Duplicate title check (case-sensitive exact match)

    const [existing] = await db
      .select({ id: dashboardResources.id })
      .from(dashboardResources)
      .where(sql`lower(${dashboardResources.title}) = ${title.toLowerCase()}`)
      .limit(1);

    if (existing) {
      return {
        ok: false,
        message: "A resource with this title already exists.",
      };
    }

    let url: string | null = externalUrl || null;

    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      return { ok: false, message: "File must be 5 MB or smaller." };
    }

    if (file instanceof File && file.size > 0) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const pathname = `resources/${Date.now()}-${safeName}`;

      const blob = await put(pathname, file, {
        access: "private",
        addRandomSuffix: false,
        contentType: file.type || undefined,
      });

      url = blob.url;
    }

    if (!url) {
      return { ok: false, message: "Provide a file or an external URL." };
    }

    await db.insert(dashboardResources).values({
      title,
      summary,
      audience,
      category,
      isPublished,
      url,
    });

    revalidatePath("/admin/resources");

    return { ok: true, message: "Resource created." };
  } catch (err) {
    console.error("createResourceAction failed", err);
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Failed to create resource.",
    };
  }
}
