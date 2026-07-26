import type { Metadata } from "next";
import { getProjectShowcaseListData } from "@/lib/admin/project-showcases";
import {
  parseProjectShowcaseListInput,
  type RawProjectShowcaseListParams,
} from "@/features/admin/project-showcases/list/_lib/parse-project-showcase-list-input";
import { ProjectShowcaseTable } from "@/features/admin/project-showcases/list/_components/project-showcase.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Showcases - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function ProjectShowcasesAdminPage({ searchParams }: { searchParams: Promise<RawProjectShowcaseListParams> }) {
  const params = await searchParams;
  const initialFilters = parseProjectShowcaseListInput(params);
  const initialData = await getProjectShowcaseListData(initialFilters);
  return (
    <div className="min-h-full w-full -mt-5 pt-0 pb-6">
      <ProjectShowcaseTable initialData={initialData} initialFilters={initialFilters} />
    </div>
  );
}
