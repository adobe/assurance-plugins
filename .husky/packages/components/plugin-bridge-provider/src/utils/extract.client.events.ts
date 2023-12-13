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

import * as R from 'ramda';
import { clientInfo } from '@adobe/griffon-toolkit-common';
import type { Events } from '../types';

export default (events: Events): Events => {
  const map = {};

  R.forEach(
    (event) => {
      const { clientId } = event;
      if ((!map[clientId] || !map[clientId].uuid) && clientInfo.isMatch(event)) {
        map[clientId] = { ...event };
      } else if (!map[clientId]) {
        map[clientId] = { clientId };
      }
    },
    events
  );

  return R.values(map);
};

