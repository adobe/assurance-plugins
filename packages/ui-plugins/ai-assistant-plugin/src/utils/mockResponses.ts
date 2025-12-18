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
import { getDemoScript, getDemoStep } from './demoScript';

/**
 * Demo mode state
 */
let demoModeEnabled = false;
let currentDemoStep = 0;
let demoScript = getDemoScript();

/**
 * Enable/disable demo script mode
 */
export function setDemoMode(enabled: boolean): void {
  demoModeEnabled = enabled;
  if (enabled) {
    currentDemoStep = 0; // Reset to beginning
    console.log('🎬 Demo mode enabled - Using scripted responses');
  } else {
    console.log('🎬 Demo mode disabled - Using dynamic responses');
  }
}

/**
 * Check if demo mode is enabled
 */
export function isDemoModeEnabled(): boolean {
  return demoModeEnabled;
}

/**
 * Reset demo script to beginning
 */
export function resetDemoScript(): void {
  currentDemoStep = 0;
  console.log('🔄 Demo script reset to beginning');
}

/**
 * Get current demo step info
 */
export function getDemoStepInfo(): { current: number; total: number; progress: number } {
  return {
    current: currentDemoStep + 1,
    total: demoScript.length,
    progress: Math.round(((currentDemoStep + 1) / demoScript.length) * 100)
  };
}

/**
 * Get response for demo mode
 * Uses scripted responses that match expected questions
 */
function getDemoResponse(userMessage: string): string | null {
  console.log(`📊 getDemoResponse called - demoModeEnabled: ${demoModeEnabled}, currentDemoStep: ${currentDemoStep}/${demoScript.length}`);
  
  if (!demoModeEnabled || currentDemoStep >= demoScript.length) {
    console.log(`❌ Demo mode ${!demoModeEnabled ? 'disabled' : 'script complete'}`);
    return null;
  }

  const step = getDemoStep(currentDemoStep);
  if (!step) {
    console.log(`❌ No step found for index ${currentDemoStep}`);
    return null;
  }

  console.log(`🔍 Matching question: "${userMessage}" vs expected: "${step.question}"`);

  // Check if user message matches expected question (fuzzy match)
  const userLower = userMessage.toLowerCase();
  const questionLower = step.question.toLowerCase();
  
  // Extract key words from both
  const userWords = userLower.split(/\s+/).filter(w => w.length > 3);
  const questionWords = questionLower.split(/\s+/).filter(w => w.length > 3);
  
  console.log(`📝 User words (${userWords.length}):`, userWords);
  console.log(`📝 Expected words (${questionWords.length}):`, questionWords);
  
  // Calculate match score
  const matchCount = userWords.filter(w => questionWords.some(q => q.includes(w) || w.includes(q))).length;
  const matchScore = matchCount / Math.max(userWords.length, questionWords.length);
  
  console.log(`📊 Match score: ${(matchScore * 100).toFixed(0)}% (${matchCount} words matched)`);
  
  // If reasonable match (>30%), return scripted response
  if (matchScore > 0.3 || currentDemoStep === 0) {
    const response = step.response;
    currentDemoStep++;
    console.log(`✅ Demo step ${currentDemoStep}/${demoScript.length} completed - Match score: ${(matchScore * 100).toFixed(0)}%`);
    return response;
  }
  
  // If no match, provide helpful hint
  console.log(`⚠️  Match score too low (${(matchScore * 100).toFixed(0)}%), showing hint`);
  return `🎬 **Demo Mode Active**\n\nExpected question: "${step.question}"\n\nPlease ask this question to continue the demo script, or type exactly:\n\`${step.question}\`\n\n💡 Tip: You can disable demo mode in settings to ask free-form questions.`;
}

/**
 * Generate mock AI response based on user input
 * Supports both demo script mode and dynamic responses
 */
export function getMockResponse(
  userMessage: string,
  eventCount: number,
  sessionName: string,
  environment: string
): string {
  console.log(`🎯 getMockResponse called - Demo mode: ${demoModeEnabled}, Message: "${userMessage}"`);
  
  // Try demo mode first
  if (demoModeEnabled) {
    console.log(`🎬 Demo mode enabled, trying scripted response...`);
    const demoResponse = getDemoResponse(userMessage);
    if (demoResponse) {
      console.log(`✅ Returning scripted response (length: ${demoResponse.length})`);
      return demoResponse;
    }
    
    // If we've reached the end of demo script
    if (currentDemoStep >= demoScript.length) {
      console.log(`🎉 Demo script complete`);
      return `🎉 **Demo Script Complete!**\n\nYou've reached the end of the demonstration.\n\nDemo covered:\n- Session analysis\n- Issue identification\n- Deep dive debugging\n- User journey analysis\n- Analytics validation\n- Performance optimization\n- Best practices audit\n- Code generation\n- Action planning\n\nYou can:\n1. Type \`reset demo\` to start over\n2. Disable demo mode in settings for free-form questions\n3. Connect to real backend for actual analysis`;
    }
  }

  // Handle reset command
  if (userMessage.toLowerCase().includes('reset demo')) {
    resetDemoScript();
    return '🔄 Demo script reset! Ask the first question to begin:\n\n"What can you tell me about this session?"';
  }
  
  // Fallback to dynamic responses (original behavior)
  console.log(`🔄 Falling back to dynamic keyword-based responses`);
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('event') || lowerMsg.includes('how many')) {
    console.log(`💬 Matched: EVENTS response`);
    return MOCK_RESPONSES.EVENTS(eventCount, sessionName, environment);
  }
  
  if (lowerMsg.includes('error') || lowerMsg.includes('issue') || lowerMsg.includes('problem')) {
    console.log(`💬 Matched: ERRORS response`);
    return MOCK_RESPONSES.ERRORS();
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('what can')) {
    console.log(`💬 Matched: HELP response`);
    return MOCK_RESPONSES.HELP();
  }
  
  if (lowerMsg.includes('sdk') || lowerMsg.includes('version')) {
    console.log(`💬 Matched: SDK response`);
    return MOCK_RESPONSES.SDK();
  }

  if (lowerMsg.includes('user') || lowerMsg.includes('journey')) {
    console.log(`💬 Matched: JOURNEY response`);
    return MOCK_RESPONSES.JOURNEY();
  }
  
  console.log(`💬 Matched: DEFAULT response`);
  return MOCK_RESPONSES.DEFAULT(eventCount);
}

/**
 * Simulate AI thinking delay
 * Longer delay for demo mode to feel more realistic
 */
export async function simulateDelay(isDemo: boolean = false): Promise<void> {
  if (isDemo && demoModeEnabled) {
    const step = getDemoStep(currentDemoStep - 1); // -1 because we already incremented
    const delay = step?.delay || 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
  } else {
    const delay = 800 + Math.random() * 1200; // 0.8-2s
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

