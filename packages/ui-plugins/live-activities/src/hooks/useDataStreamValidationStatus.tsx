/**
 * Hook to check the validation status of data stream configuration for Live Activities.
 * This hook validates the complete data pipeline from device configuration to profile schema.
 *
 * Returns status strings indicating different validation states:
 * - 'device-not-configured': Missing push token or ECID
 * - 'no-sandbox': Sandbox information not found
 * - 'sandbox-error': Error fetching sandbox data
 * - 'messaging-not-configured': Messaging event dataset not configured
 * - 'missing-messaging-dataset': Messaging dataset not found in platform
 * - 'invalid-messaging-dataset': Messaging dataset has invalid schema
 * - 'no-profile-dataset': Profile dataset not found
 * - 'not-in-platform': ECID not found in platform
 * - 'no-dataset-access': No access to dataset
 * - 'invalid-dataset': Dataset is invalid or corrupted
 * - 'invalid-schema': Profile schema missing required mixins
 * - 'token-mismatch': Push token mismatch between device and platform
 * - 'loading': Data is being loaded
 * - false: All validations passed
 */

import { useQuery } from '@tanstack/react-query';
import {
  useEvents,
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg,
  useSandbox,
  type EnvironmentMap
} from '@assurance/plugin-bridge-provider';
import { combineAll } from '@adobe/griffon-toolkit';
import useECID from './useECID';

// Platform API endpoints for different environments
const PLATFORM_ENDPOINTS: EnvironmentMap<string> = {
  local: 'https://platform.adobe.io/',
  dev: 'https://platform-stage.adobe.io/',
  qa: 'https://platform-stage.adobe.io/',
  stage: 'https://platform.adobe.io/',
  prod: 'https://platform.adobe.io/'
};

// Edge data stream endpoints
const EDGE_ENDPOINTS: EnvironmentMap<string> = {
  local: 'https://edge.adobe.io/',
  dev: 'https://edge-stage.adobe.io/',
  qa: 'https://edge-stage.adobe.io/',
  stage: 'https://edge.adobe.io/',
  prod: 'https://edge.adobe.io/'
};

// Required mixins for profile schema validation
const REQUIRED_PROFILE_MIXINS = [
  'https://ns.adobe.com/xdm/context/identitymap',
  'https://ns.adobe.com/xdm/context/profile-push-notification-details'
];

// Required mixins for tracking dataset schema validation
const REQUIRED_TRACKING_MIXINS = [
  'https://ns.adobe.com/xdm/context/experienceevent-environment-details',
  'https://ns.adobe.com/xdm/context/experienceevent-pushtracking',
  'https://ns.adobe.com/xdm/context/experienceevent-application',
  'https://ns.adobe.com/experience/customerJourneyManagement/messageprofile',
  'https://ns.adobe.com/experience/customerJourneyManagement/messageexecution'
];

// Helper function to create API headers
const createHeaders = (token: string, org: string, sandboxName?: string) => ({
  Authorization: `Bearer ${token}`,
  'x-api-key': 'Activation-DTM',
  'x-gw-ims-org-id': org,
  Accept: 'application/json, text/plain, */*',
  ...(sandboxName && { 'x-sandbox-name': sandboxName })
});

// Hook to extract event dataset from shared state events
const useEventDataset = () => {
  const events = useEvents({
    sorted: 'desc',
    matchers: [
      combineAll([
        '(payload.ACPExtensionEventSource==`com.adobe.eventSource.sharedState` || payload.ACPExtensionEventSource==`com.adobe.eventsource.sharedstate`)',
        '(payload.ACPExtensionEventType==`com.adobe.eventType.hub` || payload.ACPExtensionEventType==`com.adobe.eventtype.hub`)',
        'timestamp'
      ])
    ]
  });

  for (const event of events) {
    const eventDataset = event.payload?.metadata?.['state.data']?.['messaging.eventDataset'];
    if (eventDataset) {
      return eventDataset;
    }
  }
  return null;
};

// Hook to extract datastream ID from configuration shared state
const useDatastreamId = () => {
  const events = useEvents({
    sorted: 'desc',
    matchers: [
      combineAll([
        'payload.ACPExtensionEventData.stateowner==`com.adobe.module.configuration`',
        '(payload.ACPExtensionEventSource==`com.adobe.eventSource.sharedState` || payload.ACPExtensionEventSource==`com.adobe.eventsource.sharedstate`)',
        '(payload.ACPExtensionEventType==`com.adobe.eventType.hub` || payload.ACPExtensionEventType==`com.adobe.eventtype.hub`)',
        'timestamp'
      ])
    ]
  });

  for (const event of events) {
    const configId = event.payload?.metadata?.['state.data']?.['edge.configId'];
    if (configId) {
      return configId;
    }
  }
  return null;
};

