import { useEvents } from '@assurance/plugin-bridge-provider';

import { useMemo } from 'react';

import { ACTIVITY_TYPE, ActivityType } from '../api/liveActivityApi';
import { LIVE_ACTIVITIES_MATCHERS } from '../constants/matchers';
import {
  isLiveActivityDismissedEvent,
  isLiveActivityEndEvent,
  isLiveActivityStartEvent,
  isLiveActivityUpdatedEvent,
  isLiveActivityUpdateTokenEvent,
  isLiveActivityUpdateTokenToEdgeEvent,
  isLiveActivityStartToEdgeEvent,
  isLiveActivityPushToStartTokenToEdgeEvent,
  isLiveActivityAssuranceDebugEvent,
  isLiveActivityPushToStartTokenEvent,
  isLiveActivityEndedEvent
} from '../types/events';
import {
  LiveActivityTypeData,
  LiveActivitiesExtractionResult,
  LiveActivitySchema,
  RegisteredActivity
} from '../types/liveActivities';
import {
  extractSchemaDataFromEvents,
  extractLiveActivitiesDataFromState,
  extractRegisteredActivitiesFromSchemaEvents
} from '../utils/liveActivitiesExtraction';

export interface LiveActivity {
  id: string;
  name: string;
  status: 'active' | 'completed';
  pushToStartToken?: string;
  updateToken?: string;
  startEvent?: any;
  endEvent?: any;
  startTime?: number;
  endTime?: number;
  events?: any[];
  updateEvents?: any[];
  attributes?: string;
  examplePayload?: any;
  schema?: any;
  currentContentState?: any;
  type?: ActivityType;
  broadcastChannelId?: string;
}

/**
 * Gets a unique key for a live activity that works for both unitary and broadcast types.
 * For unitary activities: uses the activity ID
 * For broadcast activities: uses the channel ID + attribute type (to support multiple activity types per channel)
 * 
 * @param activity - The live activity
 * @returns A unique string key for the activity
 */
export function getActivityKey(activity: LiveActivity): string {
  // For broadcast: use channelId + attributeType as the key (supports multiple types per channel)
  if (activity.type === ACTIVITY_TYPE.BROADCAST && activity.broadcastChannelId) {
    return `${ACTIVITY_TYPE.BROADCAST}:${activity.broadcastChannelId}:${activity.name}`;
  }
  // For unitary: use id as the key
  if (activity.id) {
    return `${ACTIVITY_TYPE.UNITARY}:${activity.id}`;
  }
  // Fallback (shouldn't happen in normal cases)
  return `unknown:${activity.name}:${activity.startTime || 'no-timestamp'}`;
}

/**
 * Extracts activity metadata from Live Activity events.
 * @param event - The event to extract metadata from
 * @returns Object with grouping key, IDs, type, and attributeType, or null if not found
 */
function extractActivityMetadata(event: any): { 
  groupingKey: string;
  liveActivityId?: string;
  channelId?: string;
  attributeType: string;
  activityType: ActivityType;
} | null {
  const eventData = event.payload?.ACPExtensionEventData;
  if (!eventData) {
    return null;
  }

  // Detect activity type based on channelID presence
  // If channelID exists, it's a broadcast activity; otherwise it's unitary
  const channelId = eventData.channelID || eventData.data?.channelID;
  const liveActivityId = eventData.liveActivityID || eventData.data?.liveActivityID || eventData.activityId;
  
  const activityType: ActivityType = channelId ? ACTIVITY_TYPE.BROADCAST : ACTIVITY_TYPE.UNITARY;
  
  // For attributeType, try multiple possible locations
  const attributeType =
    eventData.attributeType || eventData.data?.attributeType || 'unknown';
  
  // Determine grouping key based on activity type
  // For broadcast: group by channelID + attributeType (to support multiple activity types per channel)
  // For unitary: group by liveActivityID (required)
  const groupingKey = activityType === ACTIVITY_TYPE.BROADCAST 
    ? `${channelId}:${attributeType}` 
    : liveActivityId;

  if (!groupingKey) {
    return null;
  }

  return { 
    groupingKey,
    liveActivityId,
    channelId,
    attributeType,
    activityType
  };
}

