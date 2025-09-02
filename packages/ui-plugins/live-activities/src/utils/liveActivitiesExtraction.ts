/**
 * Pure utility functions for extracting Live Activities data from events.
 * No React dependencies - can be used anywhere.
 */

import {
  LiveActivityTypeData,
  LiveActivitiesExtractionResult,
  LiveActivitySchema,
  LIVE_ACTIVITY_EVENT_PATTERNS
} from '../types/liveActivities';

/**
 * Extracts attribute type from Live Activity event name using regex pattern.
 * @param eventName - The event name to parse
 * @param pattern - Regex pattern to match
 * @returns The extracted attribute type or null if not found
 */
export function extractAttributeType(eventName: string, pattern: RegExp): string | null {
  try {
    const match = eventName.match(pattern);
    return match ? match[1] : null;
  } catch (error) {
    console.warn('Failed to extract attribute type from event name:', eventName, error);
    return null;
  }
}

/**
 * Safely extracts Live Activity schema from event payload.
 * @param event - The event containing schema data
 * @returns LiveActivitySchema or null if invalid
 */
export function extractSchemaFromEvent(event: any): LiveActivitySchema | null {
  try {
    const schema = event?.payload?.ACPExtensionEventData?.jsonSchema;
    if (!schema || !schema['attributes-type']) {
      return null;
    }

    return {
      $schema: schema.$schema || '',
      'attributes-type': schema['attributes-type'],
      'content-state': schema['content-state'] || {},
      attributes: schema.attributes || {},
      title: schema.title || ''
    };
  } catch (error) {
    console.warn('Failed to extract schema from event:', error);
    return null;
  }
}

/**
 * Safely extracts push-to-start token from event payload.
 * @param event - The event containing token data
 * @returns Token string or null if not found
 */
export function extractPushToStartTokenFromEvent(event: any): string | null {
  try {
    return event?.payload?.ACPExtensionEventData?.token || null;
  } catch (error) {
    console.warn('Failed to extract push-to-start token from event:', error);
    return null;
  }
}

/**
 * Safely extracts update token from event payload.
 * @param event - The event containing token data
 * @returns Token string or null if not found
 */
export function extractUpdateTokenFromEvent(event: any): string | null {
  try {
    return event?.payload?.ACPExtensionEventData?.token || null;
  } catch (error) {
    console.warn('Failed to extract update token from event:', error);
    return null;
  }
}

/**
 * Processes schema events and updates the activity types map.
 * @param events - Array of schema events
 * @param activityTypesMap - Map to update
 * @returns Updated map
 */
export function processSchemaEvents(
  events: any[],
  activityTypesMap: Map<string, LiveActivityTypeData>
): Map<string, LiveActivityTypeData> {
  const newMap = new Map(activityTypesMap);

  events.forEach(event => {
    const attributeType = extractAttributeType(
      event.payload?.ACPExtensionEventName || '',
      LIVE_ACTIVITY_EVENT_PATTERNS.SCHEMA
    );

    if (!attributeType) return;

    const schema = extractSchemaFromEvent(event);
    const existing = newMap.get(attributeType);

    newMap.set(attributeType, {
      attributeType,
      schema: schema || existing?.schema,
      pushToStartToken: existing?.pushToStartToken,
      updateToken: existing?.updateToken,
      hasSchema: !!schema,
      hasPushToStartToken: existing?.hasPushToStartToken || false,
      hasUpdateToken: existing?.hasUpdateToken || false,
      lastUpdated: event.timestamp || Date.now()
    });
  });

  return newMap;
}

/**
 * Processes push-to-start token events and updates the activity types map.
 * @param events - Array of push-to-start token events
 * @param activityTypesMap - Map to update
 * @returns Updated map
 */
export function processPushToStartTokenEvents(
  events: any[],
  activityTypesMap: Map<string, LiveActivityTypeData>
): Map<string, LiveActivityTypeData> {
  const newMap = new Map(activityTypesMap);

  events.forEach(event => {
    const attributeType = extractAttributeType(
      event.payload?.ACPExtensionEventName || '',
      LIVE_ACTIVITY_EVENT_PATTERNS.PUSH_TO_START
    );

    if (!attributeType) return;

    const token = extractPushToStartTokenFromEvent(event);
    const existing = newMap.get(attributeType);

    newMap.set(attributeType, {
      attributeType,
      schema: existing?.schema,
      pushToStartToken: token || existing?.pushToStartToken,
      updateToken: existing?.updateToken,
      hasSchema: existing?.hasSchema || false,
      hasPushToStartToken: !!token,
      hasUpdateToken: existing?.hasUpdateToken || false,
      lastUpdated: event.timestamp || Date.now()
    });
  });

  return newMap;
}

