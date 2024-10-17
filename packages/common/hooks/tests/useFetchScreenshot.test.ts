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

import { screenshotResponse } from '@adobe/griffon-toolkit-common';
import { renderHook } from '@testing-library/react-hooks';
import { useFetchScreenshot } from '../src/useFetchScreenshot';
import { Event } from '@adobe/assurance-types';

const mockEnv = 'dev';
const mockImsToken = 'fakeToken';
const mockBlob = new Blob([], { type: 'image/png' });
mockBlob.arrayBuffer = jest.fn().mockResolvedValue(new Uint8Array([109, 111, 99, 107, 101, 100, 32, 105, 109, 97, 103, 101]));

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(mockBlob),
    ok: true
  })
) as jest.Mock;

describe('useFetchScreenshot', () => {
  it('returns a callback function that fetches a screenshot from the server', () => {
    const { result } = renderHook(() => useFetchScreenshot({ env: mockEnv, imsToken: mockImsToken }));
    const loadScreenshot = result.current;

    expect(typeof loadScreenshot).toBe('function');
    const fakeScreenshotResponseEvent = screenshotResponse.mock({});
    const imgUrl = loadScreenshot({ event: fakeScreenshotResponseEvent as Event, sessionUuid: 'fakeSessionUuid' });
    expect(imgUrl).resolves.toBe('data:image/png;base64,bW9ja2VkIGltYWdl');
  });

  it('throws an error if sessionUuid is not provided', async () => {
    const { result } = renderHook(() => useFetchScreenshot({ env: mockEnv, imsToken: mockImsToken }));
    const loadScreenshot = result.current;

    await expect(() => loadScreenshot({ event: screenshotResponse.mock({}) as Event, sessionUuid: '' })).rejects.toThrow();
  });
});
