# CogniFlip — Project Blueprint

**Tagline:** Flip the Way You Learn.  
**Product:** AI-powered learning and coding platform.  
**Competition context:** M-ONE Telkomsel Coding Competition, Category Umum.  
**Blueprint prepared:** 12 October 2026.  
**Status:** Product/engineering documentation plus an initial application scaffold (no product features implemented yet).

## What is in this archive?

This archive contains product requirements, persistent agent rules, UX/design system, architecture, data/API contracts, AI orchestration, universal code intelligence, child safety, security, testing, M-ONE rubric traceability, Vibe Coding evidence procedures, deployment guidance, and a fine-grained roadmap.

It deliberately contains **no ready-to-paste development prompts**. `CLAUDE.md` is persistent project guidance for Claude Code, not a one-shot implementation prompt and not a substitute for the participant's authentic prompt log. Two prompt-evidence templates are blank.

## Product vision

CogniFlip helps learners build real understanding by explaining concepts to AI, receiving evidence-based feedback, applying concepts in code, predicting program behavior, diagnosing mistakes, and improving work. Full scope includes:

- Child-friendly coding learning paths and AI Reverse Tutor.
- Rubric-based scoring, misconception diagnosis, hints, and revision loops.
- Mini IDE, broad language input, code review, clean-code analysis, and language/tool adapters.
- Predict-before-run and curated debugging missions.
- Accounts, profiles, persistent learning history, achievements, and global leaderboards.
- Community, moderated collaboration, multiplayer rooms, and voice-based AI tutoring.
- Bounded multi-agent orchestration with explicit contracts and traceable results.

See `docs/02_PRODUCT_SCOPE.md` for the complete target scope. Feature breadth is not permission to ship incomplete or fake interactions: every feature must meet acceptance criteria and be honestly marked `NOT VERIFIED` if it cannot be tested.

## Start here

1. Read `CLAUDE.md` and `AGENTS.md`.
2. Read `docs/00_DOCUMENT_MAP.md`.
3. Read `docs/01_PRODUCT_REQUIREMENTS.md` and `docs/02_PRODUCT_SCOPE.md`.
4. Read `docs/03_UX_DESIGN_SPEC.md`, `docs/04_DESIGN_SYSTEM.md`, `docs/05_SYSTEM_ARCHITECTURE.md`, `docs/06_DATA_MODEL.md`, and `docs/07_API_CONTRACTS.md`.
5. Read AI, code intelligence, child-safety, security, and test documents before implementing privileged or public features.
6. Use `docs/16_IMPLEMENTATION_ROADMAP.md` for small, dependency-aware build steps.
7. Preserve authentic prompt evidence according to `docs/15_VIBE_CODING_PROTOCOL.md`; do not fabricate records.

## M-ONE compliance: hard gates

The uploaded M-ONE Category Umum guidebook specifies six eligibility gates: AI Agent reference docs; public GitHub repository; curated prompt journal with at most five prompts plus raw prompt log from beginning to end; relevant theme/subtheme; free stack choice; and a deployed website accessible to judges. It assigns 25% to Vibe Coding process, 25% functionality/theme relevance, 20% UI/UX/responsiveness, 15% technical quality, and 15% innovation/creativity. See `docs/14_MONE_RUBRIC_TRACEABILITY.md`.

The guidebook says repository, code, design, and AI Agent docs must be made after the official start time of **5 October 2026, 09:30 WIB**. Do not copy source code, design, components, repository, templates, or prewritten AI Agent docs from an older project. Keep authentic Git history. This documentation package is prepared on 12 October 2026, after the stated start time, but the participant remains responsible for the provenance of the actual competition repository and following organizer rules.

**Submission deadline in the uploaded guidebook:** 15 October 2026, 15:30 WIB. Verify any changes only through an authenticated organizer announcement. The 21:00 WIB preliminary-round closing time is not the submission deadline.

## Proposed technical baseline

Current proposal: Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL with a managed provider such as Supabase, managed authentication and authorized realtime, a browser code editor such as Monaco, provider-agnostic AI interfaces, and isolated external code execution. These are defaults to evaluate, not claims that credentials or services are already configured. Verify current stable versions, costs, policies, accessibility, and deployment constraints before accepting the stack.

## Google Stitch design workflow

Google Stitch will be used for the complete visual design and UI/UX exploration before the matching interfaces are implemented in code. Read `docs/22_STITCH_DESIGN_HANDOFF.md` and `.stitch/README.md`.

