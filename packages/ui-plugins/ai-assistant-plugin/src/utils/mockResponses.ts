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

import { MOCK_RESPONSES } from '../constants';

/**
 * Generate mock AI response based on user input
 */
export function getMockResponse(
  userMessage: string,
  eventCount: number,
  sessionName: string,
  environment: string
): string {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('event') || lowerMsg.includes('how many')) {
    return MOCK_RESPONSES.EVENTS(eventCount, sessionName, environment);
  }
  
  if (lowerMsg.includes('error') || lowerMsg.includes('issue') || lowerMsg.includes('problem')) {
    return MOCK_RESPONSES.ERRORS();
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('what can')) {
    return MOCK_RESPONSES.HELP();
  }
  
  if (lowerMsg.includes('sdk') || lowerMsg.includes('version')) {
    return MOCK_RESPONSES.SDK();
  }

  if (lowerMsg.includes('user') || lowerMsg.includes('journey')) {
    return MOCK_RESPONSES.JOURNEY();
  }
  
  return MOCK_RESPONSES.DEFAULT(eventCount);
}

/**
 * Simulate AI thinking delay
 */
export async function simulateDelay(): Promise<void> {
  const delay = 800 + Math.random() * 1200; // 0.8-2s
  await new Promise(resolve => setTimeout(resolve, delay));
}

