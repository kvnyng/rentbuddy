import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

/** Bugs and infrastructure failures end here: logged, and the client gets no internals. */
export const onError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) return error.getResponse();
  console.error("unhandled error", c.req.method, c.req.path, error);
  return c.json({ error: "internal" } as const, 500);
};

export const notFound: NotFoundHandler = (c) => c.json({ error: "not-found" } as const, 404);
