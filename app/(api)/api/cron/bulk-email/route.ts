import { NextResponse } from "next/server";
import { processDueBulkEmailCampaigns } from "@/lib/admin/bulk-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await processDueBulkEmailCampaigns();

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}
