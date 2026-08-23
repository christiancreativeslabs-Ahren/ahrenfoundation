import Link from "next/link";
import { getBulkEmailCampaignListData } from "@/lib/admin/bulk-email";
import { formatAdminDate } from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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

export default async function AdminBulkEmailPage() {
  const campaigns = await getBulkEmailCampaignListData();

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Bulk email campaigns
              </CardTitle>
              <CardDescription className="max-w-3xl text-slate-300">
                Compose audience-based emails, attach files, schedule sends, and review delivery status from one admin route.
              </CardDescription>
            </div>
            <Link
              href="/admin/bulk-email/compose"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]",
              )}
            >
              New campaign
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardContent className="p-0">
          {campaigns.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-400">Campaign</TableHead>
                  <TableHead className="text-slate-400">Audience</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Recipients</TableHead>
                  <TableHead className="text-slate-400">Timing</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-white/10 align-top">
                    <TableCell className="whitespace-normal">
                      <Link
                        href={`/admin/bulk-email/${campaign.id}`}
                        className="font-semibold text-white hover:text-[#00ff9d]"
                      >
                        {campaign.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-400">{campaign.subject}</p>
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm text-slate-300">
                      {campaign.audienceLabel || campaign.audienceType}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <Badge variant="outline" className="border-white/15 text-cyan-200">
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm text-slate-300">
                      {campaign.recipientCount} total
                    <p className="mt-1 text-xs text-slate-400">
                        Sent {campaign.sentCount} · Failed {campaign.failedCount} · Skipped {campaign.skippedCount}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm text-slate-300">
                      <p>Scheduled: {formatAdminDate(campaign.scheduledFor)}</p>
                      <p className="mt-1">Sent: {formatAdminDate(campaign.sentAt)}</p>
                    </TableCell>
                    <TableCell className="whitespace-normal text-sm">
                      <Link
                        href={`/admin/bulk-email/${campaign.id}`}
                        className="font-medium text-[#00ff9d] hover:underline"
                      >
                        Open campaign
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-sm text-slate-300">
              No campaigns yet. Create the first one to start sending bulk email from the app.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
