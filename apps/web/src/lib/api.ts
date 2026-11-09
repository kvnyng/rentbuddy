import type { AppType } from "@rentbuddy/api";
import { Me } from "@rentbuddy/core";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

export type Api = ReturnType<typeof makeApi>;

/** Typed client for the Worker's /api routes, sending the Clerk session token. */
export function makeApi(getToken: () => Promise<string | null>, origin = window.location.origin, fetch?: typeof globalThis.fetch) {
  return hc<AppType>(origin, {
    ...(fetch === undefined ? {} : { fetch }),
    headers: async (): Promise<Record<string, string>> => {
      const token = await getToken();
      return token === null ? {} : { Authorization: `Bearer ${token}` };
    },
  }).api;
}

export const meKeys = { all: ["me"] as const };

/** The response is parsed again here: the network is a boundary. */
export const meQuery = (api: Api) =>
  queryOptions({
    queryKey: meKeys.all,
    queryFn: async () => {
      // The typed client only knows the 200 shape; a 401/500 body fails this parse.
      const res = await api.me.$get();
      const parsed = Me.safeParse(await res.json());
      if (!parsed.success) throw new Error(`GET /api/me: unexpected ${res.status} response`);
      return parsed.data;
    },
  });
