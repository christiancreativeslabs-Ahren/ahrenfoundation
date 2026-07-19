import Link from "next/link";
import { formatAdminDate, getEngagementLogData } from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, TextInput } from "@/components/ui/input-fields";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminEngagementPage({
  searchParams,
}: {
  searchParams: Promise<{
    member?: string;
    module?: string;
    eventType?: string;
    date?: string;
  }>;
}) {
  const [rows, filters] = await Promise.all([getEngagementLogData(), searchParams]);

  const filteredRows = rows.filter(({ event, member, module }) => {
    if (filters.member) {
      const needle = filters.member.toLowerCase();
      const haystack = `${member?.fullName ?? ""} ${member?.email ?? ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (filters.module) {
      const needle = filters.module.toLowerCase();
      const haystack = `${module?.moduleNumber ?? ""} ${module?.title ?? ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (filters.eventType && event.eventType !== filters.eventType) {
      return false;
    }

    if (filters.date) {
      const eventDate = new Date(event.createdAt).toISOString().slice(0, 10);
      if (eventDate !== filters.date) return false;
    }

    return true;
  });

  const eventTypes = Array.from(new Set(rows.map((row) => row.event.eventType))).sort();

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Engagement activity
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Email sent, email opened, email clicked, lesson viewed, assignment started,
            assignment submitted, and admin workflow activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <TextInput
              name="member"
              defaultValue={filters.member ?? ""}
              placeholder="Filter by member"
            />
            <TextInput
              name="module"
              defaultValue={filters.module ?? ""}
              placeholder="Filter by module"
            />
            <Select
              name="eventType"
              defaultValue={filters.eventType ?? ""}
              placeholder="All event types"
              options={[
                { value: "", label: "All event types" },
                ...eventTypes.map((eventType) => ({
                  value: eventType,
                  label: eventType,
                })),
              ]}
            />
            <TextInput
              type="date"
              name="date"
              defaultValue={filters.date ?? ""}
            />
            <Button type="submit" variant="secondary" className="h-10">
              Apply filters
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Event type</TableHead>
                <TableHead className="text-slate-400">Member</TableHead>
                <TableHead className="text-slate-400">Module</TableHead>
                <TableHead className="text-slate-400">Delivery</TableHead>
                <TableHead className="text-slate-400">Metadata</TableHead>
                <TableHead className="text-slate-400">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map(({ event, member, module, delivery }) => (
                <TableRow key={event.id} className="border-white/10 align-top">
                  <TableCell className="whitespace-normal">
                    <Badge variant="outline" className="border-white/15 text-cyan-200">
                      {event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    {member ? (
                      <Link
                        href={`/admin/program-members/${member.id}`}
                        className="font-semibold text-white hover:text-[#00ff9d]"
                      >
                        {member.fullName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-white">-</span>
                    )}
                    <p className="mt-1 text-xs text-slate-400">{member?.email || "-"}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {module ? `Module ${module.moduleNumber}: ${module.title}` : "-"}
                  </TableCell>
                  <TableCell className="whitespace-normal text-xs leading-6 text-slate-300">
                    <p>ID: {delivery?.id || "-"}</p>
                    <p>Status: {delivery?.status || "-"}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <pre className="max-w-[360px] overflow-auto rounded-md border border-white/10 bg-black/20 p-3 text-xs leading-5 text-slate-300">
                      {JSON.stringify(event.metadata ?? {}, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    {formatAdminDate(event.createdAt)}
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
