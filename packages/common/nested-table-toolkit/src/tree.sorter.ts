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
import makePath from './make.path';
import { FlatDataRecord } from './types';

const hasDigitRegex = /.*\d/;
const numericStringRegex = /(\D*)(\d+)\D*/;

const defaultSorter = (direction, a, b) => (a < b ? -1 : a > b ? 1 : 0) * direction;

export default R.curry((sortBy: string, direction: number, a: FlatDataRecord, b: FlatDataRecord) => {
  const aSort = a[sortBy];
  const bSort = b[sortBy];

  const aParents = a.parentsString;
  const bParents = b.parentsString;

  if (aParents === bParents) {
    return keySorter(direction, aSort, bSort);
  }

  const aPath = makePath({ recordKey: aSort, parentsString: aParents });
  const bPath = makePath({ recordKey: bSort, parentsString: bParents });
  if (R.indexOf(bPath, aPath) === 0) {
    return 1;
  }

  if (R.indexOf(aPath, bPath) === 0) {
    return -1;
  }

  let aCommon;
  let bCommon;
  let depth = 0;

  do {
    aCommon = a.parents[depth] || aSort;
    bCommon = b.parents[depth] || bSort;
    depth++;
  } while (aCommon === bCommon);

  return keySorter(direction, aCommon, bCommon);
});

const numericStringSorter = (direction, a, b) => {
  const aMatches = a.match(numericStringRegex);
  const bMatches = b.match(numericStringRegex);
  return !aMatches || !bMatches || aMatches[1] !== bMatches[1]
    ? defaultSorter(direction, a, b)
    : (+aMatches[2] - +bMatches[2]) * direction;
};

const keySorter = R.curry((direction, a, b) =>
  hasDigitRegex.test(a) && hasDigitRegex.test(b)
    ? numericStringSorter(direction, a, b)
    : defaultSorter(direction, a, b)
);
