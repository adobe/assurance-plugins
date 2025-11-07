import React from 'react';
import usePluginState from '../hooks/usePluginState';
import { View } from '@adobe/react-spectrum';

const events = [
  {
    uuid: 'f676d779-744b-4a69-bea9-9c067a4a2ecd',
    eventNumber: 82,
    clientId: 'a4d1583e-d800-4d74-9a55-eaae89965672',
    timestamp: 1749070366409,
    vendor: 'com.adobe.griffon.mobile',
    type: 'generic',
    payload: {
      ACPExtensionEventUniqueIdentifier: '4930E442-7C7B-4B3F-B7F3-9E0F558C5974',
      ACPExtensionEventName: 'Live Activity updated',
      ACPExtensionEventData: {
        attributeType: 'FoodDeliveryLiveActivityAttributes',
        liveActivityID: 'Order123',
        isLiveActivityTrackStateEvent: true,
        appleLiveActivityId: 'AB740FAA-2EAF-4180-9B6E-9001F917E7F7',
        contentState: {
          orderStatus: 'Preparing'
        }
      },
      ACPExtensionEventSource: 'com.adobe.eventsource.debug',
      ACPExtensionEventType: 'com.adobe.eventtype.generic.data',
      ACPExtensionEventTimestamp: 1749070366407.951
    },
    annotations: [],
    _internal_adb_props: {
      label: 'Live Activity updated'
    }
  },
  {
    uuid: '80c4f5f6-c8a7-4341-8b0c-4bdc14ec42db',
    eventNumber: 77,
    clientId: 'a4d1583e-d800-4d74-9a55-eaae89965672',
    timestamp: 1749070358105,
    vendor: 'com.adobe.griffon.mobile',
    type: 'generic',
    payload: {
      ACPExtensionEventName: 'Live Activity updated',
      ACPExtensionEventTimestamp: 1749070358099.4248,
      ACPExtensionEventData: {
        isLiveActivityTrackStateEvent: true,
        liveActivityID: 'Order123',
        appleLiveActivityId: 'AB740FAA-2EAF-4180-9B6E-9001F917E7F7',
        attributeType: 'FoodDeliveryLiveActivityAttributes',
        contentState: {
          orderStatus: 'Order Accepted'
        }
      },
      ACPExtensionEventUniqueIdentifier: 'A8C522F4-BFB3-4998-ACE9-99BD8F697BD4',
      ACPExtensionEventSource: 'com.adobe.eventsource.debug',
      ACPExtensionEventType: 'com.adobe.eventtype.generic.data'
    },
    annotations: [],
    _internal_adb_props: {
      label: 'Live Activity updated'
    }
  },
  {
    uuid: '42f8aa5d-e206-4dee-9388-123c81854598',
    eventNumber: 61,
    clientId: 'a4d1583e-d800-4d74-9a55-eaae89965672',
    timestamp: 1749070326712,
    vendor: 'com.adobe.griffon.mobile',
    type: 'generic',
    payload: {
      ACPExtensionEventName: 'Live Activity updated',
      ACPExtensionEventUniqueIdentifier: '282D78F8-EDF3-4987-B69B-01A2CB7DF9A8',
      ACPExtensionEventData: {
        liveActivityID: 'Order123',
        appleLiveActivityId: 'AB740FAA-2EAF-4180-9B6E-9001F917E7F7',
        contentState: {
          orderStatus: 'Ordered'
        },
        isLiveActivityTrackStateEvent: true,
        attributeType: 'FoodDeliveryLiveActivityAttributes'
      },
      ACPExtensionEventTimestamp: 1749070326711.754,
      ACPExtensionEventSource: 'com.adobe.eventsource.debug',
      ACPExtensionEventType: 'com.adobe.eventtype.generic.data'
    },
    annotations: [],
    _internal_adb_props: {
      label: 'Live Activity updated'
    }
  }
];

function Timeline() {
  const activity = usePluginState(state => state.selectedActivityId);

  if (!events.length) return <View>No events</View>;

  return (
    <div>
      {events.map(event => (
        <div key={event.uuid}>{event.payload.ACPExtensionEventData.contentState.orderStatus}</div>
      ))}
    </div>
  );
}

export default Timeline;
