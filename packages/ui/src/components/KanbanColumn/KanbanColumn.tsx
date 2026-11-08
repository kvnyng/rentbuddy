import type { ReactNode } from "react";
import { STAGE_LABELS, type Stage } from "../../tokens/tokens";
import styles from "./KanbanColumn.module.css";

export type KanbanColumnProps = { stage: Stage; count?: number; children?: ReactNode };

export function KanbanColumn({ stage, count, children }: KanbanColumnProps) {
  return (
    <section className={styles.column} style={{ ["--accent" as string]: `var(--rb-stage-${stage}-accent)` }}>
      <header className={styles.header}>
        <h3 className={styles.title}>{STAGE_LABELS[stage]}</h3>
        {count !== undefined && <span className={styles.count}>{count}</span>}
      </header>
      <div className={styles.cards}>
        {children ?? <p className={styles.empty}>No listings yet</p>}
      </div>
    </section>
  );
}
