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
import { 
  PluginBridgeProvider,
  useFilteredEvents
} from '@adobe/assurance-plugin-bridge-provider';
import { ProgressCircle, Provider, defaultTheme } from "@adobe/react-spectrum";
import EventsTable from "../components/EventsTable";
import type { BridgeEvent } from "..//shared/types";

const prepareEvents = (events: Event[]): any[] => {
  const results = (events || []).map(
    (event) => {
      const message = event.payload?.messages?.[1];
      let data: any = {};

      try {
        data = JSON.parse(message);
      } catch (e) {
        console.log(e);
      }

      return {
        uuid: event.uuid,
        timestamp: event.timestamp,
        vendor: event.vendor,
        payload:  data
      }
    }
  )

  return results;
};


const Inner = () => {
  const events: BridgeEvent[] = useFilteredEvents({
    matchers: ['payload.name==`datastream`']
  });

  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }
  if (events.length === 0) {
    return <div>No events yet</div>;
  }
  
  const prepared = prepareEvents(events);
  return <EventsTable events={prepared} maxHeight="90vh" maxWidth="100%" />;
};

const App = () => {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <Inner />
      </PluginBridgeProvider>
    </Provider>
  );
};

export default App;
