import { z } from "zod";

const HOSTNAME = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

const decodeBase64 = (s: string): string | null => {
  try {
    return atob(s);
  } catch {
    return null;
  }
};

/**
 * A Clerk publishable key: `pk_test_` or `pk_live_`, then base64 of the instance's
 * Frontend API host followed by `$`. Parsing the real shape means a placeholder
 * like `pk_live_REPLACE_ME` fails the build and the Worker instead of shipping.
 */
export const ClerkPublishableKey = z
  .string()
  .regex(/^pk_(test|live)_[A-Za-z0-9+/]+={0,2}$/, "Clerk publishable key")
  .refine((key) => {
    const decoded = decodeBase64(key.slice("pk_live_".length));
    return decoded !== null && decoded.endsWith("$") && HOSTNAME.test(decoded.slice(0, -1));
  }, "Clerk publishable key must encode a Frontend API host")
  .brand<"ClerkPublishableKey">();
export type ClerkPublishableKey = z.infer<typeof ClerkPublishableKey>;

/** True for a DNS hostname made of lowercase letters, digits, dots and dashes. */
export const isHostname = (host: string): boolean => HOSTNAME.test(host);
