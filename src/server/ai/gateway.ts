import "server-only";
import type { FixedWindowLimiter } from "@/server/ai/rate-limit";
import type { AiProvider, ProviderErrorCode } from "@/server/ai/provider";
import {
  OUTPUT_LIMITS,
  assessmentOutputJsonSchema,
  validateAssessmentOutput,
  type ValidatedAssessment,
} from "@/server/assessment/ai-contract";
import {
  EVALUATOR_PROMPT_VERSION,
  buildEvaluatorInstructions,
} from "@/server/assessment/evaluator-prompt";
import type { Rubric } from "@/server/assessment/rubric-schema";
import type { LessonVersion } from "@/server/learning/lesson-schema";
import { logServerEvent } from "@/server/log/logger";
import type { ErrorCode } from "@/shared/api/errors";
import { TEXT_LIMITS, boundedText } from "@/shared/schemas/primitives";

/**
 * Server-side AI gateway for the Understanding Evaluator (BLOCK 17).
 * Every failure becomes a typed, unscored result; nothing here can produce a
 * score except validateAssessmentOutput() → scoreRatings().
 */

export const MAX_ATTEMPTS = 2;
const MAX_OUTPUT_TOKENS = 1_200;
const answerSchema = boundedText({ max: TEXT_LIMITS.explanation });

export type GatewayErrorCode = Extract<
  ErrorCode,
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_TIMEOUT"
  | "INVALID_MODEL_OUTPUT"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
>;

export type EvaluationResult =
  | {
      ok: true;
      assessment: Extract<ValidatedAssessment, { ok: true }>;
      mode: "live" | "mock";
      model: string;
      promptVersion: string;
      attempts: number;
    }
  | {
      ok: false;
      code: GatewayErrorCode;
      retryable: boolean;
      retryAfterSeconds?: number;
      attempts: number;
    };

export interface GatewayDeps {
  provider: AiProvider | null;
  limiter: FixedWindowLimiter;
  timeoutMs: number;
  sleep?: (ms: number) => Promise<void>;
}

const PROVIDER_TO_CODE: Record<ProviderErrorCode, GatewayErrorCode> = {
  not_configured: "PROVIDER_UNAVAILABLE",
  timeout: "PROVIDER_TIMEOUT",
  rate_limited: "RATE_LIMITED",
  unavailable: "PROVIDER_UNAVAILABLE",
  refused: "INVALID_MODEL_OUTPUT",
  cancelled: "PROVIDER_UNAVAILABLE",
  bad_request: "PROVIDER_UNAVAILABLE",
  output_truncated: "INVALID_MODEL_OUTPUT",
};

// Retrying a timeout doubles the child's wait, so only fast failures retry.
const RETRY_PROVIDER_ERRORS = new Set<ProviderErrorCode>([
  "rate_limited",
  "unavailable",
]);

const defaultSleep = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));

export async function evaluateExplanation(
  deps: GatewayDeps,
  input: {
    lesson: LessonVersion;
    rubric: Rubric;
    answer: string;
    /** Per learner/session/IP key for rate limiting; never logged raw. */
    rateLimitKey: string;
    signal?: AbortSignal;
  },
): Promise<EvaluationResult> {
  const answer = answerSchema.safeParse(input.answer);
  if (!answer.success)
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      retryable: false,
      attempts: 0,
    };

  if (!deps.provider) {
    logServerEvent("warn", "ai_call", {
      purpose: "evaluate",
      outcome: "not_configured",
    });
    return {
      ok: false,
      code: "PROVIDER_UNAVAILABLE",
      retryable: false,
      attempts: 0,
    };
  }

  const limit = deps.limiter.check(input.rateLimitKey);
  if (!limit.allowed) {
    logServerEvent("warn", "ai_call", {
      purpose: "evaluate",
      outcome: "rate_limited_local",
    });
    return {
      ok: false,
      code: "RATE_LIMITED",
      retryable: true,
      retryAfterSeconds: limit.retryAfterSeconds,
      attempts: 0,
    };
  }

  const provider = deps.provider;
  const sleep = deps.sleep ?? defaultSleep;
  const instructions = buildEvaluatorInstructions(input.lesson, input.rubric);
  let last: { code: GatewayErrorCode; retryable: boolean } = {
    code: "PROVIDER_UNAVAILABLE",
    retryable: true,
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await provider.generateStructured({
      purpose: `evaluate:${input.lesson.id}`,
      instructions,
      untrustedInput: answer.data,
      responseJsonSchema: assessmentOutputJsonSchema,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      timeoutMs: deps.timeoutMs,
      signal: input.signal,
    });

    const base = {
      purpose: "evaluate",
      provider: provider.name,
      mode: provider.mode,
      promptVersion: EVALUATOR_PROMPT_VERSION,
      lessonId: input.lesson.id,
      attempt,
      latencyMs: result.latencyMs,
    };

    if (!result.ok) {
      logServerEvent("warn", "ai_call", { ...base, outcome: result.error });
      last = {
        code: PROVIDER_TO_CODE[result.error],
        retryable: result.retryable,
      };
      if (attempt < MAX_ATTEMPTS && RETRY_PROVIDER_ERRORS.has(result.error)) {
        await sleep(250 * 2 ** (attempt - 1));
        continue;
      }
      return { ok: false, ...last, attempts: attempt };
    }

    const validated = validateAssessmentOutput(result.text, {
      rubric: input.rubric,
      lesson: input.lesson,
      answer: answer.data,
    });
    logServerEvent(validated.ok ? "info" : "warn", "ai_call", {
      ...base,
      model: result.model,
      outcome: validated.ok ? validated.outcome.status : "invalid_output",
      // Problem descriptions name criteria and rules only, never answer text.
      problems: validated.ok ? undefined : validated.problems.slice(0, 5),
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      outputBytes: Math.min(result.text.length, OUTPUT_LIMITS.rawBytes + 1),
    });

    if (validated.ok) {
      return {
        ok: true,
        assessment: validated,
        mode: provider.mode,
        model: result.model,
        promptVersion: EVALUATOR_PROMPT_VERSION,
        attempts: attempt,
      };
    }
    last = { code: "INVALID_MODEL_OUTPUT", retryable: true };
  }
  return { ok: false, ...last, attempts: MAX_ATTEMPTS };
}
