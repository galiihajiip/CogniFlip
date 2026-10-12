import "server-only";
import {
  INTEGRATION_GROUPS,
  isIntegrationConfigured,
  type IntegrationName,
  type ServerEnv,
} from "@/server/config/env";

/**
 * Whether each integration's adapter exists in this codebase. Flip an entry to
 * `true` only when the adapter is implemented and tested. Configuration alone
 * never makes a feature available.
 */
export const IMPLEMENTED_INTEGRATIONS: Record<IntegrationName, boolean> = {
  ai: false,
  database: false,
  speechToText: false,
  textToSpeech: false,
  codeRunner: false,
  errorReporting: false,
};

export type IntegrationStatus =
  | { available: true }
  | { available: false; reason: "not_configured" | "not_implemented" };

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
  const names = Object.keys(INTEGRATION_GROUPS) as IntegrationName[];
  return Object.fromEntries(
    names.map((name) => [name, getIntegrationStatus(env, name, implemented)]),
  ) as Record<IntegrationName, IntegrationStatus>;
}
