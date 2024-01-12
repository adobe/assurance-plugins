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

import type { 
  AssuranceSession,
  Events, 
  GenericObject,
  Plugins,
  PluginBridge,
  ValidationRecords
 } from '@adobe/assurance-types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Filters = {
  clients?: string[];
}

export type BridgeConnections = {
  connections: GenericObject[];
}

export type BridgeEvents = {
  events?: Events;
};

export type BridgeNavigation = {
  path: string;
  filters: Filters; 
}

export type BridgePlugins = {
  plugins: Plugins;
}

export type BridgeSelectedEvents = {
  selected?: Events;
}

export type BridgeSession = {
  session: AssuranceSession;
}


export type BridgeValidation = {
  validation: ValidationRecords;
};


export type EventFilterConfig = {
  sorted?: boolean;
  filtered?: boolean;
  hideLogs?: boolean;
  ignoreFilters?: string[];
  matchers?: string[];
  validations?: boolean;
};
