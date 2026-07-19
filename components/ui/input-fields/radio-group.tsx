"use client";

import * as React from "react";
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type RadioOption = {
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
};

type RadioGroupProps = Omit<
  React.ComponentProps<typeof ShadcnRadioGroup>,
  "children"
> & {
  itemClassName?: string;
  optionClassName?: string;
  options: RadioOption[];
};

function RadioGroup({
  className,
  itemClassName,
  optionClassName,
  options,
  ...props
}: RadioGroupProps) {
  return (
    <ShadcnRadioGroup
      data-slot="ahren-radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-400/10 bg-white/[0.03] p-3 text-sm text-[#e8eeff] transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/5",
            option.disabled && "cursor-not-allowed opacity-50",
            optionClassName,
          )}
        >
          <RadioGroupItem
            value={option.value}
            disabled={option.disabled}
            data-slot="ahren-radio"
            className={cn(
              "border-cyan-400/30 bg-[#080d2e] focus-visible:border-white focus-visible:!ring-0 focus-visible:!ring-transparent focus-visible:!ring-offset-0 data-checked:border-[#00ff9d] data-checked:bg-[#00ff9d]",
              itemClassName,
            )}
          />
          <span className="min-w-0">
            <span className="block font-medium">{option.label}</span>
            {option.description ? (
              <span className="mt-1 block text-xs leading-relaxed text-[#8892b0]">
                {option.description}
              </span>
            ) : null}
          </span>
        </label>
      ))}
    </ShadcnRadioGroup>
  );
}

export { RadioGroup };
export type { RadioOption };
