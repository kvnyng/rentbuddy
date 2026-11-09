import type { Me, Result, UserId } from "@rentbuddy/core";

export type AuthError = { kind: "missing-token" } | { kind: "invalid-token"; reason: string };

/** Turns a request into the signed-in user's id, or says why it can't. */
export type Authenticator = (request: Request) => Promise<Result<UserId, AuthError>>;

/** Looks up the renter's profile. Throws only on infrastructure failure. */
export type UserDirectory = (userId: UserId) => Promise<Me>;

export type Deps = { authenticate: Authenticator; users: UserDirectory };