/**
 * Processes update token events and updates the activity types map.
 * @param events - Array of update token events
 * @param activityTypesMap - Map to update
 * @returns Updated map
 */
export function processUpdateTokenEvents(
  events: any[],
  activityTypesMap: Map<string, LiveActivityTypeData>
): Map<string, LiveActivityTypeData> {
  const newMap = new Map(activityTypesMap);

  events.forEach(event => {
    const attributeType = extractAttributeType(
      event.payload?.ACPExtensionEventName || '',
      LIVE_ACTIVITY_EVENT_PATTERNS.UPDATE_TOKEN
    );

    if (!attributeType) return;

    const token = extractUpdateTokenFromEvent(event);
    const existing = newMap.get(attributeType);

    newMap.set(attributeType, {
      attributeType,
      schema: existing?.schema,
      pushToStartToken: existing?.pushToStartToken,
      updateToken: token || existing?.updateToken,
      hasSchema: existing?.hasSchema || false,
      hasPushToStartToken: existing?.hasPushToStartToken || false,
      hasUpdateToken: !!token,
      lastUpdated: event.timestamp || Date.now()
    });
  });

  return newMap;
}

/**
 * Processes edge events with multiple push-to-start tokens.
 * @param events - Array of edge events
 * @param activityTypesMap - Map to update
 * @returns Updated map
 */
export function processEdgeEvents(
  events: any[],
  activityTypesMap: Map<string, LiveActivityTypeData>
): Map<string, LiveActivityTypeData> {
  const newMap = new Map(activityTypesMap);

  events.forEach(event => {
    try {
      const details =
        event?.payload?.ACPExtensionEventData?.data?.liveActivityPushNotificationDetails;
      if (!Array.isArray(details)) return;

      details.forEach((detail: any) => {
        const attributeType = detail.liveActivityAttributeType;
        if (!attributeType) return;

        const token = detail.token;
        const existing = newMap.get(attributeType);

        newMap.set(attributeType, {
          attributeType,
          schema: existing?.schema,
          pushToStartToken: token || existing?.pushToStartToken,
          updateToken: existing?.updateToken,
          hasSchema: existing?.hasSchema || false,
          hasPushToStartToken: !!token,
          hasUpdateToken: existing?.hasUpdateToken || false,
          lastUpdated: event.timestamp || Date.now()
        });
      });
    } catch (error) {
      console.warn('Failed to process edge event:', error);
    }
  });

  return newMap;
}

/**
 * Main function to extract Live Activities data from events.
 * Pure function with no side effects.
 * @param events - Array of all events to process
 * @returns LiveActivitiesExtractionResult with processed data
 */
export function extractLiveActivitiesData(events: any[]): LiveActivitiesExtractionResult {
  try {
    // Filter events by type
    const schemaEvents = events.filter(event =>
      event?.payload?.ACPExtensionEventName?.match(LIVE_ACTIVITY_EVENT_PATTERNS.SCHEMA)
    );

    const pushToStartEvents = events.filter(event =>
      event?.payload?.ACPExtensionEventName?.match(LIVE_ACTIVITY_EVENT_PATTERNS.PUSH_TO_START)
    );

    const updateTokenEvents = events.filter(event =>
      event?.payload?.ACPExtensionEventName?.match(LIVE_ACTIVITY_EVENT_PATTERNS.UPDATE_TOKEN)
    );

    const edgeEvents = events.filter(
      event =>
        event?.payload?.ACPExtensionEventName === LIVE_ACTIVITY_EVENT_PATTERNS.PUSH_TO_START_EDGE
    );

    // Process events in order
    let activityTypesMap = new Map<string, LiveActivityTypeData>();

    activityTypesMap = processSchemaEvents(schemaEvents, activityTypesMap);
    activityTypesMap = processPushToStartTokenEvents(pushToStartEvents, activityTypesMap);
    activityTypesMap = processUpdateTokenEvents(updateTokenEvents, activityTypesMap);
    activityTypesMap = processEdgeEvents(edgeEvents, activityTypesMap);

    // Calculate summary statistics
    const activityTypes = Array.from(activityTypesMap.values());
    const totalCount = activityTypes.length;
    const hasAnySchema = activityTypes.some(type => type.hasSchema);
    const hasAnyPushToStartToken = activityTypes.some(type => type.hasPushToStartToken);

    return {
      activityTypes: activityTypesMap,
      totalCount,
      hasAnySchema,
      hasAnyPushToStartToken
    };
  } catch (error) {
    console.error('Failed to extract Live Activities data:', error);
    return {
      activityTypes: new Map(),
      totalCount: 0,
      hasAnySchema: false,
      hasAnyPushToStartToken: false
    };
  }
}
