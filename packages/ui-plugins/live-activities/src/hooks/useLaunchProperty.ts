import { useQuery } from '@tanstack/react-query';
import { useImsAccessToken, useImsOrg, useEnvironmentValue, useSandbox } from '@assurance/plugin-bridge-provider';
import { getLaunchBaseUrl, fetchProperty } from '../api/launch';

function useLaunchProperty(propertyId) {
  const token = useImsAccessToken();
  const org = useImsOrg();
  const env = useEnvironmentValue({
    local: 'local',
    dev: 'dev',
    qa: 'qa',
    stage: 'stage',
    prod: 'prod'
  });
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
    enabled: !!propertyId && !!token && !!org
  });
}

export default useLaunchProperty;
