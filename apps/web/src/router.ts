import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import type { Session } from "./lib/session";
import { routeTree } from "./routeTree.gen";

export type RouterContext = { queryClient: QueryClient; session: Exclude<Session, { kind: "loading" }> };

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: { queryClient, session: { kind: "signed-out" } } satisfies RouterContext,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
