import {
  useEnvironmentValue,
  useImsAccessToken,
  useImsOrg,
  useSandbox
} from '@assurance/plugin-bridge-provider';
import { useQuery } from '@tanstack/react-query';
import { useECID } from './useClientInfo';
import { getProfile, getProfileBaseUrl } from '../api/profile';

function useProfile() {
  const ecid = useECID();
  const sandbox = useSandbox();
  const baseUrl = getProfileBaseUrl(useEnvironmentValue);

  const token = useImsAccessToken();
  const org = useImsOrg();

  return useQuery({
    queryKey: ['profile', ecid, org, token, sandbox?.name],
    queryFn: () => {
      if (!token || !org || !ecid || !sandbox?.name) {
        console.error('Token, org, ecid, and sandbox are required', token, org, ecid, sandbox);
        return null;
      }
      return getProfile({ baseUrl, ecid, org, sandbox: sandbox?.name, token });
    },
    enabled: !!token && !!org && !!ecid && !!sandbox?.name,
    refetchOnWindowFocus: false
  });
}

export default useProfile;
