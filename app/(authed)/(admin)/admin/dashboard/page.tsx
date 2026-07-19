import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck, UserCircle2, WandSparkles } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { getAdminDashboardMetrics } from "@/lib/admin/onboarding";
import SignOutButton from "@/components/auth/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [session, metrics] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getAdminDashboardMetrics(),
  ]);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  const stats = [
    { label: "Signed in as", value: user.email || "Admin" },
    { label: "Active enrollments", value: String(metrics.enrollments.active) },
    { label: "Failed deliveries", value: String(metrics.deliveries.failed) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
              Admin dashboard
            </p>
            <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-[#00ff9d]">{user.name || "admin"}</span>
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
              Review applications, track onboarding, and keep delivery, engagement,
              and submission flow moving through the Ahren Foundation journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                <UserCircle2 size={20} />
              </div>
              <SignOutButton />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Applicants", value: metrics.applications.total },
                { label: "Approved", value: metrics.applications.approved },
                { label: "Scheduled emails", value: metrics.deliveries.scheduled },
                {
                  label: "Assignment completion",
                  value: `${metrics.submissions.completionRate}%`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-[#0d1538] p-4"
                >
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    {item.label}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck size={16} className="text-[#00ff9d]" />
                Security
              </CardTitle>
              <CardDescription className="text-slate-300">
                Admin access is checked in the shared route layout before any
                admin page renders.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/join-applications"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Join applications
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/admin/onboarding"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Onboarding operations
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/admin/email-events"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Email event log
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants(),
                  "w-full justify-between bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95",
                )}
              >
                Member dashboard
                <ArrowRight size={14} />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <WandSparkles size={16} className="text-[#00c9ff]" />
                Journey ops
              </CardTitle>
              <CardDescription className="text-slate-300">
                The join queue now stores lesson progress, mentor matching,
                delivery status, certificate state, and verified access state.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
