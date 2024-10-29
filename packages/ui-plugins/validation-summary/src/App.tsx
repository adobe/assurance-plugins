import { Provider, defaultTheme } from "@adobe/react-spectrum";
import { PluginBridgeProvider } from "@assurance/plugin-bridge-provider";
import React from "react";
import SummaryView from "./components/summary-view/summary-view";

function App() {
  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <PluginBridgeProvider>
        <SummaryView />
      </PluginBridgeProvider>
    </Provider>
  );
}

export default App;
