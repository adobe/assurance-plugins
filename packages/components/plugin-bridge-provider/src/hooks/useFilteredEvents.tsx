/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import { useEvents, UseEventsOptions } from "./useEvents";
import { Events } from "../types";

/**
 * A convenience hook that returns filtered events based on navigation filters.
 * This is a wrapper around useEvents with filtered: true by default.
 * 
 * @param {UseEventsOptions} config Optional configuration for additional filtering
 * @returns {Event[]} A list of filtered events
 */
export const useFilteredEvents = <T extends Events>(
  config: UseEventsOptions = {}
): T => {
  return useEvents<T>({ ...config, filtered: true });
};

