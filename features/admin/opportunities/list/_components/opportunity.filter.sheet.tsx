"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type OpportunityListFilterState = {
  search?: string;
  audience?: "all" | "youth" | "mentor";
  status?: "all" | "published" | "draft";
  type?: string;
};

type OpportunityFilterSheetProps = Omit<
  BaseFilterDialogProps<OpportunityListFilterState>,
  "children" | "title" | "subtitle"
>;

export function OpportunityFilterSheet(props: OpportunityFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Opportunities" subtitle="Refine the opportunity queue">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search title, summary, type..."
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
                  value === "all" ? undefined : (value as OpportunityListFilterState["audience"]),
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
            <label className="text-sm font-medium">Type</label>
            <TextInput
              value={localFilters.type || ""}
              onChange={(event) => handleChange("type", event.target.value || undefined)}
              placeholder="funding, partnership, training..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                handleChange(
                  "status",
                  value === "all" ? undefined : (value as OpportunityListFilterState["status"]),
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
