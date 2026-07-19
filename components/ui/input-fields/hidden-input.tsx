import * as React from "react";

function HiddenInput(props: Omit<React.ComponentProps<"input">, "type">) {
  return <input type="hidden" {...props} />;
}

export { HiddenInput };
