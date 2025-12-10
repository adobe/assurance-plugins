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
 * Message role types
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Chat message structure
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Session context sent to AI
 */
export interface SessionContext {
  sessionId?: string;
  sessionName?: string;
  eventCount: number;
  events?: unknown[];
  environment?: string;
}

/**
 * AI chat request payload
 */
export interface ChatRequest {
  message: string;
  context: SessionContext;
  history?: Message[];
}

/**
 * AI chat response payload
 */
export interface ChatResponse {
  response?: string;
  message?: string;
  error?: string;
}

/**
 * Session initialization response
 */
export interface SessionInitResponse {
  success: boolean;
  sessionId?: string;
  message?: string;
  error?: string;
  session?: {
    id: string;
    createdAt: string;
    userId?: string;
  };
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  serverUrl: string;
  mockMode: boolean;
  maxEventsContext: number;
}

/**
 * Server connection status
 */
export type ServerStatus = 'checking' | 'online' | 'offline';

/**
 * Chat state
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  serverStatus: ServerStatus;
  error: string | null;
}

