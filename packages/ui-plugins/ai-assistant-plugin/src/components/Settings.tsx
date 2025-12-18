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

import React, { useState } from 'react';
import {
  DialogTrigger,
  Dialog,
  Heading,
  Divider,
  Content,
  Button,
  ButtonGroup,
  Flex,
  TextField,
  Switch,
  Text,
  ActionButton,
} from '@adobe/react-spectrum';
import Settings from '@spectrum-icons/workflow/Settings';
import { PluginConfig } from '../types';
import { isValidUrl } from '../utils/config';
import { setDemoMode, resetDemoScript, isDemoModeEnabled } from '../utils/mockResponses';

interface SettingsProps {
  config: PluginConfig;
  onSave: (config: Partial<PluginConfig>) => void;
}

export default function SettingsPanel({ config, onSave }: SettingsProps) {
  const [serverUrl, setServerUrl] = useState(config.serverUrl);
  const [mockMode, setMockMode] = useState(config.mockMode);
  const [demoScript, setDemoScript] = useState(isDemoModeEnabled());
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleSave = (close: () => void) => {
    // Validate URL
    if (!mockMode && !isValidUrl(serverUrl)) {
      setUrlError('Please enter a valid URL (e.g., http://localhost:8000)');
      return;
    }

    setUrlError(null);
    
    // Enable/disable demo script mode
    if (mockMode) {
      setDemoMode(demoScript);
      if (demoScript) {
        resetDemoScript(); // Reset to beginning when enabling
      }
    } else {
      setDemoMode(false); // Disable demo script when not in mock mode
    }
    
    onSave({ serverUrl, mockMode });
    close();
  };

  return (
    <DialogTrigger>
      <ActionButton aria-label="Settings">
        <Settings />
      </ActionButton>
      {(close) => (
        <Dialog>
          <Heading>AI Assistant Settings</Heading>
          <Divider />
          <Content>
            <Flex direction="column" gap="size-200">
              <Switch isSelected={mockMode} onChange={setMockMode}>
                Demo Mode (Mock Responses)
              </Switch>
              
              <Text UNSAFE_style={{ fontSize: '0.9em', color: '#666' }}>
                {mockMode 
                  ? 'Demo mode uses simulated responses for testing without a server.'
                  : 'Connect to a real AI agent server for actual analysis.'}
              </Text>

              {mockMode && (
                <>
                  <Switch 
                    isSelected={demoScript} 
                    onChange={setDemoScript}
                    marginStart="size-300"
                  >
                    🎬 Demo Script Mode
                  </Switch>
                  
                  <Text UNSAFE_style={{ fontSize: '0.85em', color: '#666', marginLeft: '24px' }}>
                    {demoScript 
                      ? '📝 Uses pre-scripted conversation for presentations and recordings. Ask questions in sequence.'
                      : '🤖 Uses dynamic responses based on your questions.'}
                  </Text>
                </>
              )}

              <Divider size="S" />

              <TextField
                label="Server URL"
                value={serverUrl}
                onChange={setServerUrl}
                isDisabled={mockMode}
                errorMessage={urlError}
                validationState={urlError ? 'invalid' : undefined}
                description="Enter the URL of your AI agent server"
                placeholder="http://localhost:8000"
              />

              <Text UNSAFE_style={{ fontSize: '0.85em', color: '#888' }}>
                💡 The server should implement /health and /chat endpoints
              </Text>
            </Flex>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>Cancel</Button>
            <Button variant="accent" onPress={() => handleSave(close)}>Save</Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