/**
 * Extracts active Live Activities from events using type guards.
 * @param events - Array of events to search for Live Activity events
 * @returns Array of active Live Activity data
 */
function extractActiveActivitiesFromEvents(events: any[]): any[] {
  const activitiesMap = new Map<string, any>();

  events.forEach(event => {
    // Check if this is a relevant Live Activity event
    const isRelevantEvent =
      isLiveActivityStartEvent(event) ||
      isLiveActivityUpdatedEvent(event) ||
      isLiveActivityDismissedEvent(event) ||
      isLiveActivityUpdateTokenEvent(event) ||
      isLiveActivityUpdateTokenToEdgeEvent(event) ||
      isLiveActivityStartToEdgeEvent(event) ||
      isLiveActivityPushToStartTokenToEdgeEvent(event) ||
      isLiveActivityAssuranceDebugEvent(event) ||
      isLiveActivityEndedEvent(event);

    if (!isRelevantEvent) return;

    const metadata = extractActivityMetadata(event);
    if (!metadata) return;

    const { groupingKey, liveActivityId, channelId, attributeType, activityType } = metadata;

    // Initialize activity if not exists
    if (!activitiesMap.has(groupingKey)) {
      activitiesMap.set(groupingKey, {
        liveActivityId: liveActivityId,
        channelId: channelId,
        activityType: activityType,
        attributeType,
        events: [],
        status: 'active'
      });
    }

    // Add event to activity (avoid duplicates)
    const activity = activitiesMap.get(groupingKey);
    const isDuplicate = activity.events.some(existingEvent => existingEvent.uuid === event.uuid);
    if (!isDuplicate) {
      activity.events.push(event);
    }

    // Update attribute type if it differs from the current attribute type (might get updated from "unknown" to some value)
    if (activity.attributeType === 'unknown' && attributeType !== 'unknown') {
      activity.attributeType = attributeType;
    }

    // Update IDs if they were initially undefined
    if (!activity.liveActivityId && liveActivityId) {
      activity.liveActivityId = liveActivityId;
    }
    if (!activity.channelId && channelId) {
      activity.channelId = channelId;
    }
  });

  // Determine status based on the latest lifecycle event (for broadcast channel reuse)
  activitiesMap.forEach(activity => {
    const lifecycleEvents = activity.events.filter(e => 
      isLiveActivityStartEvent(e) || isLiveActivityEndEvent(e)
    );
    
    if (lifecycleEvents.length > 0) {
      // Sort by timestamp descending and get the latest
      const latestEvent = lifecycleEvents.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
      activity.status = isLiveActivityEndEvent(latestEvent) ? 'completed' : 'active';
    }
  });

  return Array.from(activitiesMap.values());
}

function useActivities(): LiveActivity[] {
  // Single event subscription for all Live Activities events
  const allEvents = useEvents<any[]>({
    matchers: [LIVE_ACTIVITIES_MATCHERS.ALL_LIVE_ACTIVITIES],
    sorted: 'desc'
  });

  // Use type guard-based extraction functions
  const activeActivities = extractActiveActivitiesFromEvents(allEvents);
  const schemaData = extractSchemaDataFromEvents(allEvents);

  // Filter push-to-start token events using type guards
  const pushToStartTokenEvents = allEvents.filter(isLiveActivityPushToStartTokenEvent);

  // Group push-to-start token events by attribute type
  const pushToStartTokenMap = new Map<string, any>();
  pushToStartTokenEvents.forEach(event => {
    const attributeType = event.payload?.ACPExtensionEventData?.attributeType;
    if (attributeType) {
      pushToStartTokenMap.set(attributeType, event);
    }
  });

  // Create activities from the extracted active activities
  return activeActivities.map(activity => {
    const { liveActivityId, channelId, activityType, attributeType, events, status } = activity;

    // Find specific events using type guards
    const updateTokenEvent = events.find(isLiveActivityUpdateTokenEvent);
    const startEvent = events.find(isLiveActivityStartEvent);
    const endEvent = events.find(isLiveActivityEndEvent);
    const updateEvents = events.filter(isLiveActivityUpdatedEvent);

    // Sort update events by timestamp (descending) and get the latest content state
    const sortedUpdateEvents = [...updateEvents].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const currentContentState = sortedUpdateEvents[0]?.payload?.ACPExtensionEventData?.contentState;

    // Find matching push-to-start token event by attribute type
    const pushToStartTokenEvent = pushToStartTokenMap.get(attributeType);

    // Get schema data for this attribute type
    const schemaDataForType = schemaData.get(attributeType);

    return {
      id: liveActivityId || '',                // Use actual liveActivityID (may be empty for broadcast)
      broadcastChannelId: channelId,           // Channel ID for broadcast activities
      type: activityType,                      // Activity type from metadata
      name: attributeType,                     // Use attributeType as name for backward compatibility
      attributes: attributeType,
      endEvent,
      endTime: endEvent?.timestamp,
      events,
      examplePayload: schemaDataForType?.examplePayload,
      schema: schemaDataForType?.schema,
      startEvent,
      startTime: startEvent?.timestamp,
      status: status as 'active' | 'completed',
      pushToStartToken: pushToStartTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateToken: updateTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateEvents,
      currentContentState
    };
  });
}

