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
import { PluginBridgeProvider, useFilteredEvents } from '@adobe/assurance-plugin-bridge-provider';
import { PluginView, TimelineToolbar } from '@adobe/assurance-timeline-bar';
import { pluckEventData } from '@adobe/assurance-common-utils';
import { defaultTheme, Provider } from '@adobe/react-spectrum';
import DataViewer from '../components/DataViewer';
const Inner = () => {
    const events = useFilteredEvents({
        matchers: ['payload.name==`datastream`']
    });
    return (React.createElement(DataViewer, { data: pluckEventData(events, ['payload', 'messages', 1], { parseJSON: true }) }));
};
const App = () => {
    return (React.createElement(Provider, { theme: defaultTheme, colorScheme: "light" },
        React.createElement(PluginBridgeProvider, null,
            React.createElement(PluginView, null,
                React.createElement(Inner, null),
                React.createElement(TimelineToolbar, null)))));
};
export default App;
