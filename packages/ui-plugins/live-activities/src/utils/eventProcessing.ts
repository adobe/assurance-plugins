import { useEvents } from '@assurance/plugin-bridge-provider';

import { combineAny } from '@adobe/griffon-toolkit';

import { useMemo } from 'react';

import { EVENT_CONFIG } from '../constants/liveActivitiesConfig';
import { LiveActivityEvent } from '../types/liveActivityEvent';

interface EventStatistics {
  total: number;
  start: number;
  contentUpdate: number;
  tokenUpdate: number;
  tokenUpdateEdge: number;
  ended: number;
  dismissed: number;
  other: number;
}

interface TimeRange {
  earliest: string;
  latest: string;
  duration: number; // in minutes
}

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

    const filteredEvents = allEvents.filter(event => {
      const eventLiveActivityID =
        event.payload?.ACPExtensionEventData?.liveActivityID ||
        event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
        event.payload?.ACPExtensionEventData?.activityId;

      return eventLiveActivityID === activityId;
    });

    // Deduplicate by uuid to avoid duplicate events
    const uniqueEvents = filteredEvents.filter(
      (event, index, self) => index === self.findIndex(e => e.uuid === event.uuid)
    );

    return uniqueEvents;
  }, [allEvents, activityId]);
}

/**
 * Hook to calculate event statistics for a set of events
 */
export function useEventStatistics(events: LiveActivityEvent[]): EventStatistics {
  return useMemo(() => {
    const stats: EventStatistics = {
      total: events.length,
      start: 0,
      contentUpdate: 0,
      tokenUpdate: 0,
      tokenUpdateEdge: 0,
      ended: 0,
      dismissed: 0,
      other: 0
    };

    events.forEach(event => {
      const eventName = event.payload?.ACPExtensionEventName || '';

      switch (eventName) {
        case EVENT_CONFIG.EVENT_NAMES.START:
          stats.start++;
          break;
        case EVENT_CONFIG.EVENT_NAMES.UPDATED:
          stats.contentUpdate++;
          break;
        case EVENT_CONFIG.EVENT_NAMES.UPDATE_TOKEN:
          stats.tokenUpdate++;
          break;
        case EVENT_CONFIG.EVENT_NAMES.UPDATE_TOKEN_EDGE:
          stats.tokenUpdateEdge++;
          break;
        case EVENT_CONFIG.EVENT_NAMES.ENDED:
          stats.ended++;
          break;
        case EVENT_CONFIG.EVENT_NAMES.DISMISSED:
          stats.dismissed++;
          break;
        default:
          stats.other++;
      }
    });

    return stats;
  }, [events]);
}

/**
 * Hook to calculate time range for a set of events
 */
export function useEventTimeRange(events: LiveActivityEvent[]): TimeRange | null {
  return useMemo(() => {
    if (events.length === 0) return null;

    const timestamps = events.map(e => new Date(e.timestamp));
    const earliest = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const latest = new Date(Math.max(...timestamps.map(t => t.getTime())));

    return {
      earliest: earliest.toISOString(),
      latest: latest.toISOString(),
      duration: Math.round((latest.getTime() - earliest.getTime()) / (1000 * 60)) // minutes
    };
  }, [events]);
}

/**
 * Utility function to filter events by type
 */
export function filterEventsByType(
  events: LiveActivityEvent[],
  eventType: string
): LiveActivityEvent[] {
  if (eventType === 'all') return events;

  return events.filter(event => {
    const eventName = event.payload?.ACPExtensionEventName || '';

    switch (eventType) {
      case 'start':
        return eventName === EVENT_CONFIG.EVENT_NAMES.START;
      case 'content-update':
        return eventName === EVENT_CONFIG.EVENT_NAMES.UPDATED;
      case 'token-update':
        return eventName === EVENT_CONFIG.EVENT_NAMES.UPDATE_TOKEN;
      case 'token-update-edge':
        return eventName === EVENT_CONFIG.EVENT_NAMES.UPDATE_TOKEN_EDGE;
      case 'ended':
        return eventName === EVENT_CONFIG.EVENT_NAMES.ENDED;
      case 'dismissed':
        return eventName === EVENT_CONFIG.EVENT_NAMES.DISMISSED;
      default:
        return false;
    }
  });
}

/**
 * Utility function to filter events by search query
 */
export function filterEventsBySearch(
  events: LiveActivityEvent[],
  searchQuery: string
): LiveActivityEvent[] {
  if (!searchQuery.trim()) return events;

  const query = searchQuery.toLowerCase();

  return events.filter(event => {
    const eventName = event.payload?.ACPExtensionEventName || '';
    const payload = JSON.stringify(event.payload || {});

    return eventName.toLowerCase().includes(query) || payload.toLowerCase().includes(query);
  });
}

/**
 * Utility function to get the latest content state from events
 */
export function getLatestContentState(events: LiveActivityEvent[]): any {
  const updateEvent = events
    .filter(event => event.payload?.ACPExtensionEventName === EVENT_CONFIG.EVENT_NAMES.UPDATED)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return updateEvent?.payload?.ACPExtensionEventData?.contentState;
}

/**
 * Utility function to get event type display name
 */
export function getEventTypeDisplayName(eventName: string): string {
  switch (eventName) {
    case EVENT_CONFIG.EVENT_NAMES.START:
      return 'Start';
    case EVENT_CONFIG.EVENT_NAMES.UPDATED:
      return 'Content Update';
    case EVENT_CONFIG.EVENT_NAMES.UPDATE_TOKEN:
      return 'Token Update';
    case EVENT_CONFIG.EVENT_NAMES.ENDED:
      return 'Ended';
    case EVENT_CONFIG.EVENT_NAMES.DISMISSED:
      return 'Dismissed';
    default:
      return 'Other';
  }
}

/**
 * Utility function to check if an event belongs to a specific activity
 */
export function eventBelongsToActivity(event: LiveActivityEvent, activityId: string): boolean {
  const eventLiveActivityID =
    event.payload?.ACPExtensionEventData?.liveActivityID ||
    event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
    event.payload?.ACPExtensionEventData?.activityId;

  return eventLiveActivityID === activityId;
}

/**
 * Utility function to sort events by timestamp
 */
export function sortEventsByTimestamp(
  events: LiveActivityEvent[],
  direction: 'asc' | 'desc' = 'desc'
): LiveActivityEvent[] {
  return [...events].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();

    return direction === 'desc' ? timeB - timeA : timeA - timeB;
  });
}
