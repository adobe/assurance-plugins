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
import React from "react";
import { PluginView, TimelineToolbar } from '@adobe/assurance-timeline-bar';
import { Item, Tabs, TabList, TabPanels } from "@adobe/react-spectrum";
import ProviderTable from "./ProviderTable";
import Timing from "./Timing";
import DatastreamViewer from "./DatastreamViewer";
import Validation from "./Validation";
import ValidationBuilder from "./ValidationBuilder";
import DatastreamHorinzontal from "./DatastreamHorizontal";
const SampleUI = () => (React.createElement(PluginView, null,
    React.createElement(Tabs, { "aria-label": "Sample UI Tabs", height: "100%" },
        React.createElement(TabList, null,
            React.createElement(Item, { key: "provider" }, "Provider table"),
            React.createElement(Item, { key: "timing" }, "Timing view"),
            React.createElement(Item, { key: "validation" }, "Validation view"),
            React.createElement(Item, { key: "validationBuilder" }, "Validation Builder view"),
            React.createElement(Item, { key: "datastream" }, "Datastream viewer"),
            React.createElement(Item, { key: "horizontal" }, "Datastream horizontal")),
        React.createElement(TabPanels, null,
            React.createElement(Item, { key: "provider" },
                React.createElement(ProviderTable, null)),
            React.createElement(Item, { key: "timing" },
                React.createElement(Timing, null)),
            React.createElement(Item, { key: "validation" },
                React.createElement(Validation, null)),
            React.createElement(Item, { key: "validationBuilder" },
                React.createElement(ValidationBuilder, null)),
            React.createElement(Item, { key: "datastream" },
                React.createElement(DatastreamViewer, null)),
            React.createElement(Item, { key: "horizontal" },
                React.createElement(DatastreamHorinzontal, null)))),
    React.createElement(TimelineToolbar, null)));
export default SampleUI;
