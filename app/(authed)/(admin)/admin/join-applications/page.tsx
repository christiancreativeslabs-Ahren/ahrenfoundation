import type { Metadata } from "next";
import { getJoinApplicationListData } from "@/lib/admin/join-applications";
import { getTrainingApplicationSettings } from "@/lib/application-settings";
import {
  parseJoinApplicationListInput,
  type RawJoinApplicationListParams,
} from "@/features/admin/join-applications/list/_lib/parse-join-application-list-input";
import { JoinApplicationTable } from "@/features/admin/join-applications/list/_components/join-application.table";

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
  const [initialData, applicationSettings] = await Promise.all([
    getJoinApplicationListData(initialFilters),
    getTrainingApplicationSettings(),
  ]);

  return (
    <div className="w-full min-h-full -mt-5 pb-6 pt-0">
      <JoinApplicationTable
        initialData={initialData}
        initialFilters={initialFilters}
        applicationSettings={applicationSettings}
      />
    </div>
  );
}
