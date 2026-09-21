import { put, del } from "@vercel/blob";

const PREFIX = "blog";

function publicBlobToken() {
  const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("PUBLIC_BLOB_READ_WRITE_TOKEN is not set.");
  }
  return token;
}

export async function uploadBlogImage(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${PREFIX}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: publicBlobToken(),
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

export async function deleteBlogBlob(pathname: string | null | undefined) {
  if (!pathname) return;
  try {
    await del(pathname, { token: publicBlobToken() });
  } catch (err) {
    console.error("Failed to delete blog blob:", pathname, err);
  }
}
