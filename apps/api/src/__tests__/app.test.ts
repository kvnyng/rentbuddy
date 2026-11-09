import { Me, UserId, err, ok } from "@rentbuddy/core";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import type { Deps } from "../deps";

const env = {
  CLERK_SECRET_KEY: "sk_test_stub",
  CLERK_PUBLISHABLE_KEY: `pk_test_${btoa("fond-cat-12.clerk.accounts.dev$")}`,
  APP_ORIGIN: "https://rentbuddy.pablos.cc/",
};
const userId = UserId.parse("user_2renter");

/** Stub verifier: "Bearer good" is a valid session for `userId`. */
const stubDeps: Deps = {
  authenticate: (request) => {
    const header = request.headers.get("Authorization");
    if (header === null) return Promise.resolve(err({ kind: "missing-token" }));
    if (header !== "Bearer good") return Promise.resolve(err({ kind: "invalid-token", reason: "bad signature" }));
    return Promise.resolve(ok(userId));
  },
  users: (id) => Promise.resolve(Me.parse({ userId: id, email: "renter@example.com", phone: "+1 212 555 0123" })),
};

const app = createApp(() => stubDeps);
const get = (path: string, headers: Record<string, string> = {}, bindings: object = env) =>
  app.request(path, { headers }, bindings);

describe("GET /api/me", () => {
  it("401s without a token", async () => {
    const res = await get("/api/me");
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthenticated" });
  });

  it("401s with an invalid token", async () => {
    expect((await get("/api/me", { Authorization: "Bearer forged" })).status).toBe(401);
  });

  it("returns the parsed profile with a valid token", async () => {
    const res = await get("/api/me", { Authorization: "Bearer good" });
    expect(res.status).toBe(200);
    expect(Me.parse(await res.json())).toEqual({ userId, email: "renter@example.com", phone: "+12125550123" });
  });
});

describe("app plumbing", () => {
  it("404s unknown API routes as JSON", async () => {
    const res = await get("/api/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not-found" });
  });

  it("refuses to run with unparseable bindings, without leaking why", async () => {
    const res = await get("/api/me", { Authorization: "Bearer good" }, { CLERK_SECRET_KEY: "oops" });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal" });
  });

  it("turns a failing dependency into a 500", async () => {
    const broken = createApp(() => ({ ...stubDeps, users: () => Promise.reject(new Error("clerk down")) }));
    const res = await broken.request("/api/me", { headers: { Authorization: "Bearer good" } }, env);
    expect(res.status).toBe(500);
  });
});
