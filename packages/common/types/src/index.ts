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

/**
 * OBJECTS
 */

export type AssuranceSession = {
  annotations: SessionAnnotation[];
  firstName: string;
  lastName: string;
  link: string;
  name: string;
  token: number;
  uuid: string;
};

export type Event = GenericObject & {
  eventNumber: number,
  timestamp: number,
  _internal_adb_props?: {
    label: string,
  },
  payload: any,
  type: string,
  uuid: string
};
export type Events = Event[];

export type GenericObject = Record<string, unknown>;

export type Plugin = {
  category: string;
  container: string;
  description: string;
  displayName: string;
  icon: string;
  namespace: string;
  orgId: string;
  src: string;
  type: string;
  uuid: string;
  validations: string[],
  visibility: string[];
}
export type Plugins = Plugin[];

export type SessionAnnotation = {
  uuid: string;
  namespace: string;
  payload: any;
}

export type ValidationRecord = {
  category: string,
  container?: string,
  description: string,
  displayName: string,
  icon?: string,
  level: string,
  namespace: string,
  orgId?: string,
  results: ValidationResult,
  type?: string,
};
export type ValidationRecords = Record<string, ValidationRecord>;

export type ValidationResult = {
  events: string[],
  message: string,
  result: string;
};


/**
 * BRIDGE
 */

export type PluginBridgeConfig = {
  init: (options: BridgeSettings) => void;
  navigateTo: (navigation: string) => void;
  receiveConnections: (connections: any) => void;
  receiveEvents: (events: Events) => void;
  receivePlugins: (plugins: Plugins) => void;
  receiveSelectedEvents: (events: Events) => void;
  receiveSession: (session: AssuranceSession) => void;
  receiveSettings: (settings: any) => void;
  receiveValidation: (validation: ValidationRecords) => void;
};

export type PluginBridge = {
  register: (plugin: PluginBridgeConfig) => void;
  annotateEvent: (event: any) => Promise<void>;
  annotateSession: (session: any) => Promise<void>;
  deletePlugin: (uuid: string) => Promise<void>;
  flushConnection: (namespace: string, context: any) => Promise<void>;
  navigateTo: (path: string) => Promise<void>;
  selectEvents: (events: any) => Promise<void>;
  sendCommand: (command: any) => Promise<void>;
  uploadPlugin: (contents: any) => Promise<void>;
}

export type BridgeSettings = {
  env: string;
  imsAccessToken: string;
  imsOrg: string;
  showColumnSettings: boolean;
  showReleaseNotes: boolean;
  showTimeline: boolean;
  tenant: string;
}
