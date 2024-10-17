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

import { useCallback } from 'react';
import { Event } from "@adobe/assurance-types";
import { screenshotResponse } from '@adobe/griffon-toolkit-common';

export const API_ENDPOINTS = {
  dev: 'https://plugin-support-dev.griffon.adobe.com',
  qa: 'https://plugin-support-qa.griffon.adobe.com',
  stage: 'https://plugin-support-stage.griffon.adobe.com',
  prod: 'https://plugin-support.griffon.adobe.com'
};

function uint8ArrayToBase64(uint8Array) {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

export type UseFetchScreenshotArgs = {
  env?: 'dev' | 'qa' | 'stage' | 'prod';
  imsToken: string;
  url?: string;
}

export type LoadScreenshotArgs = {
  event: Event;
  sessionUuid: string;
};

/**
 * Fetches a screenshot from the server
 * 
 */
export function useFetchScreenshot({ env, imsToken, url }: UseFetchScreenshotArgs): (args: LoadScreenshotArgs) => Promise<string> {
  if (!env && !url) {
    throw new Error('env or url is required');
  }
  const baseUrl = url ?? API_ENDPOINTS[env as 'dev' | 'qa' | 'stage' | 'prod'];
  const headers = {
    Authorization: `Bearer ${imsToken}`
  };
  const loadScreenshot = useCallback(
    async ({ event, sessionUuid }) => {
      const blobId = screenshotResponse.getBlobId(event);
      if (!sessionUuid) {
        throw new Error('sessionUuid is required');
      }

      if (!blobId) {
        throw new Error('could not find blobId in event');
      }

      const imageResponse = await fetch(
        `${baseUrl}/blob/api/FileDownload?validationSessionId=${sessionUuid}&blob=${blobId}`,
        {
          headers
        }
      );
      if (!imageResponse.ok) {
        throw new Error('Failed to load screenshot image');
      }
      const blob = await imageResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64String = uint8ArrayToBase64(uint8Array);
      return `data:image/png;base64,${base64String}`;
    },
    [baseUrl, headers]
  );

  return loadScreenshot;
}
