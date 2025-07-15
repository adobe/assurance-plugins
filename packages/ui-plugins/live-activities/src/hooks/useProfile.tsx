import {
  EnvironmentMap,
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg
} from '@assurance/plugin-bridge-provider';
import { useQuery } from '@tanstack/react-query';

interface Identity {
  namespace: {
    code: string;
  };
  id: string;
}

interface PushNotificationDetail {
  denylisted: boolean;
  token: string;
  identity: Identity;
  platform: string;
  appID: string;
}

interface ExtSourceSystemAudit {
  lastUpdatedDate: string;
}

interface ConsentValue {
  val: string;
}

interface MarketingConsent {
  preferred: string;
  push: ConsentValue;
}

interface ConsentDetails {
  marketing: MarketingConsent;
}

interface IdSpecificConsents {
  ECID: {
    [ecid: string]: ConsentDetails;
  };
}

interface ConsentMetadata {
  time: string;
}

interface Consents {
  metadata: ConsentMetadata;
  idSpecific: IdSpecificConsents;
}

interface IdentityMapEntry {
  id: string;
}

interface IdentityMap {
  ecid: IdentityMapEntry[];
}

interface UserActivityRegion {
  captureTimestamp: string;
}

interface UserActivityRegions {
  [region: string]: UserActivityRegion;
}

interface ProfileEntity {
  pushNotificationDetails: PushNotificationDetail[];
  extSourceSystemAudit: ExtSourceSystemAudit;
  consents: Consents;
  identityMap: IdentityMap;
  userActivityRegions: UserActivityRegions;
  consentPoliciesIDMap: Record<string, unknown>;
}

interface MergePolicy {
  id: string;
}

interface ProfileApiResponse {
  entityId: string;
  mergePolicy: MergePolicy;
  sources: string[];
  tags: string[];
  identityGraph: string[];
  entity: ProfileEntity;
  lastModifiedAt: string;
}

interface ProfileParams {
  baseUrl: string;
  ecid: string;
  org: string;
  sandbox: string;
  token: string;
}

const getProfile = async ({
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
        'x-gw-ims-org-id': org
      }
    }
  );
  const data: ProfileApiResponse = await response.json();
  if (!Object.keys(data).length) {
    return null;
  }

  console.log('data here', Object.values(data)[0]);

  return Object.values(data)[0];
};

const baseUrls: EnvironmentMap<string> = {
  local: 'https://platform.adobe.io',
  dev: 'https://platform-stage.adobe.io',
  qa: 'https://platform-stage.adobe.io',
  stage: 'https://platform.adobe.io',
  prod: 'https://platform.adobe.io'
};

function useProfile() {
  // const ecid = useECID();
  // const sandbox = useSandbox();
  const ecid = '90296481826512371504715314516119412966';
  const sandbox = '6127f081-1509-4c77-a7f0-811509cc7732';
  const baseUrl = useEnvironmentValue(baseUrls);

  const token = useImsAccessToken();
  const org = useImsOrg();

  return useQuery({
    queryKey: ['profile', ecid],
    queryFn: () => {
      if (!token || !org || !ecid || !sandbox) {
        console.error('Token, org, ecid, and sandbox are required', token, org, ecid, sandbox);
        return null;
      }
      return getProfile({ baseUrl, ecid, org, sandbox: sandbox, token });
    }
  });
}

export default useProfile;
