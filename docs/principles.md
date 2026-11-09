# Engineering principles

RentBuddy follows **parse, don't validate** ([Alexis King](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)). Data from outside is turned into precise types once, at the boundary. Past that point, code works only with types that can't represent invalid states, and every state is handled explicitly and exhaustively.

These rules apply to every package. Lint and compiler settings enforce what they can (see [Enforcement](#enforcement)); code review enforces the rest.

---

## 1. Parse at the boundary, then trust the types

A **boundary** is anywhere data enters our TypeScript from somewhere the compiler can't see:

| Boundary | Parsed with |
|---|---|
| HTTP request params, query, body | `zValidator` with schemas from `@rentbuddy/core` |
| HTTP responses, on the client | the same schema: `TrackedListing.parse(await res.json())` |
| Webhooks (Postmark, Clerk) | core schemas, after signature/auth checks |
| Database rows | `fromRow` functions in `packages/db` that return domain types |
| Cloudflare Workflow params and Queue messages | event schemas in core |
| Listing pages (extension) | site parsers that return a `ParseResult` union |
| LLM output | structured output, then a zod schema |
| Environment variables | one `env.ts` per app, parsed at startup |
| `localStorage`, URL search params | zod schemas (TanStack Router `validateSearch`) |

A parser returns **a more precise type than it received**, or an explicit failure. A validator that returns `void` or `boolean` and leaves the original loose type in place is not allowed.

```ts
// ❌ validate: the caller still holds `string`, and must remember it was checked
function assertValidEmail(s: string): void { if (!s.includes("@")) throw new Error(); }

// ✅ parse: the result is proof
const EmailAddress = z.email().brand<"EmailAddress">();
type EmailAddress = z.infer<typeof EmailAddress>;
```

Don't act on input before it's fully parsed (no "shotgun parsing"). Parsing in multiple passes is fine, for example reading `source` first to decide whether to run the Zillow or StreetEasy parser.

## 2. Make invalid states unrepresentable

Model data with the most precise type you reasonably can.

**Discriminated unions instead of a status field plus optional fields.**

```ts
// ❌ allows { status: "confirmed", startsAt: undefined } and { status: "proposed", confirmedAt: ... }
type Viewing = { status: "proposed" | "confirmed" | "cancelled"; startsAt?: Date; confirmedAt?: Date };

// ✅ each state carries exactly the data it has
type Viewing =
  | { status: "proposed"; id: ViewingId; slot: TimeSlot; source: ViewingSource }
  | { status: "confirmed"; id: ViewingId; slot: TimeSlot; source: ViewingSource; confirmedAt: Date }
  | { status: "cancelled"; id: ViewingId; slot: TimeSlot; source: ViewingSource; reason: CancelReason };
```

**No booleans that encode a choice.** If a boolean answers "which kind?", it's a union. `auto: true` becomes `cause: { kind: "user" } | { kind: "automatic"; trigger: AutoTrigger }`.

**No magic values.** `beds: 0` meaning "studio" becomes `{ kind: "studio" } | { kind: "bedrooms"; count: PositiveInt }`. Prices are `Money` (integer cents, branded), never a bare `number`.

**Absence is explicit.** Domain types use `T | null` when a value is legitimately unknown, and a union when absence has more than one meaning. `?:` optional properties are for inputs only (component props, request bodies where a field may be omitted). `exactOptionalPropertyTypes` is on, so `?:` can't silently hold `undefined`.

**Branded primitives for anything with rules.** IDs, email addresses, URLs, money, confidence scores and counts are branded with zod's `.brand()`. The schema is the only way to obtain the type, which turns a check into a parser ("smart constructor"). A `ListingId` can't be passed where a `ViewingId` is expected.

## 3. Every state is explicit and exhaustive

- Branch on unions with `switch` over the discriminant, and **no `default` case**. Lint fails if a case is missing, so adding a member to a union points at every place that must handle it. End with `assertNever` only where TypeScript can't see exhaustiveness on its own.
- Lookup tables over a union are `Record<Union, T>`, so a missing key is a compile error (e.g. `STAGE_LABELS: Record<Stage, string>`).
- UI states are unions too. A component never juggles `isLoading`, `isError` and `data` booleans. It switches on one state value.

## 4. Expected failures are values, not exceptions

Functions that can fail in ways the caller should handle return `Result<T, E>` with a union of error kinds. Callers must handle each kind (the API maps them to HTTP responses with an exhaustive switch).

```ts
function pass(state: StageState, reason: PassReason): Result<StageState, TransitionError>
```

`throw` is for bugs and infrastructure failures (database down, invariant violated), which are caught by the request error handler or retried by Cloudflare Workflows and Queues. Treat any function returning `void` whose main job is to throw with suspicion: it's a validator, and should usually be a parser.

## 5. One source of truth

Don't store the same fact in two places. Derive it.

- A column's count comes from its cards, not a separate `count` prop.
- The list of stages is defined once in `@rentbuddy/core`. Everything else (labels, colors, columns, database enum) is keyed by that type and checked by the compiler.
- Values derivable from the event log or messages (when a listing was first contacted, how many unread messages) are computed, not copied into another column.

When denormalizing is genuinely needed (for example, `tracked_listing.stage` as a fast projection of stage events), **one small module owns keeping the copies in sync**, and nothing else writes either copy. For stages that's `StageService.transition`, which updates the row and appends the event in one transaction.

## 6. Let the types drive the code

Change the type first, then follow the compiler errors. Don't bolt a boolean or optional field onto a type because the function you're writing needs it. If the data representation is wrong, refactor it; the compiler shows every place that needs changing.

## 7. The database enforces the same invariants

TypeScript types disappear at runtime, so Postgres enforces the invariants too:

- Postgres enums for every union discriminant (`stage`, `viewing_status`, …), generated from the core lists.
- `CHECK` constraints tying a discriminant to the columns its state requires, e.g. `CHECK ((status = 'confirmed') = (confirmed_at IS NOT NULL))`.
- Unique and partial unique indexes for "at most one" rules.
- Repositories read rows through `fromRow` parsers. A row that fails to parse is a bug and throws loudly; it's never coerced.

---

## Enforcement

**Compiler** (`tsconfig.base.json`): `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `noImplicitOverride`.

**Lint** (`eslint.config.js`, type-aware):

| Rule | Why |
|---|---|
| `@typescript-eslint/switch-exhaustiveness-check` (no default on unions) | §3: missing cases fail lint |
| `@typescript-eslint/consistent-type-assertions: never` | no `as` casts; parse instead (`as const` is allowed) |
| `@typescript-eslint/no-non-null-assertion` | no `!`; handle the `undefined` case |
| `@typescript-eslint/no-explicit-any`, `no-unsafe-*` | `unknown` must be parsed before use |
| `@typescript-eslint/strict-boolean-expressions` | no truthiness checks that conflate `0`, `""` and `null` |
| `@typescript-eslint/only-throw-error`, `prefer-promise-reject-errors` | thrown values are real errors |

**Review checklist:**
- Does new external data go through a parser before anything acts on it?
- Could the new type hold a combination of fields that makes no sense?
- Is there a boolean or a magic value that should be a union?
- Is the same fact now stored in two places?
- Does the database constrain the same invariant as the type?
