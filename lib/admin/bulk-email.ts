import { and, asc, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  bulkEmailCampaignAttachments,
  bulkEmailCampaignRecipients,
  bulkEmailCampaigns,
  emailEvents,
  engagementEvents,
  joinApplications,
  programMembers,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { sanitizeTrainingApplicationHtml } from "@/lib/application-settings.shared";

export type BulkEmailAudienceType =
  | "all_members"
  | "youth_members"
  | "mentor_members"
  | "applicants"
  | "custom";

export type BulkEmailAttachmentInput = {
  filename: string;
  contentType?: string | null;
  contentBase64: string;
  sizeBytes: number;
};

export type BulkEmailRecipientInput = {
  recipientName: string;
  recipientEmail: string;
  programMemberId?: string | null;
  joinApplicationId?: string | null;
  payload?: Record<string, unknown>;
};

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function sanitizeFilename(value: string) {
  return value
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function countByStatus<T extends { status: string }>(rows: T[]) {
  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.status] = (accumulator[row.status] ?? 0) + 1;
    return accumulator;
  }, {});
}

export function sanitizeBulkEmailHtml(input: string) {
  return sanitizeTrainingApplicationHtml(input);
}

export function parseBulkEmailRecipientsInput(input: string) {
  const emails = input
    .split(/[\n,;]/g)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeEmail);

  const seen = new Set<string>();
  return emails.filter((email) => {
    if (!email || seen.has(email)) return false;
    seen.add(email);
    return true;
  });
}

