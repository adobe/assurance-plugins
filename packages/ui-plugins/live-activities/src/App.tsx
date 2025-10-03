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
import React from 'react';
import { PluginBridgeProvider } from '@assurance/plugin-bridge-provider';
import Activities from './containers/activities';
import Events from './containers/events';
import ClientInfo from './components/validation/client-info';
import { defineMessages, IntlProvider, useIntl } from 'react-intl';
import usePluginState from './hooks/usePluginState';
import { NAVIGATION_CONFIG } from './constants/liveActivitiesConfig';

import ClientPicker from '../../../components/timeline-bar/src/components/FilterBar/ClientPicker';
import Card from './components/atoms/card';
import './App.css';
import classNames from 'classnames';

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
  const { topLevelNavigation: { activeTab, setActiveTab } } = usePluginState();
  const { formatMessage } = useIntl();

  return (
    <View padding="size-200" paddingTop="size-0">
      <Flex gap="size-100" justifyContent="end" alignItems="center">
        <Text UNSAFE_className={classNames('clientLabel')}>Client</Text>
        <Card>
          <ClientPicker allowAllClients={false} />
        </Card>
      </Flex>
      <Tabs density='compact' onSelectionChange={(key) => setActiveTab(key as any)} selectedKey={activeTab}>
        <TabList UNSAFE_className={classNames('tabList')}>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.CLIENT_INFO}>{formatMessage(messages.clientInfo)}</Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.ACTIVITIES}>{formatMessage(messages.activities)}</Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.EVENTS}>{formatMessage(messages.events)}</Item>
        </TabList>
        <TabPanels marginTop="size-200">
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.CLIENT_INFO}>
            <ClientInfo />
          </Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.ACTIVITIES}>
            <Activities />
          </Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.EVENTS}>
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
