import { EnvironmentMap } from '@assurance/plugin-bridge-provider';

export interface Identity {
  namespace: {
    code: string;
  };
  id: string;
}

export interface PushNotificationDetail {
  denylisted: boolean;
  token: string;
  identity: Identity;
  platform: string;
  appID: string;
}

export interface LiveActivityPushNotificationDetail {
  token: string;
  identity: Identity;
  platform: string;
  appID: string;
  attributeType: string;
  denylisted: boolean;
}

export interface ExtSourceSystemAudit {
  lastUpdatedDate: string;
}

export interface ConsentValue {
  val: string;
}

export interface MarketingConsent {
  preferred: string;
  push: ConsentValue;
}

export interface ConsentDetails {
  marketing: MarketingConsent;
}

export interface IdSpecificConsents {
  ECID: {
    [ecid: string]: ConsentDetails;
  };
}

export interface ConsentMetadata {
  time: string;
}

export interface Consents {
  metadata: ConsentMetadata;
  idSpecific: IdSpecificConsents;
}

export interface IdentityMapEntry {
  id: string;
}

export interface IdentityMap {
  ecid: IdentityMapEntry[];
}

export interface UserActivityRegion {
  captureTimestamp: string;
}

export interface UserActivityRegions {
  [region: string]: UserActivityRegion;
}

export interface ProfileEntity {
  pushNotificationDetails: PushNotificationDetail[];
  liveActivityPushNotificationDetails?: LiveActivityPushNotificationDetail[];
  extSourceSystemAudit: ExtSourceSystemAudit;
  consents: Consents;
  identityMap: IdentityMap;
  userActivityRegions: UserActivityRegions;
  consentPoliciesIDMap: Record<string, unknown>;
}

export interface MergePolicy {
  id: string;
}

export interface ProfileApiResponse {
  entityId: string;
  mergePolicy: MergePolicy;
  sources: string[];
  tags: string[];
  identityGraph: string[];
  entity: ProfileEntity;
  lastModifiedAt: string;
}

export interface ProfileParams {
  baseUrl: string;
  ecid: string;
  org: string;
  sandbox: string;
  token: string;
}

const profileBaseUrls: EnvironmentMap<string> = {
  local: 'https://platform.adobe.io',
  dev: 'https://platform-stage.adobe.io',
  qa: 'https://platform-stage.adobe.io',
  stage: 'https://platform-stage.adobe.io',
  prod: 'https://platform.adobe.io'
};

export function getProfileBaseUrl(useEnvironmentValue: (map: EnvironmentMap<string>) => string) {
  return useEnvironmentValue(profileBaseUrls);
}

export const getProfile = async ({
  baseUrl,
  ecid,
  org,
  sandbox,
  token
}: ProfileParams): Promise<ProfileApiResponse | null> => {
  const response = await fetch(
    `${baseUrl}/data/core/ups/access/entities?entityId=${ecid}&entityIdNS=ECID&schema.name=_xdm.context.profile&sandbox=${sandbox}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': 'Activation-DTM',
        'x-gw-ims-org-id': org,
        'x-sandbox-name': sandbox
      }
    }
  );
  const data: ProfileApiResponse = await response.json();
  if (!Object.keys(data).length) {
    return null;
  }
  return Object.values(data)[0];
};
