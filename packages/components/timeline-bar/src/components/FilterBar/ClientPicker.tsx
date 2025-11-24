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
import { filterToHash } from "@adobe/griffon-toolkit";
import {
  clientInfoAndroid,
  clientInfoIos,
} from "@adobe/griffon-toolkit-aep-mobile";
import { event as rootEvent } from "@adobe/griffon-toolkit-common";
import { Flex, Item, Picker, Text } from "@adobe/react-spectrum";
import {
  navigateTo,
  useClients,
  useNavigationFilters,
  useNavigationPath,
  useSelectedClients,
} from "@assurance/plugin-bridge-provider";
import Phone from "@spectrum-icons/workflow/DevicePhone";
import Devices from "@spectrum-icons/workflow/Devices";
import * as R from "ramda";
import React, { useMemo, useEffect } from "react";

/**
 * ClientPicker component
 *
 * Props:
 * - allowAllClients (boolean, default: true):
 *     If true, shows the 'All Clients' option. If false, only allows selecting a specific client.
 *     If false and there are no clients, shows a disabled/default option and selects none.
 */
const getClientIcon = (type) =>
  type === "all" ? <Devices size="S" /> : <Phone size="S" />;

const getType = (client) =>
  clientInfoIos.isMatch(client)
    ? "ios"
    : clientInfoAndroid.isMatch(client)
      ? "android"
      : null;

const getIosLabel = (client) =>
  clientInfoIos.getDeviceName(client) ||
  clientInfoIos.getModel(client) ||
  clientInfoIos.getDeviceType(client);
const getAndroidLabel = (client) =>
  clientInfoAndroid.getDeviceName(client) ||
  clientInfoAndroid.getDeviceType(client);

const getLabel = (client) =>
  clientInfoIos.isMatch(client)
    ? getIosLabel(client)
    : clientInfoAndroid.isMatch(client)
      ? getAndroidLabel(client)
      : null;

const prepareClientForUI = (client) => ({
  clientId: rootEvent.getClientId(client),
  label: getLabel(client),
  type: getType(client),
  timestamp: client.timestamp,
});

// Utility to determine if navigation to default client is needed
function getDefaultClientNavigation({
  allowAllClients,
  clients,
  selectedClients,
  prepared,
  filters,
  path
}) {
  if (
    !allowAllClients &&
    clients.length > 0 &&
    (!selectedClients ||
      selectedClients.length === 0 ||
      selectedClients.length === clients.length)
  ) {
    const firstClientId = prepared[0]?.clientId;
    if (firstClientId) {
      const output = {
        ...filters,
        clients: rootEvent.makeClientFilter([firstClientId.toLowerCase(), firstClientId.toUpperCase()])
      };
      return `${path}#${filterToHash(output)}`;
    }
  }
  return null;
}

const ClientPicker = ({ allowAllClients = true }) => {
  const clients = useClients();
  const selectedClients = useSelectedClients();
  const filters = useNavigationFilters();
  const path = useNavigationPath();

  const prepared = useMemo(() => clients.map(prepareClientForUI), [clients]);

  const newPath = React.useMemo(
    () =>
      getDefaultClientNavigation({
        allowAllClients,
        clients,
        selectedClients,
        prepared,
        filters,
        path
      }),
    [allowAllClients, clients, selectedClients, prepared, filters, path]
  );

  useEffect(() => {
    if (newPath) {
      navigateTo(newPath);
    }
  }, [newPath]);

  const mapSelected = useMemo(
    () =>
      selectedClients.map((id) => R.find(R.propEq(id, "clientId"), prepared)),
    [prepared, selectedClients],
  );

  if (clients.length === 0) {
    // No clients: show a disabled/default option
    return (
      <Picker aria-label="Client" isDisabled selectedKey="none">
        <Item key="none" textValue="No Clients Available">
          <Devices size="S" />
          <Text>No Clients Available</Text>
        </Item>
      </Picker>
    );
  }

  if (clients.length === 1) {
    return (
      <Flex gap="size-100">
        {getClientIcon(mapSelected[0].type)}
        <Text>{mapSelected[0].label}</Text>
      </Flex>
    );
  }

  // Build options array
  const options = allowAllClients
    ? [
        {
          clientId: "all",
          label: "All Clients",
          type: "all",
        },
        ...prepared,
      ]
    : prepared;

  // Determine selectedKey
  let selectedKey;
  if (!allowAllClients) {
    // If not allowing all clients, default to first client if none selected
    selectedKey =
      mapSelected[0]?.clientId || prepared[0]?.clientId || "none";
  } else {
    selectedKey =
      selectedClients.length === clients.length || selectedClients.length === 0
        ? "all"
        : mapSelected[0]?.clientId;
  }

  // onSelectionChange handler
  const handleSelectionChange = (selected) => {
    const output = {
      ...filters,
      clients:
        allowAllClients && selected === "all"
          ? undefined
          : rootEvent.makeClientFilter([selected.toLowerCase(), selected.toUpperCase()]),
    };
    const newPath = `${path}#${filterToHash(output)}`;
    navigateTo(newPath);
  };

  return (
    <Picker
      aria-label="Client"
      labelPosition="side"
      isQuiet
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={handleSelectionChange}
    >
      {(item: any) => (
        <Item key={item.clientId} textValue={item.label}>
          {getClientIcon(item.type)}
          <Text>{item.label}</Text>
        </Item>
      )}
    </Picker>
  );
};

export default ClientPicker;
