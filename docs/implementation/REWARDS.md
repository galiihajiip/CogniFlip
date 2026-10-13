# XP, Achievements and Leaderboard

## Rules `xp-rules-v1` (BLOCK 31)
| Event | XP | Earned when |
|---|---|---|
| `explanation_assessed` | 10 | A session has at least one attempt the server assessed |
| `strong_explanation` | 5 | The session's best assessed score is ≥ 80 |
| `improved_after_revision` | 5 | The latest assessed score in the session is higher than the first |

| Achievement | Earned when |
|---|---|
| `penjelas-pertama` (Penjelas Pertama) | First assessed explanation |
| `tiga-pelajaran` (Penjelajah Tiga Pelajaran) | Assessed explanations in 3 different lessons |
| `perbaikan-hebat` (Perbaikan Hebat) | Score rose after a revision |

- **Server-side only:** rewards are derived from persisted, assessed attempts by `RewardService.sync()` after each session action (signed-in learners) and before `GET /api/rewards`. No endpoint accepts an XP value or event from the client. Strict request bodies reject extra fields such as `xp`.
- **Idempotent:**
  - each award has a unique key `xp-rules-v1:<event>:<session>` per user (`ON CONFLICT DO NOTHING`);
  - replays, refreshes and concurrent syncs cannot duplicate awards;
  - achievements have a primary key per user.
- **Append-only:** a trigger rejects any `UPDATE` on `xp_events`. Rows disappear only through account or session deletion cascades.
- **Not rewarded:** time spent, number of attempts, provider errors, clarifications, or social activity.
- **No streaks**, by design (`docs/03` §8: no manipulative streak pressure for children).
- **Guests earn no XP**; there is no account to attach it to.
- **Versioning:** a rule change creates `xp-rules-v2`. Old ledger rows keep `rule_version` and are never rewritten. New keys include the new version, so rewards stay consistent when recalculated.

**Verified:**
- `tests/unit/reward-rules.test.ts` (4 tests).
- `tests/integration/rewards.integration.test.ts` (3 tests on PostgreSQL):
  - XP awarded once despite repeated syncs, 3 concurrent syncs and a replayed submission;
  - `UPDATE` blocked;
  - guests get no XP;
  - a forged `xp` field returns 400;
  - unauthenticated reads return 401.

**Not verified:** reward screens (no UI, D-009).
