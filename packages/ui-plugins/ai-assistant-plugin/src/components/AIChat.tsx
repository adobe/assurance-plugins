/*
Copyright 2024 Adobe. All rights reserved.
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
  ActionButton,
  DialogTrigger,
  Dialog,
  Content,
  ButtonGroup,
  Switch,
} from '@adobe/react-spectrum';
import Settings from '@spectrum-icons/workflow/Settings';
import { useConfig } from '../hooks/useConfig';
import { useChat } from '../hooks/useChat';
import { getAIService } from '../services/aiService';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [tempMockMode, setTempMockMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [eventsUploaded, setEventsUploaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Configuration
  const { config, updateConfig } = useConfig();
  
  // Session data
  const events = useFilteredEvents({ sorted: true, filtered: false });
  const session = useSession();
  const environment = useEnvironment();

  // Chat
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

  // Initialize chat
  useEffect(() => {
    initialize(
      session?.name || 'Unknown Session',
      events?.length || 0,
      environment || 'Unknown'
    );
  }, [session?.name, events?.length, environment, initialize]);

  // Check server health
  useEffect(() => {
    checkHealth();
  }, [config.serverUrl, config.mockMode, checkHealth]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const sessionContext = {
      sessionId: session?.sessionId,
      sessionName: session?.name,
      eventCount: events?.length || 0,
      events: events?.slice(0, config.maxEventsContext),
      environment,
    };

    await sendMessage(input, sessionContext);
    setInput('');
  };

  const handleUploadEvents = async () => {
    if (config.mockMode || !events || events.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const aiService = getAIService(config.serverUrl);
      await aiService.uploadEvents(events, (progress) => {
        setUploadProgress(progress.percentComplete);
      });
      setEventsUploaded(true);
      console.log('✅ Events uploaded successfully');
    } catch (error) {
      console.error('❌ Failed to upload events:', error);
      alert(`Failed to upload events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const openSettings = () => {
    setTempUrl(config.serverUrl);
    setTempMockMode(config.mockMode);
    setShowSettings(true);
  };

  const saveSettings = (close: () => void) => {
    updateConfig({ serverUrl: tempUrl, mockMode: tempMockMode });
    close();
  };

  const getStatusVariant = () => {
    if (config.mockMode) return 'notice';
    return serverStatus === 'online' ? 'positive' : 
           serverStatus === 'offline' ? 'negative' : 'info';
  };

  const getStatusText = () => {
    if (config.mockMode) return 'Demo Mode';
    return serverStatus === 'online' ? 'Online' :
           serverStatus === 'offline' ? 'Offline' : 'Checking...';
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
              {!config.mockMode && serverStatus === 'online' && (
                <Button
                  variant="secondary"
                  onPress={handleUploadEvents}
                  isDisabled={isUploading || !events || events.length === 0}
                >
                  {isUploading ? `⬆️ ${uploadProgress}%` : eventsUploaded ? '✅ Events Uploaded' : '⬆️ Upload Events'}
                </Button>
              )}
              {!config.mockMode && (
                <Button variant="secondary" onPress={checkHealth} isDisabled={isLoading}>
                  Refresh
                </Button>
              )}
              <DialogTrigger isOpen={showSettings} onOpenChange={setShowSettings}>
                <ActionButton onPress={openSettings}>
                  <Settings />
                </ActionButton>
                {(close) => (
                  <Dialog>
                    <Heading>Settings</Heading>
                    <Divider />
                    <Content>
                      <Flex direction="column" gap="size-200">
                        <Switch isSelected={tempMockMode} onChange={setTempMockMode}>
                          Demo Mode (Mock Responses)
                        </Switch>
                        
                        <TextField
                          label="Server URL"
                          value={tempUrl}
                          onChange={setTempUrl}
                          isDisabled={tempMockMode}
                          placeholder="http://localhost:8000"
                        />
                        
                        <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666' }}>
                          💡 Server should have /health and /chat endpoints
                        </Text>
                      </Flex>
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary" onPress={close}>Cancel</Button>
                      <Button variant="accent" onPress={() => saveSettings(close)}>Save</Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogTrigger>
            </Flex>
          </Flex>
        </View>

        <Divider size="S" />

        {/* Session Info */}
        <View padding="size-100" backgroundColor="gray-50">
          <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666' }}>
            📊 {session?.name || 'No session'} | Events: {events?.length || 0} | Env: {environment || 'Unknown'}
          </Text>
        </View>

        <Divider size="S" />

        {/* Messages */}
        <View flex padding="size-200" overflow="auto" backgroundColor="gray-50">
          <Flex direction="column" gap="size-150">
            {messages.map((msg) => (
              <View
                key={msg.id}
                padding="size-150"
                backgroundColor={
                  msg.role === 'user' ? 'blue-400' :
                  msg.role === 'system' ? 'yellow-400' :
                  'gray-200'
                }
                borderRadius="medium"
                UNSAFE_style={{ 
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Flex direction="column" gap="size-75">
                  <Text UNSAFE_style={{ fontWeight: 'bold', fontSize: '0.85em' }}>
                    {msg.role === 'user' ? '👤 You' : msg.role === 'system' ? '🤖 System' : '🤖 AI'}
                  </Text>
                  <Text 
                    UNSAFE_style={{ 
                      color: msg.role === 'user' ? 'white' : 'black',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                  </Text>
                  <Text UNSAFE_style={{ fontSize: '0.7em', opacity: 0.7 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Text>
                </Flex>
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

        {/* Input */}
        <View padding="size-200" backgroundColor="gray-100">
          <Flex direction="row" gap="size-100" alignItems="end">
            <TextField
              label="Message"
              flex
              value={input}
              onChange={setInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              isDisabled={isLoading}
              placeholder="Ask about your session..."
            />
            <Button
              variant="accent"
              onPress={handleSend}
              isDisabled={!input.trim() || isLoading}
              UNSAFE_style={{ marginBottom: '4px' }}
            >
              Send
            </Button>
          </Flex>
          {config.mockMode && (
            <Text UNSAFE_style={{ fontSize: '0.8em', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
              💡 Demo Mode: Try "How many events?", "Any errors?", "Help"
            </Text>
          )}
        </View>
      </Flex>
      <TimelineToolbar />
    </PluginView>
  );
}

