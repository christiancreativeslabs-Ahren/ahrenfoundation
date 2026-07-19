import * as React from "react";
import { TextInput } from "./text-input";

function EmailInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="email" inputMode="email" autoComplete="email" {...props} />;
}

export { EmailInput };
