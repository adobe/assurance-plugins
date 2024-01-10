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

import { createContext } from "react";
import { BridgeSettings } from "@adobe/assurance-types";
import type { 
  BridgeConnections,
  BridgeEvents,
  BridgeNavigation,
  BridgePlugins,
  BridgeSelectedEvents,
  BridgeSession,
  BridgeValidation, 
} from './types';

export const ConnectionContext = createContext<BridgeConnections | null>(null);
export const EventContext = createContext<BridgeEvents | null>(null);
export const NavigationContext = createContext<BridgeNavigation | null>(null);
export const PluginContext = createContext<BridgePlugins | null>(null);
export const SelectedEventContext = createContext<BridgeSelectedEvents | null>(null);
export const SettingsContext = createContext<BridgeSettings | null>(null);
export const SessionContext = createContext<BridgeSession | null>(null);
export const ValidationContext = createContext<BridgeValidation | null>(null);
