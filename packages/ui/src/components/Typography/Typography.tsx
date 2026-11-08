import type { ElementType, ReactNode } from "react";
import styles from "./Typography.module.css";

type Common = { children: ReactNode; className?: string };

type HeadingLevel = 1 | 2 | 3 | 4;
const HEADING_TAG = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const satisfies Record<HeadingLevel, ElementType>;

export type HeadingProps = Common & { level?: HeadingLevel };
/** Headers and titles — Sen. */
export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = HEADING_TAG[level];
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
