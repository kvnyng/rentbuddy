import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: unit tests don't need the Workers runtime or the router codegen.
export default defineConfig({ test: { include: ["src/**/*.test.ts", "build/**/*.test.ts"] } });
