import type { Metadata } from "next";
import Link from "next/link";
import { getJoinApplicationListData } from "@/lib/admin/join-applications";
import { getMentorAssignmentCandidates } from "@/lib/admin/mentor-assignments";
import { getTrainingApplicationSettings } from "@/lib/application-settings";
import {
  parseJoinApplicationListInput,
  type RawJoinApplicationListParams,
} from "@/features/admin/join-applications/list/_lib/parse-join-application-list-input";
import { JoinApplicationTable } from "@/features/admin/join-applications/list/_components/join-application.table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join Applications - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function JoinApplicationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawJoinApplicationListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseJoinApplicationListInput(params);
  const [initialData, applicationSettings, mentors] = await Promise.all([
    getJoinApplicationListData(initialFilters),
    getTrainingApplicationSettings(),
    getMentorAssignmentCandidates(),
  ]);

  return (
    <div className="w-full min-h-full -mt-5 pb-6 pt-0">
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/assignments"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-white/15 bg-transparent text-white hover:bg-white/10",
          )}
        >
          Bulk assignments
        </Link>
      </div>
      <JoinApplicationTable
        initialData={initialData}
        initialFilters={initialFilters}
        applicationSettings={applicationSettings}
        mentors={mentors}
      />
    </div>
  );
}
