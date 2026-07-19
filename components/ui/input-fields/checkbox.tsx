"use client";

import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CheckboxProps = React.ComponentProps<typeof ShadcnCheckbox> & {
  containerClassName?: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
};

function Checkbox({
  className,
  containerClassName,
  description,
  label,
  ...props
}: CheckboxProps) {
  const control = (
    <ShadcnCheckbox
      data-slot="ahren-checkbox"
      className={cn(
        "border-cyan-400/30 bg-[#080d2e] text-[#080d2e] focus-visible:border-white focus-visible:!ring-0 focus-visible:!ring-transparent focus-visible:!ring-offset-0 data-checked:border-[#00ff9d] data-checked:bg-[#00ff9d]",
        className,
      )}
      {...props}
    />
  );

  if (!label && !description) return control;

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-400/10 bg-white/[0.03] p-3 text-sm text-[#e8eeff] transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/5",
        containerClassName,
      )}
    >
      {control}
      <span className="min-w-0">
        {label ? <span className="block font-medium">{label}</span> : null}
        {description ? (
          <span className="mt-1 block text-xs leading-relaxed text-[#8892b0]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export { Checkbox };
