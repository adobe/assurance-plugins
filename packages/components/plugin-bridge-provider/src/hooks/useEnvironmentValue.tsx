import { Environment } from "../types";
import { useEnvironment } from "./useEnvironment";

export type EnvironmentMap<T = any> = Record<Environment, T>;

/**
 * A convenience hook that allows you to define a map of values to be used per
 * Assurance environment. If no environment is detected, defaults to prod
 * @param {EnvironmentMap} map - A map of environments and which item should be
 * used by them
 * @returns {any} - The value that was keyed by the current Assurance
 * environment
 */
export function useEnvironmentValue<T>(map: EnvironmentMap<T>): T {
  const environment = useEnvironment();
  if (!environment) {
    return map["prod"];
  }
  return map[environment];
}
