/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2024 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

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

