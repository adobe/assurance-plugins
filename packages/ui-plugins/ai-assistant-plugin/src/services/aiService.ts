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

import { ChatRequest, ChatResponse, SessionInitResponse } from '../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

/**
 * AI Service for handling API communication
 */
export class AIService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.loadSessionId();
  }

  /**
   * Load session ID from localStorage
   */
  private loadSessionId(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        const data = JSON.parse(stored);
        this.sessionId = data.sessionId;
      }
    } catch (error) {
      console.warn('Failed to load session ID:', error);
    }
  }

  /**
   * Save session ID to localStorage
   */
  private saveSessionId(sessionId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ 
        sessionId,
        createdAt: new Date().toISOString()
      }));
      this.sessionId = sessionId;
    } catch (error) {
      console.warn('Failed to save session ID:', error);
    }
  }

  /**
   * Initialize a new session with the backend
   */
  async initializeSession(metadata?: Record<string, unknown>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.SESSION_INIT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'assurance-plugin-user',
          metadata 
        }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize session: ${response.status}`);
      }

      const data: SessionInitResponse = await response.json();
      if (data.success && data.sessionId) {
        this.saveSessionId(data.sessionId);
        return data.sessionId;
      }
      
      throw new Error('Invalid session initialization response');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Session initialization failed: ${error.message}`);
      }
      throw new Error('Session initialization failed');
    }
  }

  /**
   * Get current session ID or create a new one
   */
  async ensureSession(metadata?: Record<string, unknown>): Promise<string> {
    if (this.sessionId) {
      // Verify session is still valid by checking health
      const isHealthy = await this.checkHealth();
      if (isHealthy) {
        return this.sessionId;
      }
    }
    
    // Initialize new session
    return await this.initializeSession(metadata);
  }

  /**
   * Check if server is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.HEALTH}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5s timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send chat message to AI server (Backend API contract)
   */
  async sendMessage(request: ChatRequest): Promise<string> {
    try {
      // Ensure we have a session
      const sessionId = await this.ensureSession({
        sessionName: request.context.sessionName,
        environment: request.context.environment,
        eventCount: request.context.eventCount,
      });

      // Backend expects: { sessionId: string, message: string }
      const backendPayload = {
        sessionId,
        message: request.message,
      };

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      return data.response || data.message || 'No response from AI';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to communicate with AI server: ${error.message}`);
      }
      throw new Error('Failed to communicate with AI server');
    }
  }

  /**
   * Update base URL and reset session
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
    this.sessionId = null; // Reset session when URL changes
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.sessionId = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  /**
   * Upload events to backend for semantic search
   * Uploads in chunks for reliability with large event sets
   */
  async uploadEvents(
    events: unknown[],
    onProgress?: (progress: { chunkNumber: number; totalChunks: number; percentComplete: number }) => void
  ): Promise<void> {
    try {
      // Ensure we have a session
      const sessionId = await this.ensureSession();

      // Get recommended chunk size
      const CHUNK_SIZE = 100;
      const totalChunks = Math.ceil(events.length / CHUNK_SIZE);

      console.log(`📤 Uploading ${events.length} events in ${totalChunks} chunks...`);

      for (let i = 0; i < events.length; i += CHUNK_SIZE) {
        const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
        const chunk = events.slice(i, i + CHUNK_SIZE);
        const isLast = (i + CHUNK_SIZE) >= events.length;

        const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.EVENTS_UPLOAD}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            events: chunk,
            chunkInfo: {
              current: chunkNumber,
              total: totalChunks,
              isLast: isLast,
            },
          }),
          signal: AbortSignal.timeout(60000), // 60s timeout for event processing
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Chunk ${chunkNumber} failed`);
        }

        const result = await response.json();
        
        // Report progress
        const percentComplete = Math.round((chunkNumber / totalChunks) * 100);
        if (onProgress) {
          onProgress({ chunkNumber, totalChunks, percentComplete });
        }

        console.log(`✅ Chunk ${chunkNumber}/${totalChunks} uploaded (${percentComplete}%)`);
      }

      console.log(`🎉 Upload complete! All ${events.length} events processed.`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload events: ${error.message}`);
      }
      throw new Error('Failed to upload events');
    }
  }
}

// Singleton instance (will be recreated when URL changes)
let aiServiceInstance: AIService | null = null;

/**
 * Get or create AI service instance
 */
export function getAIService(baseUrl: string): AIService {
  if (!aiServiceInstance || aiServiceInstance['baseUrl'] !== baseUrl) {
    aiServiceInstance = new AIService(baseUrl);
  }
  return aiServiceInstance;
}

