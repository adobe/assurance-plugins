/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2025 Adobe
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
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import type { Event } from "@assurance/common-utils";
import { flattenObject } from "@assurance/nested-table-toolkit";
import {
  PluginBridgeProvider,
  useEvents,
} from "@assurance/plugin-bridge-provider";
import { PluginView, TimelineToolbar } from "@assurance/timeline-bar";
import React from "react";
import DataViewer from "../components/DataViewer";
import { EventData } from "../types";

const prepareEvents = (events: Event[]): EventData[] => {
  const results = (events || []).map((event) => {
    const message = event.payload?.messages?.[1];
    let data: any = {};

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log(e);
    }

    return {
      eventId: event.uuid,
      values: data,
    };
  });

  return results;
};

const Inner = () => {
  console.log(window.pluginBridge);
  const events = useEvents({
    matchers: ["payload.name==`datastream`"],
  });

  return <DataViewer data={prepareEvents(events)} />;
};

const App = () => {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <PluginView>
          <Inner />
          <TimelineToolbar />
        </PluginView>
      </PluginBridgeProvider>
    </Provider>
  );
};

export default App;
