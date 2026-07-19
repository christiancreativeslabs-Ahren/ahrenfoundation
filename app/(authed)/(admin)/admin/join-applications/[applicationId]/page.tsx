import Link from "next/link";
import {
  grantVerifiedStatus,
  syncMemberDeliveriesAction,
  updateJoinApplicationStatus,
} from "@/actions/admin";
import {
  formatAdminDate,
  getFaithPayload,
  getJoinApplicationDetail,
  getString,
  getStringArray,
} from "@/lib/admin/onboarding";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HiddenInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function reviewApplicationAction(formData: FormData) {
  "use server";
  await updateJoinApplicationStatus(initialActionState, formData);
}

async function syncDeliveriesAction(formData: FormData) {
  "use server";
  await syncMemberDeliveriesAction(initialActionState, formData);
}

async function verifyMemberAction(formData: FormData) {
  "use server";
  await grantVerifiedStatus(initialActionState, formData);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white">
        {value || "-"}
      </p>
    </div>
  );
}

function DetailList({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.length ? (
          values.map((value) => (
            <Badge key={value} variant="outline" className="border-white/15 text-white">
              {value}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </div>
    </div>
  );
}

export default async function JoinApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const detail = await getJoinApplicationDetail(applicationId);

  if (!detail) {
    return (
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Applicant not found</CardTitle>
          <CardDescription className="text-slate-300">
            This application may have been removed or the link is invalid.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const payload = (detail.application.payload ?? {}) as Record<string, unknown>;
  const faith = getFaithPayload(payload);
  const isYouth = detail.application.applicationType === "youth";

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                href="/admin/join-applications"
                className="text-sm font-medium text-[#00ff9d] hover:underline"
              >
                Back to join applications
              </Link>
              <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
                {detail.application.fullName}
              </CardTitle>
              <CardDescription className="mt-2 text-slate-300">
                {detail.application.applicationType === "youth"
                  ? "Prospective mentee"
                  : "Mentor applicant"}{" "}
                review and onboarding handoff.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="approved" />
                <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                  Approve
                </Button>
              </form>
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="reviewing" />
                <Button type="submit" variant="secondary">
                  Mark reviewing
                </Button>
              </form>
              <form action={reviewApplicationAction}>
                <HiddenInput
                  name="application_id"
                  value={detail.application.id}
                />
                <HiddenInput name="status" value="rejected" />
                <Button type="submit" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  Reject
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <DetailItem label="Application status" value={detail.application.status} />
          <DetailItem label="Applicant type" value={detail.application.applicationType} />
          <DetailItem
            label="Current step"
            value={detail.member?.currentStep?.replaceAll("_", " ") ?? "Application review"}
          />
          <DetailItem
            label="Onboarding decision"
            value={detail.member?.status?.replaceAll("_", " ") ?? "No member record yet"}
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Application record</CardTitle>
          <CardDescription className="text-slate-300">
            Full review context for this applicant before active mentee flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Full name" value={detail.application.fullName} />
          <DetailItem label="Email address" value={detail.application.email} />
          <DetailItem label="Phone number" value={detail.application.phoneNumber} />
          <DetailItem label="Location" value={detail.application.location} />
          <DetailItem
            label="Consent"
            value={detail.application.consent ? "Yes" : "No"}
          />
          <DetailItem
            label="Created"
            value={formatAdminDate(detail.application.createdAt)}
          />
          <DetailItem
            label="Updated"
            value={formatAdminDate(detail.application.updatedAt)}
          />
          <DetailItem
            label="Linked user"
            value={detail.linkedUser?.email ?? "No linked user record"}
          />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">
            {isYouth ? "Prospective mentee profile" : "Mentor application profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isYouth ? (
            <>
              <DetailItem label="Age range" value={getString(payload.ageRange)} />
              <DetailList label="Current skills and interests" values={getStringArray(payload.skills)} />
              <DetailItem label="Other skill" value={getString(payload.otherSkill)} />
              <DetailItem label="Skills to learn" value={getString(payload.skillsToLearn)} />
              <DetailItem label="Why they want to join" value={getString(payload.motivation)} />
              <DetailItem label="Project experience" value={getString(payload.projectExperience)} />
              <DetailList
                label="Preferred participation formats"
                values={getStringArray(payload.participationFormats)}
              />
            </>
          ) : (
            <>
              <DetailItem label="Profession or industry" value={getString(payload.profession)} />
              <DetailItem label="Years of experience" value={getString(payload.yearsExperience)} />
              <DetailList label="Areas of expertise" values={getStringArray(payload.expertise)} />
              <DetailItem label="Other expertise" value={getString(payload.otherExpertise)} />
              <DetailItem label="Why they want to mentor" value={getString(payload.mentorshipReason)} />
              <DetailItem label="Commitment level" value={getString(payload.commitment)} />
              <DetailItem label="Preferred mentorship format" value={getString(payload.preferredFormat)} />
            </>
          )}

          <DetailItem label="Born again response" value={faith.bornAgain} />
          <DetailItem label="Holy Spirit response" value={faith.holySpirit} />
          <DetailItem label="Dependence on the Holy Spirit" value={faith.dependency} />
          <DetailItem label="Testimony" value={getString(payload.testimony)} />
          <DetailItem label="Church or ministry" value={getString(payload.church)} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Operational workflow</CardTitle>
          <CardDescription className="text-slate-300">
            Bridge application review into onboarding and member operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem
              label="Program member"
              value={detail.member ? detail.member.id : "Not created"}
            />
            <DetailItem
              label="Program enrollments"
              value={detail.enrollments.length ? String(detail.enrollments.length) : "None"}
            />
            <DetailItem
              label="Welcome emails"
              value={
                detail.welcomeEmails.length
                  ? `${detail.welcomeEmails.length} logged`
                  : "No email events yet"
              }
            />
            <DetailItem
              label="Latest welcome email"
              value={formatAdminDate(detail.welcomeEmails[0]?.createdAt)}
            />
          </div>

          {detail.member ? (
            <>
              <Separator className="bg-white/10" />
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/program-members/${detail.member.id}`}
                  className={cn(
                    buttonVariants(),
                    "bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                  )}
                >
                  Open member journey
                </Link>
                {detail.member.role === "youth" ? (
                  <form action={syncDeliveriesAction}>
                    <HiddenInput
                      name="program_member_id"
                      value={detail.member.id}
                    />
                    <Button type="submit" variant="secondary">
                      Sync deliveries
                    </Button>
                  </form>
                ) : null}
                <form action={verifyMemberAction}>
                  <HiddenInput
                    name="program_member_id"
                    value={detail.member.id}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    Grant verified access
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              This applicant has not yet been converted into an active program
              member, so the next action is application review and approval.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Email history</CardTitle>
          <CardDescription className="text-slate-300">
            Welcome and application-related email activity tied to this applicant email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.welcomeEmails.length ? (
            detail.welcomeEmails.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/15 text-cyan-200">
                    {event.templateKey}
                  </Badge>
                  <Badge variant="outline" className="border-white/15 text-white">
                    {event.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Sent: {formatAdminDate(event.sentAt || event.createdAt)}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Provider: {event.providerId || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Error: {event.error || "-"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No email events logged for this applicant yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