export async function fileToBulkEmailAttachment(
  file: File,
  sortOrder = 0,
): Promise<BulkEmailAttachmentInput> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `Attachment "${file.name}" is too large. The current limit is 5 MB per file.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    filename: sanitizeFilename(file.name || `attachment-${sortOrder + 1}`),
    contentType: file.type || "application/octet-stream",
    contentBase64: buffer.toString("base64"),
    sizeBytes: buffer.byteLength,
  };
}

export async function getBulkEmailCampaignListData() {
  return db
    .select()
    .from(bulkEmailCampaigns)
    .orderBy(desc(bulkEmailCampaigns.createdAt))
    .limit(100);
}

export async function getBulkEmailCampaignDetail(campaignId: string) {
  const [campaign] = await db
    .select()
    .from(bulkEmailCampaigns)
    .where(eq(bulkEmailCampaigns.id, campaignId))
    .limit(1);

  if (!campaign) return null;

  const [attachments, recipients] = await Promise.all([
    db
      .select()
      .from(bulkEmailCampaignAttachments)
      .where(eq(bulkEmailCampaignAttachments.campaignId, campaignId))
      .orderBy(asc(bulkEmailCampaignAttachments.sortOrder)),
    db
      .select({
        recipient: bulkEmailCampaignRecipients,
        member: programMembers,
        application: joinApplications,
      })
      .from(bulkEmailCampaignRecipients)
      .leftJoin(
        programMembers,
        eq(programMembers.id, bulkEmailCampaignRecipients.programMemberId),
      )
      .leftJoin(
        joinApplications,
        eq(joinApplications.id, bulkEmailCampaignRecipients.joinApplicationId),
      )
      .where(eq(bulkEmailCampaignRecipients.campaignId, campaignId))
      .orderBy(asc(bulkEmailCampaignRecipients.createdAt)),
  ]);

  return {
    campaign,
    attachments,
    recipients,
    statusCounts: countByStatus(recipients.map((row) => row.recipient)),
  };
}

export async function getBulkEmailAudiencePreview(
  audienceType: BulkEmailAudienceType,
  customRecipientEmails: string[] = [],
) {
  if (audienceType === "custom") {
    return {
      audienceType,
      count: customRecipientEmails.length,
      samples: customRecipientEmails.slice(0, 10),
    };
  }

  if (audienceType === "applicants") {
    const rows = await db.select().from(joinApplications);
    return {
      audienceType,
      count: rows.length,
      samples: rows.slice(0, 10).map((row) => `${row.fullName} <${row.email}>`),
    };
  }

  const rows = await db.select().from(programMembers);
  const filtered = rows.filter((row) => {
    if (audienceType === "all_members") return true;
    if (audienceType === "youth_members") return row.role === "youth";
    if (audienceType === "mentor_members") return row.role === "mentor";
    return false;
  });

  return {
    audienceType,
    count: filtered.length,
    samples: filtered.slice(0, 10).map((row) => `${row.fullName} <${row.email}>`),
  };
}

export async function resolveBulkEmailRecipients(options: {
  audienceType: BulkEmailAudienceType;
  customRecipientEmails?: string[];
}) {
  const { audienceType, customRecipientEmails = [] } = options;

  if (audienceType === "custom") {
    const rows = customRecipientEmails.map((email, index) => ({
      recipientName: email,
      recipientEmail: normalizeEmail(email),
      payload: {
        source: "custom",
        sortOrder: index,
      },
    }));

    const seen = new Set<string>();
    return rows.filter((row) => {
      if (seen.has(row.recipientEmail)) return false;
      seen.add(row.recipientEmail);
      return Boolean(row.recipientEmail);
    });
  }

  if (audienceType === "applicants") {
    const rows = await db.select().from(joinApplications);
    return rows.map((row) => ({
      recipientName: row.fullName,
      recipientEmail: normalizeEmail(row.email),
      joinApplicationId: row.id,
      payload: {
        source: "join_application",
        applicationType: row.applicationType,
        applicationStatus: row.status,
      },
    }));
  }

  const rows = await db.select().from(programMembers);
  const filtered = rows.filter((row) => {
    if (audienceType === "all_members") return true;
    if (audienceType === "youth_members") return row.role === "youth";
    if (audienceType === "mentor_members") return row.role === "mentor";
    return false;
  });

  return filtered.map((row) => ({
    recipientName: row.fullName,
    recipientEmail: normalizeEmail(row.email),
    programMemberId: row.id,
    payload: {
      source: "program_member",
      role: row.role,
      memberStatus: row.status,
    },
  }));
}

export async function syncBulkEmailRecipients(
  campaignId: string,
  recipients: BulkEmailRecipientInput[],
) {
  await db
    .delete(bulkEmailCampaignRecipients)
    .where(eq(bulkEmailCampaignRecipients.campaignId, campaignId));

  if (!recipients.length) {
    return [];
  }

  return db
    .insert(bulkEmailCampaignRecipients)
    .values(
      recipients.map((recipient, index) => ({
        campaignId,
        programMemberId: recipient.programMemberId ?? null,
        joinApplicationId: recipient.joinApplicationId ?? null,
        recipientName: recipient.recipientName,
        recipientEmail: recipient.recipientEmail,
        status: "pending",
        payload: {
          ...(recipient.payload ?? {}),
          sortOrder: index,
        },
      })),
    )
    .returning();
}

export async function syncBulkEmailAttachments(
  campaignId: string,
  attachments: BulkEmailAttachmentInput[],
) {
  await db
    .delete(bulkEmailCampaignAttachments)
    .where(eq(bulkEmailCampaignAttachments.campaignId, campaignId));

  if (!attachments.length) {
    return [];
  }

  return db
    .insert(bulkEmailCampaignAttachments)
    .values(
      attachments.map((attachment, index) => ({
        campaignId,
        filename: attachment.filename,
        contentType: attachment.contentType ?? null,
        contentBase64: attachment.contentBase64,
        sizeBytes: attachment.sizeBytes,
        sortOrder: index,
        payload: {
          uploadedAt: new Date().toISOString(),
        },
      })),
    )
    .returning();
}

export function attachmentsToEmailPayload(
  attachments: Array<{
    filename: string;
    contentBase64: string;
    contentType: string | null;
  }>,
) {
  return attachments.map((attachment) => ({
    filename: attachment.filename,
    content: attachment.contentBase64,
    contentType: attachment.contentType ?? "application/octet-stream",
  }));
}

export async function sendBulkEmailCampaignNow(
  campaignId: string,
  options: { source?: "admin" | "cron" } = {},
) {
  const [campaign] = await db
    .select()
    .from(bulkEmailCampaigns)
    .where(eq(bulkEmailCampaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw new Error("Bulk email campaign was not found.");
  }

  const [attachments, recipients] = await Promise.all([
    db
      .select()
      .from(bulkEmailCampaignAttachments)
      .where(eq(bulkEmailCampaignAttachments.campaignId, campaignId))
      .orderBy(asc(bulkEmailCampaignAttachments.sortOrder)),
    db
      .select()
      .from(bulkEmailCampaignRecipients)
      .where(eq(bulkEmailCampaignRecipients.campaignId, campaignId))
      .orderBy(asc(bulkEmailCampaignRecipients.createdAt)),
  ]);

  if (!recipients.length) {
    throw new Error("This campaign has no recipients.");
  }

  const messagePayload = {
    to: recipients.map((recipient) => recipient.recipientEmail),
    subject: campaign.subject,
    html: campaign.bodyHtml,
    templateKey: "bulk-email-campaign",
    replyTo: campaign.replyTo ?? undefined,
    attachments: attachmentsToEmailPayload(attachments),
  };

  const now = new Date();
  await db
    .update(bulkEmailCampaigns)
    .set({
      status: "sending",
      updatedAt: now,
    })
    .where(eq(bulkEmailCampaigns.id, campaignId));

  let sentCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        ...messagePayload,
        to: recipient.recipientEmail,
      });

      if (result.sent) {
        sentCount += 1;
      } else {
        skippedCount += 1;
      }

      await db
        .update(bulkEmailCampaignRecipients)
        .set({
          status: result.sent ? "sent" : "skipped",
          sentAt: result.sent ? new Date() : null,
          providerId: result.providerId ?? null,
          error: null,
          updatedAt: new Date(),
        })
        .where(eq(bulkEmailCampaignRecipients.id, recipient.id));

      const [emailEvent] = await db
        .insert(emailEvents)
        .values({
          bulkEmailCampaignId: campaign.id,
          recipientEmail: recipient.recipientEmail,
          templateKey: messagePayload.templateKey,
          status: result.sent ? "sent" : "skipped",
          providerId: result.providerId,
          sentAt: result.sent ? new Date() : null,
          payload: {
            subject: campaign.subject,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          audienceType: campaign.audienceType,
          senderLabel: campaign.senderLabel,
          source: options.source ?? "admin",
        },
      })
        .returning({ id: emailEvents.id });

      await db.insert(engagementEvents).values({
        eventType: result.sent ? "email_sent" : "email_skipped",
        metadata: {
          bulkEmailCampaignId: campaign.id,
          emailEventId: emailEvent?.id,
          recipientEmail: recipient.recipientEmail,
          source: options.source ?? "admin",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Bulk email send failed.";
      failedCount += 1;

      await db
        .update(bulkEmailCampaignRecipients)
        .set({
          status: "failed",
          error: message,
          updatedAt: new Date(),
        })
        .where(eq(bulkEmailCampaignRecipients.id, recipient.id));

      await db.insert(emailEvents).values({
        bulkEmailCampaignId: campaign.id,
        recipientEmail: recipient.recipientEmail,
        templateKey: messagePayload.templateKey,
        status: "failed",
        error: message,
        sentAt: null,
        payload: {
          subject: campaign.subject,
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          audienceType: campaign.audienceType,
          senderLabel: campaign.senderLabel,
          source: options.source ?? "admin",
        },
      });

      await db.insert(engagementEvents).values({
        eventType: "email_failed",
        metadata: {
          bulkEmailCampaignId: campaign.id,
          recipientEmail: recipient.recipientEmail,
          error: message,
          source: options.source ?? "admin",
        },
      });
    }
  }

  const status =
    failedCount > 0
      ? sentCount > 0 || skippedCount > 0
        ? "partial"
        : "failed"
      : skippedCount > 0 && sentCount === 0
        ? "skipped"
        : skippedCount > 0
          ? "partial"
          : "sent";

  await db
    .update(bulkEmailCampaigns)
    .set({
      status,
      sentAt: sentCount > 0 ? now : null,
      sentCount,
      failedCount,
      skippedCount,
      recipientCount: recipients.length,
      updatedAt: now,
    })
    .where(eq(bulkEmailCampaigns.id, campaignId));

  return {
    campaignId,
    status,
    sentCount,
    failedCount,
    recipientCount: recipients.length,
  };
}

export async function scheduleBulkEmailCampaign(
  campaignId: string,
  scheduledFor: Date,
) {
  const [campaign] = await db
    .select()
    .from(bulkEmailCampaigns)
    .where(eq(bulkEmailCampaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw new Error("Bulk email campaign was not found.");
  }

  const recipientCount = await db
    .select({ id: bulkEmailCampaignRecipients.id })
    .from(bulkEmailCampaignRecipients)
    .where(eq(bulkEmailCampaignRecipients.campaignId, campaignId));

  await db
    .update(bulkEmailCampaigns)
    .set({
      status: "scheduled",
      scheduledFor,
      recipientCount: recipientCount.length,
      updatedAt: new Date(),
    })
    .where(eq(bulkEmailCampaigns.id, campaignId));

  return {
    campaignId,
    scheduledFor,
    recipientCount: recipientCount.length,
  };
}

export async function getDueBulkEmailCampaigns(limit = 25) {
  return db
    .select()
    .from(bulkEmailCampaigns)
    .where(
      and(
        eq(bulkEmailCampaigns.status, "scheduled"),
        lte(bulkEmailCampaigns.scheduledFor, new Date()),
      ),
    )
    .orderBy(asc(bulkEmailCampaigns.scheduledFor))
    .limit(limit);
}

export async function processDueBulkEmailCampaigns() {
  const campaigns = await getDueBulkEmailCampaigns();
  const results: Array<{
    campaignId: string;
    status: string;
    sentCount?: number;
    failedCount?: number;
    error?: string;
  }> = [];

  for (const campaign of campaigns) {
    try {
      const result = await sendBulkEmailCampaignNow(campaign.id, {
        source: "cron",
      });
      results.push(result);
    } catch (error) {
      results.push({
        campaignId: campaign.id,
        status: "failed",
        error: error instanceof Error ? error.message : "Bulk email failed.",
      });
    }
  }

  return results;
}

export async function createBulkEmailCampaign(
  input: {
    title: string;
    subject: string;
    bodyHtml: string;
    audienceType: BulkEmailAudienceType;
    audienceLabel?: string | null;
    scheduledFor?: Date | null;
    senderLabel?: string | null;
    replyTo?: string | null;
    payload?: Record<string, unknown>;
    createdByUserId?: string | null;
  },
) {
  const [campaign] = await db
    .insert(bulkEmailCampaigns)
    .values({
      title: input.title,
      subject: input.subject,
      bodyHtml: input.bodyHtml,
      status: input.scheduledFor ? "scheduled" : "draft",
      audienceType: input.audienceType,
      audienceLabel: input.audienceLabel ?? null,
      scheduledFor: input.scheduledFor ?? null,
      senderLabel: input.senderLabel ?? null,
      replyTo: input.replyTo ?? null,
      createdByUserId: input.createdByUserId ?? null,
      payload: input.payload,
    })
    .returning();

  return campaign;
}
