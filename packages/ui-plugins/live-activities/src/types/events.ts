// Base interface for all Live Activity events
export interface BaseLiveActivityEvent {
  uuid: string;
  eventNumber: number;
  clientId: string;
  timestamp: number;
  vendor: string;
  type: string;
  annotations: any[];
  _internal_adb_props?: {
    label: string;
  };
  _internal_annotations?: {
    visibility?: {
      payload?: {
        important?: string;
      };
    };
  };
}

// Base payload structure
export interface BasePayload {
  ACPExtensionEventName: string;
  ACPExtensionEventUniqueIdentifier: string;
  ACPExtensionEventTimestamp: number;
  ACPExtensionEventSource: string;
  ACPExtensionEventType: string;
  ACPExtensionEventParentIdentifier?: string;
}

// Live Activity Updated Event
export interface LiveActivityUpdatedEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity updated';
    ACPExtensionEventData: {
      liveActivityID: string;
      appleLiveActivityId: string;
      isLiveActivityTrackStateEvent: boolean;
      contentState: Record<string, any>;
      attributeType: string;
    };
  };
}

// Live Activity Update Token Event
export interface LiveActivityUpdateTokenEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity update token';
    ACPExtensionEventData: {
      liveActivityID: string;
      appleLiveActivityId: string;
      attributeType: string;
      token: string;
      isLiveActivityUpdateTokenEvent: boolean;
    };
  };
}

// Live Activity Update Token to Edge Event
export interface LiveActivityUpdateTokenToEdgeEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity update token to Edge';
    ACPExtensionEventData: {
      data: {
        liveActivityID: string;
        token: string;
      };
      xdm: {
        eventType: 'liveActivity.updateToken';
      };
    };
  };
}

// Live Activity Push-to-Start Token Events (with attribute type variations)
export interface LiveActivityPushToStartTokenEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: string; // Can be any push-to-start token event name with attribute type
    ACPExtensionEventData: {
      attributeType: string;
      token: string;
      isLiveActivityPushToStartTokenEvent: boolean;
    };
  };
}

// Live Activity Push-to-Start Token to Edge Event
export interface LiveActivityPushToStartTokenToEdgeEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity push-to-start token to Edge';
    ACPExtensionEventData: {
      data: {
        attributeType: string;
        token: string;
      };
      xdm: {
        eventType: 'liveActivity.pushToStartToken';
      };
    };
  };
}

// Live Activity Start Event
export interface LiveActivityStartEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity start event';
    ACPExtensionEventData: {
      liveActivityID: string;
      appleLiveActivityId: string;
      attributeType: string;
      origin: Record<string, any>;
      isLiveActivityTrackStartEvent: boolean;
    };
  };
}

// Live Activity Start to Edge Event
export interface LiveActivityStartToEdgeEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity start to Edge';
    ACPExtensionEventData: {
      data: {
        liveActivityID: string;
        attributeType: string;
        origin: Record<string, any>;
      };
      xdm: {
        eventType: 'liveActivity.start';
      };
    };
  };
}

// Live Activity Dismissed Event
export interface LiveActivityDismissedEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: 'Live Activity dismissed';
    ACPExtensionEventData: {
      liveActivityID: string;
      appleLiveActivityId: string;
      attributeType: string;
      state: 'dismissed';
      isLiveActivityTrackStateEvent: boolean;
    };
  };
}

// Live Activity Assurance Debug Events
export interface LiveActivityAssuranceDebugEvent extends BaseLiveActivityEvent {
  payload: BasePayload & {
    ACPExtensionEventName: string; // Can be any debug event name with attribute type
    ACPExtensionEventData: {
      examplePayload: {
        'content-state': Record<string, any>;
        attributes: Record<string, any>;
        'attributes-type': string;
      };
      jsonSchema: {
        attributes: Record<string, any>;
        'content-state': Record<string, any>;
        'attributes-type': string;
      };
    };
  };
}

// Union type for all Live Activity events
export type LiveActivityEvent =
  | LiveActivityUpdatedEvent
  | LiveActivityUpdateTokenEvent
  | LiveActivityUpdateTokenToEdgeEvent
  | LiveActivityPushToStartTokenEvent
  | LiveActivityPushToStartTokenToEdgeEvent
  | LiveActivityStartEvent
  | LiveActivityStartToEdgeEvent
  | LiveActivityDismissedEvent
  | LiveActivityAssuranceDebugEvent;

// Type guard functions
export const isLiveActivityUpdatedEvent = (event: any): event is LiveActivityUpdatedEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity updated';
};

export const isLiveActivityUpdateTokenEvent = (
  event: any
): event is LiveActivityUpdateTokenEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity update token';
};

export const isLiveActivityUpdateTokenToEdgeEvent = (
  event: any
): event is LiveActivityUpdateTokenToEdgeEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity update token to Edge';
};

export const isLiveActivityPushToStartTokenEvent = (
  event: any
): event is LiveActivityPushToStartTokenEvent => {
  return (
    (event.payload?.ACPExtensionEventName?.includes('Live Activity push-to-start token') &&
    event.payload?.ACPExtensionEventName?.includes('Attributes)')) ||
    event.payload?.ACPExtensionEventData?.isLiveActivityPushToStartTokenEvent === true
  );
};

export const isLiveActivityPushToStartTokenToEdgeEvent = (
  event: any
): event is LiveActivityPushToStartTokenToEdgeEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity push-to-start token to Edge';
};

export const isLiveActivityStartEvent = (event: any): event is LiveActivityStartEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity start event';
};

export const isLiveActivityStartToEdgeEvent = (
  event: any
): event is LiveActivityStartToEdgeEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity start to Edge';
};

export const isLiveActivityDismissedEvent = (event: any): event is LiveActivityDismissedEvent => {
  return event.payload?.ACPExtensionEventName === 'Live Activity dismissed';
};

export const isLiveActivityAssuranceDebugEvent = (
  event: any
): event is LiveActivityAssuranceDebugEvent => {
  return (
    event.payload?.ACPExtensionEventData?.jsonSchema &&
    event.payload?.ACPExtensionEventData?.examplePayload
  );
};

// Helper function to get event type from event name
export const getEventType = (eventName: string): string => {
  if (eventName === 'Live Activity updated') return 'updated';
  if (eventName === 'Live Activity update token') return 'updateToken';
  if (eventName === 'Live Activity update token to Edge') return 'updateTokenToEdge';
  if (
    eventName.includes('Live Activity push-to-start token (') &&
    eventName.includes('Attributes)')
  )
    return 'pushToStartToken';
  if (eventName === 'Live Activity push-to-start token to Edge') return 'pushToStartTokenToEdge';
  if (eventName === 'Live Activity start event') return 'start';
  if (eventName === 'Live Activity start to Edge') return 'startToEdge';
  if (eventName === 'Live Activity dismissed') return 'dismissed';
  if (eventName.includes('Live Activity Assurance Debug for type')) return 'assuranceDebug';
  return 'unknown';
};
