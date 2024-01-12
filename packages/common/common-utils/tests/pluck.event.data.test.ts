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

import { pluckEventData } from '../src';
import type { Event } from '@adobe/assurance-types';

describe('pluckEventData', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn');
    // @ts-ignore jest.spyOn adds this functionallity
    console.warn.mockImplementation(() => null);
  });

  afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.warn.mockRestore();
  });

  it('plucks data at path', () => {
    const events = [
      { uuid: 'ID1', payload: { data: ['a'] } } as Event,
      { uuid: 'ID2', payload: { data: ['b'] } } as Event,
      { uuid: 'ID3', payload: { data: ['c'] } } as Event
    ];
    const results = pluckEventData(events, ['payload', 'data', 0]);
    expect(results[0]).toEqual({ eventId: 'ID1', values: 'a' });
    expect(results.length).toEqual(3);
  });
  it('handles json parsing', () => {
    const events = [
      {
        uuid: 'ID1',
        payload: {
          data: [JSON.stringify({ side: 'left', size: 'big' })]
        }
      } as Event
    ];
    const results = pluckEventData(events, ['payload', 'data', 0], { parseJSON: true });
    expect(results[0]).toEqual({
      eventId: 'ID1',
      values: {
        side: 'left',
        size: 'big'
      }
    });
  });
  it('handles null events', () => {
    expect(pluckEventData(null as unknown as Event[], ['payload', 3])).toEqual([]);
  });
  it('handles empty events', () => {
    expect(pluckEventData([], ['payload', 3])).toEqual([]);
  });
  it('doesnt crash on bad json', () => {
    const events = [
      {
        uuid: 'ID1',
        payload: {
          data: ['not json']
        }
      } as Event
    ];
    const results = pluckEventData(events, ['payload', 'data', 0], { parseJSON: true });
    expect(results[0]).toEqual({ eventId: 'ID1', values: 'not json' });
    expect(console.warn).toHaveBeenCalled();
  });
});
