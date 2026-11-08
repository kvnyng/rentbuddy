import tokens from "./tokens.json";

export { tokens };

export const STAGES = [
  "tracked",
  "contacted",
  "viewing-scheduled",
  "viewed",
  "applied",
  "signed",
  "passed",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  tracked: "Tracked",
  contacted: "Contacted",
  "viewing-scheduled": "Viewing scheduled",
  viewed: "Viewed",
  applied: "Applied",
  signed: "Signed",
  passed: "Passed",
};

/** Reference a token as a CSS variable, e.g. cssVar("semantic", "text"). */
export const cssVar = (...path: string[]) => `var(--rb-${path.join("-")})`;
