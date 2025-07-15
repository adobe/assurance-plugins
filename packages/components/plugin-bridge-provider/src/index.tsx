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

// Provider
export { default as PluginBridgeProvider } from "./Provider";

// Hooks - explicit exports for better tree-shaking
export { useDataStream, type DataStream } from "./hooks/useDataStream";
export { useEnvironment } from "./hooks/useEnvironment";
export { useEnvironmentValue } from "./hooks/useEnvironmentValue";
export { useEvents, type UseEventsOptions } from "./hooks/useEvents";
export { useFlags, type Flags } from "./hooks/useFlags";
export { useImsAccessToken } from "./hooks/useImsAccessToken";
export { useImsOrg } from "./hooks/useImsOrg";
export { useNavigationFilters } from "./hooks/useNavigationFilters";
export { useNavigationPath } from "./hooks/useNavigationPath";
export { useSelectEvents } from "./hooks/useSelectEvents";
export { useSelectedEvents } from "./hooks/useSelectedEvents";
export { useSandbox } from "./hooks/useSandbox";
export { useTenant } from "./hooks/useTenant";
export { useValidation } from "./hooks/useValidation";

// Additional hooks from hooks.tsx
export { useClients, useSelectedClients, useValidationMap } from "./hooks/hooks";

// Bridge utilities - explicit exports for better tree-shaking
export {
  annotateEvent,
  annotateSession,
  deletePlugin,
  flushConnection,
  navigateTo,
  selectEvents,
  sendCommand,
  uploadPlugin
} from "./bridge.utils";
