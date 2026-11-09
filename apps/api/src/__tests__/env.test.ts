import { describe, expect, it } from "vitest";
import { AllowedOrigin, ApiEnv, authorizedParty } from "../env";

describe("AllowedOrigin", () => {
  it("parses an exact origin and ignores the request", () => {
    const allowed = AllowedOrigin.parse("https://rentbuddy.pablos.cc/");
    expect(allowed).toEqual({ kind: "exact", origin: "https://rentbuddy.pablos.cc" });
    expect(authorizedParty(allowed, "https://evil.example/api/me")).toBe("https://rentbuddy.pablos.cc");
  });

  it("allows only one extra label in front of a preview wildcard", () => {
    const allowed = AllowedOrigin.parse("https://*-rentbuddy-preview.kvnyng.workers.dev");
    expect(authorizedParty(allowed, "https://pr-12-rentbuddy-preview.kvnyng.workers.dev/api/me")).toBe(
      "https://pr-12-rentbuddy-preview.kvnyng.workers.dev",
    );
    expect(authorizedParty(allowed, "https://a.b-rentbuddy-preview.kvnyng.workers.dev/api/me")).toBeNull();
    expect(authorizedParty(allowed, "https://x-rentbuddy-preview.kvnyng.workers.dev.evil.example/")).toBeNull();
    expect(authorizedParty(allowed, "http://pr-1-rentbuddy-preview.kvnyng.workers.dev/")).toBeNull();
  });

  it("rejects non-URLs and placeholders", () => {
    for (const bad of [
      "rentbuddy",
      "https://*-rentbuddy-preview.REPLACE_ME.workers.dev",
      "https://rentbuddy-preview.REPLACE_ME.workers.dev",
    ]) {
      expect(AllowedOrigin.safeParse(bad).success, bad).toBe(false);
    }
    expect(AllowedOrigin.safeParse("http://localhost:61010").success).toBe(true);
  });
});

describe("ApiEnv", () => {
  const good = {
    CLERK_SECRET_KEY: "sk_test_x",
    CLERK_PUBLISHABLE_KEY: `pk_test_${btoa("fond-cat-12.clerk.accounts.dev$")}`,
    APP_ORIGIN: "https://rentbuddy.pablos.cc",
  };

  it("parses real-shaped config", () => {
    expect(ApiEnv.safeParse(good).success).toBe(true);
  });

  it("refuses the wrangler.jsonc placeholder publishable key", () => {
    expect(ApiEnv.safeParse({ ...good, CLERK_PUBLISHABLE_KEY: "pk_live_REPLACE_ME" }).success).toBe(false);
  });
});
