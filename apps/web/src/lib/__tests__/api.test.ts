import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { makeApi, meQuery } from "../api";

const respond = (status: number, body: unknown) => {
  const seen: Request[] = [];
  const fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push(new Request(input, init));
    return Promise.resolve(Response.json(body, { status }));
  };
  return { fetch, seen };
};

const run = (status: number, body: unknown, token: string | null = "tok") => {
  const { fetch, seen } = respond(status, body);
  const api = makeApi(() => Promise.resolve(token), "https://rentbuddy.test", fetch);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return { result: client.query(meQuery(api)), seen };
};

describe("meQuery", () => {
  it("sends the session token and parses the profile", async () => {
    const { result, seen } = run(200, { userId: "user_2abc", email: "a@b.co", phone: "+12125550123" });
    expect(await result).toEqual({ userId: "user_2abc", email: "a@b.co", phone: "+12125550123" });
    expect(seen[0]?.headers.get("Authorization")).toBe("Bearer tok");
    expect(seen[0]?.url).toBe("https://rentbuddy.test/api/me");
  });

  it("sends no Authorization header when signed out", async () => {
    const { result, seen } = run(401, { error: "unauthenticated" }, null);
    await expect(result).rejects.toThrow("unexpected 401");
    expect(seen[0]?.headers.has("Authorization")).toBe(false);
  });
});
