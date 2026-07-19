import * as React from "react";
import { TextInput } from "./text-input";

function NumberInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="number" inputMode="numeric" {...props} />;
}

export { NumberInput };
