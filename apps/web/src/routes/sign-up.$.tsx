import { SignUp } from "@clerk/react";
import { Logo } from "@rentbuddy/ui";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./auth.module.css";

/**
 * Invite-only: Clerk is in restricted sign-up mode, so this form only completes
 * when opened from an invitation link (`?__clerk_ticket=…`). Email and phone are
 * required, verified identifiers in the Clerk instance settings.
 */
export const Route = createFileRoute("/sign-up/$")({
  component: () => (
    <main className={styles.page}>
      <Logo size={56} />
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />
    </main>
  ),
});
