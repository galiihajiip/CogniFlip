# Stitch Design Status

- Checked: 2026-10-13 (WIB), by listing the folders. No design has been inspected because none exists in the repository yet.
- Overall: **design handoff NOT STARTED in the repository.** Visual implementation of product screens is blocked until approved exports arrive (`CLAUDE.md` §8, Gate B).

## 1. What is in the repository now

| Path | Contents | Status |
|---|---|---|
| `.stitch/references/` | `.gitkeep` (0 bytes) only | No screenshots or references |
| `.stitch/exports/` | `.gitkeep` (0 bytes) only | No HTML/code exports |
| `.stitch/DESIGN.md` | Starter tokens (colors, Nunito Sans / JetBrains Mono, radii, spacing) from the documentation package | **Not approved.** Starter only; not to be used as final design |
| `.stitch/README.md` | Handoff rules | Present |
| `docs/22_STITCH_DESIGN_HANDOFF.md` | Screen inventory ST-01…ST-25; design `NOT STARTED`, approval `NO`, project URL `NOT RECORDED` | Present; all mapping rows `NOT DESIGNED` |

The current app pages (`src/app/page.tsx`) are unstyled scaffolding and are not an implementation of any design.

## 2. Screens still missing

All 25 screens in `docs/22` are missing. Recommended order for the competition build (traceability tiers S1/S2):

| Priority | Screens |
|---|---|
| **Needed first (S1)** | ST-01 landing · ST-03 home (new/returning) · ST-04 learning path · ST-05 lesson intro · ST-06 Teach the Robot · ST-07 assessment results (valid, insufficient evidence, provider failure) · ST-08 revision and completion · ST-25 shell and system states |
| **Gap not in the inventory** | **Privacy and safety page** (`/privasi`): AI disclosure, what data goes to the AI provider, guardian information. Required before the URL is shared (`docs/implementation/STACK_VALIDATION.md` §4); proposed as **ST-26** |
| Next (S2) | ST-09 Predict Before Run · ST-10 Debug Robot · ST-11 Mini IDE · ST-12 code review details · ST-02 auth · ST-14 history · ST-15 progress · ST-17 profile/settings |
| Later | ST-13 code execution · ST-16 achievements · ST-18 leaderboard · ST-19/20 community · ST-21–23 multiplayer · ST-24 voice |

## 3. Expected export formats

Record what Stitch actually produced; do not convert or rename it into something it was not.

