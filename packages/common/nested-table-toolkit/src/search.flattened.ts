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

import * as R from 'ramda';
import makePath from './make.path';
import startsWithString from './starts.with.string';
import { PATH_DELIMITER } from './const';
import type { FlatDataRecord } from './types';

type Options = {
  keys?: string[];
  search?: string;
}

export default R.curry(({ keys = ['value', 'recordKey'], search }: Options, flat: FlatDataRecord[]) => {
  if (!search) {
    return flat;
  }
  const matchedPaths: string[] = [];

  R.forEach(
    data =>
      R.forEach(key => {
        const value = data[key] === undefined ? '' : data[key];
        if (value.toString().toLowerCase().includes(search.toLowerCase())) {
          matchedPaths.push(makePath(data));
        }
      }, keys),
    flat
  );

  return R.reject(data => {
    const check = makePath(data);
    for (let i = 0; i < matchedPaths.length; ++i) {
      if (startsWithString(matchedPaths[i], check)) {
        return false;
      }
      const split = matchedPaths[i].split(PATH_DELIMITER);
      for (let j = 0; j < split.length - 1; ++j) {
        if (split.slice(0, j + 1).join(PATH_DELIMITER) === check) {
          return false;
        }
      }
    }
    return true;
  }, flat);
});
