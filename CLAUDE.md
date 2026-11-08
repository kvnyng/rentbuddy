# RentBuddy

TypeScript monorepo (pnpm + Turborepo): Vite + React, TanStack Router + Query, Hono on Cloudflare Workers (Workflows, Queues, R2, Hyperdrive), zod, Clerk, Postmark, Neon + Drizzle, WXT extension. Production: https://rentbuddy.pablos.cc.

- Architecture and execution flows: `docs/architecture.md`
- **Engineering principles (mandatory): `docs/principles.md`.** In short: parse, don't validate; make invalid states unrepresentable; every state explicit and exhaustive; expected failures are `Result` values; one source of truth.

## Rules that are easy to get wrong

- Domain types live in `packages/core` as zod schemas; types are `z.infer`. Never hand-write a duplicate interface.
- Parse at every boundary (HTTP in and out, webhooks, DB rows, env, LLM output, listing pages). No `as` casts, no `!`.
- Status-plus-optional-fields is banned. Use discriminated unions; switch on them with no `default`.
- No booleans that pick between kinds, no magic values (`0` = studio). Money is branded integer cents.
- Domain absence is `T | null`; `?:` only on inputs.
- Postgres mirrors type invariants with enums and `CHECK` constraints.
- Change the type first, then follow the compiler.

## Commands

```bash
pnpm install
pnpm typecheck && pnpm lint && pnpm test
pnpm ladle         # design system
```

CI runs on GitHub Actions (personal repo; chosen over the org Buildkite default). Work lands through value-focused PRs; see `docs/roadmap.md`.
