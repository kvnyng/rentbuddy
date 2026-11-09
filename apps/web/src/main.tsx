import "@rentbuddy/ui/base.css";
import "@rentbuddy/ui/fonts.css";
import { ClerkProvider } from "@clerk/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { clientEnv } from "./env";
import { clerkAppearance } from "./lib/clerk-appearance";
import { useSession } from "./lib/session";
import { queryClient, router } from "./router";

/** Routes decide on a settled session, so nothing renders until Clerk has loaded. */
function App() {
  const session = useSession();
  useEffect(() => {
    if (session.kind !== "loading") void router.invalidate();
  }, [session.kind]);

  switch (session.kind) {
    case "loading":
      return null;
    case "signed-out":
    case "signed-in":
      return <RouterProvider router={router} context={{ queryClient, session }} />;
  }
}

const root = document.getElementById("root");
if (root === null) throw new Error("#root missing from index.html");

createRoot(root).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clientEnv.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
);
