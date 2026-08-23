"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { bulkEmailCampaigns } from "@/db/schema";
import { getAdminEmails } from "@/lib/validations/join";
import {
  createBulkEmailCampaign,
  fileToBulkEmailAttachment,
  parseBulkEmailRecipientsInput,
  resolveBulkEmailRecipients,
  sanitizeBulkEmailHtml,
  scheduleBulkEmailCampaign,
  sendBulkEmailCampaignNow,
  syncBulkEmailAttachments,
  syncBulkEmailRecipients,
  type BulkEmailAudienceType,
} from "@/lib/admin/bulk-email";

type ActionResult = {
  ok: boolean;
  message: string;
  campaignId?: string;
};

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  if (!getAdminEmails().includes(session.user.email)) {
    throw new Error("You do not have admin access.");
  }

  return session.user;
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(input: string) {
  if (!input) return null;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

function firstFile(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File);
}

export async function saveBulkEmailCampaignAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const campaignId = value(formData, "campaign_id") || null;
    const intent = value(formData, "intent") || "draft";
    const title = value(formData, "title");
    const subject = value(formData, "subject");
    const audienceType = value(formData, "audience_type") as BulkEmailAudienceType;
    const audienceLabel = value(formData, "audience_label") || null;
    const bodyHtml = sanitizeBulkEmailHtml(value(formData, "body_html"));
    const replyTo = value(formData, "reply_to") || null;
    const senderLabel = value(formData, "sender_label") || null;
    const scheduledFor = optionalDate(value(formData, "scheduled_for"));
    const customEmails = parseBulkEmailRecipientsInput(value(formData, "custom_emails"));
    const files = firstFile(formData, "attachments").filter((file) => file.size > 0);

    if (!title) {
      return { ok: false, message: "Campaign title is required." };
    }

    if (!subject) {
      return { ok: false, message: "Email subject is required." };
    }

    if (!bodyHtml) {
      return { ok: false, message: "Email body is required." };
    }

    if (!audienceType) {
      return { ok: false, message: "Please choose an audience." };
    }

    if (audienceType === "custom" && !customEmails.length) {
      return { ok: false, message: "Add at least one custom recipient email." };
    }

    if (intent === "schedule") {
      if (!scheduledFor) {
        return { ok: false, message: "Choose a schedule time." };
      }

      if (scheduledFor.getTime() <= Date.now()) {
        return {
          ok: false,
          message: "Schedule time must be in the future.",
        };
      }
    }

    let campaign = campaignId
      ? (
          await db
            .select()
            .from(bulkEmailCampaigns)
            .where(eq(bulkEmailCampaigns.id, campaignId))
            .limit(1)
        )[0] ?? null
      : null;

    if (campaign && !["draft", "scheduled", "failed", "partial"].includes(campaign.status)) {
      return {
        ok: false,
        message: "This campaign is already sending or sent. Create a new draft instead.",
      };
    }

    if (campaignId && !campaign) {
      return {
        ok: false,
        message: "Campaign was not found.",
      };
    }

    if (!campaign) {
      campaign = await createBulkEmailCampaign({
        title,
        subject,
        bodyHtml,
        audienceType,
        audienceLabel,
        scheduledFor: intent === "schedule" ? scheduledFor : null,
        replyTo,
        senderLabel,
        createdByUserId: user.id,
        payload: {
          createdFrom: "admin-compose",
        },
      });
    } else {
      await db
        .update(bulkEmailCampaigns)
        .set({
          title,
          subject,
          bodyHtml,
          audienceType,
          audienceLabel,
          scheduledFor: intent === "schedule" ? scheduledFor : null,
          replyTo,
          senderLabel,
          status: intent === "schedule" ? "scheduled" : "draft",
          updatedAt: new Date(),
        })
        .where(eq(bulkEmailCampaigns.id, campaign.id));
    }

    const recipients = await resolveBulkEmailRecipients({
      audienceType,
      customRecipientEmails: customEmails,
    });

    await syncBulkEmailRecipients(campaign.id, recipients);

    await db
      .update(bulkEmailCampaigns)
      .set({
        recipientCount: recipients.length,
        updatedAt: new Date(),
      })
      .where(eq(bulkEmailCampaigns.id, campaign.id));

    const attachments = await Promise.all(
      files.map((file, index) => fileToBulkEmailAttachment(file, index)),
    );

    if (attachments.length) {
      await syncBulkEmailAttachments(campaign.id, attachments);
    }

    if (intent === "send") {
      const result = await sendBulkEmailCampaignNow(campaign.id, {
        source: "admin",
      });

      revalidatePath("/admin/bulk-email");
      revalidatePath(`/admin/bulk-email/${campaign.id}`);
      revalidatePath("/admin/email-events");
      return {
        ok: true,
        message: `Sent ${result.sentCount} email${result.sentCount === 1 ? "" : "s"}.`,
        campaignId: campaign.id,
      };
    }

    if (intent === "schedule") {
      await scheduleBulkEmailCampaign(campaign.id, scheduledFor!);
    }

    revalidatePath("/admin/bulk-email");
    revalidatePath(`/admin/bulk-email/${campaign.id}`);
    revalidatePath("/admin/email-events");

    return {
      ok: true,
      message:
        intent === "schedule"
          ? "Campaign scheduled."
          : "Campaign saved as draft.",
      campaignId: campaign.id,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Bulk email save failed.",
    };
  }
}
