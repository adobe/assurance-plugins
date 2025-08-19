import { useEvents, useSelectedClients, useClients } from '@assurance/plugin-bridge-provider';

// Hook to extract the latest ECID (Experience Cloud ID) from shared state update events for the currently selected client.
//
// - Filters events to only include shared state updates where the stateowner is 'com.adobe.edge.identity'.
// - Extracts the ECID from the most recent matching event's metadata.
// - Returns the ECID as a string, or undefined if not available.
//
// Usage:
//   const ecid = useECID();
//   // ecid will be a string (the ECID) or undefined if not found or no matching event is present.
function useECID() {
  // Fetch events containing ECID, automatically filtered by selected client via navigation filters
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner == 'com.adobe.edge.identity'"]
  });
  const ecid = events[0]?.payload?.metadata?.['xdm.state.data']?.identityMap?.ECID?.[0]?.id;
  return ecid;
}

/**
 * Returns the client object of the currently selected client, or undefined if "All Clients" is selected.
 *
 * - If exactly one client is selected, returns the full client object for that client.
 * - If "All Clients" is selected (or none are selected), returns undefined.
 *
 * This is useful for accessing all properties of the selected client.
 */
function useSelectedClientObject() {
  // selectedClients: array of clientIds currently selected in the navigation filter
  const selectedClients = useSelectedClients();
  // clients: all available client objects
  const clients = useClients();

  // If "All Clients" is selected (selectedClients is empty or contains all clientIds), return undefined
  if (!selectedClients || selectedClients.length !== 1) {
    return undefined;
  }

  // Find the client object for the selected clientId
  const selectedClientObj = clients.find(client => client.clientId === selectedClients[0]);
  // Return the clientId if found, otherwise undefined
  return selectedClientObj;
}

/**
 * Returns the clientId of the currently selected client, or undefined if "All Clients" is selected.
 *
 * This hook uses useSelectedClientObject internally and returns its clientId property.
 *
 * - If exactly one client is selected, returns that client's clientId.
 * - If "All Clients" is selected (or none are selected), returns undefined.
 *
 * This is useful for filtering events or data by the currently selected client.
 */
function useSelectedClientId(): string | undefined {
  const selectedClientObj = useSelectedClientObject();
  return selectedClientObj?.clientId;
}

/**
 * Returns the type of the currently selected client, or undefined if "All Clients" is selected.
 *
 * - Uses useSelectedClientObject to get the selected client object.
 * - Returns the 'type' property of the client object, or undefined if not available.
 *
 * Usage:
 *   const type = useSelectedClientType();
 *   // type will be a string (the client type) or undefined if not found or no client is selected.
 */
function useSelectedClientType() {
  const selectedClientObj = useSelectedClientObject();
  return selectedClientObj?.type;
}


/**
 * Returns the push token for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.messaging'.
 * - Extracts the push token from the most recent matching event's metadata.
 * - Returns the push token as a string, or undefined if not available.
 *
 * Usage:
 *   const pushToken = useSelectedClientPushToken();
 *   // pushToken will be a string (the push token) or undefined if not found or no matching event is present.
 */
function useSelectedClientPushToken() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.messaging'"]
  });
  const pushToken = events[0]?.payload?.metadata?.['state.data']?.pushidentifier;
  return pushToken;
}


/**
 * Returns the version of the Messaging extension for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.module.eventhub'.
 * - Extracts the messaging extension version from the most recent matching event's metadata.
 * - Returns the version as a string, or undefined if not available.
 *
 * Usage:
 *   const version = useClientMessagingVersion();
 *   // version will be a string (the version) or undefined if not found or no matching event is present.
 */
function useClientMessagingVersion() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.module.eventhub'"]
  });
  const messagingExtension =
    events[0]?.payload?.metadata?.['state.data']?.extensions?.['com.adobe.messaging'];
  const messagingVersion = Array.isArray(messagingExtension)
    ? messagingExtension[0]?.version
    : messagingExtension?.version;
  return messagingVersion;
}

/**
 * Returns the Edge data stream configId for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.module.configuration'.
 * - Extracts the 'edge.configId' from the most recent matching event's metadata.
 * - Returns the configId as a string, or undefined if not available.
 *
 * Usage:
 *   const configId = getClientDataStream();
 *   // configId will be a string or undefined if not found or no matching event is present.
 */
function getClientDataStream() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.module.configuration'"]
  });
  const configId = events[0]?.payload?.metadata?.['state.data']?.['edge.configId'];
  return configId;
}

/**
 * Returns the Messaging event dataset configId for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.module.configuration'.
 * - Extracts the 'messaging.eventDataset' from the most recent matching event's metadata.
 * - Returns the configId as a string, or undefined if not available.
 *
 * Usage:
 *   const datasetId = getClientMessagingEventDataset();
 *   // datasetId will be a string or undefined if not found or no matching event is present.
 */
function getClientMessagingEventDataset() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.module.configuration'"]
  });
  const configId = events[0]?.payload?.metadata?.['state.data']?.['messaging.eventDataset'];
  return configId;
}

export {
  useSelectedClientId,
  useECID,
  useSelectedClientPushToken,
  useClientMessagingVersion,
  getClientDataStream,
  getClientMessagingEventDataset,
  useSelectedClientObject,
  useSelectedClientType
};
