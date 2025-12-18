import { useEvents, useSelectedClients, useClients } from '@assurance/plugin-bridge-provider';
import { useRegisteredActivities } from './useActivities';
import { RegisteredActivity } from '../types/liveActivities';

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
 * Returns the platform type of the currently selected client, or undefined if "All Clients" is selected.
 *
 * - Uses useSelectedClientObject to get the selected client object.
 * - Returns the platform from deviceInfo['Canonical platform name'], or undefined if not available.
 * - Note: This returns the actual device platform (e.g., 'iOS', 'Android'), not the event type.
 *
 * Usage:
 *   const platformType = useSelectedClientType();
 *   // platformType will be 'iOS', 'Android', or undefined if not found or no client is selected.
 */
function useSelectedClientType() {
  const selectedClientObj = useSelectedClientObject();
  if (!selectedClientObj?.payload?.deviceInfo) return undefined;

  return selectedClientObj.payload.deviceInfo['Canonical platform name'];
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
 * Returns the pushToStart token for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.messaging'.
 * - Extracts the pushToStart token from the most recent matching event's metadata.
 * - Returns the pushToStart token as a string, or undefined if not available.
 *
 * Usage:
 *   const pushToStartToken = useSelectedClientPushToStartToken();
 *   // pushToStartToken will be a string (the pushToStart token) or undefined if not found or no matching event is present.
 */
function useSelectedClientPushToStartToken() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.messaging'"]
  });
  const pushToStartToken =
    events[0]?.payload?.metadata?.['state.data']?.liveActivity?.pushToStartToken;
  return pushToStartToken;
}

