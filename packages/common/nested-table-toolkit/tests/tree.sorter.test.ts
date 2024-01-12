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

import * as R from 'ramda';
import { treeSorter } from '../src';

const data = [
  { key: 'thirdLevelData', value: '', parents: [], parentsString: '', hasChildren: true },
  {
    key: 'key1',
    value: '',
    parents: ['thirdLevelData'],
    parentsString: 'thirdLevelData',
    hasChildren: true
  },
  {
    key: 'levelType',
    value: 'LevelModerate',
    parents: ['thirdLevelData', 'key2'],
    parentsString: 'thirdLevelData|key2'
  },
  { key: 'fourthLevelData', value: '', parents: [], parentsString: '', hasChildren: true },
  {
    key: 'key1',
    value: '',
    parents: ['fourthLevelData'],
    parentsString: 'fourthLevelData',
    hasChildren: true
  },
  {
    key: 'subKey1',
    value: '',
    parents: ['fourthLevelData', 'key1'],
    parentsString: 'fourthLevelData|key1'
  },
  {
    key: 'levelType',
    value: 'Level Insane',
    parents: ['fourthLevelData', 'key1', 'subKey1'],
    parentsString: 'fourthLevelData|key1|subKey1'
  },
  { key: 'secondLevelData', value: '', parents: [], parentsString: '', hasChildren: true },
  {
    key: 'CustomerFaceScanResult',
    value: 'Gleeful',
    parents: ['secondLevelData'],
    parentsString: 'secondLevelData'
  },
  {
    key: 'BestBuyMembershipNumber',
    value: '237KD7MJ7L',
    parents: ['secondLevelData'],
    parentsString: 'secondLevelData'
  },
  {
    key: 'FuturePurchaseRecommendation',
    value: 'Baseball Bat,Giants Cap,Vaccum Cleaner',
    parents: ['secondLevelData'],
    parentsString: 'secondLevelData'
  },
  {
    key: '2016',
    value: '622',
    parents: ['thirdLevelData', 'key1'],
    parentsString: 'thirdLevelData|key1'
  },
  {
    key: 'willUserComeBack',
    value: 'true',
    parents: ['thirdLevelData', 'key1'],
    parentsString: 'thirdLevelData|key1'
  },
  {
    key: 'key2',
    value: '',
    parents: ['thirdLevelData'],
    parentsString: 'thirdLevelData',
    hasChildren: true
  },
  {
    key: 'leveldescription',
    value: 'Average,Modest,Ordinary',
    parents: ['thirdLevelData', 'key2'],
    parentsString: 'thirdLevelData|key2'
  },
  {
    key: 'leveldescription',
    value: 'New,Acheivement,Unlocked',
    parents: ['fourthLevelData', 'key1', 'subKey1'],
    parentsString: 'fourthLevelData|key1|subKey1'
  },
  {
    key: 'BrandsTop4Loved',
    value: 'Mango,Apple,BlackBerry,Kitkat',
    parents: ['thirdLevelData', 'key1'],
    parentsString: 'thirdLevelData|key1'
  }
];
const asc = R.sort(treeSorter('key', 1));
const dsc = R.sort(treeSorter('key', -1));

describe('Tree Sorter', () => {
  it('should sort keys of an object (ascending)', () => {
    const results = asc(data);
    expect(results.length).toEqual(17);
    expect(results[0]).toEqual(data[3]);
    expect(results[16]).toEqual(data[14]);
  });
});
