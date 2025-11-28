/**
 * Centralized matcher definitions for Live Activities events.
 * Uses the existing event type definitions from events.ts
 */
import { combineAny } from '@adobe/griffon-toolkit';

export const LIVE_ACTIVITIES_MATCHERS = {
  // Messaging state for tokens
  MESSAGING_STATE: "payload.ACPExtensionEventData.stateowner=='com.adobe.messaging'",

  // All Live Activity events (comprehensive)
  ALL_LIVE_ACTIVITIES: combineAny([
    // Core Live Activity events
    'payload.ACPExtensionEventName==`Live Activity updated`',
    'payload.ACPExtensionEventName==`Live Activity update token`',
    'payload.ACPExtensionEventName==`Live Activity update token to Edge`',
    'payload.ACPExtensionEventName==`Live Activity start event`',
    'payload.ACPExtensionEventName==`Live Activity start to Edge`',
    'payload.ACPExtensionEventName==`Live Activity dismissed`',
    'payload.ACPExtensionEventName==`Live Activity ended`',
    'payload.ACPExtensionEventName==`Live Activity push-to-start token to Edge`',

    // Live Activity Schema events (for registered activities detection)
    'payload.ACPExtensionEventData.jsonSchema',
    'payload.ACPExtensionEventData.examplePayload',

    // Fallback: any event with Live Activity identifiers
    'payload.ACPExtensionEventData.liveActivityID',
    'payload.ACPExtensionEventData.data.liveActivityID',
    'payload.ACPExtensionEventData.activityId',
    'payload.ACPExtensionEventData.isLiveActivityPushToStartTokenEvent',
    'payload.ACPExtensionEventData.isLiveActivityUpdateTokenEvent',
    'payload.ACPExtensionEventData.isLiveActivityTrackStartEvent',
    'payload.ACPExtensionEventData.isLiveActivityTrackStateEvent'
  ]),

  // Specific event type matchers
  ACTIVE_ACTIVITIES: combineAny([
    'payload.ACPExtensionEventName==`Live Activity start event`',
    'payload.ACPExtensionEventName==`Live Activity updated`',
    'payload.ACPExtensionEventName==`Live Activity dismissed`',
    'payload.ACPExtensionEventName==`Live Activity ended`',
    'payload.ACPExtensionEventData.liveActivityID',
    'payload.ACPExtensionEventData.data.liveActivityID',
    'payload.ACPExtensionEventData.activityId'
  ]),

  TOKEN_EVENTS: combineAny([
    'payload.ACPExtensionEventName==`Live Activity update token`',
    'payload.ACPExtensionEventName==`Live Activity update token to Edge`',
    'payload.ACPExtensionEventName==`Live Activity push-to-start token to Edge`',
    'payload.ACPExtensionEventData.isLiveActivityPushToStartTokenEvent',
    'payload.ACPExtensionEventData.isLiveActivityUpdateTokenEvent'
  ]),

  SCHEMA_EVENTS: combineAny([
    'payload.ACPExtensionEventData.jsonSchema',
    'payload.ACPExtensionEventData.examplePayload'
  ])
} as const;

// Type for matcher keys
export type LiveActivitiesMatcherKey = keyof typeof LIVE_ACTIVITIES_MATCHERS;
