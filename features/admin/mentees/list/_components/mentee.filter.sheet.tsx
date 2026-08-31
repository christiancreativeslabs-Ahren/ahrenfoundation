"use client";

import { Button } from "@/components/ui/button";
import { Select, TextInput } from "@/components/ui/input-fields";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type MenteeListFilterState = {
  search?: string | null;
  status?: "all" | "application_received" | "approved" | "verified_member" | "completed" | null;
};

export function MenteeFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: MenteeListFilterState;
  onApply: (filters: MenteeListFilterState) => void;
  onReset: () => void;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="border-white/10 bg-[#07102c] text-white">
        <SheetHeader>
          <SheetTitle>Filter mentees</SheetTitle>
          <SheetDescription className="text-slate-300">
            Narrow the mentee list by search or workflow status.
          </SheetDescription>
        </SheetHeader>
        <form
          className="mt-6 space-y-5"
          action={(formData) => {
            onApply({
              search: String(formData.get("search") ?? "").trim() || null,
              status: String(formData.get("status") ?? "all") as MenteeListFilterState["status"],
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
                { value: "verified_member", label: "Verified member" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </label>
          <SheetFooter className="gap-3 sm:flex-col">
            <Button type="submit" className="w-full bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
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
