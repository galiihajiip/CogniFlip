import "server-only";
import {
  AppError,
  ERROR_DEFINITIONS,
  type ErrorEnvelope,
} from "@/server/http/errors";
import { logServerEvent } from "@/server/log/logger";

export const CORRELATION_HEADER = "x-correlation-id";
const INCOMING_ID = /^[A-Za-z0-9._-]{8,64}$/;

/** Reuses a well-formed incoming request ID, otherwise creates a new one. */
export function getCorrelationId(request: Request): string {
  const incoming =
    request.headers.get("x-request-id") ??
    request.headers.get(CORRELATION_HEADER);
  return incoming && INCOMING_ID.test(incoming)
    ? incoming
    : crypto.randomUUID();
}

export function jsonResponse(
  body: unknown,
  correlationId: string,
  status = 200,
): Response {
  return Response.json(body, {
    status,
    headers: {
      [CORRELATION_HEADER]: correlationId,
      "cache-control": "no-store",
    },
  });
}

/**
 * Converts any thrown value into the safe error envelope. Diagnostic detail is
 * written to the server log (redacted); the client only sees the stable code,
 * the user-facing message and allowlisted details.
 */
export function errorResponse(error: unknown, correlationId: string): Response {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("INTERNAL_ERROR", "Unhandled error", { cause: error });
  const definition = ERROR_DEFINITIONS[appError.code];

  logServerEvent(definition.status >= 500 ? "error" : "warn", "api_error", {
    correlationId,
    code: appError.code,
    internalMessage: appError.message,
    cause: appError.cause,
  });

  const body: ErrorEnvelope = {
    error: {
      code: appError.code,
      message: definition.message,
      retryable: definition.retryable,
      correlationId,
      ...(appError.details ? { details: appError.details } : {}),
    },
  };
  return jsonResponse(body, correlationId, definition.status);
}

type Handler = (
  request: Request,
  correlationId: string,
) => Promise<Response> | Response;

/** Wraps a route handler so every failure returns the safe envelope. */
export function withErrorHandling(handler: Handler) {
  return async (request: Request): Promise<Response> => {
    const correlationId = getCorrelationId(request);
    try {
      return await handler(request, correlationId);
    } catch (error) {
      return errorResponse(error, correlationId);
    }
  };
}
