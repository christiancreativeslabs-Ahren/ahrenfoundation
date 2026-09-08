import { put, del } from "@vercel/blob";

const PREFIX = "resources";

export async function uploadResourceFile(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${PREFIX}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
    size: file.size,
    fileName: file.name,
  };
}

export async function deleteResourceBlob(pathname: string | null | undefined) {
  if (!pathname) return;
  try {
    await del(pathname);
  } catch (err) {
    // Log but don't fail the whole delete if the blob is already gone
    console.error("Failed to delete blob:", pathname, err);
  }
}
