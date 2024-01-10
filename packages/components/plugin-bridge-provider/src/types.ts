/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
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
