/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { act } from "@testing-library/react";
import { AssuranceSession, BridgeSettings, Events, Plugins, PluginBridge, ValidationRecords } from "@adobe/assurance-types";

declare global {
  interface Window { pluginBridge: PluginBridge; }
}

const getBridge = () => {
  return (window.pluginBridge.register as jest.Mock).mock.calls[0][0];
}

export const initBridge = (config: Partial<BridgeSettings> = {}) => {
  act(() => {
    getBridge().init(config);
  });
}

export const navigateTo = (path: string) => {
  act(() => {
    getBridge().navigateTo(path);
  });
}

export const receiveConnections = (connections: any) => {
  act(() => {
    getBridge().receiveConnections(connections);
  });
}

export const receiveEvents = (events: Events) => {
  act(() => {
    getBridge().receiveEvents(events);
  });
}

export const receivePlugins = (plugins: Plugins) => {
  act(() => {
    getBridge().receivePlugins(plugins);
  });
}

export const receiveSelectedEvents = (events: Events) => {
  act(() => {
    getBridge().receiveSelectedEvents(events);
  });
}

export const receiveSession = (session: AssuranceSession) => {
  act(() => {
    getBridge().receiveSession(session);
  });
}

export const receiveSettings = (settings) => {
  act(() => {
    getBridge().receiveSettings(settings);
  });
}

export const receiveValidation = (validation: ValidationRecords) => {
  act(() => {
    getBridge().receiveValidation(validation);
  });
}
