import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { inputBaseClass } from "./field-styles";

function TextInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="ahren-text-input"
      className={cn(inputBaseClass, className)}
      {...props}
    />
  );
}

export { TextInput };
