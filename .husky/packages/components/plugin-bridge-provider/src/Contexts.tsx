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

import { createContext } from "react";
import type { 
  BridgeConnections,
  BridgeEvents,
  BridgeNavigation,
  BridgeSelectedEvents,
  BridgeSettings,
  BridgeValidation, 
} from './types';

export const ConnectionContext = createContext<BridgeConnections | null>(null);
export const EventContext = createContext<BridgeEvents | null>(null);
export const NavigationContext = createContext<BridgeNavigation | null>(null);
export const SelectedEventContext = createContext<BridgeSelectedEvents | null>(null);
export const SettingsContext = createContext<BridgeSettings | null>(null);
export const ValidationContext = createContext<BridgeValidation | null>(null);
