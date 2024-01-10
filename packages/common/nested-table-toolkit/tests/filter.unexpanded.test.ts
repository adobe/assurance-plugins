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
