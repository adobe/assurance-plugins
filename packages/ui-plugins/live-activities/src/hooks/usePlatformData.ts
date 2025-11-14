import {
  EnvironmentMap,
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg,
  useSandbox
} from '@assurance/plugin-bridge-provider';
import { useQuery } from '@tanstack/react-query';

// Platform endpoints for each environment
const ENDPOINTS: EnvironmentMap<string> = {
  local: 'https://platform.adobe.io/',
  dev: 'https://platform-stage.adobe.io/',
  qa: 'https://platform-stage.adobe.io/',
  stage: 'https://platform.adobe.io/',
  prod: 'https://platform.adobe.io/'
};

// Types for platform API responses
interface PlatformEntityResponse {
  entity?: any;
  // Add more specific types as needed
}

interface PlatformDatasetResponse {
  // Define dataset response structure
  [key: string]: any;
}

interface PlatformSchemaResponse {
  // Define schema response structure
  [key: string]: any;
}

// Standard request processor that adds authentication headers
const standardProcessor = (token: string, org: string) => {
  return {
    headers: {
      'x-api-key': 'Activation-DTM',
      Authorization: `Bearer ${token}`,
      'x-gw-ims-org-id': org
    }
  };
};

// Sandbox processor that adds sandbox header
const sandboxProcessor = (token: string, org: string, sandbox: string, baseURL: string) => {
  const standard = standardProcessor(token, org);

  return {
    baseURL,
    headers: {
      ...standard.headers,
      'x-sandbox-name': sandbox
    }
  };
};

// Schema processor that adds schema-specific headers
const schemaProcessor = (token: string, org: string, sandbox: string, baseURL: string) => {
  const sandboxConfig = sandboxProcessor(token, org, sandbox, baseURL);

  return {
    ...sandboxConfig,
    headers: {
      ...sandboxConfig.headers,
      Accept: 'application/vnd.adobe.xed+json; version=1'
    }
  };
};

// API functions
async function fetchPlatformEntity({
  baseURL,
  token,
  org,
  sandbox,
  ecid
}: {
  baseURL: string;
  token: string;
  org: string;
  sandbox: string;
  ecid: string;
}): Promise<PlatformEntityResponse> {
  const config = sandboxProcessor(token, org, sandbox, baseURL);
  const url = `${config.baseURL}data/core/ups/access/entities?entityId=${ecid}&entityIdNS=ECID&schema.name=_xdm.context.profile&sandbox=${sandbox}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch entity: ${response.statusText}`);
  }

  return response.json();
}

async function fetchPlatformDataset({
  baseURL,
  token,
  org,
  sandbox,
  datasetId
}: {
  baseURL: string;
  token: string;
  org: string;
  sandbox: string;
  datasetId: string;
}): Promise<PlatformDatasetResponse> {
  const config = sandboxProcessor(token, org, sandbox, baseURL);
  const url = `${config.baseURL}data/foundation/catalog/datasets/${datasetId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.statusText}`);
  }

  return response.json();
}

async function fetchPlatformSchema({
  baseURL,
  token,
  org,
  sandbox,
  schemaId
}: {
  baseURL: string;
  token: string;
  org: string;
  sandbox: string;
  schemaId: string;
}): Promise<PlatformSchemaResponse> {
  const config = schemaProcessor(token, org, sandbox, baseURL);
  const url = `${config.baseURL}data/foundation/schemaregistry/tenant/schemas/${schemaId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.statusText}`);
  }

  return response.json();
}

// Hook for fetching platform entity data
export function usePlatformEntity(ecid?: string) {
  const baseURL = useEnvironmentValue(ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['platform', 'entity', ecid, token, org, sandbox?.name],
    queryFn: () => {
      if (!token || !org || !sandbox?.name || !ecid) {
        return null;
      }

      return fetchPlatformEntity({
        baseURL,
        token,
        org,
        sandbox: sandbox.name,
        ecid
      });
    },
    enabled: !!token && !!org && !!sandbox?.name && !!ecid,
    refetchOnWindowFocus: false
  });
}

// Hook for fetching platform dataset data
export function usePlatformDataset(datasetId?: string) {
  const baseURL = useEnvironmentValue(ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['platform', 'dataset', datasetId, token, org, sandbox?.name],
    queryFn: () => {
      if (!token || !org || !sandbox?.name || !datasetId) {
        return null;
      }

      return fetchPlatformDataset({
        baseURL,
        token,
        org,
        sandbox: sandbox.name,
        datasetId
      });
    },
    enabled: !!token && !!org && !!sandbox?.name && !!datasetId,
    retry: 1,
    refetchOnWindowFocus: false
  });
}

// Hook for fetching platform schema data
export function usePlatformSchema(schemaId?: string) {
  const baseURL = useEnvironmentValue(ENDPOINTS);
  const token = useImsAccessToken();
  const org = useImsOrg();
  const sandbox = useSandbox();

  return useQuery({
    queryKey: ['platform', 'schema', token, schemaId, org, sandbox?.name],
    queryFn: () => {
      if (!token || !org || !sandbox?.name || !schemaId) {
        return null;
      }

      return fetchPlatformSchema({
        baseURL,
        token,
        org,
        sandbox: sandbox.name,
        schemaId
      });
    },
    enabled: !!token && !!org && !!sandbox?.name && !!schemaId,
    retry: 1,
    refetchOnWindowFocus: false
  });
}

// Default export for backward compatibility - you can use any of the three hooks above
export default usePlatformEntity;
