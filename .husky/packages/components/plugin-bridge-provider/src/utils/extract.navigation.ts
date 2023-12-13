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

import { filterFromHash } from '@adobe/griffon-toolkit';
import { BridgeNavigation } from '../types';

export default (navigation: string): BridgeNavigation => {
  // extract the filters
  const filters = filterFromHash(navigation);

  // extract the path
  const pathRX = /([^#]*)#?.*/;
  const matches = navigation.match(pathRX);
  const path = matches?.[1] || '';
  
  return { path, filters };
}
