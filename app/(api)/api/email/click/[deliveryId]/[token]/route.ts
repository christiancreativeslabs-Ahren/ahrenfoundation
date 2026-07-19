import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { moduleDeliveries } from "@/db/schema";
import {
  buildLessonUrl,
  getDeliveryByToken,
  getAppBaseUrl,
  recordEngagementEvent,
} from "@/lib/onboarding/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ deliveryId: string; token: string }> },
) {
  const { deliveryId, token } = await context.params;
  const row = await getDeliveryByToken(deliveryId, token);

  if (!row) {
    return NextResponse.redirect(`${getAppBaseUrl()}/join`);
  }

  const now = new Date();

  await db
    .update(moduleDeliveries)
    .set({
      clickedAt: row.delivery.clickedAt ?? now,
      assignmentStartedAt: row.delivery.assignmentStartedAt ?? now,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, row.delivery.id));

  await recordEngagementEvent({
    eventType: "email_clicked",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId: row.delivery.id,
    metadata: {
      moduleNumber: row.module.moduleNumber,
    },
  });

  if (!row.delivery.assignmentStartedAt) {
    await recordEngagementEvent({
      eventType: "assignment_started",
      programMemberId: row.member.id,
      enrollmentId: row.enrollment.id,
      moduleId: row.module.id,
      deliveryId: row.delivery.id,
      metadata: {
        moduleNumber: row.module.moduleNumber,
        source: "email_click",
      },
    });
  }

  return NextResponse.redirect(buildLessonUrl(row.delivery.id, row.delivery.accessToken));
}
