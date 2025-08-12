import {
  EnvironmentMap,
  useClients,
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg,
  useSandbox
} from '@assurance/plugin-bridge-provider';
import { useQuery } from '@tanstack/react-query';
import useSelectedClientId from './useSelectedClientId';

// Endpoints for each environment
const baseUrls: EnvironmentMap<string> = {
  local: 'https://exc-unifiedcontent.experience.adobe.net/',
  dev: 'https://exc-unifiedcontent.experience-stage.adobe.net/',
  qa: 'https://exc-unifiedcontent.experience-stage.adobe.net/',
  stage: 'https://exc-unifiedcontent.experience.adobe.net/',
  prod: 'https://exc-unifiedcontent.experience.adobe.net/'
};

// Types for the API response (partial, expand as needed)
interface PushCredentialAttributes {
  app_id: string;
  name: string;
  platform: string;
  messaging_service: string;
  key_type: string;
  created_at: string;
  created_by_display_name: string;
  created_by_email: string;
  updated_at: string;
  updated_by_display_name: string;
  updated_by_email: string;
  sandbox_name: string;
}

interface PushCredentialData {
  id: string;
  type: string;
  attributes: PushCredentialAttributes;
}

interface PushCredentialsApiResponse {
  data: PushCredentialData[];
  links?: any;
}

interface PushCredentialsQueryResponse {
  getPushCredentials: PushCredentialsApiResponse;
}

// Function to call the push credentials API
async function getPushCredentials({
  baseUrl,
  org,
  token,
  sandboxName,
  messagingService = 'apns'
}: {
  baseUrl: string;
  org: string;
  token: string;
  sandboxName: string;
  messagingService?: string;
}) {
  // GraphQL query as per the provided comment
  const sandbox = sandboxName;

  console.log(messagingService, sandbox, 'messagingService, sandbox ***');
  const body = JSON.stringify({
    query: `query getPushCredentials($params: String) {\n  getPushCredentials(params: $params) {\n    data {\n      id\n      type\n      attributes {\n        app_id\n        name\n        platform\n        messaging_service\n        key_type\n        created_at\n        created_by_display_name\n        created_by_email\n        updated_at\n        updated_by_display_name\n        updated_by_email\n        sandbox_name\n      }\n    }\n    links\n  }\n}`,
    variables: {
      params: encodeURI(
        `filter[messaging_service]=EQ ${messagingService}&page[size]=100&[sandbox_name]=EQ ${sandbox || null}`
      )
    },
    sandboxName
  });

  const response = await fetch(`${baseUrl}api/gql/app/cjm-configui/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-api-key': 'exc_app',
      'x-gw-ims-org-id': org
    },
    body
  });
  const json = await response.json();
  // Return the relevant data
  return json.data?.getPushCredentials || null;
}

/**
 * React hook to fetch push credentials using the current environment, org, token, and sandbox.
 * Returns the query result from react-query.
 */
function usePushCredentialsData() {
  const baseUrl = useEnvironmentValue(baseUrls);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  const selectedClientId = useSelectedClientId();
  const clients = useClients();

  const selectedClient = clients.find(client => client.clientId === selectedClientId);

  const messagingService =
    selectedClient?.payload?.deviceInfo?.['Canonical platform name'] === 'iOS' ? 'apns' : 'fcm';

  console.log(
    { selectedClientId, clients, selectedClient, messagingService },
    'selectedClientId, clients, selectedClient'
  );

  return useQuery({
    queryKey: ['pushCredentials', org, token, sandbox?.name],
    queryFn: () => {
      if (!token || !org || !sandbox?.name) {
        console.error('Token, org, and sandbox are required', token, org, sandbox);
        return null;
      }

      console.log('refetching', { sandboxName: sandbox?.name, org, token });
      return getPushCredentials({
        baseUrl,
        org,
        token,
        sandboxName: sandbox?.name,
        messagingService
      });
    },
    enabled: !!token && !!org && !!sandbox?.name,
    refetchOnWindowFocus: false
  });
}

export default usePushCredentialsData;
