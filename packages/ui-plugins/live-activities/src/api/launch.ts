const LAUNCH_ENDPOINTS = {
  local: 'https://reactor.adobe.io',
  dev: 'https://reactor-qe.adobe.io',
  qa: 'https://reactor-qe.adobe.io',
  stage: 'https://reactor-integration.adobe.io',
  prod: 'https://reactor.adobe.io'
};

export function getLaunchBaseUrl(env) {
  return LAUNCH_ENDPOINTS[env] || LAUNCH_ENDPOINTS['prod'];
}

export function buildLaunchHeaders({ token, org }) {
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
}) {
  const url = `${baseUrl}/properties/${propertyId}`;
  const headers = buildLaunchHeaders({ token, org });
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
