import { Event } from '@assurance/common-utils';

export interface LiveActivityEvent extends Event {
  payload?: {
    ACPExtensionEventName?: string;
    ACPExtensionEventData?: {
      liveActivityID?: string;
      channelID?: string;
      attributeType?: string;
      isLiveActivityUpdateTokenEvent?: boolean;
      data?: {
        liveActivityID?: string;
        channelID?: string;
        origin?: string;
        type?: string;
        attributeType?: string;
      };
      activityId?: string;
      contentState?: any;
    };
  };
}
