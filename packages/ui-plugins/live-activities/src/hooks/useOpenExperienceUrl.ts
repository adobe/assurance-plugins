import { useCallback } from 'react';

import { getExperienceBaseUrl } from '../utils/utils';
import { useExperienceRedirectionContext } from './useExperienceRedirectionContext';

/**
 * Opens an Experience Cloud URL in a new tab based on the provided mode and context.
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.mode - The mode for redirection (e.g., 'edgeConfig', 'catalog', etc.).
 */
export function openExperienceUrl({
  mode,
  env,
  company,
  datastream,
  propertyId,
  tenant,
  sandbox
}: any) {
  const baseUrl = getExperienceBaseUrl(env);
  let url: string;
  switch (mode) {
    case 'edgeConfig':
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/scramjet/${datastream}`;
      break;
    case 'catalog':
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/tags/companies/${company}/properties/${propertyId}/extensions/catalog`;
      break;
    case 'environments':
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/tags/companies/${company}/properties/${propertyId}/environments`;
      break;
    case 'installed':
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/tags/companies/${company}/properties/${propertyId}/extensions/installed`;
      break;
    case 'publishing':
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/tags/companies/${company}/properties/${propertyId}/publishing`;
      break;
    default: // setupIos, setupAndroid, manage
      url = `${baseUrl}@${tenant}/sname:${sandbox.name}/data-collection/appSurfaces/companies/${company}/appSurfaces`;
      break;
  }
  window.open(url, '_blank');
}

/**
 * Hook that provides a function to open Experience Cloud URLs
 */
export function useOpenExperienceUrl() {
  const { env, company, datastream, propertyId, sandbox, tenant } =
    useExperienceRedirectionContext();

  const openExpUrl = useCallback(
    ({ mode }: any) => {
      openExperienceUrl({ mode, env, company, datastream, propertyId, tenant, sandbox });
    },
    [env, company, datastream, propertyId, tenant, sandbox]
  );

  return {
    openExpUrl
  };
}
