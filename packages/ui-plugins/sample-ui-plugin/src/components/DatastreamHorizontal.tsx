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
import React from 'react';

import { ProgressCircle } from '@adobe/react-spectrum';
import { Event } from '@assurance/common-utils';
import { HorizontalEvents } from '@assurance/horizontal-events';
import { useEvents } from '@assurance/plugin-bridge-provider';

const prepareEvents = (events: any[]): any[] => {
  const results = (events || []).map(event => {
    const message = event?.payload?.messages?.[1];
    let data: any = {};

    try {
      if (typeof message === 'string') {
        data = JSON.parse(message);
      } else {
        if (message !== undefined && message !== null) {
          console.warn(`Expected message to be a string, but got ${typeof message}:`, message);
        }
        data = {};
      }
    } catch (e) {
      console.warn('Failed to parse message as JSON:', e);
      data = {};
    }

    return {
      uuid: event.uuid,
      timestamp: event.timestamp,
      vendor: event.vendor,
      payload: data
    };
  });

  return results;
};

const DatastreamHorizontal = () => {
  const events: Event[] = useEvents({
    matchers: ['payload.name==`datastream`']
  });

  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (events.length === 0) {
    return <div>No events yet</div>;
  }
  const prepared = prepareEvents(events);
  return <HorizontalEvents events={prepared} maxHeight="90vh" maxWidth="100%" />;
};

export default DatastreamHorizontal;
