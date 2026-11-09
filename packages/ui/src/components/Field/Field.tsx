import { useId, type ReactNode } from "react";
import styles from "./Field.module.css";

export type FieldStatus = { kind: "idle" } | { kind: "error"; message: string };

/** Props Field hands to its control, so the label, hint and error are always wired up. */
export type FieldControlProps = { id: string; "aria-describedby"?: string; "aria-invalid"?: true };

export type FieldProps = {
  label: string;
  hint?: string;
  status?: FieldStatus;
  /** Optional action at the right of the label row, e.g. a small link. */
  labelAction?: ReactNode;
  children: (control: FieldControlProps) => ReactNode;
};

/** A label above a control, with a hint or an error message below it. */
export function Field({ label, hint, status = { kind: "idle" }, labelAction, children }: FieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const [control, note] = describe(status, hint, id, noteId);
  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {labelAction}
      </div>
      {children(control)}
      {note}
    </div>
  );
}

function describe(status: FieldStatus, hint: string | undefined, id: string, noteId: string): [FieldControlProps, ReactNode] {
  switch (status.kind) {
    case "idle":
      return hint === undefined
        ? [{ id }, null]
        : [{ id, "aria-describedby": noteId }, <p key="hint" id={noteId} className={styles.hint}>{hint}</p>];
    case "error":
      return [
        { id, "aria-describedby": noteId, "aria-invalid": true },
        <p key="error" id={noteId} className={styles.error}>{status.message}</p>,
      ];
  }
}
