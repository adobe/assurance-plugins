/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import { PluginView, TimelineToolbar } from '@adobe/assurance-timeline-bar';
import { Item, Tabs, TabList, TabPanels } from "@adobe/react-spectrum";
import ProviderTable from "./ProviderTable";
import Timing from "./Timing";
import DatastreamViewer from "./DatastreamViewer";
import Validation from "./Validation";
import ValidationBuilder from "./ValidationBuilder";

const SampleUI = () => (
  <PluginView>
    <Tabs aria-label="Sample UI Tabs" height="100%">
      <TabList>
        <Item key="provider">Provider table</Item>
        <Item key="timing">Timing view</Item>
        <Item key="validation">Validation view</Item>
        <Item key="validationBuilder">Validation Builder view</Item>
        <Item key="datastream">Datastream viewer</Item>
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
      </TabPanels>
    </Tabs>
    <TimelineToolbar />
  </PluginView>
);

export default SampleUI;


