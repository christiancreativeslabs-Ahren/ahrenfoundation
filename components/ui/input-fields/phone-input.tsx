import * as React from "react";
import { TextInput } from "./text-input";

function PhoneInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="tel" inputMode="tel" autoComplete="tel" {...props} />;
}

export { PhoneInput };
