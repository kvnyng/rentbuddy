import { useLayoutEffect, useRef, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { Button, type ButtonProps } from "../Button/Button";
import { classNames } from "../../classNames";
import styles from "./Toolbar.module.css";

export type ToolbarProps = { /** Names the toolbar for screen readers. */ label: string; children: ReactNode };

/**
 * A row of actions. One Tab stop: Left/Right move between buttons (wrapping),
 * Home/End jump to the ends, and Tab leaves the toolbar (roving tabindex).
 */
export function Toolbar({ label, children }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const buttons = () => Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
  const makeTabStop = (stop: HTMLButtonElement | undefined) => {
    for (const b of buttons()) b.tabIndex = b === stop ? 0 : -1;
  };

  useLayoutEffect(() => {
    const all = buttons();
    makeTabStop(all.find((b) => b.tabIndex === 0) ?? all[0]);
  });

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement) makeTabStop(e.target);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const all = buttons();
    const at = all.findIndex((b) => b === document.activeElement);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: all.length - 1 }[e.key];
    if (to === undefined || at === -1 || all.length === 0) return;
    e.preventDefault();
    all[(to + all.length) % all.length]?.focus();
  };

  return (
    <div ref={ref} role="toolbar" aria-label={label} className={styles.toolbar} onFocus={onFocus} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

export type ToolbarButtonProps = Omit<ButtonProps, "variant" | "size" | "leadingIcon"> & { icon: ReactNode };

/** A ghost Button with a leading icon. Pass `aria-pressed` for a toggle; pressed shows the selected fill. */
export function ToolbarButton({ icon, className, ...rest }: ToolbarButtonProps) {
  return <Button variant="ghost" size="sm" leadingIcon={icon} className={classNames(styles.button, className)} {...rest} />;
}
