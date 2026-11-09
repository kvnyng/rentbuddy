import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../classNames";
import styles from "./Button.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** An icon before the label, e.g. a 16px lucide icon in a toolbar. Decorative: the label names the button. */
  leadingIcon?: ReactNode;
};

export function Button({ variant = "primary", size = "md", leadingIcon, className, type = "button", children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={classNames(styles.button, styles[variant], styles[size], className)} {...rest}>
      {leadingIcon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </button>
  );
}
