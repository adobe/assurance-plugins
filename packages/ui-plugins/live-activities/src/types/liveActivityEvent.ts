import { Event } from '@assurance/common-utils';

export interface LiveActivityEvent extends Event {
  payload?: {
    ACPExtensionEventName?: string;
    ACPExtensionEventData?: {
      liveActivityID?: string;
      data?: {
        liveActivityID?: string;
      };
      activityId?: string;
      contentState?: any;
    };
  };
}
