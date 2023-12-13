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
import React, { useEffect } from 'react';
import { ConnectionContext, EventContext, NavigationContext, SelectedEventContext, SettingsContext, ValidationContext, } from './Contexts';
import extractNavigation from './utils/extract.navigation';
const PluginBridgeProvider = ({ children }) => {
    const [bridgeConnections, setBridgeConnections] = React.useState(null);
    const [bridgeNavigation, setBridgeNavigation] = React.useState(null);
    const [bridgeEvents, setBridgeEvents] = React.useState(null);
    const [bridgeSelectedEvents, setBridgeSelectedEvents] = React.useState(null);
    const [bridgeSettings, setBridgeSettings] = React.useState(null);
    const [bridgeValidation, setBridgeValidation] = React.useState(null);
    useEffect(() => {
        window.pluginBridge.register({
            init(options) {
                console.log("INIT!", options);
                setBridgeSettings(options);
            },
            navigateTo(navigation) {
                console.log("NAV", navigation);
                setBridgeNavigation(extractNavigation(navigation));
            },
            receiveConnections(connections) {
                console.log("CON", connections);
                setBridgeConnections(connections);
            },
            receiveEvents(events) {
                console.log("events", events);
                setBridgeEvents({ events });
            },
            receivePlugins(plugins) {
                console.log("plugins", plugins);
            },
            receiveSelectedEvents(selected) {
                console.log("selectedevents", selected, bridgeEvents);
                setBridgeSelectedEvents({ selected });
            },
            receiveSession(session) {
                console.log("session", session);
            },
            receiveSettings(settings) {
                console.log("receiveSettings", settings);
                setBridgeSettings(settings);
            },
            receiveValidation(validation) {
                console.log("receiveValidation", validation);
                setBridgeValidation({ validation });
            }
        });
    }, [window.pluginBridge]);
    if (!bridgeSettings) {
        return null;
    }
    const contexts = [
        { context: SettingsContext, value: bridgeSettings },
        { context: NavigationContext, value: bridgeNavigation },
        { context: ConnectionContext, value: bridgeConnections },
        { context: EventContext, value: bridgeEvents },
        { context: SelectedEventContext, value: bridgeSelectedEvents },
        { context: ValidationContext, value: bridgeValidation },
    ];
    let Result = null;
    contexts.forEach(({ context, value }) => {
        const Renderer = context.Provider;
        if (Result == null) {
            Result = React.createElement(Renderer, { value: value }, children);
        }
        else {
            Result = React.createElement(Renderer, { value: value }, Result);
            ;
        }
    });
    return Result;
};
export default PluginBridgeProvider;
