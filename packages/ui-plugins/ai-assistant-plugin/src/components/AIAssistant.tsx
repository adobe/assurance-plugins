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

import React, { useState, useEffect, useRef } from 'react';
import {
  useFilteredEvents,
  useSession,
  useEnvironment,
} from '@adobe/assurance-plugin-bridge-provider';
import { PluginView, TimelineToolbar } from '@adobe/assurance-timeline-bar';
import {
  View,
  Flex,
  TextField,
  Button,
  Text,
  Heading,
  Divider,
  StatusLight,
  ProgressCircle,
} from '@adobe/react-spectrum';
import { useConfig } from '../hooks/useConfig';
import { useChat } from '../hooks/useChat';
import SettingsPanel from './Settings';

const AIAssistant = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration
  const { config, updateConfig } = useConfig();

  // Assurance session data
  const events = useFilteredEvents({ sorted: true, filtered: false });
  const session = useSession();
  const environment = useEnvironment();

  // Chat logic
  const {
    messages,
    isLoading,
    serverStatus,
    initialize,
    sendMessage,
    checkHealth,
  } = useChat({
    serverUrl: config.serverUrl,
    mockMode: config.mockMode,
    maxEventsContext: config.maxEventsContext,
  });

  // Initialize chat on mount
  useEffect(() => {
    initialize(
      session?.name || 'Unknown Session',
      events?.length || 0,
      environment || 'Unknown'
    );
  }, [session?.name, events?.length, environment, initialize]);

  // Check server health when config changes
  useEffect(() => {
    checkHealth();
  }, [config.serverUrl, config.mockMode, checkHealth]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const sessionContext = {
      sessionId: session?.sessionId,
      sessionName: session?.name,
      eventCount: events?.length || 0,
      events: events?.slice(0, config.maxEventsContext),
      environment,
    };

    await sendMessage(inputValue, sessionContext);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusVariant = () => {
    if (config.mockMode) return 'notice';
    return serverStatus === 'online' ? 'positive' : 
           serverStatus === 'offline' ? 'negative' : 'info';
  };

  const getStatusText = () => {
    if (config.mockMode) return 'Demo Mode';
    return serverStatus === 'online' ? 'Server Online' :
           serverStatus === 'offline' ? 'Server Offline' : 'Checking...';
  };

  return (
    <PluginView>
      <Flex direction="column" height="100%" width="100%">
        {/* Header */}
        <View padding="size-200" backgroundColor="gray-100">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={3}>AI Assistant</Heading>
            <Flex gap="size-100" alignItems="center">
              <StatusLight variant={getStatusVariant()}>
                {getStatusText()}
              </StatusLight>
              {!config.mockMode && (
                <Button
                  variant="secondary"
                  onPress={checkHealth}
                  isDisabled={isLoading}
                >
                  Refresh
                </Button>
              )}
              <SettingsPanel config={config} onSave={updateConfig} />
            </Flex>
          </Flex>
        </View>

        <Divider size="S" />

        {/* Session Info */}
        <View padding="size-100" backgroundColor="gray-50">
          <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666' }}>
            📊 Session: {session?.name || 'No session'} | 
            Events: {events?.length || 0} | 
            Env: {environment || 'Unknown'}
          </Text>
        </View>

        <Divider size="S" />

        {/* Messages Area */}
        <View flex padding="size-200" overflow="auto" backgroundColor="gray-50">
          <Flex direction="column" gap="size-200">
            {messages.map((message) => (
              <View
                key={message.id}
                paddingX="size-200"
                paddingY="size-150"
                backgroundColor={
                  message.role === 'user' ? 'blue-400' :
                  message.role === 'system' ? 'yellow-400' :
                  'gray-200'
                }
                borderRadius="medium"
                UNSAFE_style={{
                  maxWidth: '85%',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Text 
                  UNSAFE_style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '4px',
                    color: message.role === 'user' ? 'white' : 'black'
                  }}
                >
                  {message.role === 'user' ? '👤 You' :
                   message.role === 'system' ? '🤖 System' :
                   '🤖 AI Assistant'}
                </Text>
                <Text 
                  UNSAFE_style={{ 
                    whiteSpace: 'pre-wrap',
                    color: message.role === 'user' ? 'white' : 'black'
                  }}
                >
                  {message.content}
                </Text>
                <Text 
                  UNSAFE_style={{ 
                    fontSize: '0.75em', 
                    marginTop: '4px', 
                    opacity: 0.8,
                    color: message.role === 'user' ? 'white' : 'black'
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            ))}
            
            {isLoading && (
              <Flex justifyContent="center" alignItems="center" gap="size-100">
                <ProgressCircle size="S" isIndeterminate />
                <Text>AI is thinking...</Text>
              </Flex>
            )}
            
            <div ref={messagesEndRef} />
          </Flex>
        </View>

        <Divider size="S" />

        {/* Input Area */}
        <View padding="size-200" backgroundColor="gray-100">
          <Flex direction="row" gap="size-100" alignItems="end">
            <TextField
              label="Message"
              flex
              value={inputValue}
              onChange={setInputValue}
              onKeyDown={handleKeyPress}
              isDisabled={isLoading}
              placeholder="Ask about your Assurance session..."
            />
            <Button
              variant="accent"
              onPress={handleSend}
              isDisabled={!inputValue.trim() || isLoading}
              UNSAFE_style={{ marginBottom: '4px' }}
            >
              Send
            </Button>
          </Flex>
          {config.mockMode && (
            <Text UNSAFE_style={{ fontSize: '0.8em', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
              💡 Try: "How many events?", "Any errors?", "Help", "SDK version"
            </Text>
          )}
        </View>
      </Flex>
      <TimelineToolbar />
    </PluginView>
  );
};

export default AIAssistant;
