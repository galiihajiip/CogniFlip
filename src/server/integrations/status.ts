import "server-only";
import { isIntegrationConfigured, type ServerEnv } from "@/server/config/env";
import {
  INTEGRATION_NAMES,
  type IntegrationName,
  type IntegrationStatus,
} from "@/shared/api/status";

export type { IntegrationStatus };

/**
 * Whether each integration's adapter exists in this codebase. Flip an entry to
 * `true` only when the adapter is implemented and tested. Configuration alone
 * never makes a feature available.
 */
export const IMPLEMENTED_INTEGRATIONS: Record<IntegrationName, boolean> = {
  ai: false,
  database: true,
  speechToText: false,
  textToSpeech: false,
  codeRunner: false,
  errorReporting: false,
};

export function getIntegrationStatus(
  env: ServerEnv,
  name: IntegrationName,
  implemented: Record<IntegrationName, boolean> = IMPLEMENTED_INTEGRATIONS,
): IntegrationStatus {
  if (!isIntegrationConfigured(env, name))
    return { available: false, reason: "not_configured" };
  if (!implemented[name])
    return { available: false, reason: "not_implemented" };
  return { available: true };
}

export function getAllIntegrationStatuses(
  env: ServerEnv,
  implemented: Record<IntegrationName, boolean> = IMPLEMENTED_INTEGRATIONS,
): Record<IntegrationName, IntegrationStatus> {
  return Object.fromEntries(
    INTEGRATION_NAMES.map((name) => [
      name,
      getIntegrationStatus(env, name, implemented),
    ]),
  ) as Record<IntegrationName, IntegrationStatus>;
}
