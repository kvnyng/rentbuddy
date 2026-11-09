import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { makeApi } from "../lib/api";

/** Everything under here needs a signed-in renter, and gets a typed API client in context. */
export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    switch (context.session.kind) {
      case "signed-out":
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router's redirect protocol
        throw redirect({ to: "/sign-in/$", params: { _splat: "" } });
      case "signed-in":
        return { api: makeApi(context.session.getToken) };
    }
  },
  component: Outlet,
});
