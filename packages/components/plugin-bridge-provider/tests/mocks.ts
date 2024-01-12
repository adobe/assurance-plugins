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

import { AssuranceSession, Event, Plugin, ValidationRecord } from "@adobe/assurance-types";
import { clientInfo } from '@adobe/griffon-toolkit-common';

export const EVENT1: Event =  {
  uuid: 'TestEvent1',
  type: 'generic',
  eventNumber: 1,
  _internal_adb_props: {
    label: 'TestEvent1'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent1'
  },
  timestamp: 1703188726000
};

export const EVENT2: Event = {
  uuid: 'TestEvent2',
  type: 'generic',
  eventNumber: 2,
  _internal_adb_props: {
    label: 'TestEvent2 chains to one'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent2',
    ACPExtensionEventParentIdentifier: 'TestEvent1'
  },
  timestamp: 1703188727000
};

export const EVENT3: Event = {
  uuid: 'TestEvent3',
  type: 'generic',
  eventNumber: 3,
  _internal_adb_props: {
    label: 'TestEvent3 chains to one'
  },
  payload: {
    ACPExtensionEventUniqueIdentifier: 'TestEvent3',
    ACPExtensionEventParentIdentifier: 'TestEvent1'
  },
  timestamp: 1703188728000
};

export const CLIENT_EVENT: Event = clientInfo.mock({
  eventNumber: 4,
  clientId: 'test-client'
}) as Event;

export const CLIENT_EVENT2: Event = clientInfo.mock({
  eventNumber: 5,
  clientId: 'test-client2'
}) as Event;

export const VALID_TEST: ValidationRecord = {
  category: 'test',
  level: 'error',
  namespace: 'test-valid',
  displayName: 'valid test',
  description: 'this is valid',
  results: {
    events: ['abc', 'efg'],
    message: 'it was valid',
    result: 'matched'
  }
};

export const INVALID_TEST: ValidationRecord = {
  category: 'test',
  level: 'error',
  namespace: 'test-invalid',
  displayName: 'invalid test',
  description: 'this is valid',
  results: {
    events: ['abc', 'efg'],
    message: 'it was valid',
    result: 'fail'
  }
};

export const PLUGIN1: Plugin = {
  category: 'test',
  container: 'none',
  displayName: 'Plugin 1',
  description: 'Plugin 1 description',
  icon: '',
  namespace: 'plugin1',
  orgId: 'test-org',
  src: '',
  type: 'view',
  uuid: 'plugin1',
  validations: [],
  visibility: []
};

export const SESSION: AssuranceSession = {
  annotations: [],
  firstName: 'Test',
  lastName: 'User',
  link: 'https://example.com',
  name: 'My test session',
  token: 1234,
  uuid: 'test-session'
};

