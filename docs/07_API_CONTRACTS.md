# API Contracts and Error Semantics

This document describes domain behavior, not a forced route naming convention. Concrete API routes can follow Next.js conventions if these contract rules remain intact.

## 1. Common contract
- JSON unless a provider requires a distinct upload protocol.
- Validate all network payloads at runtime; static TypeScript types do not validate requests.
- Use authenticated identity from server session, not a caller-supplied owner ID.
- Use idempotency for job creation, room submissions, XP awards, and repeatable writes.
- Add correlation IDs, input/output limits, timeouts and rate limits.
- Return safe error envelopes, e.g. `{ error: { code, message, retryable, correlationId, details? } }`. Do not expose stack traces, secrets, system prompts or another user's data.

## 2. Auth and profile
Actions include register/login/logout/recovery, own-profile read/update, privacy settings, data export and deletion. Rate-limit credential/recovery attempts. Public profile responses must be allowlisted, never a raw row dump.

## 3. Learning
Actions include list/read published lessons, create/resume owned session, submit attempt, request tutor follow-up, request validated assessment, revise attempt, read own history/progress.

The server loads the authoritative lesson and rubric; client-supplied weights/reference answers are ignored. Assessment status is `complete`, `needs_clarification`, or `error`. A complete response includes validated criterion judgments/evidence, deterministic total, rubric version, feedback, one next-step hint, and provenance. No total score is returned for failed/insufficient assessment.

## 4. Code intelligence
Actions include create/update/delete owned project/files; request review using code/revision plus declared language/framework/version/goal/categories; poll/subcribe to review status; fetch findings; request a proposed diff; request execution only for enabled supported adapters; cancel job; retrieve sanitized output.

Server chooses available capabilities and never trusts a client assertion that a tool ran. Input limits, path normalization, ownership, budget and sandbox policy are server enforced.

## 5. Voice
Create/close voice session, request STT, send transcript to tutor, request TTS, cancel session. Raw audio is temporary unless a separately documented retention feature exists. Text alternative remains available.

## 6. Multiplayer/realtime
Create/join by expiring invite, leave, submit turn/challenge, retrieve state, report participant, close room. Server checks membership and turn/version on every write. Realtime messages notify clients but cannot independently award points or change privileged state.

## 7. Community
Create/edit/delete own post/comment, list/search visible approved content, report content/user, block user, retrieve appropriate report state, moderate with authorized role. Enforce content length and rate limits; public responses exclude email, private history, moderator notes, and restricted fields.

## 8. Leaderboard/achievements
Read current period/ranking using public opt-in summary. XP/achievement events are server-generated from validated events. Client cannot submit an arbitrary XP delta or rank. Duplicate events are rejected or reconciled idempotently.

## 9. Minimum error taxonomy
`VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `PROVIDER_TIMEOUT`, `INVALID_MODEL_OUTPUT`, `ASSESSMENT_INSUFFICIENT_EVIDENCE`, `UNSUPPORTED_TOOLCHAIN`, `EXECUTION_REJECTED`, `EXECUTION_TIMEOUT`, `ROOM_EXPIRED`, `ROOM_VERSION_CONFLICT`, `CONTENT_RESTRICTED`, `INTERNAL_ERROR`.

Map errors to user-friendly Indonesian. Do not expose raw provider messages. Retry only safe operations; use idempotency for writes.
