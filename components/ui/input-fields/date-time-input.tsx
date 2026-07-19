import * as React from "react";
import { TextInput } from "./text-input";

function DateTimeInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="datetime-local" {...props} />;
}

export { DateTimeInput };
