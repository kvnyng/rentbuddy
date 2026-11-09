import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { unstable_readConfig } from "wrangler";
import { publishableKeyForBuild } from "./build/publishable-key";

/*
 * The Cloudflare environment (top level = production, "preview") is picked with
 * CLOUDFLARE_ENV at dev/build time; `wrangler deploy` then uses the built config.
 * wrangler.jsonc is the one place the Clerk publishable key lives: the Worker
 * reads it as a var, and the SPA gets the same value inlined at build time.
 * Local dev only: VITE_CLERK_PUBLISHABLE_KEY in .env.local (with CLERK_PUBLISHABLE_KEY
 * in .dev.vars for the Worker) overrides it, for a Clerk dev instance not yet in wrangler.jsonc.
 */
const cloudflareEnv = process.env.CLOUDFLARE_ENV;
const { vars } = unstable_readConfig({ config: "wrangler.jsonc", env: cloudflareEnv });

export default defineConfig(({ command, mode }) => {
  const local = command === "serve" ? loadEnv(mode, process.cwd(), "VITE_").VITE_CLERK_PUBLISHABLE_KEY : undefined;
  const key = publishableKeyForBuild(vars, local, cloudflareEnv ?? "production");
  return {
    plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), cloudflare()],
    define: { "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(key) },
  };
});
