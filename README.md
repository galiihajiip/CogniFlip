# CogniFlip — Project Blueprint

**Tagline:** Flip the Way You Learn.  
**Product:** AI-powered learning and coding platform.  
**Competition context:** M-ONE Telkomsel Coding Competition, Category Umum.  
**Blueprint prepared:** 12 October 2026.  
**Status:** Product/engineering documentation only; this package contains no application source implementation.

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

See `docs/00_DOCUMENT_MAP.md` for the full document index.
