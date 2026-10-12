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

## Pending decisions
Record after actual review: runtime LLM/provider/model and terms; auth/database/realtime provider; runner/isolation model; STT/TTS provider and retention; community/profile visibility defaults after safety review; exact dependency versions and hosting setup.
