"use client";

import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectOption = {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
};

type SelectProps = Omit<
  React.ComponentProps<typeof ShadcnSelect<string>>,
  "children"
> & {
  contentClassName?: string;
  options: SelectOption[];
  placeholder?: string;
  triggerClassName?: string;
};

function Select({
  contentClassName,
  options,
  placeholder = "Select an option",
  triggerClassName,
  ...props
}: SelectProps) {
  return (
    <ShadcnSelect {...props}>
      <SelectTrigger
        data-slot="ahren-select-trigger"
        className={cn(
          "h-10 w-full rounded-xl border-cyan-400/15 bg-[#080d2e] px-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus-visible:border-white focus-visible:!ring-0 focus-visible:!ring-transparent focus-visible:!ring-offset-0 data-placeholder:text-[#8892b0]",
          triggerClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        data-slot="ahren-select-content"
        className={cn(
          "border border-cyan-400/15 bg-[#091033] text-[#e8eeff] shadow-xl shadow-black/30 ring-0",
          contentClassName,
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="focus:bg-cyan-400/10 focus:text-white data-highlighted:bg-cyan-400/10"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}

export { Select };
export type { SelectOption };
