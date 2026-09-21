"use server";

import { uploadBlogImage } from "@/lib/blob/blog-blob";

export async function uploadBlogImageAction(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, message: "No file provided." };
  }

  if (file.size > 4 * 1024 * 1024) {
    return { ok: false as const, message: "Image must be 4 MB or smaller." };
  }

  if (!file.type.startsWith("image/")) {
    return { ok: false as const, message: "Only image files are allowed." };
  }

  try {
    const uploaded = await uploadBlogImage(file);
    return { ok: true as const, url: uploaded.url };
  } catch (err) {
    console.error("uploadBlogImageAction failed", err);
    return {
      ok: false as const,
      message: err instanceof Error ? err.message : "Upload failed.",
    };
  }
}
