import type { Metadata } from "next";
import Link from "next/link";
import { getMentorAssignmentCandidates, getMentorAssignmentMenteeCandidates } from "@/lib/admin/mentor-assignments";
import { MentorBulkAssignmentWizard } from "@/components/admin/mentor-bulk-assignment-wizard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Assignments - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function MentorAssignmentsAdminPage() {
  const [mentors, mentees] = await Promise.all([
    getMentorAssignmentCandidates(),
    getMentorAssignmentMenteeCandidates(),
  ]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/10 bg-white/[0.03] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="h-1 bg-gradient-to-r from-[#00c9ff] via-[#00ff9d] to-[#00c9ff]" />
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Bulk assignment
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mentor assignments
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                Use this guided flow when one mentor needs to be assigned to multiple mentees in a single pass.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/join-applications"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Join applications
              </Link>
              <Link
                href="/admin/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/15 bg-transparent text-white hover:bg-white/10",
                )}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Available mentors", value: mentors.length },
            { label: "Available mentees", value: mentees.length },
            { label: "Bulk flow", value: "Multi-step" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#0d1538] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                {item.label}
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <MentorBulkAssignmentWizard mentors={mentors} mentees={mentees} />
    </div>
  );
}
