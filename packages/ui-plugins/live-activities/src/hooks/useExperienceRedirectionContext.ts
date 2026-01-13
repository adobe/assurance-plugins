import { useMemo } from 'react';
import { getPropertyId, getClientDataStream } from './useClientInfo';
import useLaunchProperty from './useLaunchProperty';
import {
  useEnvironmentValue,
  useImsOrg,
  useSandbox,
  useTenant
} from '@assurance/plugin-bridge-provider';
import { ENVIRONMENT_MAPPING } from '../utils/utils';

/**
 * Custom hook to provide all context needed for Experience Cloud redirection.
 * Returns: { propertyId, company, env, datastream, tenant, sandbox, org }
 */
export function useExperienceRedirectionContext() {
  const propertyId = getPropertyId();
  const property = useLaunchProperty(propertyId);
  const datastream = getClientDataStream();
  const sandbox = useSandbox();
  const org = useImsOrg();
  const tenant = useTenant();

  const env = useEnvironmentValue(ENVIRONMENT_MAPPING);

  // Extract company from property data (adjust path as needed)
  const company = useMemo(() => {
    const companyValue =
      property.data?.data?.attributes?.company ||
      property.data?.data.relationships.company.data.id ||
      '';
    return companyValue;
  }, [property.data]);

  return { propertyId, company, env, datastream, tenant, sandbox, org };
}
