import { useAuth } from "@clerk/react";

/** Clerk's isLoaded/isSignedIn booleans, turned into one state the router can switch on. */
export type Session =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "signed-in"; getToken: () => Promise<string | null> };

export function useSession(): Session {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  if (!isLoaded) return { kind: "loading" };
  return isSignedIn ? { kind: "signed-in", getToken: () => getToken() } : { kind: "signed-out" };
}
