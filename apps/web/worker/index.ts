import { clerkDeps, createApp } from "@rentbuddy/api";

type Env = { ASSETS: Fetcher };

const api = createApp(clerkDeps);

/**
 * `run_worker_first: ["/api/*"]` sends only API calls here; static files and SPA
 * routes are served from assets without invoking the Worker. The fallback to
 * ASSETS keeps that true if the routing config ever changes.
 */
export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) return api.fetch(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
