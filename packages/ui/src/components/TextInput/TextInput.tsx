import type { ComponentPropsWithRef } from "react";
import { classNames } from "../../classNames";
import styles from "./TextInput.module.css";

/** A native <input>: every input prop, including `ref`, is forwarded. Wrap it in Field for a label. */
export type TextInputProps = ComponentPropsWithRef<"input">;

export function TextInput({ className, type = "text", ...rest }: TextInputProps) {
  return <input type={type} className={classNames(styles.input, className)} {...rest} />;
}
