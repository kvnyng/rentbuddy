import { describe, expect, it } from "vitest";
import { ClerkPublishableKey } from "../index";

const key = (prefix: string, host: string) => `${prefix}${btoa(`${host}$`)}`;

describe("ClerkPublishableKey", () => {
  it("accepts test and live keys that encode a Frontend API host", () => {
    expect(ClerkPublishableKey.safeParse(key("pk_test_", "fond-cat-12.clerk.accounts.dev")).success).toBe(true);
    expect(ClerkPublishableKey.safeParse(key("pk_live_", "clerk.rentbuddy.pablos.cc")).success).toBe(true);
  });

  it("rejects placeholders and other shapes", () => {
    for (const bad of [
      "pk_live_REPLACE_ME",
      "pk_test_REPLACE_ME",
      "pk_test_...",
      key("sk_test_", "fond-cat-12.clerk.accounts.dev"),
      key("pk_test_", "not a host"),
      `pk_test_${btoa("clerk.example.com")}`, // missing the trailing $
    ]) {
      expect(ClerkPublishableKey.safeParse(bad).success, bad).toBe(false);
    }
  });
});
