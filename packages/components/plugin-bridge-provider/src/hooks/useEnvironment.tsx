import { useContext } from "react";
import { SettingsContext } from "../Contexts";
import type { Environment, Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * Retrieves the current Assurance environment that is currently being used
 * @returns {Environment} - The value of the current environment
 */
export const useEnvironment = (): Maybe<Environment> => {
  const context = checkContext(useContext(SettingsContext));
  return context?.env;
};
