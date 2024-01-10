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

import flattenObject from '../src/flatten.object';

describe('flattenObject', () => {
  const nested = {
    favorites: {
      food: 'pizza',
      drink: 'root beer'
    },
    properties: {
      color: 'red',
      size: {
        width: 800,
        height: 600
      }
    },
    enabled: true
  };

  it('should flatten an object', () => {
    const results = flattenObject(nested);
    expect(results[0]).toEqual({
      hasChildren: true,
      id: 'favorites',
      parents: [],
      parentsString: '',
      recordKey: 'favorites',
      value: ''
    });

    expect(results[2]).toEqual({
      id: 'favorites|drink',
      parents: ['favorites'],
      parentsString: 'favorites',
      recordKey: 'drink',
      value: 'root beer'
    });

    expect(results[7]).toEqual({
      id: 'properties|size|height',
      parents: ['properties', 'size'],
      parentsString: 'properties|size',
      recordKey: 'height',
      value: 600
    });
  });
});
