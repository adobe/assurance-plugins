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
import { clientInfo } from '@adobe/griffon-toolkit-common';
import { Events } from '@adobe/assurance-types';

export default (events: Events): Events => {
  const map = {};

  R.forEach(event => {
    const { clientId } = event;
    if (clientId && (!map[clientId] || !map[clientId].uuid) && clientInfo.isMatch(event)) {
      map[clientId] = { ...event };
    } else if (clientId && !map[clientId]) {
      map[clientId] = { clientId };
    }
  }, events);

  return R.values(map);
};
