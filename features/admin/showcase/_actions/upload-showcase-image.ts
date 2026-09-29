"use server";

import { put } from "@vercel/blob";

export async function uploadShowcaseImageAction(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, message: "No file provided." };
  }

  if (file.size > 4 * 1024 * 1024) {
    return { ok: false as const, message: "File must be 4 MB or smaller." };
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const pathname = `showcase/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });

    return { ok: true as const, url: blob.url };
  } catch (err) {
    console.error("uploadShowcaseImageAction failed", err);
    return {
      ok: false as const,
      message: err instanceof Error ? err.message : "Upload failed.",
    };
  }
}