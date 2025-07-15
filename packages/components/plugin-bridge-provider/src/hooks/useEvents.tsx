import { useContext, useMemo } from "react";
import {
  EventContext,
  NavigationContext,
  ValidationContext,
} from "../Contexts";
import { Events } from "../types";
import { extractFilteredEvents } from "../utils/extract.filtered.events";
import { checkContext } from "./checkContext";

export interface UseEventsOptions {
  /** Allows events to be sorted by timestamp */
  sorted?: "asc" | "desc";
  filtered?: boolean;
  hideLogs?: boolean;
  ignoreFilters?: string[];
  /** JMESPath query language strings that can be specified to match certain events
   * @see https://jmespath.org/
   */
  matchers?: string[];
  validations?: boolean;
}

/**
 * A hook into the events that are currently in the given Assurance session. Can be used with the config
 * parameter in order to filter and sort events
 * @param {EventFilterConfig} config An optional configuration that can be used to filter and sort events
 * @returns {Event[]} A list of events that matched the criteria of the input config
 */
export const useEvents = <T extends Events>(
  config: UseEventsOptions = {},
): T => {
  const context = checkContext(useContext(EventContext));
  const validation = useContext(ValidationContext);
  const navigation = useContext(NavigationContext);

  return useMemo(
    () =>
      extractFilteredEvents(
        config,
        context?.events!,
        navigation?.filters,
        validation?.validation,
      ) as T,
    [context?.events, navigation?.filters, validation?.validation],
  );
};
