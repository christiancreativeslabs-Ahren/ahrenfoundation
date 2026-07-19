import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import {
  cancelModuleDeliveryAction,
  resendModuleDelivery,
  rescheduleModuleDeliveryAction,
  retryFailedModuleDelivery,
  syncMemberDeliveriesAction,
} from "@/actions/admin";
import { db } from "@/db";
import {
  moduleDeliveries,
  programEnrollments,
  programMembers,
  programModules,
} from "@/db/schema";
import {
  formatAdminDate,
  getOnboardingOverviewData,
} from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateTimeInput, HiddenInput } from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function resendDeliveryAction(formData: FormData) {
  "use server";
  await resendModuleDelivery(initialActionState, formData);
}

async function retryDeliveryAction(formData: FormData) {
  "use server";
  await retryFailedModuleDelivery(initialActionState, formData);
}

async function cancelDeliveryAction(formData: FormData) {
  "use server";
  await cancelModuleDeliveryAction(initialActionState, formData);
}

async function rescheduleDeliveryAction(formData: FormData) {
  "use server";
  await rescheduleModuleDeliveryAction(initialActionState, formData);
}

async function syncDeliveriesAction(formData: FormData) {
  "use server";
  await syncMemberDeliveriesAction(initialActionState, formData);
}

function toDateTimeLocal(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminOnboardingPage() {
  const [overview, recentDeliveries] = await Promise.all([
    getOnboardingOverviewData(),
    db
      .select({
        delivery: moduleDeliveries,
        member: programMembers,
        module: programModules,
        enrollment: programEnrollments,
      })
      .from(moduleDeliveries)
      .innerJoin(programMembers, eq(programMembers.id, moduleDeliveries.programMemberId))
      .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
      .innerJoin(programEnrollments, eq(programEnrollments.id, moduleDeliveries.enrollmentId))
      .orderBy(desc(moduleDeliveries.scheduledFor))
      .limit(20),
  ]);

  const statCards = [
    { label: "Total enrollments", value: overview.enrollments.total },
    { label: "Active enrollments", value: overview.enrollments.active },
    { label: "Completed enrollments", value: overview.enrollments.completed },
    { label: "Scheduled deliveries", value: overview.deliveries.scheduled },
    { label: "Sent deliveries", value: overview.deliveries.sent },
    { label: "Failed deliveries", value: overview.deliveries.failed },
    { label: "Applicants approved", value: overview.applications.approved },
    { label: "Assignment completion", value: `${overview.submissions.completionRate}%` },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Onboarding operations
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Manage the dynamic Ahren onboarding engine: enrollments, deliveries,
            email send health, lesson engagement, and submission flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent engagement</CardTitle>
            <CardDescription className="text-slate-300">
              Latest opens, clicks, lesson views, and submissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentEvents.map(({ event, member, module }) => (
              <div
                key={event.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {event.eventType}
                  </Badge>
                  <span className="text-sm font-medium text-white">
                    {member?.fullName || "Unknown member"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {module
                    ? `Module ${module.moduleNumber}: ${module.title}`
                    : "No module linked"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatAdminDate(event.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent submission activity</CardTitle>
            <CardDescription className="text-slate-300">
              Latest assignment submissions across onboarding modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentSubmissions.map(({ submission, member, module }) => (
              <div
                key={submission.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-semibold text-white">{member.fullName}</p>
                <p className="mt-1 text-sm text-slate-300">
                  Module {module.moduleNumber}: {module.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {submission.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {formatAdminDate(submission.submittedAt)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Delivery controls</CardTitle>
          <CardDescription className="text-slate-300">
            Resend, retry, reschedule, cancel, or sync delivery records for active members.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Member</TableHead>
                <TableHead className="text-slate-400">Module</TableHead>
                <TableHead className="text-slate-400">Schedule</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeliveries.map(({ delivery, member, module }) => (
                <TableRow key={delivery.id} className="border-white/10 align-top">
                  <TableCell className="whitespace-normal">
                    <Link
                      href={`/admin/program-members/${member.id}`}
                      className="font-semibold text-white hover:text-[#00ff9d]"
                    >
                      {member.fullName}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">{member.email}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <p className="text-sm font-medium text-white">
                      Module {module.moduleNumber}: {module.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{module.sendDayLabel}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-slate-300">
                    <p>Scheduled: {formatAdminDate(delivery.scheduledFor)}</p>
                    <p>Sent: {formatAdminDate(delivery.sentAt)}</p>
                    <p>Failed: {formatAdminDate(delivery.failedAt)}</p>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="space-y-2">
                      <Badge variant="outline" className="border-white/15 text-cyan-200">
                        {delivery.status}
                      </Badge>
                      <p className="text-xs text-slate-400">
                        Error: {delivery.error || "-"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <div className="flex flex-wrap gap-2">
                      <form action={resendDeliveryAction}>
                        <HiddenInput name="delivery_id" value={delivery.id} />
                        <Button type="submit" size="sm" variant="secondary">
                          Resend
                        </Button>
                      </form>
                      <form action={retryDeliveryAction}>
                        <HiddenInput name="delivery_id" value={delivery.id} />
                        <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                          Retry
                        </Button>
                      </form>
                      <form action={cancelDeliveryAction}>
                        <HiddenInput name="delivery_id" value={delivery.id} />
                        <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                          Cancel
                        </Button>
                      </form>
                      <form action={syncDeliveriesAction}>
                        <HiddenInput
                          name="program_member_id"
                          value={member.id}
                        />
                        <Button type="submit" size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                          Sync member
                        </Button>
                      </form>
                    </div>
                    <form action={rescheduleDeliveryAction} className="mt-3 flex flex-wrap gap-2">
                      <HiddenInput name="delivery_id" value={delivery.id} />
                      <DateTimeInput
                        name="scheduled_for"
                        defaultValue={toDateTimeLocal(delivery.scheduledFor)}
                        className="h-8 rounded-md text-xs"
                      />
                      <Button type="submit" size="sm" variant="secondary">
                        Reschedule
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent email events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentEmailEvents.map(({ emailEvent, member, module }) => (
              <div
                key={emailEvent.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {emailEvent.status}
                  </Badge>
                  <span className="text-sm font-medium text-white">
                    {emailEvent.templateKey}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {member?.fullName || emailEvent.recipientEmail}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {module
                    ? `Module ${module.moduleNumber}`
                    : "No module linked"}{" "}
                  - {formatAdminDate(emailEvent.sentAt || emailEvent.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Quick routes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { href: "/admin/email-events", label: "Open email event log" },
              { href: "/admin/engagement", label: "Open engagement log" },
              { href: "/admin/module-submissions", label: "Open submission review" },
              { href: "/admin/join-applications", label: "Return to applications" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
