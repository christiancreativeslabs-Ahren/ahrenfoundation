"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type EventListFilterState = {
  search?: string;
  audience?: "all" | "youth" | "mentor";
  status?: "all" | "published" | "draft";
};

type EventFilterSheetProps = Omit<
  BaseFilterDialogProps<EventListFilterState>,
  "children" | "title" | "subtitle"
>;

export function EventFilterSheet(props: EventFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Events" subtitle="Refine the community event queue">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search title, summary, location..."
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Audience</label>
            <Select
              value={localFilters.audience || "all"}
              onValueChange={(value) =>
                handleChange(
                  "audience",
                  value === "all" ? undefined : (value as EventListFilterState["audience"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All audiences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All audiences</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                handleChange(
                  "status",
                  value === "all" ? undefined : (value as EventListFilterState["status"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </BaseFilterDialog>
  );
}
