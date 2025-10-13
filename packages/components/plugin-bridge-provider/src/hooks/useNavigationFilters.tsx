import { useContext } from "react";
import { NavigationContext } from "../Contexts";
import type { Filters, Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * Retrieves the current filters that have been set in the URL params as global
 * Assurance filters
 * @returns {Filters} - An object containing which filters have been set
 */

export const useNavigationFilters = (): Maybe<Filters> => {
  const context = checkContext(useContext(NavigationContext));
  return context?.filters;
};