| Kind | Where | Required? |
|---|---|---|
| Screenshot per screen, state and viewport (PNG preferred, at the viewport's real width) | `.stitch/references/` | **Required** for every screen to be implemented |
| Code export (HTML/CSS or whatever Stitch provides) | `.stitch/exports/ST-XX-<slug>/` | Optional; reference only, never pasted in as the app |
| Approved tokens and rationale | `.stitch/DESIGN.md` (replace the starter) | **Required** before tokens are implemented |
| Stitch project/share link, approval date, approver | `docs/22` "Approved Stitch project" | **Required** |
| Assets (illustrations, mascot, icons) with source/license note | `.stitch/exports/assets/` + `SOURCE.md` | Required if the design uses them |

## 4. Screen-to-route inventory (routes are proposals)

Route names follow the Indonesian navigation in `docs/03` §2. They are **proposals for your approval**, not decisions.

| Screen | Proposed route | Main interaction | Depends on |
|---|---|---|---|
| ST-01 Landing | `/` | "Mulai belajar" → `/belajar` | — |
| ST-03 Home | `/` (returning learner state) | Resume lesson | History (F12) for "returning" state |
| ST-04 Learning path | `/belajar` | Choose lesson | Lesson registry (R2) |
| ST-05 Lesson intro | `/belajar/[lesson]` | "Coba jelaskan" | R2 |
| ST-06 Teach the Robot | `/belajar/[lesson]/jelaskan` | Submit explanation / answer clarification | Session engine (R4), AI gateway (R3) |
| ST-07 Results | `/belajar/[lesson]/hasil` | "Perbaiki penjelasan" | Scoring (R2.7) |
| ST-08 Revision/completion | `/belajar/[lesson]/perbaiki`, `/belajar/[lesson]/selesai` | Resubmit; next lesson | R4 |
| ST-26 Privacy & safety *(proposed)* | `/privasi` | Read | — |
| ST-09 Predict Before Run | `/misi/tebak-hasil/[challenge]` | Predict, then compare | Reviewed fixtures (R11) |
| ST-10 Debug Robot | `/misi/robot-debug/[challenge]` | Diagnose bug | R11 |
| ST-11–13 Mini IDE, review, execution | `/ide` (panels, not separate pages) | Analyze; run only if enabled | R8–R10 |
| ST-02 Auth | `/masuk`, `/daftar`, `/lupa-sandi` | Sign in/up | Auth decision (open) |
| ST-14–16 Journey | `/perjalanan`, `/perjalanan/[session]` | Review history/progress | F12 |
| ST-17 Profile | `/profil` | Privacy, export, delete | F11 |
| ST-18 Leaderboard | `/peringkat` | Opt-in ranking | F13 |
| ST-19–20 Community | `/bersama/komunitas`, `/bersama/komunitas/[post]` | Read/post/report | F14 (gated) |
| ST-21–23 Multiplayer | `/bersama/ruang`, `/bersama/ruang/[room]` | Join/play | F16 (gated) |
| ST-24 Voice | Panel inside ST-06 | Record/cancel/text fallback | F15 (out of competition build) |
| ST-25 System | Global: header/nav, `not-found`, `error`, offline, dialogs | — | — |

## 5. Responsive states needed

**Viewports** (proposed; designs need at least the two in bold):

| Viewport | Size |
|---|---|
| **Mobile** | **390 × 844** |
| Small mobile | 360 × 800 |
| Tablet | 768 × 1024 |
| **Laptop** | **1280 × 800** |
| Wide desktop | 1440 × 900 |

**States per networked screen** (`docs/03` §7): loading, empty, success, validation error, unavailable (feature or provider off), provider failure / retry, timeout, unauthorized/forbidden where relevant, offline/disconnected where relevant.

**Specific to S1:**
- ST-06: empty input, typing, submitting (double-submit prevented), clarification question, AI unavailable.
- ST-07: valid score with criteria and evidence; "not enough evidence yet" (no score); provider failure (no score).
- ST-04: lesson available, completed, and prerequisite-locked (with explanation); only if progression rules exist.
- Also required:
  - keyboard focus style;
  - reduced-motion behaviour for every animation;
  - AI-character identity, shown visibly every session.

## 6. Neutral component needs (no styling decided)

These follow from `docs/04` and the S1 flow. Colors, typography, spacing, shapes and layout come only from the approved design:

- **Basic controls:** Button (primary/secondary/quiet; loading/disabled), text input/textarea with label, hint, error and character count.
- **Lesson flow:** LessonCard, ProgressPath, RobotMessage (AI-identified), EvidenceSnippet, RubricScore (criterion, reason, expandable evidence).
- **Status and feedback:** StatusBadge (text + icon, never color alone), Alert, Skeleton/LoadingState, EmptyState, ErrorState, Dialog, LiveStatus (announcements).
- **App shell:** header/navigation with a mobile menu.

## 7. Exact files to place

Put screenshots in `.stitch/references/` using `ST-XX-<slug>-<state>-<viewport>.png`, where `<viewport>` is `mobile` or `desktop`. The `default` state is the normal screen. Minimum set for S1, **each in `-mobile` and `-desktop`**:

```
ST-01-landing-default
ST-03-home-new-learner
ST-03-home-returning
ST-04-learning-path-default
ST-04-learning-path-locked-lesson
ST-05-lesson-intro-default
ST-05-lesson-intro-example-expanded
ST-06-teach-robot-empty
ST-06-teach-robot-submitting
ST-06-teach-robot-clarification
ST-06-teach-robot-ai-unavailable
ST-07-results-scored
ST-07-results-insufficient-evidence
ST-07-results-provider-failure
ST-08-revision-compare
ST-08-revision-completed
ST-25-shell-navigation
ST-25-shell-mobile-menu-open
ST-25-not-found
ST-25-error
ST-26-privacy-default          (proposed screen)
```

That is 21 screens × 2 viewports = 42 PNGs. Also:
- `.stitch/DESIGN.md`: replaced with the approved tokens and rationale.
- `.stitch/exports/ST-XX-<slug>/…`: any code export, unmodified, plus `SOURCE.md` (export date, Stitch screen name, project link).
- `.stitch/exports/assets/…`: mascot/illustrations/icons used, plus `SOURCE.md` with origin and license.
- In `docs/22`: project/share URL, approval date and approver, filled in by you.

S2 screens (ST-09–12, ST-02, ST-14, ST-15, ST-17) follow the same naming when ready.

## 8. Review procedure (when exports arrive — BLOCK 19)

1. **List** every file actually present; do not assume names or formats.
2. **Match** each file to a screen ID and state; record gaps in this document.
3. **Check completeness** per S1 screen: mobile and desktop exist; loading/empty/error/unavailable states exist; AI identity visible; one dominant action per step.
4. **Check accessibility** from the design:
   - text and control contrast, to be measured once tokens exist rather than estimated;
   - status is never shown by color alone;
   - touch targets are reasonable;
   - text is legible on 360-px screens.
5. **Check content:**
   - copy is simple Indonesian;
   - the "insufficient evidence" and "provider failure" states show no score;
   - there is no shaming language.
6. **Check consistency:** tokens in `.stitch/DESIGN.md` match what the screenshots show; record any conflicts.
7. **Inspect any code export** for dependencies, external fonts/scripts and license terms before reusing anything.
8. **Get approval.** You confirm approval; record the project link, date and approver in `docs/22`, and the decision in `docs/20`.
9. **Implement only after approval.** Then compare implementation screenshots with the references at the same viewports (`docs/22` "Visual QA").

## 9. Open design decisions for you

- Approve or change the proposed routes and the ST-26 privacy screen.
- Confirm the target viewports.
- Decide whether the mascot is an illustration asset from Stitch or produced separately (license/source needed either way).
