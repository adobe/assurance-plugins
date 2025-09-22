/**
 * Pure utility functions for extracting Live Activities data from messaging state and events.
 * No React dependencies - can be used anywhere.
 */

import { isLiveActivityAssuranceDebugEvent } from '../types/events';
import {
  LiveActivityTypeData,
  LiveActivitiesExtractionResult,
  LiveActivitySchema
} from '../types/liveActivities';

/**
 * Extracts attribute type from Live Activity schema event using type guards.
 * @param event - The event to extract attribute type from
 * @returns The extracted attribute type or null if not found
 */
function extractAttributeTypeFromSchemaEvent(event: any): string | null {
  if (isLiveActivityAssuranceDebugEvent(event)) {
    const attributeType =
      event.payload.ACPExtensionEventData.jsonSchema?.['attributes-type'] || null;
    return attributeType;
  }
  return null;
}

/**
 * Safely extracts Live Activity schema from event payload using type guards.
 * @param event - The event containing schema data
 * @returns LiveActivitySchema or null if invalid
 */
function extractSchemaFromEvent(event: any): LiveActivitySchema | null {
  try {
    if (!isLiveActivityAssuranceDebugEvent(event)) {
      return null;
    }

    const schema = event.payload.ACPExtensionEventData.jsonSchema;
    if (!schema || !schema['attributes-type']) {
      return null;
    }

    const result: LiveActivitySchema = {
      $schema: (schema as any).$schema || '',
      'attributes-type': schema['attributes-type'],
      'content-state': schema['content-state'] || {},
      attributes: schema.attributes || {},
      title: (schema as any).title || ''
    };

    // Add example data if available
    if (event.payload.ACPExtensionEventData.examplePayload) {
      (result as any).examplePayload = event.payload.ACPExtensionEventData.examplePayload;
      (result as any).exampleState =
        event.payload.ACPExtensionEventData.examplePayload['content-state'];
    }

    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts example payload from Live Activity schema event using type guards.
 * @param event - The event containing schema data
 * @returns Example payload object or null if not found
 */
function extractExamplePayloadFromEvent(event: any): any | null {
  try {
    if (!isLiveActivityAssuranceDebugEvent(event)) {
      return null;
    }
    return event.payload.ACPExtensionEventData.examplePayload || null;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts schema information from Live Activity schema events using type guards.
 * @param events - Array of events to search for schema events
 * @returns Map of attribute types to their schema and example payload data
 */
export function extractSchemaDataFromEvents(
  events: any[]
): Map<string, { schema: LiveActivitySchema; examplePayload: any }> {
  const schemaMap = new Map<string, { schema: LiveActivitySchema; examplePayload: any }>();

  events.forEach(event => {
    // Use type guard to filter for schema events
    if (!isLiveActivityAssuranceDebugEvent(event)) return;

    const attributeType = extractAttributeTypeFromSchemaEvent(event);
    if (!attributeType) return;

    const schema = extractSchemaFromEvent(event);
    const examplePayload = extractExamplePayloadFromEvent(event);

    if (schema) {
      schemaMap.set(attributeType, {
        schema,
        examplePayload
      });
    }
  });

  return schemaMap;
}

/**
 * Extracts registered activities from Live Activity Schema events.
 * This is the primary source of truth for registered activities, especially for iOS 16.4.
 * @param schemaEvents - Array of events containing schema information
 * @returns Map of registered activity types with their metadata
 */
export function extractRegisteredActivitiesFromSchemaEvents(
  schemaEvents: any[]
): Map<string, LiveActivityTypeData> {
  const registeredActivitiesMap = new Map<string, LiveActivityTypeData>();

  schemaEvents.forEach(event => {
    // Use type guard to filter for schema events
    if (!isLiveActivityAssuranceDebugEvent(event)) return;

    const attributeType = extractAttributeTypeFromSchemaEvent(event);
    if (!attributeType) return;

    const schema = extractSchemaFromEvent(event);
    const examplePayload = extractExamplePayloadFromEvent(event);

    if (schema) {
      registeredActivitiesMap.set(attributeType, {
        attributeType,
        schema,
        pushToStartToken: undefined, // Will be filled from state if available
        updateToken: undefined, // Will be filled from state if available
        hasSchema: true,
        hasPushToStartToken: false, // Will be updated from state if available
        hasUpdateToken: false, // Will be updated from state if available
        lastUpdated: event.timestamp || Date.now(),
        examplePayload
      });
    }
  });

  return registeredActivitiesMap;
}

/**
 * Extracts Live Activities data from the messaging state data.
 * This is the primary method as it gets all data from a single source.
 * @param liveActivityState - The live activity state from messaging
 * @param schemaEvents - Optional array of events to extract schema information from
 * @returns LiveActivitiesExtractionResult with processed data
 */
export function extractLiveActivitiesDataFromState(
  liveActivityState: any,
  schemaEvents?: any[]
): LiveActivitiesExtractionResult {
  try {
    // Start with registered activities from schema events (primary source of truth)
    const activityTypesMap = schemaEvents
      ? extractRegisteredActivitiesFromSchemaEvents(schemaEvents)
      : new Map<string, LiveActivityTypeData>();

    // If no schema events available, fall back to shared state
    if (activityTypesMap.size === 0 && liveActivityState) {
      // Extract schema information from events if provided
      const schemaDataMap = schemaEvents ? extractSchemaDataFromEvents(schemaEvents) : new Map();

      // Extract push-to-start tokens
      const pushToStartTokens = liveActivityState.pushToStartTokens || {};
      Object.entries(pushToStartTokens).forEach(([attributeType, tokenData]: [string, any]) => {
        if (tokenData && tokenData.token) {
          const schemaData = schemaDataMap.get(attributeType);

          activityTypesMap.set(attributeType, {
            attributeType,
            schema: schemaData?.schema,
            pushToStartToken: tokenData.token,
            updateToken: undefined,
            hasSchema: !!schemaData?.schema,
            hasPushToStartToken: true,
            hasUpdateToken: false,
            lastUpdated: tokenData.firstIssued || Date.now()
          });
        }
      });

      // Extract update tokens and merge with existing push-to-start data
      const updateTokens = liveActivityState.updateTokens || {};
      Object.entries(updateTokens).forEach(([activityId, tokenData]: [string, any]) => {
        if (tokenData && tokenData.token && tokenData.attributeType) {
          const attributeType = tokenData.attributeType;
          const existing = activityTypesMap.get(attributeType);
          const schemaData = schemaDataMap.get(attributeType);

          activityTypesMap.set(attributeType, {
            attributeType,
            schema: existing?.schema || schemaData?.schema,
            pushToStartToken: existing?.pushToStartToken,
            updateToken: tokenData.token,
            hasSchema: existing?.hasSchema || !!schemaData?.schema,
            hasPushToStartToken: existing?.hasPushToStartToken || false,
            hasUpdateToken: true,
            lastUpdated: tokenData.firstIssued || Date.now()
          });
        }
      });
    }

    // Enhance schema-based activities with token data from state if available
    if (liveActivityState && activityTypesMap.size > 0) {
      const pushToStartTokens = liveActivityState.pushToStartTokens || {};
      const updateTokens = liveActivityState.updateTokens || {};

      // Update existing activities with token information
      activityTypesMap.forEach((activity, attributeType) => {
        const pushToStartTokenData = pushToStartTokens[attributeType];
        const updateTokenData = Object.values(updateTokens).find(
          (tokenData: any) => tokenData.attributeType === attributeType
        ) as any;

        if (pushToStartTokenData?.token) {
          activity.pushToStartToken = pushToStartTokenData.token;
          activity.hasPushToStartToken = true;
          activity.lastUpdated = pushToStartTokenData.firstIssued || activity.lastUpdated;
        }

        if (updateTokenData?.token) {
          activity.updateToken = updateTokenData.token;
          activity.hasUpdateToken = true;
          activity.lastUpdated = updateTokenData.firstIssued || activity.lastUpdated;
        }
      });
    }

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
    return {
      activityTypes: new Map(),
      totalCount: 0,
      hasAnySchema: false,
      hasAnyPushToStartToken: false
    };
  }
}
