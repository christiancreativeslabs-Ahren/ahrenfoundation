"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type CommunityPostListFilterState = {
  search?: string;
  channel?: string;
  status?: "all" | "published" | "hidden";
};

type CommunityPostFilterSheetProps = Omit<
  BaseFilterDialogProps<CommunityPostListFilterState>,
  "children" | "title" | "subtitle"
>;

export function CommunityPostFilterSheet(props: CommunityPostFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Posts" subtitle="Refine the community post queue">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search post body, author, member..."
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Channel</label>
            <TextInput
              value={localFilters.channel || ""}
              onChange={(event) => handleChange("channel", event.target.value || undefined)}
              placeholder="verified_members"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                handleChange(
                  "status",
                  value === "all" ? undefined : (value as CommunityPostListFilterState["status"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
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
