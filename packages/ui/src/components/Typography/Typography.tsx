import type { ElementType, ReactNode } from "react";
import styles from "./Typography.module.css";

type Common = { children: ReactNode; className?: string };

export type HeadingProps = Common & { level?: 1 | 2 | 3 | 4 };
/** Headers and titles — Sen. */
export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return <Tag className={[styles.heading, styles[`h${level}`], className].filter(Boolean).join(" ")}>{children}</Tag>;
}

export type SubtitleProps = Common & { as?: ElementType };
/** Subtitles — Sanchez. */
export function Subtitle({ as: Tag = "p", children, className }: SubtitleProps) {
  return <Tag className={[styles.subtitle, className].filter(Boolean).join(" ")}>{children}</Tag>;
}

export type TextProps = Common & {
  as?: ElementType;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "muted" | "subtle";
  weight?: "regular" | "medium" | "bold";
};
/** Body copy — DM Sans. */
export function Text({ as: Tag = "p", size = "md", tone = "default", weight = "regular", children, className }: TextProps) {
  return (
    <Tag className={[styles.text, styles[`size-${size}`], styles[`tone-${tone}`], styles[`weight-${weight}`], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
