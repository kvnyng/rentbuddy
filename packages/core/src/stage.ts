import { z } from "zod";
import { err, ok, type Result } from "./result";
import { ViewingId } from "./primitives";

/** The single list of stages. Labels, colors, columns and the DB enum are all keyed by this. */
export const STAGES = ["tracked", "contacted", "viewing-scheduled", "viewed", "applied", "signed", "passed"] as const;
export const Stage = z.enum(STAGES);
export type Stage = z.infer<typeof Stage>;
export type ActiveStage = Exclude<Stage, "passed">;

export const STAGE_LABELS: Record<Stage, string> = {
  tracked: "Tracked",
  contacted: "Contacted",
  "viewing-scheduled": "Viewing scheduled",
  viewed: "Viewed",
  applied: "Applied",
  signed: "Signed",
  passed: "Passed",
};

export const PASS_REASONS = [
  "unspecified",
  "too-expensive",
  "rented-to-someone-else",
  "didnt-like-it",
  "agent-unresponsive",
  "signed-elsewhere",
] as const;
export const PassReason = z.enum(PASS_REASONS);
export type PassReason = z.infer<typeof PassReason>;

/*
 * A stage carries only the data that stage requires and that isn't derivable
 * elsewhere. You can't be "viewing scheduled" without a viewing, and a passed
 * listing remembers exactly what to restore to.
 */
const ActiveStageState = z.discriminatedUnion("stage", [
  z.object({ stage: z.literal("tracked") }),
  z.object({ stage: z.literal("contacted") }),
  z.object({ stage: z.literal("viewing-scheduled"), viewingId: ViewingId }),
  z.object({ stage: z.literal("viewed"), viewingId: ViewingId }),
  z.object({ stage: z.literal("applied") }),
  z.object({ stage: z.literal("signed") }),
]);
export type ActiveStageState = z.infer<typeof ActiveStageState>;

export const StageState = z.discriminatedUnion("stage", [
  ...ActiveStageState.options,
  z.object({ stage: z.literal("passed"), previous: ActiveStageState, reason: PassReason }),
]);
export type StageState = z.infer<typeof StageState>;

/** Why a stage changed. Replaces an `auto: boolean`. */
export const AutoTrigger = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("first-outbound-email") }),
  z.object({ kind: z.literal("viewing-confirmed"), viewingId: ViewingId }),
  z.object({ kind: z.literal("viewing-time-passed"), viewingId: ViewingId }),
]);
export type AutoTrigger = z.infer<typeof AutoTrigger>;

export const StageChangeCause = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("user") }),
  z.object({ kind: z.literal("automatic"), trigger: AutoTrigger }),
]);
export type StageChangeCause = z.infer<typeof StageChangeCause>;

export type TransitionError =
  | { kind: "already-passed" }
  | { kind: "not-passed" }
  | { kind: "same-stage"; stage: Stage }
  | { kind: "use-pass-to-pass" };

/** Manual move between active stages, in any direction. */
export function moveTo(current: StageState, next: ActiveStageState): Result<StageState, TransitionError> {
  if (current.stage === "passed") return err({ kind: "already-passed" });
  if (current.stage === next.stage) return err({ kind: "same-stage", stage: next.stage });
  return ok(next);
}

export function pass(current: StageState, reason: PassReason): Result<StageState, TransitionError> {
  if (current.stage === "passed") return err({ kind: "already-passed" });
  return ok({ stage: "passed", previous: current, reason });
}

export function restore(current: StageState): Result<StageState, TransitionError> {
  if (current.stage !== "passed") return err({ kind: "not-passed" });
  return ok(current.previous);
}

const ORDER: Record<ActiveStage, number> = {
  tracked: 0,
  contacted: 1,
  "viewing-scheduled": 2,
  viewed: 3,
  applied: 4,
  signed: 5,
};

export type AutoAdvanceOutcome =
  | { kind: "advanced"; next: StageState }
  | { kind: "unchanged"; reason: "passed" | "already-at-or-past-stage" | "different-viewing" };

/** Automatic moves only go forward and never touch a passed listing. */
export function autoAdvance(current: StageState, trigger: AutoTrigger): AutoAdvanceOutcome {
  if (current.stage === "passed") return { kind: "unchanged", reason: "passed" };

  const target = targetFor(trigger);
  if (ORDER[target.stage] <= ORDER[current.stage]) return { kind: "unchanged", reason: "already-at-or-past-stage" };

  if (trigger.kind === "viewing-time-passed") {
    // Only the viewing the listing is scheduled for can mark it viewed.
    if (current.stage !== "viewing-scheduled" || current.viewingId !== trigger.viewingId) {
      return { kind: "unchanged", reason: "different-viewing" };
    }
  }
  return { kind: "advanced", next: target };
}

function targetFor(trigger: AutoTrigger): ActiveStageState {
  switch (trigger.kind) {
    case "first-outbound-email":
      return { stage: "contacted" };
    case "viewing-confirmed":
      return { stage: "viewing-scheduled", viewingId: trigger.viewingId };
    case "viewing-time-passed":
      return { stage: "viewed", viewingId: trigger.viewingId };
  }
}
