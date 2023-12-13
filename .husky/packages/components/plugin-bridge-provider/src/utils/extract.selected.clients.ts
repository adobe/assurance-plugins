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

import type { Events, Filters } from "../types";
import * as R from 'ramda';
import * as kit from '@adobe/griffon-toolkit';

export default (clients?: Events, filters?: Filters) => {
  const matcher = filters?.clients && filters?.clients.length
    ? kit.match(filters?.clients) : R.identity;
  return R.pipe(
    matcher,
    R.map(R.prop('clientId'))
  )(clients || []);
}
