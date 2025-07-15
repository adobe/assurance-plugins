import { useCallback } from "react";
import { selectEvents } from "../bridge.utils";
import type { Events } from "../types";

/**
 * Returns a dispatch function to select events globally on Assurance
 * @param events The events to select globally across Assurance
 * @returns A function that will allow you to dispatch events
 */
export const useSelectEvents = (events: Events): ((events: Events) => void) =>
  useCallback(() => selectEvents(events), []);
