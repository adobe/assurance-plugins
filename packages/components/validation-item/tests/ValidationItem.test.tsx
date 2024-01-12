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

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ValidationItem } from '../src';
import { initBridge, receiveValidation, setupBridge } from '@adobe/assurance-testing-library';
import { PluginBridgeProvider } from '@adobe/assurance-plugin-bridge-provider';

describe('ValidationItem', () => {
  beforeEach(async () => {
    setupBridge();
    render(
      <PluginBridgeProvider>
        <ValidationItem namespace={'test-valid'} />
        <ValidationItem namespace={'test-invalid'} />
      </PluginBridgeProvider>
    );
    await initBridge();
    receiveValidation({
      'test-valid': {
        category: 'test',
        level: 'error',
        namespace: 'test-valid',
        displayName: 'valid test',
        description: 'this is valid',
        results: {
          events: ['abc', 'efg'],
          message: 'it was valid',
          result: 'matched'
        }
      },
      'test-invalid': {
        category: 'test',
        level: 'error',
        namespace: 'test-invalid',
        displayName: 'invalid test',
        description: 'this is valid',
        results: {
          events: ['abc', 'efg'],
          message: 'it was valid',
          result: 'fail'
        }
      }
    });
  });
  it('should render valid items', () => {
    const val1 = screen.getByTestId('test-valid');
    const val2 = screen.getByTestId('test-invalid');

    expect(within(val1).getByTestId('val-success')).toBeInTheDocument();
    expect(within(val1).getByTestId('val-heading')).toHaveTextContent('valid test');
    expect(within(val1).getByTestId('val-message')).toHaveTextContent('it was valid');

    expect(within(val2).getByTestId('val-error')).toBeInTheDocument();
  });
});
