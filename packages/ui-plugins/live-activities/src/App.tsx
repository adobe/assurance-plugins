import {
  defaultTheme,
  Flex,
  Item,
  Key,
  Picker,
  Provider,
  TabList,
  TabPanels,
  Tabs,
  View
} from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { PluginBridgeProvider, useClients } from '@assurance/plugin-bridge-provider';
import Activities from './containers/activities';
import Events from './containers/events';
import ClientInfo from './containers/client-info';
import { defineMessages, IntlProvider, useIntl } from 'react-intl';
import LaunchLiveActivity from './components/launch-live-activity';
import usePluginState from './hooks/usePluginState';

const messages = defineMessages({
  activities: {
    id: 'activities',
    defaultMessage: 'Activities'
  },
  events: {
    id: 'events',
    defaultMessage: 'Events'
  },
  clientInfo: {
    id: 'clientInfo',
    defaultMessage: 'Client Info'
  }
});

function Inner() {
  const [selectedTab, setSelectedTab] = useState<Key>('simulate');
  const { formatMessage } = useIntl();
  const clients = useClients();
  const selectedClient = usePluginState(state => state.selectedClient);
  const setSelectedClient = usePluginState(state => state.setSelectedClient);

  useEffect(() => {
    if (!selectedClient && clients.length) {
      setSelectedClient(clients[0].id);
    }
  }, [clients, selectedClient, setSelectedClient]);

  return (
    <View padding="size-200" paddingTop="size-0">
      {!!clients.length && (
        <Flex gap="size-100" justifyContent="end" alignItems="end">
          <Picker label="Client" selectedKey={selectedClient} onSelectionChange={setSelectedClient}>
            {clients.map(client => (
              <Item key={client.id}>{client.payload.deviceInfo['Device name']}</Item>
            ))}
          </Picker>
        </Flex>
      )}
      <Tabs onSelectionChange={setSelectedTab} selectedKey={selectedTab}>
        <TabList UNSAFE_style={{ flex: 1 }}>
          <Item key="activities">{formatMessage(messages.activities)}</Item>
          <Item key="clientInfo">{formatMessage(messages.clientInfo)}</Item>
          <Item key="events">{formatMessage(messages.events)}</Item>
        </TabList>

        <TabPanels>
          <Item key="activities">
            <Activities />
          </Item>
          <Item key="clientInfo">
            <ClientInfo />
          </Item>
          <Item key="events">
            <Events />
          </Item>
        </TabPanels>
      </Tabs>
    </View>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <PluginBridgeProvider>
      <IntlProvider locale="en">
        <Provider theme={defaultTheme}>
          <QueryClientProvider client={queryClient}>
            <Inner />
          </QueryClientProvider>
        </Provider>
      </IntlProvider>
    </PluginBridgeProvider>
  );
}

export default App;
