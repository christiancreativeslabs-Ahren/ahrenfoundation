import Link from "next/link";
import { getBulkEmailAudiencePreview, getBulkEmailCampaignDetail } from "@/lib/admin/bulk-email";
import { BulkEmailComposer } from "@/components/admin/bulk-email-composer";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function buildAudiencePreview(detail: Awaited<ReturnType<typeof getBulkEmailCampaignDetail>>) {
  if (!detail) return null;

  const customEmails = detail.recipients
    .filter((row) => !row.recipient.programMemberId && !row.recipient.joinApplicationId)
    .map((row) => row.recipient.recipientEmail);

  if (detail.campaign.audienceType === "custom") {
    return {
      audienceType: detail.campaign.audienceType,
      count: customEmails.length,
      samples: customEmails.slice(0, 10),
    };
  }

  return getBulkEmailAudiencePreview(
    detail.campaign.audienceType as Parameters<typeof getBulkEmailAudiencePreview>[0],
    customEmails,
  );
}

export default async function BulkEmailComposePage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const params = await searchParams;
  const campaignId = params.campaignId;
  const detail = campaignId ? await getBulkEmailCampaignDetail(campaignId) : null;
  const audiencePreview = detail ? await buildAudiencePreview(detail) : null;

  if (campaignId && !detail) {
    return (
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardContent className="space-y-4 p-6">
          <p className="text-lg font-semibold">Campaign not found</p>
          <Link
            href="/admin/bulk-email"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/15 bg-transparent text-white hover:bg-white/10",
            )}
          >
            Back to campaigns
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <BulkEmailComposer
      initialCampaign={detail?.campaign ?? null}
      initialAttachmentNames={detail?.attachments.map((attachment) => attachment.filename) ?? []}
      recipientCount={detail?.campaign.recipientCount ?? detail?.recipients.length ?? 0}
      statusSummary={detail?.statusCounts ?? {}}
      audiencePreview={audiencePreview ?? undefined}
    />
  );
}
