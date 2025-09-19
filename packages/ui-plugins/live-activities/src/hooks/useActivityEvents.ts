import { useEvents } from '@assurance/plugin-bridge-provider';
import { combineAny } from '@adobe/griffon-toolkit';
import { useMemo } from 'react';
import { LiveActivityEvent } from '../types/liveActivityEvent';
import { processActivityEvents, calculateEventStatistics, calculateTimeRange } from '../utils/eventProcessingUtils';

/**
 * Hook to get events for a specific Live Activity
 */
export function useActivityEvents(activityId?: string): LiveActivityEvent[] {
  const allEvents = useEvents<LiveActivityEvent[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.liveActivityID',
        'payload.ACPExtensionEventData.data.liveActivityID',
        'payload.ACPExtensionEventData.activityId'
      ])
    ],
    sorted: 'desc'
  });
  
  return useMemo(() => {
    if (!activityId) return [];
    return processActivityEvents(allEvents, activityId);
  }, [allEvents, activityId]);
}

/**
 * Hook to get event statistics for a specific Live Activity
 */
export function useEventStatistics(events: LiveActivityEvent[]) {
  return useMemo(() => {
    return calculateEventStatistics(events);
  }, [events]);
}

/**
 * Hook to get time range for events
 */
export function useEventTimeRange(events: LiveActivityEvent[]) {
  return useMemo(() => {
    return calculateTimeRange(events);
  }, [events]);
}