1. Use the product and UX documents to design the shared visual identity and all required screens/states in Stitch.
2. Iterate and connect prototypes in Stitch; review child-friendly language, navigation, desktop/mobile layouts, empty/loading/error states, accessibility, and end-to-end flows.
3. After approval, preserve the finalized design tokens/rationale in `.stitch/DESIGN.md` and save screen references/screenshots/exports under `.stitch/references/` and `.stitch/exports/`.
4. Record a mapping from every approved Stitch screen to its application route, components, interactions, and acceptance criteria in `docs/22_STITCH_DESIGN_HANDOFF.md`.
5. Claude Code must implement the approved design faithfully while building real functionality. Static Stitch exports or screenshots do not count as a working application, and generated HTML should not be copied blindly over the application's architecture.

This package contains a starter `DESIGN.md` to guide initial exploration, not a final design. Replace/update it after making and approving the actual design in Stitch. The package intentionally contains no ready-to-paste development prompts.

## Non-negotiable engineering constraints

- Indonesian-first, child-friendly UX is the primary competition path.
- Never present AI predictions as verified compiler/runtime results.
- Never execute arbitrary submitted code inside the primary application server.
- Broad code input is distinct from native compiler/runtime support. Capability status must be explicit.
- Multi-agent workflows are bounded, schema-validated, cost-limited, and not used unnecessarily.
- Learning scores are computed deterministically from validated rubric criteria.
- Community, voice, and multiplayer require privacy, authorization, reporting, and child-safety controls.
- Do not fabricate prompts, tests, verification, deployment status, or competition evidence.

## Development setup

The application lives in `src/` (Next.js App Router, TypeScript, Tailwind CSS). It was scaffolded with the official `create-next-app@16.4.0`; nothing was copied from another project.

Requirements: Node.js **24.x LTS** (see `.nvmrc`, `package.json` `engines`) and npm 11 (`packageManager` field). Next.js 16 and Tailwind CSS 4 target Chrome/Edge 111+, Firefox 128+ and Safari 16.4+.

```bash
node --version          # must print v24.x
npm ci                  # install exactly what package-lock.json pins
npm run dev             # http://localhost:3000
npm run format          # Prettier: rewrite code/config files
npm run format:check    # Prettier: check only (CI)
npm run lint            # ESLint (eslint-config-next)
npm run typecheck       # generates Next.js route types, then tsc --noEmit
npm run test            # Vitest, single run (tests/unit/**/*.test.ts)
npm run build && npm start
npm run check           # format:check + lint + typecheck + test + build
npm run db:up           # local PostgreSQL 18.6 in Docker (see db/README.md)
npm run db:migrate      # apply pending SQL migrations (db:status, db:new -- <name>)
npm run test:integration  # real-database tests; needs TEST_DATABASE_URL
```

Prettier skips Markdown, `docs/` and `.stitch/` so supplied documentation is never reformatted. CI (`.github/workflows/ci.yml`) runs the same checks on pushes to `main` and on pull requests, with read-only permissions and no secrets.

### Configuration

Copy `.env.example` to `.env.local` and fill values locally; never commit real credentials.

- Development needs no variables. Production requires `APP_BASE_URL`.
- Database (D-006): plain PostgreSQL via `DATABASE_URL`, server-only. Migration policy, local Docker setup, rollback/recovery and health checks are in `db/README.md`. Without `DATABASE_URL` the database reports `not_configured`; database-backed features must return `PROVIDER_UNAVAILABLE` rather than pretend to save.
- Each integration (AI, database, speech-to-text, text-to-speech, code runner, error reporting) is all-or-nothing: set every variable in its group or none.
- Validation runs once at server start (`src/instrumentation.ts`). Invalid configuration stops startup with a list of variable names and problems, never their values.
- Only `NEXT_PUBLIC_*` variables reach the browser (`src/config/public-env.ts`); secrets are read only in `src/server/config/env.ts`.
- `GET /api/status` reports each integration as available or unavailable with a reason (`not_configured`, `not_implemented`, `unreachable`). Configuration alone never makes a feature available. Only the database adapter exists so far, and it is checked live (`GET /api/health/database`); every other integration is unavailable.
- API errors use one envelope: `{ "error": { "code", "message", "retryable", "correlationId", "details?" } }`, with an `x-correlation-id` header. Diagnostics go to the server log only, after redaction.

See `docs/00_DOCUMENT_MAP.md` for the full document index.
