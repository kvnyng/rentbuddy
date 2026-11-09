# RentBuddy roadmap

Work lands as **value-focused PRs**: each one gives a renter something they can do that they couldn't before. PRs are reviewed in [diffnav](https://github.com/dlvhdr/diffnav) and merged in order.

## Decisions

| Topic | Decision |
|---|---|
| Hosting | Cloudflare: one Worker serves the SPA and the Hono API; R2, Workflows, Queues, Hyperdrive, Cron Triggers |
| Production URL | `https://rentbuddy.pablos.cc` (pablos.cc DNS is on Cloudflare) |
| Database | Neon Postgres + Drizzle, through Hyperdrive |
| Auth | Clerk; renters sign up with **email and phone**, both verified |
| Access | **Invite-only** (Clerk restricted sign-up + invitations) |
| Pricing | **Free alpha** until the paywall in M4 |
| Landing page | Minimal, later (M4) |
| CI | GitHub Actions |
| Repo | https://github.com/kvnyng/rentbuddy (personal) |

## How PRs are shaped

- **One user-visible outcome per PR**, stated as "A renter can…", delivered as a thin slice through UI, API, database, core and tests.
- **Infrastructure arrives with the first feature that needs it.** No PR adds a library nothing uses.
- **Commits are ordered for review:** core types → database → API → UI → docs. Each commit builds and passes tests on its own.
- **PR description template:** user value, demo steps, suggested review order, test evidence, generated files to skip, out of scope.
- **Target size:** under ~600 changed lines, not counting generated files (lockfile, migrations, `tokens.css`).
- **Branches:** `pr-<n>/<slug>`, branched from `main`, merged in order. Every PR gets a preview deployment and CI checks.
- **Reviewing:** `gh pr diff <n> | diffnav`, or one commit at a time with `git show <sha> | diffnav`.
- Every PR follows [docs/principles.md](principles.md) and updates [docs/architecture.md](architecture.md) when a flow changes.

---

## Milestone 1: Launch the tracker

**Exit criteria:** an invited stranger installs the extension from the Chrome Web Store, signs up with email and phone, tracks listings from StreetEasy and Zillow, manages their board, and can delete their account, all at `rentbuddy.pablos.cc`, with errors reported to us.

| PR | A renter can… | Introduces | Size |
|---|---|---|---|
| **0** | *(enabler, no user value)* | GitHub Actions CI (typecheck, lint, test, Ladle build), PR template, `main` branch protection, fixes from the review (single mascot image, token build fails on unknown references, keyboard-accessible `ListingCard`), Cloudflare architecture, this roadmap | S |
| **1** | **accept an invite, sign up with email + phone, and see their empty board at rentbuddy.pablos.cc** | `apps/web` (Vite + `@cloudflare/vite-plugin`, TanStack Router + Query, Clerk), `apps/api` (Hono, Clerk auth middleware, env parsed with zod), `PhoneNumber` in core, Worker with custom domain, deploy workflow (production on merge, preview URL per PR), Clerk production instance in invite-only mode | M |
| **2** | **click "Track in RentBuddy" on a StreetEasy listing and see it on their board** | StreetEasy parser + saved-page tests; `packages/db` (Drizzle, `listing` and `tracked_listing` with CHECK constraints, migrations run by the deploy workflow, Hyperdrive); `POST /listings/track` with R2 snapshots; `apps/extension` (WXT, Clerk session sync); minimal privacy policy page (required to submit the extension). **Then submit an unlisted build to the Chrome Web Store.** | L, 5 commits |
| **3** | **track Zillow listings too** | Zillow parser + tests, second content script | S |
| **4** | **move cards between stages, pass with a reason, and restore** | `StageService.transition` (stage row and event written in one transaction), drag and drop with instant updates, pass/restore UI | M |
| **5** | **see photos on cards and open a listing's detail page** | First Workflow (`TrackListing`), thumbnails via Cloudflare Images stored in R2, `/listing/$id` route with gallery | M |
| **6** | **be guided from their invite to their first tracked listing** | Onboarding checklist (install the extension, track a first listing), extension install link, empty states | S |
| **7** | **read how their data is used, and delete their account and data** | Full privacy policy and terms, account deletion across Clerk, Postgres and R2, Chrome Web Store privacy disclosures | S |
| **8** | **report a problem, and we see errors before they report them** | Sentry (web, Worker, extension), Workers rate limiting, Neon point-in-time restore check, alerts, feedback link, production runbook | S |

### Setup outside the code (owner: you)

| Needed by | Task |
|---|---|
| PR 0 | Add a `CLOUDFLARE_API_TOKEN` repository secret (Workers deploy permission) for GitHub Actions |
| PR 1 | Create a Clerk production instance for `rentbuddy.pablos.cc` and add its DNS records in Cloudflare (**DNS only, not proxied**). Turn on email + phone as required identifiers and set sign-up to restricted (invite-only). SMS verification needs a paid Clerk plan. |
| PR 2 | Create a Neon project (production branch) and a Hyperdrive config pointing at it. Register a Chrome Web Store developer account ($5). |
| PR 8 | Create a Sentry project |
| M2 | Postmark account + `mail.rentbuddy.pablos.cc` DNS records |
| M3 | Anthropic API key |

---

## Milestone 2: Inbox

| PR | A renter can… | Introduces |
|---|---|---|
| **9** | **get their RentBuddy email address and see every email it receives** | Address provisioning, Postmark inbound webhook to the Worker, raw emails in R2, `InboundEmail` workflow, Inbox page, attach an email to a listing by hand. Onboarding gains "use your RentBuddy address on Zillow/StreetEasy". |
| **10** | **have Zillow/StreetEasy and agent emails attach to the right listing automatically** | Site notification-email parsers, matching by known agent, thread view on the listing page |
| **11** | **email agents and reply in a thread from RentBuddy** | Postmark outbound, reply threading headers, automatic move to Contacted, SPF/DKIM/DMARC, per-user send limit |

## Milestone 3: Assist

| PR | A renter can… | Introduces |
|---|---|---|
| **12** | **get an AI-drafted viewing request to review and send** | Weekly availability form, Claude drafting endpoint |
| **13** | **see viewing times proposed in agent replies and confirm one with a click** | Claude extraction step, viewing proposals UI, automatic move to Viewing scheduled |
| **14** | **see confirmed viewings in their own calendar app** | Calendar subscription feed (regenerable token), Cron Trigger moves cards to Viewed after the viewing |
| **15** | **get suggested matches for emails nothing else could place** | Claude matching fallback with a confidence threshold, suggestions in the Inbox |
| *16 (optional)* | *get text reminders before viewings* | *SMS provider (e.g. Twilio) using the verified phone number* |

## Milestone 4: Monetize and grow

| PR | Value | Introduces |
|---|---|---|
| **17** | **a renter can buy a $25 / 60-day search pass** | Payment checkout, access check, pass expiry; the free alpha ends |
| **18** | **the team can see the marketing metrics** | `core/metrics.ts` over domain events, internal dashboard |
| **19** | **a visitor understands RentBuddy and requests an invite or signs up** | Minimal public landing page, prerendered for search engines |
