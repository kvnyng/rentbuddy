import { describe, expect, it } from "vitest";
import { ViewingId, autoAdvance, moveTo, pass, restore, type StageState } from "../index";

const v1 = ViewingId.parse("7b0d6f9a-3c5e-4f7a-9d1e-2a4b6c8d0e1f");
const v2 = ViewingId.parse("1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f");

describe("stage machine", () => {
  it("pass remembers the exact previous state and restore returns it", () => {
    const scheduled: StageState = { stage: "viewing-scheduled", viewingId: v1 };
    const passed = pass(scheduled, "too-expensive");
    expect(passed).toEqual({ ok: true, value: { stage: "passed", previous: scheduled, reason: "too-expensive" } });
    if (!passed.ok) throw new Error("unreachable");
    expect(restore(passed.value)).toEqual({ ok: true, value: scheduled });
  });

  it("rejects moves out of passed and restoring an active listing", () => {
    const passed: StageState = { stage: "passed", previous: { stage: "tracked" }, reason: "unspecified" };
    expect(moveTo(passed, { stage: "contacted" })).toEqual({ ok: false, error: { kind: "already-passed" } });
    expect(restore({ stage: "tracked" })).toEqual({ ok: false, error: { kind: "not-passed" } });
  });

  it("auto-advance only moves forward", () => {
    expect(autoAdvance({ stage: "tracked" }, { kind: "first-outbound-email" })).toEqual({
      kind: "advanced",
      next: { stage: "contacted" },
    });
    expect(autoAdvance({ stage: "applied" }, { kind: "first-outbound-email" })).toEqual({
      kind: "unchanged",
      reason: "already-at-or-past-stage",
    });
  });

  it("only the scheduled viewing can mark a listing viewed", () => {
    const scheduled: StageState = { stage: "viewing-scheduled", viewingId: v1 };
    expect(autoAdvance(scheduled, { kind: "viewing-time-passed", viewingId: v2 })).toEqual({
      kind: "unchanged",
      reason: "different-viewing",
    });
    expect(autoAdvance(scheduled, { kind: "viewing-time-passed", viewingId: v1 })).toEqual({
      kind: "advanced",
      next: { stage: "viewed", viewingId: v1 },
    });
  });

  it("never auto-advances a passed listing", () => {
    const passed: StageState = { stage: "passed", previous: { stage: "contacted" }, reason: "unspecified" };
    expect(autoAdvance(passed, { kind: "viewing-confirmed", viewingId: v1 })).toEqual({ kind: "unchanged", reason: "passed" });
  });
});
