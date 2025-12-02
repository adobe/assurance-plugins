import {
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg
} from '@assurance/plugin-bridge-provider';
import { useQuery } from '@tanstack/react-query';

import { fetchProperty, getLaunchBaseUrl } from '../api/launch';
import { ENVIRONMENT_MAPPING } from '../utils/utils';

function useLaunchProperty(propertyId) {
  const token = useImsAccessToken();
  const org = useImsOrg();
  const env = useEnvironmentValue(ENVIRONMENT_MAPPING);
  const baseUrl = getLaunchBaseUrl(env);

  return useQuery({
    queryKey: ['launchProperty', propertyId, token, org, env],
    queryFn: () => {
      if (!token || !org || !propertyId) {
        console.error('Token, org, and propertyId are required', token, org, propertyId);
        return null;
      }
      return fetchProperty({ baseUrl, propertyId, token, org });
    },
    enabled: !!propertyId && !!token && !!org,
    refetchOnWindowFocus: false
  });
}

export default useLaunchProperty;
