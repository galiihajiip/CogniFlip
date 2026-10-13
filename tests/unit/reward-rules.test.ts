import { describe, expect, it } from "vitest";
import { XP_RULE_VERSION, eligibleAwards } from "@/server/rewards/rules";

const s = (sessionId: string, lessonId: string, assessedScores: number[]) => ({
  sessionId,
  lessonId,
  assessedScores,
});

describe("xp-rules-v1", () => {
  it("awards nothing without an assessed attempt (errors/clarifications earn no XP)", () => {
    expect(eligibleAwards([s("a", "urutan", [])])).toEqual({
      xp: [],
      achievements: [],
    });
  });

  it("awards a fixed amount per assessed session, plus strong and improvement bonuses", () => {
    const { xp, achievements } = eligibleAwards([s("a", "urutan", [60, 85])]);
    expect(xp.map((a) => [a.type, a.delta])).toEqual([
      ["explanation_assessed", 10],
      ["strong_explanation", 5],
      ["improved_after_revision", 5],
    ]);
    expect(
      xp.every((a) => a.idempotencyKey.startsWith(`${XP_RULE_VERSION}:`)),
    ).toBe(true);
    expect(achievements.sort()).toEqual([
      "penjelas-pertama",
      "perbaikan-hebat",
    ]);
  });

  it("does not reward a revision that did not raise the score, or repeated sessions twice", () => {
    expect(
      eligibleAwards([s("a", "urutan", [80, 80])]).xp.map((a) => a.type),
    ).toEqual(["explanation_assessed", "strong_explanation"]);
    const twice = eligibleAwards([
      s("a", "urutan", [40]),
      s("a", "urutan", [40]),
    ]);
    expect(new Set(twice.xp.map((a) => a.idempotencyKey)).size).toBe(1);
  });

  it("is deterministic and grants the three-lessons achievement only for distinct lessons", () => {
    const sessions = [
      s("a", "urutan", [40]),
      s("b", "urutan", [50]),
      s("c", "perulangan", [50]),
    ];
    expect(eligibleAwards(sessions)).toEqual(eligibleAwards([...sessions]));
    expect(eligibleAwards(sessions).achievements).not.toContain(
      "tiga-pelajaran",
    );
    expect(
      eligibleAwards([...sessions, s("d", "percabangan", [10])]).achievements,
    ).toContain("tiga-pelajaran");
  });
});
