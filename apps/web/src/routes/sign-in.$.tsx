import { SignIn } from "@clerk/react";
import { Logo } from "@rentbuddy/ui";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./auth.module.css";

export const Route = createFileRoute("/sign-in/$")({
  component: () => (
    <main className={styles.page}>
      <Logo size={56} />
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
    </main>
  ),
});
