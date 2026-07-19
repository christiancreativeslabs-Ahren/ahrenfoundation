import * as React from "react";
import { TextInput } from "./text-input";

function UrlInput(props: Omit<React.ComponentProps<typeof TextInput>, "type">) {
  return <TextInput type="url" inputMode="url" autoComplete="url" {...props} />;
}

export { UrlInput };
