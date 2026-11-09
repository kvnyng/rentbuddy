import { createClerkClient } from "@clerk/backend";
import { Me, UserId, err, ok } from "@rentbuddy/core";
import type { Deps } from "./deps";
import { authorizedParty, type ApiEnv } from "./env";

/** The production dependencies: Clerk verifies session tokens and serves profiles. */
export function clerkDeps(env: ApiEnv): Deps {
  const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY, publishableKey: env.CLERK_PUBLISHABLE_KEY });

  return {
    async authenticate(request) {
      if (request.headers.get("Authorization") === null) return err({ kind: "missing-token" });
      const party = authorizedParty(env.APP_ORIGIN, request.url);
      if (party === null) return err({ kind: "invalid-token", reason: "unexpected origin" });
      const state = await clerk.authenticateRequest(request, { authorizedParties: [party] });
      if (!state.isAuthenticated) return err({ kind: "invalid-token", reason: state.reason });
      // A Clerk user id that doesn't parse is a bug on their side or ours; let it throw.
      return ok(UserId.parse(state.toAuth().userId));
    },

    async users(userId) {
      const user = await clerk.users.getUser(userId);
      return Me.parse({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        phone: user.primaryPhoneNumber?.phoneNumber ?? null,
      });
    },
  };
}
