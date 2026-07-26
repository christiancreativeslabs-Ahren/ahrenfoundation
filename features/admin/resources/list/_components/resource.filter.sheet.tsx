"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type ResourceListFilterState = {
  search?: string;
  audience?: "all" | "youth" | "mentor";
  visibility?: "all" | "published" | "draft";
  category?: string;
};

type ResourceFilterSheetProps = Omit<
  BaseFilterDialogProps<ResourceListFilterState>,
  "children" | "title" | "subtitle"
>;

export function ResourceFilterSheet(props: ResourceFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Resources" subtitle="Refine the resource list">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search title, summary, category..."
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
                  value === "all" ? undefined : (value as ResourceListFilterState["audience"]),
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
            <label className="text-sm font-medium">Visibility</label>
            <Select
              value={localFilters.visibility || "all"}
              onValueChange={(value) =>
                handleChange(
                  "visibility",
                  value === "all" ? undefined : (value as ResourceListFilterState["visibility"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All visibility</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <TextInput
              value={localFilters.category || ""}
              onChange={(event) => handleChange("category", event.target.value || undefined)}
              placeholder="Books, links, templates..."
            />
          </div>
        </div>
      )}
    </BaseFilterDialog>
  );
}
