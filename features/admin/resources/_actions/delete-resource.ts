"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { dashboardResources } from "@/db/schema";
import { deleteResourceBlob } from "@/lib/blob/resource-blob";
// import { requireAdmin } from "@/lib/auth";

export async function deleteResource(resourceId: string) {
  // await requireAdmin();

  if (!resourceId) throw new Error("Missing resource id");

  const [row] = await db
    .select({
      id: dashboardResources.id,
      blobPathname: dashboardResources.blobPathname,
    })
    .from(dashboardResources)
    .where(eq(dashboardResources.id, resourceId))
    .limit(1);

  if (!row) throw new Error("Resource not found");

  await deleteResourceBlob(row.blobPathname);

  await db
    .delete(dashboardResources)
    .where(eq(dashboardResources.id, resourceId));

  revalidatePath("/admin/resources");
}
