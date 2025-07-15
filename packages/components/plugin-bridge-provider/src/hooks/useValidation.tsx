import { useContext } from "react";
import { ValidationContext } from "../Contexts";
import type { ValidationRecord } from "../types";
import { checkContext } from "./checkContext";

/**
 * Retrieves the results of all Validation Plugins that have been run on the
 * current Assurance session's events
 * @returns {ValidationRecord[]} - The Validation results of the session
 */
export const useValidation = (): ValidationRecord[] => {
  const context = checkContext(useContext(ValidationContext));
  if (!context?.validation) {
    return [];
  }
  return Array.isArray(context?.validation)
    ? context?.validation
    : Object.values(context?.validation);
};
