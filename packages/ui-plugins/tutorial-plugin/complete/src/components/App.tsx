import React from 'react';

import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { PluginBridgeProvider } from '@assurance/plugin-bridge-provider';

import GroupedEvents from './GroupedEvents';

function App() {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <GroupedEvents />
      </PluginBridgeProvider>
    </Provider>
  );
}

export default App;
