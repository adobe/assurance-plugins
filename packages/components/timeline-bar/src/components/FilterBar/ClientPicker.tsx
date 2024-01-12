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

import React, { useMemo } from "react";
import { Flex, Item, Picker, Text } from "@adobe/react-spectrum";
import { filterToHash } from '@adobe/griffon-toolkit';
import * as R from 'ramda';
import { 
  navigateTo,
  useClients, 
  useFilteredEvents, 
  useNavigationFilters,
  useNavigationPath,
  useSelectedClients, 
} from "@adobe/assurance-plugin-bridge-provider";
import { event as rootEvent } from '@adobe/griffon-toolkit-common';
import { clientInfoIos, clientInfoAndroid } from '@adobe/griffon-toolkit-aep-mobile';
import Devices from "@spectrum-icons/workflow/Devices";
import Phone from "@spectrum-icons/workflow/DevicePhone";

const getClientIcon = type => (type === 'all'
  ? <Devices size="S" /> : <Phone size="S" />);

const getType = client => (clientInfoIos.isMatch(client)
  ? 'ios' : clientInfoAndroid.isMatch(client) ? 'android' : null);

const getIosLabel = client =>
  clientInfoIos.getDeviceName(client)
  || clientInfoIos.getModel(client)
  || clientInfoIos.getDeviceType(client);
const getAndroidLabel = client =>
  clientInfoAndroid.getDeviceName(client)
  || clientInfoAndroid.getDeviceType(client);

const getLabel = client =>
  (clientInfoIos.isMatch(client) ? getIosLabel(client)
    : clientInfoAndroid.isMatch(client) ? getAndroidLabel(client)
      : null);

const prepareClientForUI = client => ({
  clientId: rootEvent.getClientId(client),
  label: getLabel(client),
  type: getType(client),
  timestamp: client.timestamp
});


const ClientPicker = () => {
  const events = useFilteredEvents();
  const clients = useClients();
  const selectedClients = useSelectedClients();
  const filters = useNavigationFilters();
  const path = useNavigationPath();

  const prepared = useMemo(() => clients.map(prepareClientForUI), [clients]);

  const mapSelected = useMemo(() =>
    selectedClients.map(
      id => R.find(R.propEq(id, 'clientId'), prepared)
    ),
    [prepared, selectedClients]
  )

  if (events.length === 0 || clients.length === 0) {
    return null;
  }

  if (clients.length === 1) {
    return (
      <Flex gap="size-100" data-testid="client-text">
        {getClientIcon(mapSelected[0].type)}
        <Text>{mapSelected[0].label}</Text>
      </Flex>
    );
  }

  const options = [
    {
      clientId: 'all',
      label: 'All clients',
      type: 'all'
     },
    ...prepared    
  ];
  
  return (
    <Picker 
      aria-label="Client" 
      labelPosition="side" 
      data-testid="client-picker"
      isQuiet
      items={options}
      selectedKey={selectedClients.length === clients.length ? 'all' : mapSelected[0].clientId}
      onSelectionChange={(selected) => {
        const output = {
          ...filters,
          clients: selected === 'all' ? undefined : rootEvent.makeClientFilter([selected])
        };

        const newPath = `${path}#${filterToHash(output)}`;
        navigateTo(newPath);
      }}
    >
      {(item) => 
        <Item key={item.clientId} textValue={item.label}>
          {getClientIcon(item.type)}
          <Text>{item.label}</Text>
        </Item>
      }
    </Picker>
  );
};

export default ClientPicker;