function useActivitiesWithPushToStartTokens(): RegisteredActivity[] {
    const events = useEvents({
      sorted: 'desc',
      matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.messaging'"]
    });
  
    const registeredActivities = useRegisteredActivities();
  
    /**
     * {
      "state.data": {
          "pushidentifier": "803FB00A29938438240C8DF63140113D2070F42F7709B2A67167735C5897A47EE50C090A13BB927964D9995181D2069EB2A5A03162C5EB0107EA1F3C3A428CC2A87B26BA4D2FD16417F4E8AAA8D8644D",
          "liveActivity": {
              "pushToStartTokens": {
                  "GameScoreLiveActivityAttributes": {
                      "token": "80469f94715bd1f5b707c1450a88dcca079e3bc04532c8181652aef84f0584f60ac1d8030901633330a1421d015bff6e6a41afe8191553ca76546d16f53f569d84d8f2f347bd951e2bb31edf4560cb3a3d59a0ac6d0297605f8d7472e2c4589d5234b485df4253061a6ef7ee309c0698d718db9e43d32b3b5d0e887efa25419d",
                      "firstIssued": 1765779189049.1628
                  },
                  "FoodDeliveryLiveActivityAttributes": {
                      "token": "80469f94715bd1f5b707c1450a88dcca079e3bc04532c8181652aef84f0584f60ac1d8030901633330a1421d015bff6e6a41afe8191553ca76546d16f53f569d84d8f2f347bd951e2bb31edf4560cb3a3d59a0ac6d0297605f8d7472e2c4589d5234b485df4253061a6ef7ee309c0698d718db9e43d32b3b5d0e887efa25419d",
                      "firstIssued": 1765779189049.155
                  },
                  "AirplaneTrackingAttributes": {
                      "token": "80469f94715bd1f5b707c1450a88dcca079e3bc04532c8181652aef84f0584f60ac1d8030901633330a1421d015bff6e6a41afe8191553ca76546d16f53f569d84d8f2f347bd951e2bb31edf4560cb3a3d59a0ac6d0297605f8d7472e2c4589d5234b485df4253061a6ef7ee309c0698d718db9e43d32b3b5d0e887efa25419d",
                      "firstIssued": 1765779189049.151
                  }
              }
          }
      }
  }
     * 
     */
    const activitiesArrayWithPushToStartToken = registeredActivities.map(activity => {
      return {
        ...activity,
        pushToStartToken: events[0]?.payload?.metadata?.['state.data']?.liveActivity?.pushToStartTokens?.[activity.attributeType]?.token
      };
    });
    return activitiesArrayWithPushToStartToken;
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

/**
 * Returns the propertyId for the currently selected client, if available.
 *
 * - Filters events to only include shared state updates where the stateowner is 'com.adobe.module.configuration'.
 * - Extracts the 'property.id' from the most recent matching event's metadata.
 * - Returns the propertyId as a string, or undefined if not available.
 *
 * Usage:
 *   const propertyId = getPropertyId();
 *   // propertyId will be a string or undefined if not found or no matching event is present.
 */

function getPropertyId() {
  const events = useEvents({
    sorted: 'desc',
    matchers: ["payload.ACPExtensionEventData.stateowner=='com.adobe.module.configuration'"]
  });
  const propertyId = events[0]?.payload?.metadata?.['state.data']?.['property.id'];
  return propertyId;
}

/**
 * Returns the iOS version for the currently selected client, if available.
 *
 * - Gets the iOS version directly from the selected client's deviceInfo.
 * - Extracts the iOS version from Operating system field.
 * - Returns the version as a string, or undefined if not available.
 *
 * Usage:
 *   const iosVersion = useClientIOSVersion();
 *   // iosVersion will be a string (the version) or undefined if not found.
 */
function useClientIOSVersion() {
  const selectedClientObj = useSelectedClientObject();
  if (!selectedClientObj?.payload?.deviceInfo) return undefined;

  const operatingSystem = selectedClientObj.payload.deviceInfo['Operating system'];
  if (!operatingSystem || !operatingSystem.startsWith('iOS ')) return undefined;

  // Extract version from "iOS 18.0" -> "18.0"
  return operatingSystem.replace('iOS ', '');
}

/**
 * Returns the Android version for the currently selected client, if available.
 *
 * - Gets the Android version directly from the selected client's deviceInfo.
 * - Extracts the Android version from Operating system field.
 * - Returns the version as a string, or undefined if not available.
 *
 * Usage:
 *   const androidVersion = useClientAndroidVersion();
 *   // androidVersion will be a string (the version) or undefined if not found.
 */
function useClientAndroidVersion() {
  const selectedClientObj = useSelectedClientObject();
  if (!selectedClientObj?.payload?.deviceInfo) return undefined;

  const operatingSystem = selectedClientObj.payload.deviceInfo['Operating system'];
  if (!operatingSystem || !operatingSystem.startsWith('Android ')) return undefined;

  // Extract version from "Android 14.0" -> "14.0"
  return operatingSystem.replace('Android ', '');
}

/**
 * Returns whether the currently selected client supports Live Activities, if available.
 *
 * - Gets the Live Activities support information directly from the selected client's appSettings.
 * - Checks NSSupportsLiveActivities and NSSupportsLiveActivitiesFrequentUpdates.
 * - Returns an object with support details, or undefined if not available.
 *
 * Usage:
 *   const liveActivitiesSupport = useClientLiveActivitiesSupport();
 *   // liveActivitiesSupport will be an object with support details or undefined if not found.
 */
function useClientLiveActivitiesSupport() {
  const selectedClientObj = useSelectedClientObject();
  if (!selectedClientObj?.payload?.appSettings) return undefined;

  const appSettings = selectedClientObj.payload.appSettings as any;

  return {
    supportsLiveActivities: appSettings.NSSupportsLiveActivities === true,
    supportsFrequentUpdates: appSettings.NSSupportsLiveActivitiesFrequentUpdates === true,
    minimumOSVersion: appSettings.MinimumOSVersion
  };
}

/**
 * Returns the device type information for the currently selected client, if available.
 *
 * - Gets the device type directly from the selected client's deviceInfo.
 * - Extracts device type from Device type field.
 * - Returns the device type as a string, or undefined if not available.
 *
 * Usage:
 *   const deviceType = useClientDeviceType();
 *   // deviceType will be a string (e.g., "iPhone or iPod touch") or undefined if not found.
 */
function useClientDeviceType() {
  const selectedClientObj = useSelectedClientObject();
  if (!selectedClientObj?.payload?.deviceInfo) return undefined;

  return selectedClientObj.payload.deviceInfo['Device type'];
}

export {
  useSelectedClientId,
  useECID,
  useSelectedClientPushToken,
  useSelectedClientPushToStartToken,
  useClientMessagingVersion,
  getClientDataStream,
  getClientMessagingEventDataset,
  useSelectedClientObject,
  useSelectedClientType,
  getPropertyId,
  useClientIOSVersion,
  useClientAndroidVersion,
  useClientLiveActivitiesSupport,
  useClientDeviceType,
  useActivitiesWithPushToStartTokens
};
