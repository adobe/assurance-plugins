/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { annotation, sessionAnnotation } from '@adobe/griffon-toolkit-common';
import {
  mobileEvent,
  clientInfoAndroid,
  clientInfoIos,
  lifecycleStart,
  trackAction,
} from '@adobe/griffon-toolkit-aep-mobile';
import { Events, Event } from '@adobe/assurance-types';

export const ANNOTATION_EVENT1 = mobileEvent.mock({
  uuid: 'EVENT_#10',
  clientId: 'abc',
  eventNumber: 10,
  timestamp: 1703188711000,
  annotations: [
    annotation.mock({
      namespace: annotation.publicNamespace.visibility,
      payload: {
        [annotation.publicKey.hidden]: true
      }
    })
  ]
});

export const ANNOTATION_EVENT2 = mobileEvent.mock({
  uuid: 'EVENT_#11',
  clientId: 'efg',
  eventNumber: 11,
  timestamp: 1703188711001,
  annotations: [
    annotation.mock({
      namespace: annotation.publicNamespace.visibility,
      payload: {
        [annotation.publicKey.hidden]: false,
        [annotation.publicKey.important]: true
      }
    }),
    annotation.mock({
      namespace: annotation.publicNamespace.notes,
      payload: {
        [annotation.publicKey.note]: 'Honey Bear'
      }
    })
  ]
});

export const CLIENT_EVENT1 = clientInfoAndroid.mock({
  uuid: 'EVENT_#1',
  clientId: 'abc',
  eventNumber: 1,
  timestamp: 1703188710000,
  deviceName: 'Test Device'
});

export const CLIENT_EVENT2 = clientInfoIos.mock({
  uuid: 'EVENT_#2',
  clientId: 'efg',
  eventNumber: 2,
  timestamp: 1703188710001,
  deviceName: null,
  model: 'iPhone X2'
});


export const SINGLE_CLIENT_EVENTS: Events = [
  ANNOTATION_EVENT2 as Event,
  CLIENT_EVENT2 as Event
];


export const EVENTS: Events = [
  ANNOTATION_EVENT1 as Event,
  ANNOTATION_EVENT2 as Event,
  CLIENT_EVENT1 as Event,
  CLIENT_EVENT2 as Event,
  lifecycleStart.mock({
    uuid: 'EVENT_#21',
    clientId: 'abc',
    eventNumber: 21,
    _internal_adb_props: {
      label: 'Lifecyle Start'
    },
    timestamp: 1703188710021,
  }) as Event,
  trackAction.mock({
    uuid: 'EVENT_#22',
    clientId: 'abc',
    eventNumber: 22,
    timestamp: 1703188710022,
  }) as Event,
  trackAction.mock({
    uuid: 'EVENT_#23',
    clientId: 'abc',
    eventNumber: 23,
    timestamp: 1703188710023,
  }) as Event,
  mobileEvent.mock({
    uuid: 'EVENT_#24',
    clientId: 'abc',
    eventNumber: 24,
    timestamp: 1703188710024,
  }) as Event,
  mobileEvent.mock({
    uuid: 'EVENT_#25',
    clientId: 'abc',
    eventNumber: 24,
    timestamp: 1703188710025,
  }) as Event,
  mobileEvent.mock({
    uuid: 'EVENT_#26',
    clientId: 'abc',
    eventNumber: 26,
    timestamp: 1703188710026,
  }) as Event,
];