// Hook to extract current push token from messaging shared state
const useCurrentPushToken = () => {
  const events = useEvents({
    sorted: 'desc',
    matchers: [
      combineAll([
        'payload.ACPExtensionEventData.stateowner==`com.adobe.messaging`',
        '(payload.ACPExtensionEventSource==`com.adobe.eventSource.sharedState` || payload.ACPExtensionEventSource==`com.adobe.eventsource.sharedstate`)',
        '(payload.ACPExtensionEventType==`com.adobe.eventType.hub` || payload.ACPExtensionEventType==`com.adobe.eventtype.hub`)',
        'timestamp'
      ])
    ]
  });

  for (const event of events) {
    const pushIdentifier = event.payload?.metadata?.['state.data']?.pushidentifier;
    if (pushIdentifier) {
      return pushIdentifier;
    }
  }
  return null;
};

// Hook to fetch dataset information from Platform API
const useDataset = (datasetId: string | null, enabled: boolean = true) => {
  const baseUrl = useEnvironmentValue(PLATFORM_ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['dataset', datasetId, org, sandbox?.name],
    queryFn: async () => {
      if (!datasetId || !token || !org || !sandbox?.name) return null;

      const response = await fetch(`${baseUrl}data/foundation/catalog/datasets/${datasetId}`, {
        headers: createHeaders(token, org, sandbox.name)
      });

      if (!response.ok) {
        throw new Error(`Dataset fetch failed: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
    enabled: enabled && !!datasetId && !!token && !!org && !!sandbox?.name,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

// Hook to fetch schema information from Platform API
const useSchema = (schemaId: string | null, enabled: boolean = true) => {
  const baseUrl = useEnvironmentValue(PLATFORM_ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['schema', schemaId, org, sandbox?.name],
    queryFn: async () => {
      if (!schemaId || !token || !org || !sandbox?.name) return null;

      const response = await fetch(
        `${baseUrl}data/foundation/schemaregistry/tenant/schemas/${encodeURIComponent(schemaId)}`,
        {
          headers: {
            ...createHeaders(token, org, sandbox.name),
            Accept: 'application/vnd.adobe.xed+json; version=1'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Schema fetch failed: ${response.status}`);
      }

      return response.json();
    },
    enabled: enabled && !!schemaId && !!token && !!org && !!sandbox?.name,
    retry: 1
  });
};

