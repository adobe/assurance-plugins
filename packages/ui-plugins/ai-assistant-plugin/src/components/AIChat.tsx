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
import { setDemoMode, resetDemoScript, isDemoModeEnabled, getDemoStepInfo } from '../utils/mockResponses';
import { getDemoScript } from '../utils/demoScript';
import MarkdownRenderer from './MarkdownRenderer';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [tempMockMode, setTempMockMode] = useState(false);
  const [tempDemoScript, setTempDemoScript] = useState(false);
  const [tempAutoPlay, setTempAutoPlay] = useState(false);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalEventsUploaded, setTotalEventsUploaded] = useState(0);
  const [isAutoUploadEnabled, setIsAutoUploadEnabled] = useState(true);
  const lastUploadedIndexRef = useRef(0);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
    const enableDemoScript = config.mockMode && isDemoModeEnabled();
    initialize(
      session?.name || 'Unknown Session',
      events?.length || 0,
      environment || 'Unknown',
      enableDemoScript
    );
  }, [session?.name, events?.length, environment, initialize, config.mockMode]);

  // Check server health
  useEffect(() => {
    checkHealth();
  }, [config.serverUrl, config.mockMode, checkHealth]);

  // Auto-scroll to show messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-play demo - simulates human typing
  useEffect(() => {
    if (!isAutoPlayActive || !config.mockMode || !isDemoModeEnabled()) {
      return;
    }

    // Don't start new question while AI is responding
    if (isLoading) {
      return;
    }

    const demoScript = getDemoScript();
    const stepInfo = getDemoStepInfo();
    
    // Check if we've completed all steps
    if (stepInfo.current > demoScript.length) {
      setIsAutoPlayActive(false);
      console.log('🎬 Auto-play demo completed!');
      return;
    }

    // Wait before starting next question (simulate thinking time)
    const thinkingDelay = stepInfo.current === 1 ? 1000 : 3000; // Shorter for first, longer after responses
    
    autoPlayTimerRef.current = setTimeout(() => {
      const currentStep = demoScript[stepInfo.current - 1];
      if (!currentStep) {
        setIsAutoPlayActive(false);
        return;
      }

      const question = currentStep.question;
      let charIndex = 0;

      console.log(`🎬 Auto-play typing: "${question}"`);

      // Simulate human typing character by character
      typingIntervalRef.current = setInterval(() => {
        if (charIndex <= question.length) {
          setInput(question.substring(0, charIndex));
          charIndex++;
        } else {
          // Finished typing, clear interval
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          
          // Simulate pressing Enter after a brief pause
          setTimeout(() => {
            console.log('🎬 Auto-play sending message...');
            
            const sessionContext = {
              sessionId: session?.sessionId,
              sessionName: session?.name,
              eventCount: events?.length || 0,
              events: events?.slice(0, config.maxEventsContext),
              environment,
            };

            sendMessage(question, sessionContext);
            setInput(''); // Clear input after sending
          }, 800); // Brief pause before "pressing Enter"
        }
      }, 80 + Math.random() * 40); // Variable typing speed (80-120ms) for human-like feel
    }, thinkingDelay);

    // Cleanup
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [isAutoPlayActive, config.mockMode, isLoading, messages.length, session, events, environment, config.maxEventsContext, sendMessage]);

  // Streaming/Incremental event upload
  useEffect(() => {
    if (config.mockMode || !isAutoUploadEnabled || !events || events.length === 0) {
      return;
    }

    if (serverStatus !== 'online') {
      return;
    }

    const newEvents = events.slice(lastUploadedIndexRef.current);
    
    // Upload when we have 10+ new events or it's been 5 seconds since last batch
    if (newEvents.length >= 10) {
      // Debounce: wait a bit in case more events are coming
      if (uploadTimerRef.current) {
        clearTimeout(uploadTimerRef.current);
      }

      uploadTimerRef.current = setTimeout(() => {
        uploadNewEventsBatch(newEvents);
      }, 2000); // Wait 2s for more events
    }

    // Cleanup timer on unmount
    return () => {
      if (uploadTimerRef.current) {
        clearTimeout(uploadTimerRef.current);
      }
    };
  }, [events, config.mockMode, isAutoUploadEnabled, serverStatus]);

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

  // Upload new events batch (streaming)
  const uploadNewEventsBatch = async (newEvents: unknown[]) => {
    if (isUploading || newEvents.length === 0) return;

    setIsUploading(true);
    const startIndex = lastUploadedIndexRef.current;

    try {
      const aiService = getAIService(config.serverUrl);
      const result = await aiService.uploadEvents(newEvents, (progress) => {
        setUploadProgress(progress.percentComplete);
      });
      
      // Update tracking based on actual uploaded count
      lastUploadedIndexRef.current = startIndex + result.uploaded;
      setTotalEventsUploaded(prev => prev + result.uploaded);
      
      if (result.success) {
        console.log(`✅ Uploaded ${result.uploaded} new events (total: ${lastUploadedIndexRef.current})`);
      } else {
        console.warn(`⚠️  Partial upload: ${result.uploaded} succeeded, ${result.failed} failed`);
        // Show warning toast for partial failures (don't block UI)
        const errorSummary = result.errors.slice(0, 2).join('; ');
        console.error('Upload errors:', errorSummary);
      }
    } catch (error) {
      console.error('❌ Failed to upload event batch:', error);
      // Don't show alert for background uploads, just log
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Manual upload all events (force full upload)
  const handleManualUpload = async () => {
    if (config.mockMode || !events || events.length === 0 || isUploading) return;

    // Upload all events from scratch
    lastUploadedIndexRef.current = 0;
    setTotalEventsUploaded(0);
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const aiService = getAIService(config.serverUrl);
      const result = await aiService.uploadEvents(events, (progress) => {
        setUploadProgress(progress.percentComplete);
      });
      
      lastUploadedIndexRef.current = result.uploaded;
      setTotalEventsUploaded(result.uploaded);

      if (result.success) {
        console.log(`✅ Manually uploaded all ${result.uploaded} events`);
      } else {
        const errorMsg = `Partial upload: ${result.uploaded}/${events.length} events uploaded. ${result.failed} failed.`;
        console.warn(`⚠️  ${errorMsg}`);
        alert(errorMsg + '\n\nSome chunks failed after retries. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Failed to upload events:', error);
      alert(`Failed to upload events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const openSettings = () => {
    setTempUrl(config.serverUrl);
    setTempMockMode(config.mockMode);
    setTempDemoScript(isDemoModeEnabled());
    setTempAutoPlay(isAutoPlayActive);
    setShowSettings(true);
  };

  const saveSettings = (close: () => void) => {
    // Enable/disable demo script mode
    if (tempMockMode) {
      setDemoMode(tempDemoScript);
      if (tempDemoScript) {
        resetDemoScript(); // Reset to beginning when enabling
      }
    } else {
      setDemoMode(false); // Disable demo script when not in mock mode
    }
    
    // Set auto-play mode
    setIsAutoPlayActive(tempAutoPlay && tempMockMode && tempDemoScript);
    
    updateConfig({ serverUrl: tempUrl, mockMode: tempMockMode });
    
    // Re-initialize chat with new settings
    const enableDemoScript = tempMockMode && tempDemoScript;
    initialize(
      session?.name || 'Unknown Session',
      events?.length || 0,
      environment || 'Unknown',
      enableDemoScript
    );
    
    close();
  };

  const getStatusVariant = () => {
    if (config.mockMode) return 'notice';
    return serverStatus === 'online' ? 'positive' : 
           serverStatus === 'offline' ? 'negative' : 'info';
  };

  const getStatusText = () => {
    if (config.mockMode) {
      const demoScriptEnabled = isDemoModeEnabled();
      return demoScriptEnabled ? 'Demo Script Mode' : 'Demo Mode';
    }
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
                <>
                  {/* Auto-upload status */}
                  {isAutoUploadEnabled && (
                    <Text UNSAFE_style={{ fontSize: '0.75em', color: isUploading ? '#0a84ae' : '#6e6e6e' }}>
                      {isUploading ? `⬆️ Uploading ${uploadProgress}%` : `📊 ${totalEventsUploaded}/${events?.length || 0} synced`}
                    </Text>
                  )}
                  
                  {/* Manual upload button */}
                  <ActionButton
                    onPress={handleManualUpload}
                    isDisabled={isUploading || !events || events.length === 0}
                    isQuiet
                  >
                    <Text>⟳ Upload All</Text>
                  </ActionButton>
                </>
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
                        
                        <Text UNSAFE_style={{ fontSize: '0.9em', color: '#666' }}>
                          {tempMockMode 
                            ? 'Demo mode uses simulated responses for testing without a server.'
                            : 'Connect to a real AI agent server for actual analysis.'}
                        </Text>

                        {tempMockMode && (
                          <>
                            <Divider size="S" />
                            <Switch 
                              isSelected={tempDemoScript} 
                              onChange={setTempDemoScript}
                              marginStart="size-300"
                            >
                              🎬 Demo Script Mode
                            </Switch>
                            
                            <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666', marginLeft: '24px' }}>
                              {tempDemoScript 
                                ? '📝 Uses pre-scripted conversation for presentations.'
                                : '🤖 Uses dynamic responses based on keywords in your questions.'}
                            </Text>

                            {tempDemoScript && (
                              <>
                                <Switch 
                                  isSelected={tempAutoPlay} 
                                  onChange={setTempAutoPlay}
                                  marginStart="size-300"
                                >
                                  ▶️ Auto-Play Demo
                                </Switch>
                                
                                <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666', marginLeft: '24px' }}>
                                  {tempAutoPlay 
                                    ? '🤖 Automatically types questions and progresses through demo.'
                                    : '✋ Manual mode - you type each question yourself.'}
                                </Text>
                              </>
                            )}
                          </>
                        )}

                        <Divider size="S" />
                        
                        <Switch 
                          isSelected={isAutoUploadEnabled} 
                          onChange={setIsAutoUploadEnabled}
                          isDisabled={tempMockMode}
                        >
                          Auto-upload Events (Streaming)
                        </Switch>
                        
                        <TextField
                          label="Server URL"
                          value={tempUrl}
                          onChange={setTempUrl}
                          isDisabled={tempMockMode}
                          placeholder="http://localhost:3001"
                        />
                        
                        <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666' }}>
                          💡 Auto-upload syncs events incrementally in background (10+ new events)
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
                  minWidth: msg.role === 'user' ? 'auto' : 'min(50%, 300px)',
                  maxWidth: msg.role === 'user' ? '85%' : 'none',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  overflowX: 'auto',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                <Flex direction="column" gap="size-75">
                  <Text UNSAFE_style={{ fontWeight: 'bold', fontSize: '0.85em' }}>
                    {msg.role === 'user' ? '👤 You' : msg.role === 'system' ? '🤖 System' : '🤖 AI'}
                  </Text>
                  
                  {/* Render markdown for AI/system messages, plain text for user */}
                  {msg.role === 'user' ? (
                    <Text 
                      UNSAFE_style={{ 
                        color: 'white',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.content}
                    </Text>
                  ) : (
                    <MarkdownRenderer 
                      content={msg.content} 
                      textColor={msg.role === 'user' ? 'white' : 'black'}
                    />
                  )}
                  
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
          {isAutoPlayActive && (
            <Flex justifyContent="space-between" alignItems="center" marginBottom="size-100">
              <Text UNSAFE_style={{ fontSize: '0.9em', color: '#0a84ae', fontWeight: 'bold' }}>
                🎬 Auto-Play Demo Running - Watch the AI type and respond...
              </Text>
              <Button
                variant="secondary"
                onPress={() => {
                  setIsAutoPlayActive(false);
                  if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
                  if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
                  setInput('');
                }}
              >
                ⏸ Stop
              </Button>
            </Flex>
          )}
          <Flex direction="row" gap="size-100" alignItems="end">
            <TextField
              label="Message"
              flex
              value={input}
              onChange={(val) => !isAutoPlayActive && setInput(val)}
              onKeyDown={(e) => e.key === 'Enter' && !isAutoPlayActive && handleSend()}
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
          {config.mockMode && !isAutoPlayActive && (
            <Text UNSAFE_style={{ fontSize: '0.8em', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
              {isDemoModeEnabled() ? (
                <>
                  🎬 Demo Script Mode: Ask questions in sequence. 
                  {(() => {
                    const progress = getDemoStepInfo();
                    return progress.current <= progress.total ? 
                      ` Step ${progress.current}/${progress.total} (${progress.progress}%)` : 
                      ' Complete! Type "reset demo" to restart.';
                  })()}
                  {' '}💡 Tip: Enable Auto-Play in settings for automated demo.
                </>
              ) : (
                '💡 Demo Mode: Try "How many events?", "Any errors?", "Help"'
              )}
            </Text>
          )}
        </View>
      </Flex>
      <TimelineToolbar />
    </PluginView>
  );
}

