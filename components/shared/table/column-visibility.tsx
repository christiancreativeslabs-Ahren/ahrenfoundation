"use client";

import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ColumnVisibilityDropdownProps {
  table: Table<any>;
  disabled?: boolean;
  getFriendlyColumnName?: (columnId: string) => string;
}

export function ColumnVisibilityDropdown({
  table,
  disabled = false,
  getFriendlyColumnName,
}: ColumnVisibilityDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        className="h-9 border-border bg-background"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="sr-only">Toggle Columns</span>
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Toggle Columns
          </p>
          <div className="space-y-2">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  />
                  <span className={cn("capitalize")}>
                    {getFriendlyColumnName
                      ? getFriendlyColumnName(column.id)
                      : column.id.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
