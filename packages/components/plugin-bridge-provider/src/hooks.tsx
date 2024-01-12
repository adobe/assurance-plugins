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

import { useContext, useMemo } from "react";
import { 
  ConnectionContext,
  EventContext,
  NavigationContext,
  PluginContext,
  SelectedEventContext,
  SessionContext,
  SettingsContext,
  ValidationContext,
} from "./Contexts";
import type { EventFilterConfig } from "./types";
import extractFilteredEvents from "./utils/extract.filtered.events";
import extractClientEvents from "./utils/extract.client.events";
import extractSelectedClients from "./utils/extract.selected.clients";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkContext(context: any, check = true) {
  if (context && Object.keys(context).length === 0 && check) {
    throw new Error('Plugin bridge hooks must be used within a PluginBridgeProvider');
  }
  return context;
}

export const useEnvironment = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.env;
}

export const useFlags = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  
  return useMemo(() => {
    return {
      showColumnSettings: context?.showColumnSettings,
      showReleaseNotes: context?.showReleaseNotes,
      showTimeline: context?.showTimeline,
    };
  }, [context?.showColumnSettings, context?.showReleaseNotes, context?.showTimeline]);
}

export const useImsAccessToken = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.imsAccessToken;
}

export const useImsOrg = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.imsOrg;
}

export const useTenant = (check = true) => {
  const context = checkContext(useContext(SettingsContext), check);
  return context?.tenant;
}

export const useNavigationPath = (check = true) => {
  const context = checkContext(useContext(NavigationContext), check);
  return context?.path;
}

export const useNavigationFilters = (check = true) => {
  const context = checkContext(useContext(NavigationContext), check);
  return context?.filters;
}

export const useFilteredEvents = (configIn: EventFilterConfig = {}, check = true) => {
  const defaultConfig = {
    sorted: true,
    filtered: false,
    hideLogs: false,
    ignoreFilters: [],
    matchers: [],
    validations: false
  };
  const config = { ...defaultConfig, ...configIn };

  const context = checkContext(useContext(EventContext), check);
  const validation = useContext(ValidationContext);
  const navigation = useContext(NavigationContext);

  return useMemo(() => {
    return extractFilteredEvents(config, context?.events, navigation?.filters, validation?.validation);
  }, [context?.events, navigation?.filters, validation?.validation]);
}

export const usePlugins = (check = true) => {
  const context = checkContext(useContext(PluginContext), check);
  return context?.plugins;
}

export const useSelectedEvents = (check = true) => {
  const context = checkContext(useContext(SelectedEventContext), check);
  return context?.selected;
}

export const useSession = (check = true) => {
  const context = checkContext(useContext(SessionContext), check);
  return context?.session;
}

export const useValidation = (check = true) => {
  const context = checkContext(useContext(ValidationContext), check);
  return context?.validation;
}

export const useClients = (check = true) => {
  const events = useFilteredEvents({
    sorted: true,
    filtered: true,
    ignoreFilters: ['clients']
  }, check);

  return useMemo(() => {
    return extractClientEvents(events);
  }, [events]);
}

export const useSelectedClients = (check = true) => {
  const clients = useClients(check);
  const filters = useNavigationFilters(check);

  return extractSelectedClients(clients, filters);
}

export const useConnections = (check = true) => {
  const context = checkContext(useContext(ConnectionContext), check);
  return context?.connections;
}
