import { STAGE_LABELS, type Stage } from "../../tokens/tokens";
import styles from "./StageBadge.module.css";

export type StageBadgeProps = { stage: Stage };

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={styles.badge}
      style={{
        background: `var(--rb-stage-${stage}-bg)`,
        color: `var(--rb-stage-${stage}-fg)`,
        ["--dot" as string]: `var(--rb-stage-${stage}-accent)`,
      }}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
