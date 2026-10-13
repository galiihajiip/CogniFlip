import { z } from "zod";

/**
 * Language-neutral code-review contracts (BLOCK 34, docs/09 §5–6).
 * Shared by server and client; no server imports.
 */

export const FINDING_CATEGORIES = [
  "correctness",
  "syntax",
  "types",
  "edge_cases",
  "error_handling",
  "readability",
  "naming",
  "duplication",
  "complexity",
  "maintainability",
  "performance",
  "security",
] as const;

/** Style-type categories are suggestions, never defects. */
export const SUGGESTION_CATEGORIES = new Set<
  (typeof FINDING_CATEGORIES)[number]
>(["readability", "naming", "duplication", "complexity", "maintainability"]);

export const SEVERITIES = [
  "info",
  "low",
  "medium",
  "high",
  "critical",
] as const;
export const PROVENANCES = [
  "ai",
  "parser",
  "linter",
  "type_checker",
  "compiler",
  "test",
  "runtime",
] as const;

export const sourceRangeSchema = z
  .strictObject({
    startLine: z.number().int().min(1),
    startColumn: z.number().int().min(1).optional(),
    endLine: z.number().int().min(1),
    endColumn: z.number().int().min(1).optional(),
  })
  .refine((r) => r.endLine >= r.startLine, { message: "end_before_start" });

export const findingSchema = z.strictObject({
  id: z.string().min(1).max(40),
  category: z.enum(FINDING_CATEGORIES),
  severity: z.enum(SEVERITIES),
  title: z.string().trim().min(1).max(80),
  explanation: z.string().trim().min(1).max(600),
  /** Exact text from the submitted code, or null when not applicable. */
  evidence: z.string().min(1).max(300).nullable(),
  /** Null means the location is unknown; it is never guessed. */
  range: sourceRangeSchema.nullable(),
  provenance: z.enum(PROVENANCES),
  /** Required for every non-AI finding: which tool produced it. */
  tool: z
    .strictObject({ name: z.string().max(60), version: z.string().max(40) })
    .nullable(),
  /** For AI findings: how sure the model is. Tools are not "unsure". */
  confidence: z.enum(["low", "medium", "high"]).nullable(),
  remediation: z.string().trim().min(1).max(400),
  /**
   * `potential_issue`: an AI suggestion that is not confirmed by any tool.
   * `confirmed_diagnostic`: reported by an actual tool run.
   */
  verification: z.enum(["potential_issue", "confirmed_diagnostic"]),
});
export type Finding = z.infer<typeof findingSchema>;

export const CODE_LIMITS = {
  maxBytes: 20 * 1024,
  maxLines: 500,
  maxFindings: 20,
} as const;

const capabilityViewSchema = z.strictObject({
  available: z.boolean(),
  tool: z.string().optional(),
  version: z.string().optional(),
});

export const capabilityMatrixResponseSchema = z.strictObject({
  registryVersion: z.string(),
  languages: z.array(
    z.strictObject({
      id: z.string(),
      label: z.string(),
      supportLevel: z.enum([
        "AI_REVIEW_ONLY",
        "STATIC_ANALYSIS",
        "COMPILE_VERIFIED",
        "RUNTIME_VERIFIED",
      ]),
      canAnalyzeWithAi: z.boolean(),
      capabilities: z.record(z.string(), capabilityViewSchema),
      limitations: z.array(z.string()),
    }),
  ),
  correlationId: z.string(),
});
