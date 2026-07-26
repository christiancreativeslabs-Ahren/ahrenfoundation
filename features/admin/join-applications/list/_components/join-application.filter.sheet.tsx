"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/input-fields";
import { Separator } from "@/components/ui/separator";
import { BaseFilterDialog, type BaseFilterDialogProps } from "@/components/shared/table";

export type JoinApplicationListFilterState = {
  search?: string;
  applicationType?: "all" | "youth" | "mentor";
  status?: "all" | "pending" | "reviewing" | "approved" | "rejected";
};

type JoinApplicationFilterSheetProps = Omit<
  BaseFilterDialogProps<JoinApplicationListFilterState>,
  "children" | "title" | "subtitle"
>;

export function JoinApplicationFilterSheet(props: JoinApplicationFilterSheetProps) {
  return (
    <BaseFilterDialog {...props} title="Filter Applications" subtitle="Refine the applicant queue">
      {({ localFilters, handleChange }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <TextInput
              value={localFilters.search || ""}
              onChange={(event) => handleChange("search", event.target.value || undefined)}
              placeholder="Search name, email, phone, location..."
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Applicant type</label>
            <Select
              value={localFilters.applicationType || "all"}
              onValueChange={(value) =>
                handleChange(
                  "applicationType",
                  value === "all" ? undefined : (value as JoinApplicationListFilterState["applicationType"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="youth">Prospective mentee</SelectItem>
                <SelectItem value="mentor">Mentor applicant</SelectItem>
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
                  value === "all" ? undefined : (value as JoinApplicationListFilterState["status"]),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </BaseFilterDialog>
  );
}
