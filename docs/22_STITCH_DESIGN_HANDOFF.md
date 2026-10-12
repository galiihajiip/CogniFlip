# Google Stitch Design Handoff and Screen Inventory

## Purpose and status
Google Stitch is the primary tool for complete UI/UX design and interactive screen exploration for CogniFlip. This document is a handoff protocol and inventory, not a prompt. The actual visual design must be created and reviewed in Stitch by the participant. Do not fabricate screen links, exported files, screenshots, or approval statuses.

- Design status: `NOT STARTED` until the participant begins in Stitch.
- Approval status: `NOT APPROVED` until reviewed by the participant.
- Final tokens: record in `.stitch/DESIGN.md` after the design system is chosen.
- Store real approved screen references in `.stitch/references/` and optional exports in `.stitch/exports/`.

## Source-of-truth policy
1. Product intent, functional behavior, accessibility and acceptance rules come from `docs/01_PRODUCT_REQUIREMENTS.md`, `docs/02_PRODUCT_SCOPE.md`, `docs/03_UX_DESIGN_SPEC.md`, and `docs/13_ACCEPTANCE_CRITERIA.md`.
2. After approval, Stitch screen designs/prototypes and `.stitch/DESIGN.md` define the intended visual layout, tokens, interaction presentation, and responsive behavior.
3. Claude Code implements these approved designs in the real application stack. Stitch-generated HTML/code can be a reference or export, but must not blindly replace the application, security boundaries, data/API logic, or test architecture.
4. An attractive prototype does not count as an implemented feature. Every primary interaction must connect to real application state/API or have an explicit, honest unavailable state.
5. If a screen/state is missing, record it in the inventory and resolve it before treating that flow as complete. Do not silently invent an alternate visual system.
6. Record major visual decisions and revisions in the decision log; preserve actual Stitch interaction history according to the participant's Vibe Coding evidence process.

## Workflow

### Stage A — Establish a visual direction
- Start from the brand idea in `docs/04_DESIGN_SYSTEM.md` and the initial `.stitch/DESIGN.md`, but treat these as a brief, not a finished design.
- Explore variants for typography, color, illustration style, density, cards, navigation, and the AI learning companion.
- Choose a direction that is distinctive, accessible, child-friendly, and suitable for an educational coding product rather than a generic SaaS dashboard.
- Update `.stitch/DESIGN.md` with the approved tokens/rationale. Validate token references and contrast; do not assume starter colors pass all contexts.

### Stage B — Design the full screen inventory
Create the listed screens and their critical states, not just a landing page:

| ID | Screen group | Required screens/states | Priority |
|---|---|---|---|
| ST-01 | Public entry | Landing, value proposition, primary CTA, feature discovery, footer | P0 |
| ST-02 | Authentication | Register, login, forgot/reset password, validation, loading, failure | P1 |
| ST-03 | Home | New learner, returning learner, no history, resume learning | P0 |
| ST-04 | Learning path | Path overview, lesson cards, locked/available/completed states | P0 |
| ST-05 | Lesson intro | Concept explanation, example, hint/example expand state | P0 |
| ST-06 | Teach the Robot | Initial explanation, typing, optional voice, submitting, clarification, empty and error state | P0 |
| ST-07 | Assessment results | Valid score, strengths, gap, evidence, hint, insufficient evidence, provider failure | P0 |
| ST-08 | Revision loop | Revised answer, before/after attempt comparison, completion | P0 |
| ST-09 | Predict Before Run | Prediction entry, actual output, comparison, unavailable runtime state | P1 |
| ST-10 | Debug Robot | Challenge, code/context view, submit diagnosis, feedback, retry, completion | P1 |
| ST-11 | Mini IDE | Empty editor, editing, language selector, project context, analyze, running tool, findings, failure, retry | P1 |
| ST-12 | Code review details | Findings grouped by severity, evidence/location, AI vs tool provenance, hint, diff/accept change | P1 |
| ST-13 | Code execution | Queued/running/success/compile error/runtime error/timeout/cancelled/unsupported | P1 |
| ST-14 | Learning history | Empty history, history list, session details, attempt comparison, continue/review | P1 |
| ST-15 | Progress | Topic progress, strengths, practice suggestions, insufficient data | P1 |
| ST-16 | Achievements | Earned/locked badge, mission complete, XP details | P2 |
| ST-17 | Profile/settings | Profile, avatar/handle, accessibility, preferences, privacy, data export/deletion, confirmation | P1 |
| ST-18 | Leaderboard | Weekly/global tab, current user, empty state, low rank without shaming, privacy opt-out | P2 |
| ST-19 | Community feed | Feed, search/filter, empty state, loading, unavailable state | P2 |
| ST-20 | Community post | Detail, create/edit, comments, validation, report, mute/block, moderation feedback | P2 |
| ST-21 | Multiplayer lobby | Create/join room, invite, waiting room, permission/error, full/expired room | P2 |
| ST-22 | Multiplayer room | Participants, turns, challenge, live results, reconnecting/disconnected, leave/report/mute | P2 |
| ST-23 | Multiplayer results | Validated result, score breakdown, XP result, tie/aborted state | P2 |
| ST-24 | Voice Tutor | Microphone permission, recording/listening, transcribing, speaking, stop/cancel, transcript, unsupported browser/fallback | P2 |
| ST-25 | Shared shell and system | Navigation, mobile menu, notifications, confirmation dialog, not found, forbidden, generic error, offline/retry | P0 |

