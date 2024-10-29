import {
  Item,
  Provider,
  TabList,
  TabPanels,
  Tabs,
  View,
  defaultTheme,
} from "@adobe/react-spectrum";
import { PluginBridgeProvider } from "@assurance/plugin-bridge-provider";
import React from "react";
import Events from "./components/events";
import Requests from "./components/requests";
import Simulate from "./components/simulate";
import Validation from "./components/validation";
import { usePluginState } from "./hooks/usePluginState";

function App() {
  const selectedTab = usePluginState((state) => state.selectedTab);
  const setSelectedTab = usePluginState((state) => state.setSelectedTab);

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <Tabs
          defaultSelectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          selectedKey={selectedTab}
        >
          <TabList>
            <Item key="requests">Requests</Item>
            <Item key="simulate">Simulate</Item>
            <Item key="events">Events List</Item>
            <Item key="validation">Validation</Item>
          </TabList>
          <TabPanels>
            <Item key="requests">
              <Requests />
            </Item>
            <Item key="simulate">
              <Simulate />
            </Item>
            <Item key="events">
              <Events />
            </Item>
            <Item key="validation">
              <Validation />
            </Item>
          </TabPanels>
        </Tabs>
      </PluginBridgeProvider>
    </Provider>
  );
}

export default App;
