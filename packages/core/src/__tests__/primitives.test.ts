import { describe, expect, it } from "vitest";
import { Bathrooms, Bedrooms, IanaTimeZone, Money, StageState, TimeSlot, Viewing, dollars } from "../index";

describe("primitives parse instead of validate", () => {
  it("Money is integer cents", () => {
    expect(dollars(3850)).toBe(385000);
    expect(Money.safeParse(12.5).success).toBe(false);
    expect(Money.safeParse(-1).success).toBe(false);
  });

  it("bathrooms come in halves", () => {
    expect(Bathrooms.safeParse(1.5).success).toBe(true);
    expect(Bathrooms.safeParse(1.25).success).toBe(false);
  });

  it("a studio is not zero bedrooms", () => {
    expect(Bedrooms.safeParse({ kind: "bedrooms", count: 0 }).success).toBe(false);
    expect(Bedrooms.safeParse({ kind: "studio" }).success).toBe(true);
  });

  it("time slots must end after they start", () => {
    expect(TimeSlot.safeParse({ start: "2026-11-11T19:00:00Z", end: "2026-11-11T18:00:00Z" }).success).toBe(false);
  });
});

describe("unions reject impossible combinations", () => {
  const slot = { start: "2026-11-11T18:30:00Z", end: "2026-11-11T19:00:00Z" };
  const id = "7b0d6f9a-3c5e-4f7a-9d1e-2a4b6c8d0e1f";

  it("a confirmed viewing needs confirmedAt", () => {
    expect(Viewing.safeParse({ status: "confirmed", id, slot, source: { kind: "entered-by-user" } }).success).toBe(false);
  });

  it("viewing-scheduled needs a viewing", () => {
    expect(StageState.safeParse({ stage: "viewing-scheduled" }).success).toBe(false);
  });

  it("passed must remember an active previous stage", () => {
    const nested = { stage: "passed", reason: "unspecified", previous: { stage: "passed", reason: "unspecified", previous: { stage: "tracked" } } };
    expect(StageState.safeParse(nested).success).toBe(false);
  });
});

describe("wire codecs", () => {
  it("timestamps round-trip between ISO strings and Dates", () => {
    const wire = { start: "2026-11-11T23:30:00.000Z", end: "2026-11-12T00:00:00.000Z" };
    const slot = TimeSlot.parse(wire);
    expect(slot.start).toBeInstanceOf(Date);
    expect(TimeSlot.encode(slot)).toEqual(wire);
  });
});

describe("time zones", () => {
  it("accepts IANA zones and rejects anything else", () => {
    expect(IanaTimeZone.safeParse("America/New_York").success).toBe(true);
    expect(IanaTimeZone.safeParse("Eastern").success).toBe(false);
    expect(IanaTimeZone.safeParse("").success).toBe(false);
  });
});
