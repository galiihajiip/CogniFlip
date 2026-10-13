import "server-only";
import { getRubric } from "@/server/assessment/content";
import { BENCHMARK_ITEMS } from "@/server/assessment/benchmark/dataset";
import { MockAiProvider } from "@/server/ai/mock-provider";
import type { StructuredRequest } from "@/server/ai/provider";

/**
 * Development mock for `AI_MOCK_MODE=true` (never production).
 *
 * Answers that exactly match a benchmark fixture get that fixture's proposed
 * label; anything else gets a clarification question. Output follows the
 * evaluator contract, so the full validation and scoring path runs. Results
 * are labelled mock everywhere; they are not AI judgments.
 */
export function createDevMockProvider(): MockAiProvider {
  return new MockAiProvider((request: StructuredRequest) => {
    if (request.purpose === "code_review")
      return mockCodeReview(request.untrustedInput);
    const lessonId = request.purpose.split(":")[1] ?? "";
    const rubric = getRubric(lessonId, 1);
    const answer = request.untrustedInput;
    const item = BENCHMARK_ITEMS.find(
      (i) => i.lessonId === lessonId && i.answer.trim() === answer.trim(),
    );
    const firstCriterion = rubric?.criteria[0]?.key ?? "unknown";

    if (item?.expected.status === "assessed" && rubric) {
      const ratings = item.expected.ratings;
      return {
        kind: "text",
        text: JSON.stringify({
          status: "assessed",
          criteria: rubric.criteria.map((c) => ({
            criterionKey: c.key,
            rating: ratings[c.key],
            evidence:
              ratings[c.key] === "belum_terlihat"
                ? { kind: "none" }
                : { kind: "quote", text: answer.trim().slice(0, 300) },
            rationale: "Mock: label taken from the benchmark fixture.",
            uncertainty: "low",
          })),
          misconceptionIds: item.expected.misconceptionIds,
          hint: "[Mode uji] Coba jelaskan bagian yang belum terlihat dengan contoh.",
        }),
      };
    }
    return {
      kind: "text",
      text: JSON.stringify({
        status: "needs_clarification",
        targetCriterion:
          item?.expected.status === "needs_clarification"
            ? item.expected.clarifyCriterion
            : firstCriterion,
        reason: "Mock: answer is not a known fixture.",
        question: "[Mode uji] Bisa jelaskan lagi dengan kata-katamu sendiri?",
      }),
    };
  });
}

/** One clearly labelled info finding on the first non-empty line. */
function mockCodeReview(code: string) {
  const lines = code.split("\n");
  const index = lines.findIndex((l) => l.trim() !== "");
  const line = lines[index]?.trim() ?? "";
  const findings =
    index < 0
      ? []
      : [
          {
            id: "mock-1",
            category: "readability",
            severity: "info",
            title: "[Mode uji] Contoh temuan",
            explanation:
              "[Mode uji] Ini temuan contoh dari mock, bukan analisis AI sungguhan.",
            evidence: line.slice(0, 300),
            range: { startLine: index + 1, endLine: index + 1 },
            confidence: "low",
            remediation: "[Mode uji] Tidak ada tindakan yang diperlukan.",
          },
        ];
  return { kind: "text" as const, text: JSON.stringify({ findings }) };
}
