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
import { IntlProvider } from "react-intl";
import Events from "./components/events/events";
import Validation from "./components/validation/validation";
import { Tab, usePluginState } from "./hooks/usePluginState";

function App() {
  const { selectedTab, setSelectedTab } = usePluginState();
  return (
    <IntlProvider locale="en-US">
      <PluginBridgeProvider>
        <Provider theme={defaultTheme}>
          <Tabs
            onSelectionChange={(tab) => setSelectedTab(tab as Tab)}
            selectedKey={selectedTab}
          >
            <TabList>
              <Item key="experiences">Experiences</Item>
              <Item key="events">Events</Item>
              <Item key="validation">Validation</Item>
            </TabList>
            <TabPanels>
              <Item key="experiences">Experiences</Item>
              <Item key="events">
                <Events />
              </Item>
              <Item key="validation">
                <Validation />
              </Item>
            </TabPanels>
          </Tabs>
        </Provider>
      </PluginBridgeProvider>
    </IntlProvider>
  );
}

export default App;
