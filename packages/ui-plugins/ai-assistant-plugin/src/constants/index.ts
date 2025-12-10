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
 * Default API configuration
 */
export const DEFAULT_SERVER_URL = 'http://localhost:3001';
export const DEFAULT_MOCK_MODE = false;
export const MAX_EVENTS_CONTEXT = 100;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  CONFIG: 'ai-assistant-config',
  MESSAGES: 'ai-assistant-messages',
  SESSION: 'ai-assistant-session',
} as const;

/**
 * API endpoints - matches backend /api/* structure
 */
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  CHAT: '/api/chat',
  SESSION_INIT: '/api/session/init',
  SESSION_HISTORY: '/api/session',
  EVENTS_UPLOAD: '/api/events/upload',
  EVENTS_CONFIG: '/api/events/config',
} as const;

/**
 * Mock responses for demo mode
 */
export const MOCK_RESPONSES = {
  EVENTS: (eventCount: number, sessionName: string, environment: string) =>
    `Based on the current session, I can see there are ${eventCount} events. The session "${sessionName}" is running in ${environment} environment.\n\nSome common event types I'm seeing:\n- Analytics events\n- Edge requests\n- Lifecycle events\n\nWould you like me to analyze any specific event type?`,
  
  ERRORS: () =>
    `I've analyzed the session and here's what I found:\n\n✅ No critical errors detected\n⚠️ Found 2 warnings:\n   - Slow network response (>2s)\n   - Missing user consent\n\n📊 Session health: Good\n🔍 Recommendation: Check network conditions and verify consent implementation.`,
  
  HELP: () =>
    `I can help you with:\n\n1. 📊 Event Analysis - Analyze and explain events in your session\n2. 🐛 Debugging - Identify errors and issues\n3. 📈 Performance - Check for performance bottlenecks\n4. 🔍 Search - Find specific events or patterns\n5. 💡 Recommendations - Suggest improvements\n\nJust ask me anything about your Assurance session!`,
  
  SDK: () =>
    `SDK Information from current session:\n\n📱 Platform: iOS/Android\n📦 AEP Core SDK: v2.3.0\n🔄 Edge Network: v1.5.0\n📊 Analytics: v3.1.2\n\nAll SDKs are up to date! ✅`,
  
  JOURNEY: () =>
    `User Journey Analysis:\n\n1. 🚀 App Launch (10:23:45)\n2. 🏠 Home Screen View (10:23:46)\n3. 🔍 Product Search: "shoes" (10:24:12)\n4. 👆 Product Click: Product ID 12345 (10:24:28)\n5. 🛒 Add to Cart (10:24:45)\n\nAverage session duration: 5m 23s\nUser engagement: High`,
  
  DEFAULT: (eventCount: number) =>
    `I understand you're asking about the session. Currently, I have access to ${eventCount} events and can help you analyze them.\n\n🤖 Note: This is a mock response for demo purposes. Connect to the real AI server for actual analysis.`,
} as const;

