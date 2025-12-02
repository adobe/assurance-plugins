import React from 'react';

import { Item, Provider, TabList, TabPanels, Tabs, defaultTheme } from '@adobe/react-spectrum';
import { PluginBridgeProvider } from '@assurance/plugin-bridge-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';

import CardsView from './components/cards-view/cards-view';
import Events from './components/events/events';
import Requests from './components/requests/requests';
import Validation from './components/validation/validation';
import { usePluginState } from './hooks/usePluginState';

const queryClient = new QueryClient();

function App() {
  const selectedTab = usePluginState(state => state.selectedTab);
  const setSelectedTab = usePluginState(state => state.setSelectedTab);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en-US">
        <Provider theme={defaultTheme} colorScheme="light">
          <PluginBridgeProvider>
            <Tabs
              defaultSelectedKey={selectedTab}
              onSelectionChange={key => setSelectedTab(key as string)}
              selectedKey={selectedTab}
            >
              <TabList>
                <Item key="cards">Content Cards</Item>
                <Item key="requests">Requests</Item>
                <Item key="event-list">Event List</Item>
                <Item key="validation" aria-label="validation">
                  Validation
                </Item>
              </TabList>
              <TabPanels marginTop="size-200">
                <Item key="cards">
                  <CardsView />
                </Item>
                <Item key="requests">
                  <Requests />
                </Item>
                <Item key="event-list">
                  <Events />
                </Item>
                <Item key="validation">
                  <Validation />
                </Item>
              </TabPanels>
            </Tabs>
          </PluginBridgeProvider>
        </Provider>
      </IntlProvider>
    </QueryClientProvider>
  );
}

export default App;
