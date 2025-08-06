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
import {
  PluginBridgeProvider,
  useClients,
  useDataStream,
  useEnvironment,
  useEvents,
  useImsAccessToken,
  useImsOrg,
  useNavigationFilters,
  useNavigationPath,
  useSandbox,
  useSelectedClients,
  useSelectedEvents,
  useSelectEvents,
  useTenant,
  useValidation,
  useValidationMap
} from '@assurance/plugin-bridge-provider';
import Activities from './containers/activities';
import Events from './containers/events';
import ClientInfo from './containers/client-info';
import { defineMessages, IntlProvider, useIntl } from 'react-intl';
import LaunchLiveActivity from './components/launch-live-activity';
import usePluginState from './hooks/usePluginState';
import useActivities from './hooks/useActivities';
import usePushCredentialsData from './hooks/usePushCredentialsData';

// export { useDataStream, type DataStream } from "./hooks/useDataStream";
// export { useEnvironment } from "./hooks/useEnvironment";
// export { useEnvironmentValue } from "./hooks/useEnvironmentValue";
// export { useEvents, type UseEventsOptions } from "./hooks/useEvents";
// export { useFlags, type Flags } from "./hooks/useFlags";
// export { useImsAccessToken } from "./hooks/useImsAccessToken";
// export { useImsOrg } from "./hooks/useImsOrg";
// export { useNavigationFilters } from "./hooks/useNavigationFilters";
// export { useNavigationPath } from "./hooks/useNavigationPath";
// export { useSelectEvents } from "./hooks/useSelectEvents";
// export { useSelectedEvents } from "./hooks/useSelectedEvents";
// export { useSandbox } from "./hooks/useSandbox";
// export { useTenant } from "./hooks/useTenant";
// export { useValidation } from "./hooks/useValidation";

// // Additional hooks from hooks.tsx
// export { useClients, useSelectedClients, useValidationMap } from "./hooks/hooks";

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
  const [selectedTab, setSelectedTab] = useState<Key>('clientInfo');
  const { formatMessage } = useIntl();
  const clients = useClients();
  const selectedClient = usePluginState(state => state.selectedClient);
  const setSelectedClient = usePluginState(state => state.setSelectedClient);
  const activities = useActivities();

  console.log(activities, '*********activities');

  const events = useEvents();
  const tenant = useTenant();
  const imsOrg = useImsOrg();
  const imsAccessToken = useImsAccessToken();
  const environment = useEnvironment();
  const selectedEvents = useSelectedEvents();
  const selectedClients = useSelectedClients();
  const validation = useValidation();
  const validationMap = useValidationMap();
  const navigationFilters = useNavigationFilters();
  const navigationPath = useNavigationPath();
  const dataStream = useDataStream();
  const sandbox = useSandbox();

  console.log(
    {
      events,
      tenant,
      imsOrg,
      imsAccessToken,
      environment,
      selectedEvents,
      selectedClients,
      validation,
      validationMap,
      navigationFilters,
      navigationPath,
      dataStream,
      sandbox
    },
    'data from plugin bridge provider'
  );

  useEffect(() => {
    if (!selectedClient && clients.length) {
      setSelectedClient(clients[0].id);
      console.log(clients, '*********');
    }

    console.log(selectedClient, clients, '*********OUTSIDE');
  }, [clients, selectedClient, setSelectedClient]);

  console.log(selectedClient, clients, '*********OUTSIDE useffect');

  console.log(selectedTab, '*********OUTSIDE  ATBBBBBBBuseffect');

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
          <Item key="clientInfo">{formatMessage(messages.clientInfo)}</Item>
          <Item key="activities">{formatMessage(messages.activities)}</Item>

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
