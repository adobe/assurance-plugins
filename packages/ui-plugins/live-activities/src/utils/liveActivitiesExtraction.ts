/**
 * Pure utility functions for extracting Live Activities data from messaging state and events.
 * No React dependencies - can be used anywhere.
 */

import {
  LiveActivityTypeData,
  LiveActivitiesExtractionResult,
  LiveActivitySchema
} from '../types/liveActivities';
import { isLiveActivityAssuranceDebugEvent } from '../types/events';

/**
 * Extracts attribute type from Live Activity schema event using type guards.
 * @param event - The event to extract attribute type from
 * @returns The extracted attribute type or null if not found
 */
function extractAttributeTypeFromSchemaEvent(event: any): string | null {
  try {
    if (isLiveActivityAssuranceDebugEvent(event)) {
      return event.payload.ACPExtensionEventData.jsonSchema?.['attributes-type'] || null;
    }
    return null;
  } catch (error) {
    console.warn('Failed to extract attribute type from schema event:', error);
    return null;
  }
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

    return {
      $schema: (schema as any).$schema || '',
      'attributes-type': schema['attributes-type'],
      'content-state': schema['content-state'] || {},
      attributes: schema.attributes || {},
      title: (schema as any).title || ''
    };
  } catch (error) {
    console.warn('Failed to extract schema from event:', error);
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
    console.warn('Failed to extract example payload from event:', error);
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
    if (!liveActivityState) {
      return {
        activityTypes: new Map(),
        totalCount: 0,
        hasAnySchema: false,
        hasAnyPushToStartToken: false
      };
    }

    const activityTypesMap = new Map<string, LiveActivityTypeData>();

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
    console.error('Failed to extract Live Activities data from state:', error);
    return {
      activityTypes: new Map(),
      totalCount: 0,
      hasAnySchema: false,
      hasAnyPushToStartToken: false
    };
  }
}
