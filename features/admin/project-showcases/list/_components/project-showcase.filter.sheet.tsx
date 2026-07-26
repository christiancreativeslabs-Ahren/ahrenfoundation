"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type ProjectShowcaseListFilterState = {
  search?: string;
  status?: "all" | "draft" | "submitted" | "published" | "hidden";
};

type ProjectShowcaseFilterSheetProps = Omit<
  BaseFilterDialogProps<ProjectShowcaseListFilterState>,
  "children" | "title" | "subtitle"
>;

export function ProjectShowcaseFilterSheet(props: ProjectShowcaseFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Projects" subtitle="Refine the project showcase queue">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search title, summary, author..."
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                handleChange(
                  "status",
                  value === "all" ? undefined : (value as ProjectShowcaseListFilterState["status"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </BaseFilterDialog>
  );
}
