import { and, eq, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  moduleDeliveries,
  programModules,
} from "@/db/schema";
import {
  sendModuleDeliveryNow,
} from "@/lib/onboarding/service";

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

  const dueDeliveries = await db
    .select({
      delivery: moduleDeliveries,
      module: programModules,
    })
    .from(moduleDeliveries)
    .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
    .where(
      and(
        eq(moduleDeliveries.status, "scheduled"),
        lte(moduleDeliveries.scheduledFor, new Date()),
      ),
    )
    .limit(50);

  const results: Array<{
    deliveryId: string;
    moduleNumber: number;
    status: string;
    error?: string;
  }> = [];

  for (const item of dueDeliveries) {
    try {
      const result = await sendModuleDeliveryNow(item.delivery.id, {
        source: "cron",
      });
      results.push({
        deliveryId: item.delivery.id,
        moduleNumber: item.module.moduleNumber,
        status: result.status,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Module delivery failed.";

      results.push({
        deliveryId: item.delivery.id,
        moduleNumber: item.module.moduleNumber,
        status: "failed",
        error: message,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}
