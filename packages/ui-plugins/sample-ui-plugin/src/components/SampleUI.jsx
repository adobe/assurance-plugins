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

const SampleUI = () => (
  <PluginView>
    <Tabs aria-label="Sample UI Tabs" height="100%">
      <TabList>
        <Item key="provider">Provider table</Item>
        <Item key="timing">Timing view</Item>
        <Item key="validation">Validation view</Item>
        <Item key="validationBuilder">Validation Builder view</Item>
        <Item key="datastream">Datastream viewer</Item>
        <Item key="horizontal">Datastream horizontal</Item>
      </TabList>
      <TabPanels>
        <Item key="provider">
          <ProviderTable />
        </Item>
        <Item key="timing">
          <Timing />
        </Item>
        <Item key="validation">
          <Validation />
        </Item>
        <Item key="validationBuilder">
          <ValidationBuilder />
        </Item>
        <Item key="datastream">
          <DatastreamViewer />
        </Item>
        <Item key="horizontal">
          <DatastreamHorinzontal />
        </Item>
      </TabPanels>
    </Tabs>
    <TimelineToolbar />
  </PluginView>
);

export default SampleUI;


