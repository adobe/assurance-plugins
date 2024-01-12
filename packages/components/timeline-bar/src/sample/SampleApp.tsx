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
import { 
  PluginBridgeProvider
} from '@adobe/assurance-plugin-bridge-provider';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import TimelineToolbar from '../components/TimelineToolbar';
import PluginView from '../components/PluginView';

const App = () => {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <PluginView>
          <div>Plugin Goes Here</div>
          <TimelineToolbar 
            highlights={[
              { 
                matcher: 'payload.ACPExtensionEventType==`com.adobe.eventtype.generic.lifecycle`'
              },
              {
                matcher: 'payload.ACPExtensionEventType==`com.adobe.eventtype.assurance`',
                color: 'purple-400'
              }
            ]}
          />
        </PluginView>
      </PluginBridgeProvider>
    </Provider>
  );
};

export default App;
