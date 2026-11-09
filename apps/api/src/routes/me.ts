import { Me } from "@rentbuddy/core";
import { Hono } from "hono";
import { requireUser, type AuthedVariables } from "../middleware/auth";

export const me = new Hono<{ Variables: AuthedVariables }>().get("/", requireUser, async (c) => {
  const profile = await c.get("deps").users(c.get("userId"));
  // Parsed on the way out too: the response is exactly the contract, nothing extra leaks.
  return c.json(Me.parse(profile), 200);
});
