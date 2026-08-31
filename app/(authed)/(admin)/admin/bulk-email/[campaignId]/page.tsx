import Link from "next/link";
import { revalidatePath } from "next/cache";
import { sendBulkEmailCampaignNow, getBulkEmailCampaignDetail } from "@/lib/admin/bulk-email";
import { formatAdminDate } from "@/lib/admin/member-workflow";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function sendNowAction(formData: FormData) {
  "use server";

  const campaignId = String(formData.get("campaign_id") ?? "").trim();
  if (!campaignId) {
    throw new Error("Campaign id is required.");
  }

  await sendBulkEmailCampaignNow(campaignId, { source: "admin" });
  revalidatePath("/admin/bulk-email");
  revalidatePath(`/admin/bulk-email/${campaignId}`);
  revalidatePath("/admin/email-events");
}

function SummaryCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {note ? <p className="mt-1 text-sm text-slate-400">{note}</p> : null}
    </div>
  );
}

export default async function BulkEmailCampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const detail = await getBulkEmailCampaignDetail(campaignId);

  if (!detail) {
    return (
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Campaign not found</CardTitle>
          <CardDescription className="text-slate-300">
            This campaign may have been removed or the link is invalid.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { campaign, attachments, recipients, statusCounts } = detail;
  const canSend =
    recipients.length > 0 &&
    campaign.status !== "sending" &&
    campaign.status !== "sent";

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Link
                href="/admin/bulk-email"
                className="text-sm font-medium text-[#00ff9d] hover:underline"
              >
                Back to bulk email campaigns
              </Link>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {campaign.title}
              </CardTitle>
              <CardDescription className="max-w-3xl text-slate-300">
                {campaign.subject}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/15 text-cyan-200">
                {campaign.status}
              </Badge>
              {campaign.status !== "sent" ? (
                <Link
                  href={`/admin/bulk-email/compose?campaignId=${campaign.id}`}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
                  )}
                >
                  Edit campaign
                </Link>
              ) : null}
              <form action={sendNowAction}>
                <input type="hidden" name="campaign_id" value={campaign.id} />
                <Button
                  type="submit"
                  disabled={!canSend}
                  className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
                >
                  Send now
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Recipients"
          value={campaign.recipientCount}
          note={`Audience: ${campaign.audienceLabel || campaign.audienceType}`}
        />
        <SummaryCard label="Sent" value={campaign.sentCount} />
        <SummaryCard label="Failed" value={campaign.failedCount} />
        <SummaryCard label="Skipped" value={campaign.skippedCount} />
        <SummaryCard
          label="Timing"
          value={campaign.scheduledFor ? formatAdminDate(campaign.scheduledFor) : "Not scheduled"}
          note={campaign.sentAt ? `Sent ${formatAdminDate(campaign.sentAt)}` : "Draft or queued"}
        />
      </div>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-xl">Campaign body</CardTitle>
          <CardDescription className="text-slate-300">
            This is the exact HTML stored for the campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-invert max-w-none rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            dangerouslySetInnerHTML={{ __html: campaign.bodyHtml }}
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-xl">Attachments</CardTitle>
          <CardDescription className="text-slate-300">
            These files are bundled with the campaign send.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {attachments.length ? (
            attachments.map((attachment) => (
              <Badge key={attachment.id} variant="outline" className="border-white/15 text-white">
                {attachment.filename}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-400">No attachments saved with this campaign.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-xl">Recipient delivery log</CardTitle>
          <CardDescription className="text-slate-300">
            Track the status of every recipient in this campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Recipient</TableHead>
                <TableHead className="text-slate-400">Linked record</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Provider</TableHead>
                <TableHead className="text-slate-400">Sent at</TableHead>
                <TableHead className="text-slate-400">Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map(({ recipient, member, application }) => (
                <TableRow key={recipient.id} className="border-white/10 align-top">
                  <TableCell className="whitespace-normal">
                    <p className="font-semibold text-white">{recipient.recipientName}</p>
                    <p className="mt-1 text-xs text-slate-400">{recipient.recipientEmail}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    <p>
                      Member:{" "}
                      {member ? (
                        <Link
                          href={`/admin/program-members/${member.id}`}
                          className="text-[#00ff9d] hover:underline"
                        >
                          {member.fullName}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </p>
                    <p className="mt-1">
                      Applicant:{" "}
                      {application ? (
                        <Link
                          href={`/admin/join-applications/${application.id}`}
                          className="text-[#00ff9d] hover:underline"
                        >
                          {application.fullName}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <Badge variant="outline" className="border-white/15 text-cyan-200">
                      {recipient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {recipient.providerId || "-"}
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {formatAdminDate(recipient.sentAt)}
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {recipient.error || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-xl">Status summary</CardTitle>
          <CardDescription className="text-slate-300">
            Snapshot of recipient delivery outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Badge key={status} variant="outline" className="border-white/15 text-white">
              {status}: {count}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
