import { useContext } from "react";
import { SelectedEventContext } from "../Contexts";
import type { Events, Maybe } from "../types";
import { checkContext } from "./checkContext";

/**
 * A hook that returns a list of events that are currently selected under the global Assurance context
 * @returns {Event[]} - An array of events that have currently been selected
 */
export const useSelectedEvents = <T extends Events>(): Maybe<T> => {
  const context = checkContext(useContext(SelectedEventContext));
  return context?.selected as T;
};
