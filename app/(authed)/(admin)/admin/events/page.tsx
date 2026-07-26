import type { Metadata } from "next";
import { getEventListData } from "@/lib/admin/events";
import {
  parseEventListInput,
  type RawEventListParams,
} from "@/features/admin/events/list/_lib/parse-event-list-input";
import { EventTable } from "@/features/admin/events/list/_components/event.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function EventsAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawEventListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseEventListInput(params);
  const initialData = await getEventListData(initialFilters);

  return (
    <div className="min-h-full w-full -mt-5 pt-0 pb-6">
      <EventTable initialData={initialData} initialFilters={initialFilters} />
    </div>
  );
}
