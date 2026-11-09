import { ClerkPublishableKey, isHostname } from "@rentbuddy/core";
import { z } from "zod";

/**
 * Which page origin may present Clerk session tokens (Clerk's `authorizedParties`).
 * Production is one exact origin. Preview versions each get their own URL
 * (`<alias>-rentbuddy-preview.<subdomain>.workers.dev`), so preview allows a
 * wildcard on the first label only, written `https://*-rentbuddy-preview.<subdomain>.workers.dev`.
 */
export const AllowedOrigin = z.union([
  z
    .string()
    .regex(/^https:\/\/\*[-.][a-z0-9.-]+$/, "wildcard origin")
    .refine((s) => isHostname(`x${s.slice("https://*".length)}`), "wildcard origin must end in a real hostname")
    .transform((s) => ({ kind: "any-prefix" as const, suffix: s.slice("https://*".length) })),
  z
    .url({ protocol: /^https?$/ })
    // zod still runs refinements after .url() fails, so guard the parse.
    .refine((u) => {
      const hostname = URL.canParse(u) ? new URL(u).hostname : "";
      return hostname === "localhost" || isHostname(hostname);
    }, "origin must be a real hostname")
    .transform((u) => ({ kind: "exact" as const, origin: new URL(u).origin })),
]);
export type AllowedOrigin = z.infer<typeof AllowedOrigin>;

/** The origin Clerk should accept for this request, or null if the request comes from elsewhere. */
export function authorizedParty(allowed: AllowedOrigin, requestUrl: string): string | null {
  switch (allowed.kind) {
    case "exact":
      return allowed.origin;
    case "any-prefix": {
      const { protocol, host, origin } = new URL(requestUrl);
      const prefix = host.slice(0, host.length - allowed.suffix.length);
      return protocol === "https:" && host.endsWith(allowed.suffix) && /^[a-z0-9-]+$/.test(prefix) ? origin : null;
    }
  }
}

/**
 * Worker bindings the API reads, parsed once per isolate. Secrets are set with
 * `wrangler secret put` (see apps/web/.dev.vars.example); vars live in wrangler.jsonc.
 */
export const ApiEnv = z.object({
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  CLERK_PUBLISHABLE_KEY: ClerkPublishableKey,
  APP_ORIGIN: AllowedOrigin,
});
export type ApiEnv = z.infer<typeof ApiEnv>;
