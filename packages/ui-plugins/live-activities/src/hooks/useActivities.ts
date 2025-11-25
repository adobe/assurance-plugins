import { combineAny } from '@adobe/griffon-toolkit';

import { useEvents } from '@assurance/plugin-bridge-provider';

import groupBy from 'lodash/groupBy';

import { useMemo } from 'react';

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
}

/**
 * Extracts activity metadata from Live Activity events.
 * @param event - The event to extract metadata from
 * @returns Object with activityId and attributeType, or null if not found
 */
function extractActivityMetadata(event: any): { activityId: string; attributeType: string } | null {
  const eventData = event.payload?.ACPExtensionEventData;
  if (!eventData) {
    return null;
  }

  // Use the same flexible matching logic as useActivityEvents
  const activityId =
    eventData.liveActivityID || eventData.data?.liveActivityID || eventData.activityId;

  // For attributeType, try multiple possible locations
  const attributeType =
    eventData.attributeType || eventData.data?.attributeType || eventData.type || 'unknown'; // Fallback for events without attributeType

  if (!activityId) {
    return null;
  }

  return { activityId, attributeType };
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

    const { activityId, attributeType } = metadata;

    // Initialize activity if not exists
    if (!activitiesMap.has(activityId)) {
      activitiesMap.set(activityId, {
        id: activityId,
        attributeType,
        events: [],
        status: 'active'
      });
    }

    // Add event to activity (avoid duplicates)
    const activity = activitiesMap.get(activityId);
    const isDuplicate = activity.events.some(existingEvent => existingEvent.uuid === event.uuid);
    if (!isDuplicate) {
      activity.events.push(event);
    }

    // Update attribute type if it differs from the current attribute type (might get updated from "unknown" to some value)
    if (activity.attributeType === 'unknown' && attributeType !== 'unknown') {
      activity.attributeType = attributeType;
    }

    // Only update status to completed if this is an end event (dismissed or ended)
    if (isLiveActivityEndEvent(event)) {
      activity.status = 'completed';
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
    const { id, attributeType, events, status } = activity;

    // Find specific events using type guards
    const updateTokenEvent = events.find(isLiveActivityUpdateTokenEvent);
    const startEvent = events.find(isLiveActivityStartEvent);
    const endEvent = events.find(isLiveActivityEndEvent);
    const updateEvents = events.filter(isLiveActivityUpdatedEvent);

    // Sort update events by timestamp (descending) and get the latest content state
    const sortedUpdateEvents = [...updateEvents].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const currentContentState = sortedUpdateEvents[0]?.payload?.ACPExtensionEventData?.contentState ?? {};

    // Find matching push-to-start token event by attribute type
    const pushToStartTokenEvent = pushToStartTokenMap.get(attributeType);

    // Get schema data for this attribute type
    const schemaDataForType = schemaData.get(attributeType);

    return {
      id,
      name: attributeType, // Use attributeType as name for backward compatibility
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
