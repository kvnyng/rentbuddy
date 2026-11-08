import type { ReactNode } from "react";
import { STAGE_LABELS, type Stage } from "@rentbuddy/core";
import styles from "./KanbanColumn.module.css";

/** The count is derived from `items`, so it can never disagree with the cards shown. */
export type KanbanColumnProps<T> = {
  stage: Stage;
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

export function KanbanColumn<T>({ stage, items, getKey, renderItem }: KanbanColumnProps<T>) {
  return (
    <section className={styles.column} style={{ "--accent": `var(--rb-stage-${stage}-accent)` }}>
      <header className={styles.header}>
        <h3 className={styles.title}>{STAGE_LABELS[stage]}</h3>
        <span className={styles.count}>{items.length}</span>
      </header>
      <div className={styles.cards}>
        {items.length === 0 ? (
          <p className={styles.empty}>No listings yet</p>
        ) : (
          items.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)
        )}
      </div>
    </section>
  );
}
