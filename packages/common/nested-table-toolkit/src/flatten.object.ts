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
import { FlatDataRecord } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (obj: any): FlatDataRecord[] => {
  const go = (obj_, parents = [], parentsString = '') => R.chain(([k, v]) => {
    const type = R.type(v);
    if (type === 'Object' || type === 'Array') {
      return R.prepend([k, { value: '', parents, parentsString, hasChildren: true }], R.map(([k_, v_]) =>
        [k_, v_], go(v, R.append(k, parents), makePath({ recordKey: k, parentsString }))));
    }
    return [[k, { value: v, parents, parentsString }]];
  }, R.toPairs(obj_));

  const pairs = go(obj);
  return pairs.map(([key, { value, parentsString, ...others }]) => ({ id: makePath({ recordKey: key, parentsString }), recordKey: key, value, parentsString, ...others }));
};
