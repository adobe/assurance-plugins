import { combineAny } from '@adobe/griffon-toolkit';

import { useEvents } from '@assurance/plugin-bridge-provider';

import groupBy from 'lodash/groupBy';

import { useMemo } from 'react';

import { LIVE_ACTIVITIES_MATCHERS } from '../constants/matchers';
import {
  isLiveActivityDismissedEvent,
  isLiveActivityStartEvent,
  isLiveActivityUpdatedEvent,
  isLiveActivityUpdateTokenEvent,
  isLiveActivityAssuranceDebugEvent,
  isLiveActivityPushToStartTokenEvent
} from '../types/events';
import {
  LiveActivityTypeData,
  LiveActivitiesExtractionResult,
  LiveActivitySchema
} from '../types/liveActivities';
import {
  extractSchemaDataFromEvents,
  extractLiveActivitiesDataFromState
} from '../utils/liveActivitiesExtraction';

export interface LiveActivity {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'completed';
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
}

/**
 * Extracts activity metadata from Live Activity events.
 * @param event - The event to extract metadata from
 * @returns Object with activityId and attributeType, or null if not found
 */
function extractActivityMetadata(event: any): { activityId: string; attributeType: string } | null {
  const eventData = event.payload?.ACPExtensionEventData;
  if (!eventData) return null;

  const activityId = eventData.liveActivityID || eventData.activityId;
  const attributeType = eventData.attributeType;

  return activityId && attributeType ? { activityId, attributeType } : null;
}

/**
 * Determines activity status based on event type.
 * @param event - The event to check
 * @returns The status for this event type
 */
function getActivityStatusFromEvent(event: any): 'active' | 'completed' {
  return isLiveActivityDismissedEvent(event) ? 'completed' : 'active';
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
      isLiveActivityUpdateTokenEvent(event);

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

    // Add event to activity and update status
    const activity = activitiesMap.get(activityId);
    activity.events.push(event);
    activity.status = getActivityStatusFromEvent(event);
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
    const endEvent = events.find(isLiveActivityDismissedEvent);
    const updateEvents = events.filter(isLiveActivityUpdatedEvent);

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
      status: status as 'active' | 'inactive' | 'completed',
      pushToStartToken: pushToStartTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateToken: updateTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateEvents
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