/**
 * Hook to get Live Activity state from messaging.
 * @returns Live Activity state data or undefined
 */
export function useSelectedClientLiveActivityState() {
  const events = useEvents({
    sorted: 'desc',
    matchers: [LIVE_ACTIVITIES_MATCHERS.MESSAGING_STATE]
  });
  return events[0]?.payload?.metadata?.['state.data']?.liveActivity;
}

/**
 * Hook to extract Live Activities data from messaging state.
 * This is the primary method as it gets all data from a single source.
 * Always includes schema information from events for better registered activities detection.
 *
 * @param includeSchema - Whether to include schema data from events (default: true for better detection)
 * @returns LiveActivitiesExtractionResult with processed data
 */
export function useLiveActivitiesData(
  includeSchema: boolean = true
): LiveActivitiesExtractionResult {
  const liveActivityState = useSelectedClientLiveActivityState();

  // Use the same single event source as useActivities
  const allEvents = useEvents<any[]>({
    sorted: 'desc',
    matchers: [LIVE_ACTIVITIES_MATCHERS.ALL_LIVE_ACTIVITIES]
  });

  return useMemo(() => {
    // Always filter for schema events for better registered activities detection
    const schemaEvents = allEvents.filter(
      event =>
        event?.payload?.ACPExtensionEventData?.jsonSchema ||
        event?.payload?.ACPExtensionEventData?.examplePayload
    );

    return extractLiveActivitiesDataFromState(liveActivityState, schemaEvents);
  }, [liveActivityState, allEvents]);
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

/**
 * Hook to get schema data for all Live Activity types.
 * @returns Map of attribute types to their schema and example payload data
 */
export function useLiveActivitySchemas(): Map<
  string,
  { schema: LiveActivitySchema; examplePayload: any }
> {
  // Use the same single event source as useActivities
  const allEvents = useEvents<any[]>({
    sorted: 'desc',
    matchers: [LIVE_ACTIVITIES_MATCHERS.ALL_LIVE_ACTIVITIES]
  });

  return useMemo(() => {
    // Filter for schema events from the single source
    const schemaEvents = allEvents.filter(
      event =>
        event?.payload?.ACPExtensionEventData?.jsonSchema ||
        event?.payload?.ACPExtensionEventData?.examplePayload
    );
    return extractSchemaDataFromEvents(schemaEvents);
  }, [allEvents]);
}

export default useActivities;

/**
 * Hook to fetch registered Live Activities that haven't been started yet.
 * These are activities that have been registered on the client but no start event has occurred.
 */
export function useRegisteredActivities(): RegisteredActivity[] {
  // Fetch all Live Activity events to extract registered activities
  const allEvents = useEvents({
    matchers: [LIVE_ACTIVITIES_MATCHERS.SCHEMA_EVENTS],
    sorted: 'desc'
  });

  // Extract registered activities from schema events
  const registeredActivitiesMap = extractRegisteredActivitiesFromSchemaEvents(allEvents);

  // Convert map to array
  const registeredActivities = Array.from(registeredActivitiesMap.values());

  return registeredActivities;
}
