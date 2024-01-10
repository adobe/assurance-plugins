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

import type { Event } from '@adobe/assurance-types';
import chooseEventLabel from '../src/choose.event.label';

describe('chooseEventLabel', () => {
  it('returns the event type if no label is present', () => {
    expect(chooseEventLabel({ type: 'foo' } as Event)).toEqual('foo');
  });

  it('returns the label if present', () => {
    expect(
      chooseEventLabel({
        type: 'foo',
        _internal_adb_props: {
          label: 'bar'
        }
      } as Event)
    ).toEqual('bar');
  });
});
