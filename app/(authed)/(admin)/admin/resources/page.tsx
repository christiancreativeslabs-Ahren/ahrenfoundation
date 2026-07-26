import type { Metadata } from "next";
import { getResourceListData } from "@/lib/admin/resources";
import {
  parseResourceListInput,
  type RawResourceListParams,
} from "@/features/admin/resources/list/_lib/parse-resource-list-input";
import { ResourceTable } from "@/features/admin/resources/list/_components/resource.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function ResourcesAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawResourceListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseResourceListInput(params);
  const initialData = await getResourceListData(initialFilters);

  return (
    <div className="min-h-full w-full -mt-5 pt-0 pb-6">
      <ResourceTable initialData={initialData} initialFilters={initialFilters} />
    </div>
  );
}
