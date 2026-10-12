import { getServerEnv } from "@/server/config/env";
import { getAllIntegrationStatuses } from "@/server/integrations/status";
import { jsonResponse, withErrorHandling } from "@/server/http/respond";

// Evaluate at request time so the response reflects the runtime environment.
export const dynamic = "force-dynamic";

/**
 * Reports which integrations are usable, as availability and a reason code only.
 * It never returns variable names, values or provider details.
 */
export const GET = withErrorHandling((_request, correlationId) => {
  const integrations = getAllIntegrationStatuses(getServerEnv());
  return jsonResponse(
    { status: "ok", integrations, correlationId },
    correlationId,
  );
});
