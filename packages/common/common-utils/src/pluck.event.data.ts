/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import { path } from 'ramda';
import type { Event } from './types';

type PluckOptions = {
  parseJSON: true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (events: Event[], pathIn: (string | number)[], options?: PluckOptions): any[] => {
  const results = (events || []).map(
    (event) => {
      let data = path(pathIn, event);

      if (options?.parseJSON) {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Failed to parse JSON', e);
         }
      }

      return {
        eventId: event.uuid,
        values: data
      }
    }
  )

  return results;

};


