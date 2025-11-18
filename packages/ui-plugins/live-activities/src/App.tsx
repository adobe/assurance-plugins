import {
  defaultTheme,
  Flex,
  Item,
  Provider,
  TabList,
  TabPanels,
  Tabs,
  View,
  Text,
  ToastContainer
} from '@adobe/react-spectrum';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { PluginBridgeProvider, useSelectedClients } from '@assurance/plugin-bridge-provider';
import Activities from './containers/activities';
import Events from './containers/events';
import ClientInfo from './components/validation/client-info';
import { IntlProvider, useIntl } from 'react-intl';
import usePluginState, { TopLevelTab } from './hooks/usePluginState';
import { NAVIGATION_CONFIG } from './constants/liveActivitiesConfig';
import { navigationMessages } from './i18n';

import ClientPicker from '../../../components/timeline-bar/src/components/FilterBar/ClientPicker';
import Card from './components/atoms/card';
import classNames from 'classnames';
import './App.css';

function Inner() {
  const {
    topLevelNavigation: { activeTab, setActiveTab }
  } = usePluginState();
  const { formatMessage } = useIntl();

  const selectedClients = useSelectedClients();
  const currentClient = selectedClients[0];

  useEffect(() => {
    if (currentClient) {
      setActiveTab(NAVIGATION_CONFIG.TOP_LEVEL_TABS.CLIENT_INFO);
    }
  }, [currentClient]);

  return (
    <View padding="size-200" paddingTop="size-0">
      <Flex gap="size-100" justifyContent="end" alignItems="center">
        <Text UNSAFE_className={classNames('clientLabel')}>Client</Text>
        <Card>
          <ClientPicker allowAllClients={false} />
        </Card>
      </Flex>
      <Tabs
        density="compact"
        onSelectionChange={key => setActiveTab(key as TopLevelTab)}
        selectedKey={activeTab}
      >
        <TabList UNSAFE_className={classNames('tabList')}>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.CLIENT_INFO}>
            {formatMessage(navigationMessages.clientInfo)}
          </Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.ACTIVITIES}>
            {formatMessage(navigationMessages.activities)}
          </Item>
          <Item key={NAVIGATION_CONFIG.TOP_LEVEL_TABS.EVENTS}>
            {formatMessage(navigationMessages.events)}
          </Item>
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
      <Provider theme={defaultTheme}>
        <IntlProvider locale="en">
          <QueryClientProvider client={queryClient}>
            <Inner />
            <ToastContainer placement="top end" />
          </QueryClientProvider>
        </IntlProvider>
      </Provider>
    </PluginBridgeProvider>
  );
}

export default App;
