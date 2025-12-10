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

import { PluginConfig } from '../types';
import { DEFAULT_SERVER_URL, DEFAULT_MOCK_MODE, MAX_EVENTS_CONTEXT, STORAGE_KEYS } from '../constants';

/**
 * Get plugin configuration from localStorage
 */
export function getConfig(): PluginConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
  
  return {
    serverUrl: DEFAULT_SERVER_URL,
    mockMode: DEFAULT_MOCK_MODE,
    maxEventsContext: MAX_EVENTS_CONTEXT,
  };
}

/**
 * Save plugin configuration to localStorage
 */
export function saveConfig(config: PluginConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

/**
 * Validate server URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

