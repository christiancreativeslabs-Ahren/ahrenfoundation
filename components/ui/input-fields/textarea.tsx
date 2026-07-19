import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fieldControlClass } from "./field-styles";

function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnTextarea>) {
  return (
    <ShadcnTextarea
      data-slot="ahren-textarea"
      className={cn(
        "min-h-24 resize-y py-2 focus-visible:!ring-0 focus-visible:!ring-transparent focus-visible:!ring-offset-0",
        fieldControlClass,
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
