import { combineAny } from '@adobe/griffon-toolkit';
import { useEvents } from '@assurance/plugin-bridge-provider';
import groupBy from 'lodash/groupBy';
import {
  isLiveActivityDismissedEvent,
  isLiveActivityStartEvent,
  isLiveActivityUpdatedEvent,
  isLiveActivityUpdateTokenEvent
} from '../types/events';

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

const getLiveActivityID = (event: any) => {
  // For push to start token events, use the attribute type as the ID
  if (event.payload?.ACPExtensionEventData?.isLiveActivityPushToStartTokenEvent) {
    return event.payload?.ACPExtensionEventData?.attributeType;
  }

  // For other events, use the liveActivityID
  return (
    event.payload?.ACPExtensionEventData?.liveActivityID ||
    event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
    event.payload?.ACPExtensionEventData?.activityId
  );
};

function useActivities(): LiveActivity[] {
  const events = useEvents<any[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.liveActivityID',
        'payload.ACPExtensionEventData.data.liveActivityID',
        'payload.ACPExtensionEventData.isLiveActivityPushToStartTokenEvent'
      ])
    ],
    sorted: 'desc'
  });

  const debugEvents = useEvents<any[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.examplePayload',
        'payload.ACPExtensionEventData.jsonSchema'
      ])
    ]
  });

  // First, group push to start token events by attribute type
  const pushToStartTokenEvents = events.filter(
    event => event.payload?.ACPExtensionEventData?.isLiveActivityPushToStartTokenEvent
  );

  // Then group other events by activity ID
  const activityEvents = events.filter(
    event => !event.payload?.ACPExtensionEventData?.isLiveActivityPushToStartTokenEvent
  );

  const groupedByActivityId = groupBy(activityEvents, getLiveActivityID);

  // Create activities from the grouped events
  return Object.entries(groupedByActivityId).map(([name, events]) => {
    const updateTokenEvent = events.find(isLiveActivityUpdateTokenEvent);
    const startEvent = events.find(isLiveActivityStartEvent);
    const endEvent = events.find(isLiveActivityDismissedEvent);

    // Find matching push to start token event by attribute type
    const attributeType = startEvent?.payload?.ACPExtensionEventData?.attributeType;
    const pushToStartTokenEvent = attributeType
      ? pushToStartTokenEvents.find(
          e => e.payload?.ACPExtensionEventData?.attributeType === attributeType
        )
      : undefined;

    // console.log('Activity events:', {
    //   name,
    //   attributeType,
    //   updateTokenEvent: updateTokenEvent?.payload?.ACPExtensionEventData?.token,
    //   pushToStartTokenEvent: pushToStartTokenEvent?.payload?.ACPExtensionEventData?.token,
    //   pushToStartTokenEventFound: !!pushToStartTokenEvent,
    //   pushToStartTokenEventName: pushToStartTokenEvent?.payload?.ACPExtensionEventName,
    //   eventsCount: events.length,
    //   hasIsLiveActivityPushToStartTokenFlag: events.some(
    //     e => e.payload?.ACPExtensionEventData?.isLiveActivityPushToStartTokenEvent
    //   ),
    //   matchingEvents: pushToStartTokenEvents
    //     .filter(e => e.payload?.ACPExtensionEventData?.attributeType === attributeType)
    //     .map(e => ({
    //       eventName: e.payload?.ACPExtensionEventName,
    //       token: e.payload?.ACPExtensionEventData?.token,
    //       attributeType: e.payload?.ACPExtensionEventData?.attributeType
    //     }))
    // });

    const updateEvents = events.filter(isLiveActivityUpdatedEvent);
    const startTime = startEvent?.timestamp;
    const endTime = endEvent?.timestamp;
    const attributes = startEvent?.payload?.ACPExtensionEventData?.attributeType;
    const debugEvent = debugEvents.find(
      debugEvent =>
        debugEvent?.payload?.ACPExtensionEventData?.jsonSchema?.['attributes-type'] === attributes
    );
    const jsonSchema = debugEvent?.payload?.ACPExtensionEventData?.jsonSchema;
    const examplePayload = debugEvent?.payload?.ACPExtensionEventData?.examplePayload;

    return {
      id: name,
      attributes,
      endEvent,
      endTime,
      events,
      name,
      examplePayload,
      schema: jsonSchema,
      startEvent,
      startTime,
      status: endEvent ? 'completed' : 'active',
      pushToStartToken: pushToStartTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateToken: updateTokenEvent?.payload?.ACPExtensionEventData?.token,
      updateEvents
    };
  });
}

export default useActivities;
