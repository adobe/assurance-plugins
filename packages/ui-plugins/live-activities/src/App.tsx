import {
  defaultTheme,
  Flex,
  Item,
  Key,
  Provider,
  TabList,
  TabPanels,
  Tabs,
  View,
  Text
} from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { PluginBridgeProvider } from '@assurance/plugin-bridge-provider';
import Activities from './containers/activities';
import ActivitiesEnhanced from './containers/activities-enhanced';
import Events from './containers/events';
import ClientInfo from './components/validation/client-info';
import { defineMessages, IntlProvider, useIntl } from 'react-intl';

import ClientPicker from '../../../components/timeline-bar/src/components/FilterBar/ClientPicker';
import Card from './components/atoms/card';

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

// // Additional hooks from hooks.tsx

const messages = defineMessages({
  activities: {
    id: 'activities',
    defaultMessage: 'Activities'
  },
  activitiesEnhanced: {
    id: 'activitiesEnhanced',
    defaultMessage: 'Activities Enhanced'
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

  return (
    <View padding="size-200" paddingTop="size-0">
      <Flex gap="size-100" justifyContent="end" alignItems="center">
        <Text UNSAFE_style={{ fontWeight: 500, minWidth: 60, textAlign: 'center' }}>Client</Text>
        <Card>
          <ClientPicker allowAllClients={false} />
        </Card>
      </Flex>
      <Tabs density='compact'  onSelectionChange={setSelectedTab} selectedKey={selectedTab}>
        <TabList UNSAFE_style={{ flex: 1 }}>
          <Item key="clientInfo">{formatMessage(messages.clientInfo)}</Item>
          <Item key="activities">{formatMessage(messages.activities)}</Item>
          <Item key="activitiesEnhanced">{formatMessage(messages.activitiesEnhanced)}</Item>
          <Item key="events">{formatMessage(messages.events)}</Item>
        </TabList>
        <TabPanels  marginTop="size-200">
          <Item key="activities">
            <Activities />
          </Item>
          <Item key="activitiesEnhanced">
            <ActivitiesEnhanced />
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
