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

import React from 'react';
import { PluginBridgeProvider, useFilteredEvents } from '@adobe/assurance-plugin-bridge-provider';
import { PluginView, TimelineToolbar } from '@adobe/assurance-timeline-bar';
import { pluckEventData } from '@adobe/assurance-common-utils';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import DataViewer from '../components/DataViewer';

const Inner = () => {
  const events = useFilteredEvents({
    matchers: ['payload.name==`datastream`']
  });

  console.log(pluckEventData(events, ['payload', 'messages', 1], { parseJSON: true }));

  return (
    <DataViewer data={pluckEventData(events, ['payload', 'messages', 1], { parseJSON: true })} />
  );
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
