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

import { filterUnexpanded } from '../src';

describe('filterUnexpanded', () => {
  const flat = [
    { key: 'favorites', hasChildren: true },
    { key: 'food', value: 'pizza', parentsString: 'favorites' },
    { key: 'drink', value: 'root beer', parentsString: 'favorites' },
    { key: 'properties', hasChildren: true },
    { key: 'size', hasChildren: true, parentsString: 'properties' },
    { key: 'width', value: 800, parentsString: 'properties|size' },
    { key: 'width', value: 800, parentsString: 'properties|size' }
  ];

  it('returns parents if not expanded', () => {
    const results = filterUnexpanded([], flat);
    expect(results.length).toEqual(2);
    expect(results[0]).toEqual(flat[0]);
    expect(results[1]).toEqual(flat[3]);
  });
  it('filters items with parents not expanded', () => {
    const results = filterUnexpanded(['properties', 'properties|size'], flat);
    expect(results.length).toEqual(5);
    expect(results[0]).toEqual(flat[0]);
    expect(results[3]).toEqual(flat[5]);
  });
});
