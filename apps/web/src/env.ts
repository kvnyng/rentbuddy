import { ClerkPublishableKey } from "@rentbuddy/core";
import { z } from "zod";

/** Build-time config for the SPA, inlined by vite.config.ts from wrangler.jsonc. Public values only. */
const ClientEnv = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: ClerkPublishableKey,
});

export const clientEnv = ClientEnv.parse(import.meta.env);
