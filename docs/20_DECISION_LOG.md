# Project Decision Log

Append decisions chronologically. Record actual options, rationale, impact, status, and approver. Do not invent or backdate decisions.

## D-001 — Working product name
- Date: 2026-10-12
- Status: accepted as working name
- Decision: `CogniFlip`, tagline `Flip the Way You Learn.`
- Rationale: represents the shift from receiving answers to explaining/testing understanding and leaves room for coding tools.
- Revisit if domain/trademark review identifies conflict.

## D-002 — Full feature scope
- Date: 2026-10-12
- Status: accepted as target vision
- Decision: preserve the complete scope in `02_PRODUCT_SCOPE.md`, including authentication/profile, history, leaderboard, community, voice, multiplayer, multi-agent, Mini IDE, and language/tool adapters.
- Implementation rule: sequence by dependency and verify each module. This is not a claim all features will be ready by the competition deadline.

## D-003 — Indonesian-first child-friendly UX
- Date: 2026-10-12
- Status: accepted
- Decision: Indonesian is default UI language; elementary-school usability governs the primary learning path.

## D-004 — Deterministic scoring
- Date: 2026-10-12
- Status: accepted
- Decision: LLM may produce validated criterion-level judgment with evidence; application code computes total score from a versioned rubric. Error/insufficient evidence never becomes a fake numeric score.

## D-005 — Broad language input, explicit tool support
- Date: 2026-10-12
- Status: accepted
- Decision: accept arbitrary code as text for generic AI review and report actual parser/linter/compiler/runtime/framework capabilities using a registry. Do not claim universal tool verification without real tools/tests.

## D-006 — Database: plain PostgreSQL, verified locally in Docker
- Date: 2026-10-13
- Status: accepted
- Approver: participant (answered in the Claude Code session on 2026-10-13 WIB, BLOCK 08)
- Options considered: (1) server-only boundary with the database deferred; (2) Supabase (Postgres + Auth + Realtime) as proposed in ADR-001; (3) provider-neutral PostgreSQL with SQL migrations, verified against a throwaway local Postgres in Docker.
- Decision: option 3. Use the `pg` driver from server-only code and forward-only SQL migrations run by a small project script. Develop and test against a local Docker Postgres (`postgres:18.6-alpine`) with synthetic data only.
- Rationale: verifiable now without external accounts or credentials; works with any managed Postgres host later.
- Consequences: Supabase Auth/Realtime are not part of this decision. Authentication, authorization (RLS or server checks) and realtime need separate decisions before F11/F12/F16. The production database host is still to be chosen.

## D-007 — Lesson content defaults
- Date: 2026-10-13
- Status: accepted
- Approver: participant (Claude Code session, 2026-10-13)
- Decision: target grades 4–6. Lessons 1–2 use Indonesian "robot command" steps (no programming language); later code-reading lessons use short Python snippets with reviewed expected output. At most 1 clarification per attempt and 3 attempts per lesson session. Each lesson rubric totals 100 points; each criterion has 3 levels (`belum_terlihat` / `sebagian` / `tepat`) worth 0 / 50 / 100 % of its weight.
- Resolves traceability questions Q4, Q5, Q7, Q8.

## D-008 — Runtime AI provider: Google Gemini (accepted against a recorded terms risk)
- Date: 2026-10-13
- Status: accepted by the participant after being shown the risk below
- Approver: participant (Claude Code session, 2026-10-13)
- Options presented: Claude Sonnet 5.5 / Haiku 5.5 / Opus 5.5 (Anthropic's Usage Policy permits products serving minors with AI disclosure and safeguards), or Gemini.
- Decision: use the Gemini API through Google's official SDK, behind the project's provider-neutral AI interface. The specific model is chosen by the benchmark (R3.9).
- **Recorded risk:** Google's Gemini API Additional Terms (last modified 2026-04-28, https://ai.google.dev/gemini-api/terms) state "You must be 18 years of age or older to use the APIs" and forbid use in a website or application directed towards or likely to be accessed by individuals under 18. Google Cloud's Service Specific Terms carry an equivalent restriction for Vertex AI. CogniFlip's primary audience is elementary-school children, so this use conflicts with the provider's terms and may lead to suspension. On unpaid tiers Google may use inputs to improve its products and human reviewers may read them.
- Mitigations kept in the code: provider-neutral interface (switching provider is one adapter); no names or personal data sent to the model; AI disclosure in the product; recommendation to use a paid tier at minimum. The participant remains responsible for the provider-terms decision.

## D-009 — No product screens before approved Stitch designs
- Date: 2026-10-13
- Status: accepted
- Approver: participant (Claude Code session, 2026-10-13)
- Decision: UI blocks (BLOCK 19–26 and other screen work) wait for approved Stitch exports. Until then only domain logic, services, APIs and tests are built. Screens are marked BLOCKED, not provisional.
- Consequence: the UI/UX criterion (20%) and the deployed learner flow depend on Stitch exports arriving before the 2026-10-15 15:30 WIB deadline.

## D-010 — Accounts: pseudonymous handle + password, no email
- Date: 2026-10-13
- Status: accepted
- Approver: participant (Claude Code session, 2026-10-13)
- Decision: in-house accounts stored in the project's PostgreSQL (D-006): a pseudonymous handle and a password hashed with a memory-hard algorithm; server-side sessions in an httpOnly cookie. No email, real name, school, birthdate or location is collected.
- Consequence: no self-service password recovery (no email). Recovery and its safety implications must be documented honestly.

## Pending decisions
Record after actual review: runtime model (after benchmark); realtime provider; production Postgres host; runner/isolation model; STT/TTS provider and retention; community/profile visibility defaults after safety review; exact dependency versions and hosting setup.
