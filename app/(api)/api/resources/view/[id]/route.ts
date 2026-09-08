import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { get } from "@vercel/blob";
import { db } from "@/db";
import { dashboardResources } from "@/db/schema";
// import { requireAdmin } from "@/lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  // await requireAdmin();

  const { id } = await context.params;

  const [row] = await db
    .select({
      id: dashboardResources.id,
      url: dashboardResources.url,
      title: dashboardResources.title,
    })
    .from(dashboardResources)
    .where(eq(dashboardResources.id, id))
    .limit(1);

  if (!row?.url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Private blob fetch with token
  const result = await get(row.url, { access: "private" });
  // Depending on @vercel/blob version, you may need:
  // const result = await get(row.url);
  // or fetch(row.url, { headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` } })

  if (!result) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  // Prefer streaming the blob body
  const body =
    "stream" in result && result.stream
      ? result.stream
      : "blob" in result && result.blob
        ? new Response(result.blob as unknown as Blob).body
        : null;

  // Fallback: fetch with token if get() shape differs
  if (!body) {
    const res = await fetch(row.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to load file" },
        { status: 502 },
      );
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(row.title)}.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  return new NextResponse(body as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(row.title)}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
