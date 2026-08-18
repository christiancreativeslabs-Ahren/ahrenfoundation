import * as React from "react";
import { TextInput } from "./text-input";

function DateInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="date" {...props} />;
}

export { DateInput };
