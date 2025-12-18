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

import { useState, useCallback } from 'react';
import { Message, ChatState, ServerStatus, SessionContext } from '../types';
import { getAIService } from '../services/aiService';
import { getMockResponse, simulateDelay, setDemoMode, isDemoModeEnabled, getDemoStepInfo } from '../utils/mockResponses';

interface UseChatOptions {
  serverUrl: string;
  mockMode: boolean;
  maxEventsContext: number;
}

/**
 * Hook for managing chat state and interactions
 */
export function useChat(options: UseChatOptions) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    serverStatus: 'checking' as ServerStatus,
    error: null,
  });

  /**
   * Initialize with welcome message
   */
  const initialize = useCallback((sessionName: string, eventCount: number, environment: string, enableDemoScript: boolean = false) => {
    // Enable/disable demo script mode
    if (options.mockMode && enableDemoScript) {
      setDemoMode(true);
    }
    
    const demoModeActive = options.mockMode && isDemoModeEnabled();
    
    const welcomeMessage: Message = {
      id: `system-${Date.now()}`,
      role: 'system',
      content: `🤖 AI Assistant for Assurance ${options.mockMode ? (demoModeActive ? '(DEMO SCRIPT MODE)' : '(DEMO MODE)') : ''}\n\nConnected to session: ${sessionName}\nEvents available: ${eventCount}\nEnvironment: ${environment}\n\n${options.mockMode ? (demoModeActive ? '🎬 Running in DEMO SCRIPT mode - Ask questions in sequence for a guided demonstration.\n\n**Start by asking:** "What can you tell me about this session?"\n\n' : '⚠️ Running in DEMO mode with mock responses. Configure server URL in settings to connect to actual AI agent.\n\n') : ''}I can help you analyze events, debug issues, and answer questions about your Assurance session.`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [welcomeMessage],
    }));
  }, [options.mockMode]);

  /**
   * Check server health
   */
  const checkHealth = useCallback(async () => {
    if (options.mockMode) {
      setState(prev => ({ ...prev, serverStatus: 'offline' }));
      return;
    }

    setState(prev => ({ ...prev, serverStatus: 'checking' }));
    
    try {
      const aiService = getAIService(options.serverUrl);
      const isHealthy = await aiService.checkHealth();
      setState(prev => ({ 
        ...prev, 
        serverStatus: isHealthy ? 'online' : 'offline' 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, serverStatus: 'offline' }));
    }
  }, [options.mockMode, options.serverUrl]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (
    content: string,
    sessionContext: SessionContext
  ): Promise<void> => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      let responseContent: string;

      if (options.mockMode) {
        // Mock mode (with demo script support)
        const isDemo = isDemoModeEnabled();
        await simulateDelay(isDemo);
        responseContent = getMockResponse(
          content,
          sessionContext.eventCount,
          sessionContext.sessionName || 'Unknown',
          sessionContext.environment || 'Unknown'
        );
      } else {
        // Real server mode
        const aiService = getAIService(options.serverUrl);
        const history = state.messages.filter(m => m.role !== 'system');
        
        responseContent = await aiService.sendMessage({
          message: content,
          context: sessionContext,
          history,
        });
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to get response'}\n\n💡 Tip: Check your server URL in settings or enable Demo Mode to test the interface.`,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        serverStatus: 'offline',
      }));
    }
  }, [options.mockMode, options.serverUrl, state.messages]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
    }));
  }, []);

  /**
   * Toggle demo script mode
   */
  const toggleDemoScript = useCallback((enabled: boolean) => {
    setDemoMode(enabled);
  }, []);

  /**
   * Get demo script progress
   */
  const getDemoProgress = useCallback(() => {
    return getDemoStepInfo();
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    serverStatus: state.serverStatus,
    error: state.error,
    initialize,
    sendMessage,
    checkHealth,
    clearMessages,
    toggleDemoScript,
    getDemoProgress,
    isDemoMode: options.mockMode && isDemoModeEnabled(),
  };
}