// Hook to fetch datastream configuration
const useDatastream = (datastreamId: string | null, enabled: boolean = true) => {
  const baseUrl = useEnvironmentValue(EDGE_ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['datastream', datastreamId, org, sandbox?.name],
    queryFn: async () => {
      if (!datastreamId || !token || !org || !sandbox?.name) return null;

      const response = await fetch(
        `${baseUrl}metadata/namespaces/edge/datasets/datastreams/records/${datastreamId}?LIMIT=10`,
        {
          headers: createHeaders(token, org, sandbox.name)
        }
      );

      if (!response.ok) {
        throw new Error(`Datastream fetch failed: ${response.status}`);
      }

      return response.json();
    },
    enabled: enabled && !!datastreamId && !!token && !!org && !!sandbox?.name,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

// Hook to fetch profile entities from Platform API
const useProfileEntities = (ecid: string | null, enabled: boolean = true) => {
  const baseUrl = useEnvironmentValue(PLATFORM_ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['entities', ecid, org, sandbox?.name],
    queryFn: async () => {
      if (!ecid || !token || !org || !sandbox?.name) return null;

      const response = await fetch(
        `${baseUrl}data/core/ups/access/entities?entityId=${ecid}&entityIdNS=ECID&schema.name=_xdm.context.profile&sandbox=${sandbox.name}`,
        {
          headers: createHeaders(token, org)
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('403');
        }
        throw new Error(`Entities fetch failed: ${response.status}`);
      }

      return response.json();
    },
    enabled: enabled && !!ecid && !!token && !!org && !!sandbox?.name,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

// Helper function to extract schema ID from dataset
const extractSchemaFromDataset = (dataset: any): string | null => {
  if (!dataset) return null;
  const data = Object.values(dataset)[0] as any;
  return data?.schemaRef?.id || null;
};

// Helper function to extract profile dataset ID from datastream config
const extractProfileDatasetId = (datastreamConfig: any): string | null => {
  if (!datastreamConfig?.settings?.com_adobe_experience_platform?.datasets?.profile) {
    return null;
  }

  const profileDatasets = datastreamConfig.settings.com_adobe_experience_platform.datasets.profile;
  return profileDatasets[0]?.datasetId || null;
};

// Helper function to extract profile push token from entities data
const extractProfilePushToken = (entitiesResponseData: any, ecid: string): string | null => {
  const entitiesData = Object.values(entitiesResponseData || {})?.[0] as any;
  if (!entitiesData?.entity?.pushNotificationDetails) return null;

  const detailList = entitiesData.entity.pushNotificationDetails;
  const match = detailList.find(
    (details: any) =>
      details?.identity?.namespace?.code === 'ECID' && details?.identity?.id === ecid
  );

  return match?.token || null;
};

// data/foundation/catalog/datasets
// Helper function to validate tracking dataset status (equivalent to original selectTrackingDatasetStatus)
const validateTrackingDatasetStatus = (
  messagingDatasetQuery: ReturnType<typeof useDataset>,
  messagingSchemaQuery: ReturnType<typeof useSchema>
): string | false => {
  // This function replicates the original selectTrackingDatasetStatus logic

  // Check if messaging dataset is loading
  if (messagingDatasetQuery.isLoading) {
    return 'loading';
  }

  // Check if messaging dataset has errors or missing
  if (messagingDatasetQuery.error || !messagingDatasetQuery.data) {
    return 'missing-messaging-dataset';
  }

  // Check if messaging schema is loading
  if (messagingSchemaQuery.isLoading) {
    return 'loading';
  }

  // Check if messaging schema has errors or missing
  if (messagingSchemaQuery.error || !messagingSchemaQuery.data) {
    return 'invalid-messaging-dataset';
  }

  // Validate that the messaging schema has all required tracking mixins
  const schema = messagingSchemaQuery.data;
  for (const requiredMixin of REQUIRED_TRACKING_MIXINS) {
    if (!schema?.['meta:extends']?.length || schema['meta:extends'].indexOf(requiredMixin) === -1) {
      return 'invalid-messaging-dataset';
    }
  }

  // All tracking dataset validations passed
  return false;
};

// Main hook for data stream validation status
export const useDataStreamValidationStatus = () => {
  // STEP 1: Call ALL hooks unconditionally (Rules of Hooks compliance)
  const ecid = useECID();
  const sandbox = useSandbox();
  const currentPushToken = useCurrentPushToken();
  const eventDataset = useEventDataset();
  const datastreamId = useDatastreamId();

  // Call ALL useQuery hooks unconditionally with proper enabled flags
  const messagingDatasetQuery = useDataset(eventDataset, !!eventDataset);
  const messagingSchemaId = extractSchemaFromDataset(messagingDatasetQuery.data);
  const messagingSchemaQuery = useSchema(
    messagingSchemaId,
    !!messagingSchemaId && !!messagingDatasetQuery.data
  );

  const datastreamQuery = useDatastream(datastreamId, !!datastreamId);
  const profileDatasetId = extractProfileDatasetId(datastreamQuery?.data?.data);
  const profileDatasetQuery = useDataset(profileDatasetId, !!profileDatasetId);

  const profileEntitiesQuery = useProfileEntities(ecid, !!ecid);
  const profileSchemaId = extractSchemaFromDataset(profileDatasetQuery.data);
  const profileSchemaQuery = useSchema(
    profileSchemaId,
    !!profileSchemaId && !!profileDatasetQuery.data
  );

  // STEP 2: Determine validation status based on data and loading states

  // Check if device is configured (has ECID and push token)
  const deviceConfigured = ecid && currentPushToken;
  console.log(deviceConfigured, '*********** deviceConfigured');
  if (!deviceConfigured) {
    return 'device-not-configured';
  }

  // Check if sandbox is available
  console.log(sandbox?.name, '*********** sandbox?.name');
  if (!sandbox?.name) {
    return 'no-sandbox';
  }

  // Check messaging configuration
  if (!eventDataset) {
    return 'messaging-not-configured';
  }

  // Check datastream loading and errors
  if (datastreamQuery.isLoading) {
    return 'loading';
  }
  if (datastreamQuery.error) {
    return 'sandbox-error';
  }

  // Check if profile dataset ID was extracted
  if (!profileDatasetId) {
    return 'no-profile-dataset';
  }

  // Check profile entities loading and errors
  if (profileEntitiesQuery.isLoading) {
    return 'loading';
  }

  if (profileEntitiesQuery.error) {
    return 'not-in-platform';
  }

  if (profileDatasetQuery.error) {
    if (profileDatasetQuery.error.message.includes('403')) {
      return 'no-dataset-access';
    }
    return 'invalid-dataset';
  }

  // Check profile dataset loading
  if (profileDatasetQuery.isLoading) {
    return 'loading';
  }

  if (!profileDatasetQuery.data) {
    return 'invalid-dataset';
  }

  // Check profile schema loading and errors
  if (profileSchemaQuery.isLoading) {
    return 'loading';
  }

  if (profileSchemaQuery.error || !profileSchemaQuery.data) {
    return 'invalid-schema';
  }

  // Validate profile schema has required mixins
  for (const requiredMixin of REQUIRED_PROFILE_MIXINS) {
    if (!profileSchemaQuery.data?.['meta:extends']?.includes(requiredMixin)) {
      return 'invalid-schema';
    }
  }

  // Check for push token mismatch
  const profilePushToken = extractProfilePushToken(profileEntitiesQuery.data, ecid);
  if (currentPushToken !== profilePushToken) {
    return 'token-mismatch';
  }

  // FINAL STEP: Validate tracking dataset status (as per original selectTrackingDatasetStatus)
  // This is done last to ensure all profile/platform validations pass first
  // before validating the messaging/tracking infrastructure
  const trackingValidationStatus = validateTrackingDatasetStatus(
    messagingDatasetQuery,
    messagingSchemaQuery
  );

  if (trackingValidationStatus !== false) {
    return trackingValidationStatus;
  }

  // All validations passed
  return false;
};

export default useDataStreamValidationStatus;
