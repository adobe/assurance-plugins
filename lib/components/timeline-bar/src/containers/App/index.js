/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/
import React from 'react';
import { PluginBridgeProvider } from '@adobe/assurance-plugin-bridge-provider';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import TimelineToolbar from '../../components/TimelineToolbar';
import PluginView from '../../components/PluginView';
const App = () => {
    return (React.createElement(Provider, { theme: defaultTheme, colorScheme: "light" },
        React.createElement(PluginBridgeProvider, null,
            React.createElement(PluginView, null,
                React.createElement("div", null, "Plugin Goes Here"),
                React.createElement(TimelineToolbar, null)))));
};
export default App;
