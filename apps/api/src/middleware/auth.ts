import type { UserId } from "@rentbuddy/core";
import { createMiddleware } from "hono/factory";
import type { Deps } from "../deps";

export type AuthedVariables = { deps: Deps; userId: UserId };

/** Every route behind this sees a parsed `userId`; anything else gets 401 before the handler runs. */
export const requireUser = createMiddleware<{ Variables: AuthedVariables }>(async (c, next) => {
  const result = await c.get("deps").authenticate(c.req.raw);
  if (!result.ok) {
    switch (result.error.kind) {
      case "missing-token":
        return c.json({ error: "unauthenticated" } as const, 401);
      case "invalid-token":
        console.warn("auth: invalid token", result.error.reason);
        return c.json({ error: "unauthenticated" } as const, 401);
    }
  }
  c.set("userId", result.value);
  await next();
  return undefined;
});
