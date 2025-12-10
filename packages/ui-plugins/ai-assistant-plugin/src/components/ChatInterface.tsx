/*
Copyright 2024 Adobe. All rights reserved.
*/

import React, { useState } from 'react';
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
  Well,
} from '@adobe/react-spectrum';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  
  // Get session data
  const events = useFilteredEvents({ sorted: true, filtered: false });
  const session = useSession();
  const environment = useEnvironment();

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I can see ${events?.length || 0} events in the session "${session?.name || 'Unknown'}". This is a demo response!` 
      }]);
    }, 500);
    
    setInput('');
  };

  return (
    <PluginView>
      <Flex direction="column" height="100%" width="100%">
        {/* Header */}
        <View padding="size-200" backgroundColor="gray-100">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={3}>AI Assistant</Heading>
            <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666' }}>
              Session: {session?.name || 'None'} | Events: {events?.length || 0}
            </Text>
          </Flex>
        </View>

        <Divider size="S" />

        {/* Messages */}
        <View flex padding="size-200" overflow="auto" backgroundColor="gray-50">
          {messages.length === 0 && (
            <Text>👋 Welcome! Ask me about your Assurance session.</Text>
          )}
          
          <Flex direction="column" gap="size-150">
            {messages.map((msg, idx) => (
              <View
                key={idx}
                padding="size-150"
                backgroundColor={msg.role === 'user' ? 'blue-400' : 'gray-200'}
                borderRadius="medium"
                UNSAFE_style={{ 
                  maxWidth: '80%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Text 
                  UNSAFE_style={{ 
                    color: msg.role === 'user' ? 'white' : 'black',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.content}
                </Text>
              </View>
            ))}
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
              placeholder="Ask about your session..."
            />
            <Button
              variant="accent"
              onPress={handleSend}
              isDisabled={!input.trim()}
              UNSAFE_style={{ marginBottom: '4px' }}
            >
              Send
            </Button>
          </Flex>
        </View>
      </Flex>
      <TimelineToolbar />
    </PluginView>
  );
}

