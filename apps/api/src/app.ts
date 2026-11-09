import { Hono } from "hono";
import type { Deps } from "./deps";
import { ApiEnv } from "./env";
import { notFound, onError } from "./middleware/errors";
import { me } from "./routes/me";

/**
 * The API, mounted at /api by the Worker. `makeDeps` builds the services from
 * parsed env; tests pass stubs instead of Clerk.
 */
export function createApp(makeDeps: (env: ApiEnv) => Deps) {
  // Bindings are the same object for the life of an isolate, so parse once per object.
  const cache = new WeakMap<object, Deps>();

  const app = new Hono<{ Bindings: object; Variables: { deps: Deps } }>().basePath("/api");
  app.onError(onError);
  app.notFound(notFound);
  app.use(async (c, next) => {
    let deps = cache.get(c.env);
    if (deps === undefined) {
      deps = makeDeps(ApiEnv.parse(c.env));
      cache.set(c.env, deps);
    }
    c.set("deps", deps);
    await next();
  });
  return app.route("/me", me);
}

export type AppType = ReturnType<typeof createApp>;