Priority codes identify design and build sequencing, not permission to remove any feature from the full product target.

### Stage C — Connect prototypes
- Connect critical screens into coherent paths, especially ST-01 → ST-04 → ST-05 → ST-06 → ST-07 → ST-08 → completion.
- Connect Mini IDE paths ST-11 → ST-12 and, where supported, ST-13 → revise → re-analyze.
- Connect login → profile → history/progress, and social paths only with the relevant permissions and child-safety states.
- Check that back, cancel, retry, and resume behaviors are represented.
- Ensure mobile and desktop layouts are both designed; do not merely scale a desktop layout down.

### Stage D — Export and hand off
- Save the final approved `DESIGN.md` at `.stitch/DESIGN.md`.
- Save actual screen screenshots or other references under `.stitch/references/` using stable names such as `ST-06-teach-robot-desktop.png` and `ST-06-teach-robot-mobile.png`.
- Optional HTML/code exports go under `.stitch/exports/`. They are references, not proof of functional behavior.
- Record the actual Stitch project/share link below after the participant has one. Do not invent a link.
- Complete the mapping table below before declaring a screen's design finalized.

## Approved Stitch project
- Project title: `CogniFlip`
- Project/share URL: `NOT RECORDED`
- Design system approved: `NO`
- Key screens approved: `NO`
- Desktop/mobile reviewed: `NO`
- Accessibility/contrast review: `NOT VERIFIED`
- Last reviewed by participant: `NOT RECORDED`

## Screen-to-implementation mapping
Update this table with actual names/URLs and files after each screen is designed and implemented.

| Screen ID | Stitch screen name/reference | App route | Main interaction | Acceptance criteria | Status |
|---|---|---|---|---|---|
| ST-01 | NOT DESIGNED | TBD | Primary CTA starts learning | AC reference TBD | NOT STARTED |
| ST-06 | NOT DESIGNED | TBD | Submit explanation / receive clarification | AC reference TBD | NOT STARTED |
| ST-07 | NOT DESIGNED | TBD | Show validated assessment and evidence | AC reference TBD | NOT STARTED |
| ST-11 | NOT DESIGNED | TBD | Edit code and request analysis | AC reference TBD | NOT STARTED |

## Visual QA before implementation is accepted
- Compare implementation screenshots with the approved Stitch references at agreed viewport sizes.
- Verify layout, hierarchy, typography, component states, spacing, illustrations, and navigation.
- Test mobile reflow and bounded editor scrolling.
- Check focus, keyboard access, labels, contrast, reduced motion, and error announcements.
- Verify every control is wired to a real action and every network feature has relevant states.
- Record intentional deviations and their rationale; otherwise fix visual drift.
- Capture new screenshots after material UI changes and rerun core end-to-end tests.

## Completion definition
The design handoff is complete only after the design system is approved, critical screens and key states exist for desktop/mobile, prototype navigation covers primary user journeys, the mapping table uses actual references and routes, and unresolved design gaps are documented. The feature implementation is separate and must pass its own acceptance criteria and tests.
