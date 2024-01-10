/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { path } from 'ramda';
import type { Event } from "@adobe/assurance-types";

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


