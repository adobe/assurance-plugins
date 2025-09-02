/**
 * React hook to extract Live Activities data from events.
 * Uses pure utility functions for data extraction.
 */

import { useMemo } from 'react';
import { useEvents } from '@assurance/plugin-bridge-provider';
import { extractLiveActivitiesData } from '../utils/liveActivitiesExtraction';
import { LiveActivityTypeData, LiveActivitiesExtractionResult } from '../types/liveActivities';

/**
 * Hook to extract Live Activities data from events.
 * This hook handles React-specific concerns (context, memoization) while
 * delegating the pure data extraction logic to utility functions.
 *
 * @returns LiveActivitiesExtractionResult with processed data
 */
export function useLiveActivitiesData(): LiveActivitiesExtractionResult {
  const events = useEvents<any[]>({
    sorted: 'desc'
  });

  return useMemo(() => {
    return extractLiveActivitiesData(events);
  }, [events]);
}

/**
 * Hook to get a specific activity type data.
 * @param attributeType - The attribute type to find
 * @returns LiveActivityTypeData or undefined if not found
 */
export function useLiveActivityTypeData(attributeType: string): LiveActivityTypeData | undefined {
  const { activityTypes } = useLiveActivitiesData();

  return useMemo(() => {
    return activityTypes.get(attributeType);
  }, [activityTypes, attributeType]);
}

/**
 * Hook to get all activity types as an array.
 * @returns Array of LiveActivityTypeData
 */
export function useLiveActivityTypesArray(): LiveActivityTypeData[] {
  const { activityTypes } = useLiveActivitiesData();

  return useMemo(() => {
    return Array.from(activityTypes.values());
  }, [activityTypes]);
}

export default useLiveActivitiesData;
