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

import { searchFlattened } from '../src';

describe('SearchFlattened', () => {
  it('filters items', () => {
    const tree = [
      { recordKey: 'food', value: 'pizza' },
      { recordKey: 'drink', value: 'root beer' }
    ];

    expect(searchFlattened({ search: 'root' }, tree)).toEqual([tree[1]]);
    expect(searchFlattened({ search: 'food' }, tree)).toEqual([tree[0]]);
  });
  it('filters nested items', () => {
    const tree = [
      { recordKey: 'favorites', hasChildren: true },
      { recordKey: 'food', value: 'pizza', parentsString: 'favorites' },
      { recordKey: 'drink', value: 'root beer', parentsString: 'favorites' },
      { recordKey: 'test', value: true }
    ];

    expect(searchFlattened({ search: 'root' }, tree)).toEqual([tree[0], tree[2]]);
    expect(searchFlattened({ search: 'fav' }, tree)).toEqual([tree[0], tree[1], tree[2]]);
    expect(searchFlattened({ search: 'food' }, tree)).toEqual([tree[0], tree[1]]);
  });
  it('is case insensitive', () => {
    const tree = [
      { recordKey: 'favorites', hasChildren: true },
      { recordKey: 'food', value: 'pizza', parentsString: 'favorites' },
      { recordKey: 'drink', value: 'root beer', parentsString: 'favorites' },
      { recordKey: 'test', value: true }
    ];
    expect(searchFlattened({ search: 'ROot' }, tree)).toEqual([tree[0], tree[2]]);
    expect(searchFlattened({ search: 'faV' }, tree)).toEqual([tree[0], tree[1], tree[2]]);
    expect(searchFlattened({ search: 'fooD' }, tree)).toEqual([tree[0], tree[1]]);
  });
  it('can search numbers and bools', () => {
    const tree = [
      { recordKey: 'size', value: 3 },
      { recordKey: 'test', value: true }
    ];
    expect(searchFlattened({ search: '3' }, tree)).toEqual([tree[0]]);
    expect(searchFlattened({ search: 'true' }, tree)).toEqual([tree[1]]);
  });
  it('can search custom keys', () => {
    const tree = [
      { recordKey: 'size', value: 3, other: 'yes' },
      { recordKey: 'test', value: true, other: 'no' }
    ];
    expect(searchFlattened({ search: '3', keys: ['other'] }, tree)).toEqual([]);
    expect(searchFlattened({ search: 'yes', keys: ['other'] }, tree)).toEqual([tree[0]]);
  });
  it('handles empty search', () => {
    const tree = [
      { recordKey: 'size', value: 3 },
      { recordKey: 'test', value: true }
    ];
    expect(searchFlattened({ search: '' }, tree)).toEqual(tree);
  });
});
