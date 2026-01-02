import { Event } from '@assurance/common-utils';

export interface LiveActivityEvent extends Event {
  payload?: {
    ACPExtensionEventName?: string;
    ACPExtensionEventData?: {
      liveActivityID?: string;
      channelID?: string;
      data?: {
        liveActivityID?: string;
        channelID?: string;
        origin?: string;
        type?: string;
      };
      activityId?: string;
      contentState?: any;
    };
  };
}
