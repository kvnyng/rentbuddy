import { describe, expect, it } from "vitest";
import { Me, PhoneNumber } from "../index";

describe("PhoneNumber parses to E.164", () => {
  it("accepts E.164 and strips formatting", () => {
    expect(PhoneNumber.parse("+12125550123")).toBe("+12125550123");
    expect(PhoneNumber.parse("+1 (212) 555-0123")).toBe("+12125550123");
    expect(PhoneNumber.parse("+44 20.7946.0958")).toBe("+442079460958");
  });

  it("rejects numbers without a country code, a leading zero, letters, or too many digits", () => {
    for (const bad of ["2125550123", "+0212555012", "+1 212 CALL NOW", "+1234567890123456", "+", ""]) {
      expect(PhoneNumber.safeParse(bad).success, bad).toBe(false);
    }
  });
});

describe("Me", () => {
  it("parses a renter with a missing phone as null, not undefined", () => {
    const me = Me.parse({ userId: "user_2abc", email: "Kevin@Example.com", phone: null });
    expect(me).toEqual({ userId: "user_2abc", email: "kevin@example.com", phone: null });
    expect(Me.safeParse({ userId: "user_2abc", email: "kevin@example.com" }).success).toBe(false);
  });
});
