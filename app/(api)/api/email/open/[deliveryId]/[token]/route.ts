import { eq } from "drizzle-orm";
import { db } from "@/db";
import { moduleDeliveries } from "@/db/schema";
import { getDeliveryByToken, recordEngagementEvent } from "@/lib/onboarding/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const transparentPixel = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33,
  249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

function pixelResponse() {
  return new Response(transparentPixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ deliveryId: string; token: string }> },
) {
  const { deliveryId, token } = await context.params;
  const row = await getDeliveryByToken(deliveryId, token);

  if (!row) {
    return pixelResponse();
  }

  const now = new Date();

  await db
    .update(moduleDeliveries)
    .set({
      openedAt: row.delivery.openedAt ?? now,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, row.delivery.id));

  await recordEngagementEvent({
    eventType: "email_opened",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId: row.delivery.id,
    metadata: {
      moduleNumber: row.module.moduleNumber,
    },
  });

  return pixelResponse();
}
