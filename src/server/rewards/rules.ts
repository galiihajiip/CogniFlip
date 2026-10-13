import "server-only";

/**
 * XP and achievement rules, version `xp-rules-v1` (BLOCK 31).
 *
 * Inputs are persisted, server-assessed attempts only; the client never
 * supplies an amount. Rules reward explaining and improving, not time spent,
 * and there are no streaks (docs/03 §8: no manipulative streak pressure).
 * Changing a rule means a new version; existing ledger rows keep their
 * rule_version and are never rewritten.
 */
export const XP_RULE_VERSION = "xp-rules-v1";

export const XP_RULES = {
  explanation_assessed: {
    delta: 10,
    description: "Penjelasanmu dinilai untuk pertama kali di sesi ini.",
  },
  strong_explanation: {
    delta: 5,
    description: "Skor penjelasan 80 atau lebih di sesi ini.",
  },
  improved_after_revision: {
    delta: 5,
    description: "Skor naik setelah kamu memperbaiki penjelasan.",
  },
} as const;
export type XpEventType = keyof typeof XP_RULES;

export const ACHIEVEMENTS = {
  "penjelas-pertama": {
    title: "Penjelas Pertama",
    description: "Menyelesaikan penjelasan pertama yang dinilai.",
  },
  "tiga-pelajaran": {
    title: "Penjelajah Tiga Pelajaran",
    description: "Penjelasanmu dinilai di tiga pelajaran berbeda.",
  },
  "perbaikan-hebat": {
    title: "Perbaikan Hebat",
    description: "Skormu naik setelah memperbaiki penjelasan.",
  },
} as const;
export type AchievementKey = keyof typeof ACHIEVEMENTS;

/** One session's assessed scores in submission order (display totals). */
export interface SessionScores {
  sessionId: string;
  lessonId: string;
  assessedScores: number[];
}

export interface XpAward {
  type: XpEventType;
  sessionId: string;
  delta: number;
  idempotencyKey: string;
}

/** Deterministic: the same sessions always yield the same awards. */
export function eligibleAwards(sessions: readonly SessionScores[]) {
  const xp: XpAward[] = [];
  const award = (type: XpEventType, sessionId: string) =>
    xp.push({
      type,
      sessionId,
      delta: XP_RULES[type].delta,
      idempotencyKey: `${XP_RULE_VERSION}:${type}:${sessionId}`,
    });

  for (const s of sessions) {
    if (s.assessedScores.length === 0) continue;
    award("explanation_assessed", s.sessionId);
    if (Math.max(...s.assessedScores) >= 80)
      award("strong_explanation", s.sessionId);
    if (s.assessedScores.at(-1)! > s.assessedScores[0])
      award("improved_after_revision", s.sessionId);
  }

  const achievements = new Set<AchievementKey>();
  const assessed = sessions.filter((s) => s.assessedScores.length > 0);
  if (assessed.length > 0) achievements.add("penjelas-pertama");
  if (new Set(assessed.map((s) => s.lessonId)).size >= 3)
    achievements.add("tiga-pelajaran");
  if (xp.some((a) => a.type === "improved_after_revision"))
    achievements.add("perbaikan-hebat");

  return { xp, achievements: [...achievements] };
}
