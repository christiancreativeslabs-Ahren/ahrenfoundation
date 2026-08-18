import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { trainingApplicationSettings } from "@/db/schema";
import {
  normalizeTrainingApplicationSettings,
  type TrainingApplicationSettings,
  type TrainingApplicationSettingsRecord,
  TRAINING_APPLICATION_SETTINGS_KEY,
} from "./application-settings.shared";

export async function getTrainingApplicationSettings(): Promise<TrainingApplicationSettingsRecord> {
  const [row] = await db
    .select()
    .from(trainingApplicationSettings)
    .where(eq(trainingApplicationSettings.key, TRAINING_APPLICATION_SETTINGS_KEY))
    .orderBy(desc(trainingApplicationSettings.updatedAt))
    .limit(1);

  const normalized = normalizeTrainingApplicationSettings(
    row
      ? {
          applicationsOpenAt: row.applicationsOpenAt
            ? row.applicationsOpenAt.toISOString()
            : null,
          applicationsCloseAt: row.applicationsCloseAt
            ? row.applicationsCloseAt.toISOString()
            : null,
          forceClosed: row.forceClosed,
          closedTitle: row.closedTitle,
          closedMessageHtml: row.closedMessageHtml,
        }
      : null,
  );

  return {
    ...normalized,
    updatedAt: row?.updatedAt ?? null,
    createdAt: row?.createdAt ?? null,
  };
}

export async function upsertTrainingApplicationSettings(
  settings: TrainingApplicationSettings,
) {
  const payload = normalizeTrainingApplicationSettings(settings);
  const applicationsOpenAt = payload.applicationsOpenAt
    ? new Date(payload.applicationsOpenAt)
    : null;
  const applicationsCloseAt = payload.applicationsCloseAt
    ? new Date(payload.applicationsCloseAt)
    : null;

  const [row] = await db
    .insert(trainingApplicationSettings)
    .values({
      key: TRAINING_APPLICATION_SETTINGS_KEY,
      applicationsOpenAt,
      applicationsCloseAt,
      forceClosed: payload.forceClosed,
      closedTitle: payload.closedTitle,
      closedMessageHtml: payload.closedMessageHtml,
    })
    .onConflictDoUpdate({
      target: trainingApplicationSettings.key,
      set: {
        applicationsOpenAt,
        applicationsCloseAt,
        forceClosed: payload.forceClosed,
        closedTitle: payload.closedTitle,
        closedMessageHtml: payload.closedMessageHtml,
        updatedAt: new Date(),
      },
    })
    .returning();

  return {
    ...payload,
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
  };
}
