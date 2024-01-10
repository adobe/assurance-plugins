/*
 * ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *   Copyright 2020 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ************************************************************************
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
