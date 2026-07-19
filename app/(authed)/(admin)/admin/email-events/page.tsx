import Link from "next/link";
import { getEmailEventLogData, formatAdminDate } from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminEmailEventsPage() {
  const rows = await getEmailEventLogData();

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Email event log
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Delivery visibility across welcome, onboarding, and operational email sends.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Recipient</TableHead>
                <TableHead className="text-slate-400">Template</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Linked records</TableHead>
                <TableHead className="text-slate-400">Provider</TableHead>
                <TableHead className="text-slate-400">Time</TableHead>
                <TableHead className="text-slate-400">Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ emailEvent, member, module, delivery, enrollment }) => (
                <TableRow key={emailEvent.id} className="border-white/10 align-top">
                  <TableCell className="whitespace-normal">
                    {member ? (
                      <Link
                        href={`/admin/program-members/${member.id}`}
                        className="font-semibold text-white hover:text-[#00ff9d]"
                      >
                        {member.fullName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-white">{emailEvent.recipientEmail}</span>
                    )}
                    <p className="mt-1 text-xs text-slate-400">{emailEvent.recipientEmail}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-white">
                    {emailEvent.templateKey}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <Badge variant="outline" className="border-white/15 text-cyan-200">
                      {emailEvent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal text-xs leading-6 text-slate-300">
                    <p>Member: {member?.id || "-"}</p>
                    <p>Enrollment: {enrollment?.id || "-"}</p>
                    <p>Delivery: {delivery?.id || "-"}</p>
                    <p>
                      Module:{" "}
                      {module ? `${module.moduleNumber} - ${module.title}` : "-"}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {emailEvent.providerId || "-"}
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {formatAdminDate(emailEvent.sentAt || emailEvent.createdAt)}
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {emailEvent.error || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
