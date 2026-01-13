import { fakeEventCommand } from '@adobe/griffon-toolkit-aep-mobile';
import { sendCommand } from '@assurance/plugin-bridge-provider';
import { v4 } from 'uuid';
import usePluginState from './usePluginState';
function useLaunchLiveActivity() {
  const selectedClient = usePluginState(state => state.selectedClient);

  const launch = () => {
    const command = fakeEventCommand.make({
      eventName: 'Push To Start (Spoof)',
      eventType: 'com.adobe.eventType.generic',
      eventSource: 'com.adobe.eventSource.requestContent',
      eventData: {
        uuid: v4(),
        sessionUuid: '674be345-14df-44d3-a11e-3c87841e5d5e',
        orgId: '745F37C35E4B776E0A49421B@AdobeOrg',
        vendor: 'com.adobe.griffon.mobile',
        type: 'generic',
        payload: {
          appSessionID: '7F3C18EE-6D18-4FAA-91DC-8295B135FD9D',
          ACPExtensionEventTimestamp: 1746564848514.108,
          ACPExtensionEventName: 'Live Activity Started (GameScoreLiveActivityAttributes)',
          ACPExtensionEventUniqueIdentifier: 'BC338C47-FE8D-4497-A217-FE5D65B059FD',
          ACPExtensionEventType: 'com.adobe.eventtype.edge',
          ACPExtensionEventData: {
            activityId: v4(),
            liveActivityID: 'Testing',
            attributeTypeName: 'GameScoreLiveActivityAttributes'
          },
          ACPExtensionEventSource: 'com.adobe.eventsource.requestcontent'
        },
        timestamp: 1746564848558,
        eventNumber: 321,
        clientId: selectedClient?.id
      }
    });

    sendCommand(command);
  };

  return launch;
}

export default useLaunchLiveActivity;
