import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import {
  assignMentorToYouth,
  grantVerifiedStatus,
  issueCompletionCertificate,
  updateJoinApplicationStatus,
} from "@/actions/admin";
import { db } from "@/db";
import { joinApplications, programMembers } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiddenInput, Select } from "@/components/ui/input-fields";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function reviewApplicationAction(formData: FormData) {
  "use server";
  await updateJoinApplicationStatus(initialActionState, formData);
}

async function assignMentorAction(formData: FormData) {
  "use server";
  await assignMentorToYouth(initialActionState, formData);
}

async function issueCertificateAction(formData: FormData) {
  "use server";
  await issueCompletionCertificate(initialActionState, formData);
}

async function grantVerifiedAction(formData: FormData) {
  "use server";
  await grantVerifiedStatus(initialActionState, formData);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusClasses(status: string) {
  switch (status) {
    case "approved":
    case "active":
    case "verified_member":
    case "verified_mentor":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    case "rejected":
      return "border-rose-500/20 bg-rose-500/10 text-rose-200";
    case "completed":
      return "border-amber-500/20 bg-amber-500/10 text-amber-200";
    default:
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
  }
}

function ReviewButton({
  applicationId,
  status,
  children,
  variant = "outline",
}: {
  applicationId: string;
  status: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
}) {
  return (
    <form action={reviewApplicationAction}>
      <HiddenInput name="application_id" value={applicationId} />
      <HiddenInput name="status" value={status} />
      <Button
        type="submit"
        size="sm"
        variant={variant}
        className="border-white/15 bg-transparent text-white hover:bg-white/10"
      >
        {children}
      </Button>
    </form>
  );
}

export default async function JoinApplicationsAdminPage() {
  const rows = await db
    .select({
      application: joinApplications,
      member: programMembers,
    })
    .from(joinApplications)
    .leftJoin(
      programMembers,
      eq(programMembers.joinApplicationId, joinApplications.id),
    )
    .orderBy(desc(joinApplications.createdAt))
    .limit(100);

  const mentors = rows
    .map((row) => row.member)
    .filter((member): member is NonNullable<typeof member> => {
      return Boolean(member && member.role === "mentor" && member.status !== "rejected");
    });

  const total = rows.length;
  const youthCount = rows.filter(
    (row) => row.application.applicationType === "youth",
  ).length;
  const mentorCount = rows.filter(
    (row) => row.application.applicationType === "mentor",
  ).length;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin review
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join applications
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Review applications, move applicants through the mentorship
                journey, assign mentors, and grant verified access.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/join"
                className={cn(
                  buttonVariants(),
                  "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                )}
              >
                Join page
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total", value: total },
              { label: "Youth", value: youthCount },
              { label: "Mentors", value: mentorCount },
            ].map((item) => (
              <Card
                key={item.label}
                className="border-white/10 bg-[#0d1538] text-white"
              >
                <CardContent className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Journey queue</CardTitle>
          <CardDescription className="text-slate-300">
            Showing the latest 100 applications and their program state.
          </CardDescription>
        </CardHeader>
        <Separator className="bg-white/10" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/[0.02]">
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Applicant
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Program
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Journey
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Submitted
                  </TableHead>
                  <TableHead className="min-w-[320px] text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ application, member }) => (
                  <TableRow key={application.id} className="border-white/10 hover:bg-white/[0.02]">
                    <TableCell className="align-top">
                      <div className="font-semibold text-white">{application.fullName}</div>
                      <div className="mt-1 text-xs text-slate-400">{application.email}</div>
                      <div className="mt-1 text-xs text-slate-400">{application.phoneNumber}</div>
                      <div className="mt-1 text-xs text-slate-400">{application.location}</div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline" className="border-white/15 text-cyan-200">
                        {application.applicationType}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className={`capitalize ${statusClasses(application.status)}`}
                        >
                          {application.status}
                        </Badge>
                        {member ? (
                          <Badge
                            variant="outline"
                            className={`capitalize ${statusClasses(member.status)}`}
                          >
                            {member.status.replaceAll("_", " ")}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="align-top text-sm text-slate-300">
                      {member?.currentStep.replaceAll("_", " ") ?? "Not created"}
                    </TableCell>
                    <TableCell className="align-top text-sm text-slate-400">
                      {formatDate(application.createdAt)}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/join-applications/${application.id}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "border-white/15 bg-transparent text-white hover:bg-white/10",
                          )}
                        >
                          View detail
                        </Link>
                        <ReviewButton applicationId={application.id} status="approved">
                          Approve
                        </ReviewButton>
                        <ReviewButton applicationId={application.id} status="reviewing">
                          Review
                        </ReviewButton>
                        <ReviewButton applicationId={application.id} status="rejected">
                          Reject
                        </ReviewButton>
                      </div>

                      {member?.role === "youth" ? (
                        <div className="mt-3 space-y-2">
                          <form
                            action={assignMentorAction}
                            className="flex flex-wrap gap-2"
                          >
                            <HiddenInput name="youth_member_id" value={member.id} />
                            <Select
                              name="mentor_member_id"
                              defaultValue=""
                              placeholder="Select mentor"
                              triggerClassName="h-9 min-w-44"
                              options={mentors.map((mentor) => ({
                                value: mentor.id,
                                label: mentor.fullName,
                              }))}
                            />
                            <Button type="submit" size="sm" variant="secondary">
                              Assign
                            </Button>
                          </form>

                          <div className="flex flex-wrap gap-2">
                            <form action={issueCertificateAction}>
                              <HiddenInput name="program_member_id" value={member.id} />
                              <Button type="submit" size="sm" variant="secondary">
                                Issue certificate
                              </Button>
                            </form>
                            <form action={grantVerifiedAction}>
                              <HiddenInput name="program_member_id" value={member.id} />
                              <Button type="submit" size="sm" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                                Verify member
                              </Button>
                            </form>
                          </div>
                        </div>
                      ) : null}

                      {member?.role === "mentor" ? (
                        <div className="mt-3">
                          <form action={grantVerifiedAction}>
                            <HiddenInput name="program_member_id" value={member.id} />
                            <Button type="submit" size="sm" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                              Verify mentor
                            </Button>
                          </form>
                        </div>
                      ) : null}

                      {member ? (
                        <div className="mt-2 flex flex-wrap gap-3">
                          <Link
                            href={`/admin/program-members/${member.id}`}
                            className={cn(
                              buttonVariants({ variant: "link", size: "sm" }),
                              "px-0 text-[#00ff9d]",
                            )}
                          >
                            Open journey tracker
                          </Link>
                          <Link
                            href={`/admin/join-applications/${application.id}`}
                            className={cn(
                              buttonVariants({ variant: "link", size: "sm" }),
                              "px-0 text-slate-300",
                            )}
                          >
                            Open applicant record
                          </Link>
                        </div>
                      ) : null}

                      <details className="mt-3">
                        <summary className="cursor-pointer list-none text-sm font-medium text-[#00ff9d] hover:underline">
                          Payload
                        </summary>
                        <pre className="mt-3 max-w-[560px] overflow-auto rounded-md border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-slate-300">
                          {JSON.stringify(application.payload, null, 2)}
                        </pre>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}

                {!rows.length ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                      No join applications yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
