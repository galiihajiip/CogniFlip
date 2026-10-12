# Acceptance Criteria and Release Gates

Use `PASS`, `FAIL`, or `NOT VERIFIED` with evidence/test IDs. A rendered page alone does not make a feature complete.

## Global
- [ ] Navigation works by mouse, touch, keyboard.
- [ ] Indonesian copy is appropriate for elementary learners.
- [ ] Primary actions have real behavior and clear results.
- [ ] Loading/empty/unauthorized/unavailable/error/timeout/retry states exist where relevant.
- [ ] Mobile/tablet/laptop/desktop layouts are checked.
- [ ] Contrast, focus, reduced motion, labels, error announcements are checked.
- [ ] Build and deployed smoke test pass.

## Learning path
- [ ] Published lessons have objective, concept card, example, rubric version, accepted evidence and misconception catalogue.
- [ ] Learner can start/complete/resume as designed.
- [ ] Locked prerequisites have clear explanation.

## Reverse Tutor/scoring
- [ ] Submission uses authoritative lesson/rubric version.
- [ ] Clarification is targeted and bounded.
- [ ] Assessment schema is parsed and validated.
- [ ] Evidence maps to the learner's response or is marked missing.
- [ ] Score is deterministic and unit-tested.
- [ ] Provider/schema errors never return fake score.
- [ ] Feedback separates strengths, gaps, next action.
- [ ] Learner can revise and reassess.
- [ ] Persistent result tracks rubric/scoring version.

## Mini IDE/universal code input
- [ ] Editor loads lazily and works in target browsers.
- [ ] Code is editable, copyable and reviewable.
- [ ] Custom language label allows generic review for any language text.
- [ ] Registry distinguishes editor/parser/static/compiler/runtime/test/framework capabilities.
- [ ] Unsupported toolchain does not block generic review and is disclosed.
- [ ] Findings include evidence/provenance and valid locations where known.
- [ ] Patches are diffs and never silently overwrite code.
- [ ] Saved project/review is private to its owner by default.

## Sandbox
- [ ] Code executes only through isolated infrastructure.
- [ ] CPU, memory, time, output, files, network and concurrency limits enforced.
- [ ] Job has no app secret/database access.
- [ ] Timeout/provider-unavailable/unsupported differ from compile/runtime failures.
- [ ] Cleanup/expiry tested.
- [ ] If isolation is unverifiable, execution is disabled.

## Voice
- [ ] Microphone permission is explicit/visible.
- [ ] User can cancel/end and switch to text.
- [ ] Provider errors recover safely.
- [ ] Raw audio not retained by default.
- [ ] Peer voice stays disabled until its safety gate passes.

## Auth/profile/history
- [ ] Registration/login/logout/recovery works for configured provider.
- [ ] Cross-user access tested with at least two accounts.
- [ ] Public fields are allowlisted and private fields stay private.
- [ ] Privacy/leaderboard settings work.
- [ ] Data export/deletion and retention behavior is documented/tested to implemented scope.
- [ ] Attempts/history persist across sessions for authenticated user.

## Gamification
- [ ] Progress derives from authoritative data.
- [ ] Duplicate event cannot award XP/achievement twice.
- [ ] Leaderboard is server-calculated, privacy-aware and governed by clear rules.

## Community/multiplayer
- [ ] Content safe-rendered and rate-limited.
- [ ] Report/moderation action/audit works.
- [ ] No default child DMs.
- [ ] Room membership and realtime access are authorized.
- [ ] Concurrent/replayed actions do not corrupt state or duplicate rewards.
- [ ] Leave/report/mute controls work where applicable.
- [ ] Public features remain disabled if their safety gates fail.

## Multi-agent
- [ ] Each agent has documented role/schema/budget/failure state.
- [ ] Orchestrator has maximum calls/turns/time/cost and cancellation.
- [ ] Agent output cannot change score/permission directly.
- [ ] Prompt-injection fixtures cannot grant privileged tool access.
- [ ] Logs preserve trace/outcome without hidden chain-of-thought.

## M-ONE eligibility
- [ ] AI Agent reference docs are present and authentic to the project.
- [ ] GitHub is public and inspectable.
- [ ] Curated prompt journal has no more than five genuine entries.
- [ ] Raw prompt log represents actual start-to-end interactions.
- [ ] Theme/subtheme fit is evident.
- [ ] Website is deployed and accessible to judges.
- [ ] Repository/code/design/agent docs satisfy start-time/originality rules.
- [ ] No prohibited reuse, plagiarism, private repository, prompt manipulation, timestamp falsification or unapproved late submission.
- [ ] Required links/materials are checked before submission.
