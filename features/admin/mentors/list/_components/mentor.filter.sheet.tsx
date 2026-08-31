"use client";

import { Button } from "@/components/ui/button";
import { Select, TextInput } from "@/components/ui/input-fields";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type MentorListFilterState = {
  search?: string | null;
  status?: "all" | "application_received" | "approved" | "verified_mentor" | null;
};

export function MentorFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: MentorListFilterState;
  onApply: (filters: MentorListFilterState) => void;
  onReset: () => void;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="border-white/10 bg-[#07102c] text-white">
        <SheetHeader>
          <SheetTitle>Filter mentors</SheetTitle>
          <SheetDescription className="text-slate-300">
            Narrow the mentor list by search or workflow status.
          </SheetDescription>
        </SheetHeader>

        <form
          className="mt-6 space-y-5"
          action={(formData) => {
            onApply({
              search: String(formData.get("search") ?? "").trim() || null,
              status: String(formData.get("status") ?? "all") as MentorListFilterState["status"],
            });
            onClose();
          }}
        >
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Search</span>
            <TextInput
              name="search"
              defaultValue={filters.search ?? ""}
              placeholder="Name, email, status, or step"
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Status</span>
            <Select
              name="status"
              defaultValue={filters.status ?? "all"}
              triggerClassName="border-white/10 bg-white/[0.04] text-white"
              options={[
                { value: "all", label: "All statuses" },
                { value: "application_received", label: "Application received" },
                { value: "approved", label: "Approved" },
                { value: "verified_mentor", label: "Verified mentor" },
              ]}
            />
          </label>

          <SheetFooter className="gap-3 sm:flex-col">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
            >
              Apply filters
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                onReset();
                onClose();
              }}
            >
              Reset filters
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
