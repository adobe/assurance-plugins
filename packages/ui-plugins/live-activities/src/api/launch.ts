export type Env = 'local' | 'dev' | 'qa' | 'stage' | 'prod';

const LAUNCH_ENDPOINTS: Record<Env, string> = {
  local: 'https://reactor.adobe.io',
  dev: 'https://reactor-qa.adobe.io',
  qa: 'https://reactor-stage.adobe.io',
  stage: 'https://reactor-stage.adobe.io',
  prod: 'https://reactor.adobe.io'
} as const;

export function getLaunchBaseUrl(env: string): string {
  return LAUNCH_ENDPOINTS[env as Env] || LAUNCH_ENDPOINTS['prod'];
}

export function buildLaunchHeaders({ token, org }: { token: string; org: string }): Record<string, string> {
  return {
    Accept: 'application/vnd.api+json;revision=1',
    'X-API-Key': 'Activation-DTM',
    Authorization: `Bearer ${token}`,
    'x-gw-ims-org-id': org,
    'content-type': 'application/vnd.api+json'
  };
}

export async function fetchProperty({
  baseUrl,
  propertyId,
  token,
  org
}: {
  baseUrl: string;
  propertyId: string;
  token: string;
  org: string;
}): Promise<any> {

  const url = `${baseUrl}/properties/${propertyId}`;
  const headers = buildLaunchHeaders({ token, org });
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const message = `Failed to fetch property: ${response.statusText}`;
    throw new Error(message);
  }
  
  const data = await response.json();
  return data;
}
