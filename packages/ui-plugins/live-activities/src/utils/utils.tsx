import React from 'react';
import { UnknownBadge } from '../components/atoms/UnknownBadge';
import { useMemo } from 'react';
import { getPropertyId, getClientDataStream } from '../hooks/useClientInfo';
import useLaunchProperty from '../hooks/useLaunchProperty';
import { useEnvironmentValue } from '@assurance/plugin-bridge-provider';

/**
 * Utility function to render values with proper fallback handling.
 * @param value - The value to render
 * @returns Rendered value or UnknownBadge for null/undefined values
 */
export function renderValue(value: any): React.ReactNode {
  if (value == null || value === 'N/A') {
    return <UnknownBadge />;
  }
  return String(value);
}

/**
 * Custom hook to provide all context needed for Experience Cloud redirection.
 * Returns: { propertyId, company, env, datastream }
 */
function useExperienceRedirectionContext() {
  const propertyId = getPropertyId();
  const property = useLaunchProperty(propertyId);
  const datastream = getClientDataStream();
  const env = useEnvironmentValue({
    local: 'local',
    dev: 'dev',
    qa: 'qa',
    stage: 'stage',
    prod: 'prod'
  });

  // Print the full property data for debugging
  console.log('[useExperienceRedirectionContext] property.data:', property.data);

  // Extract company from property data (adjust path as needed)
  const company = useMemo(() => {
    const companyValue = property.data?.data?.attributes?.company || '';
    console.log('[useExperienceRedirectionContext] company:', companyValue);
    return companyValue;
  }, [property.data]);

  console.log('[useExperienceRedirectionContext] propertyId:', propertyId);
  console.log('[useExperienceRedirectionContext] datastream:', datastream);
  console.log('[useExperienceRedirectionContext] env:', env);

  return { propertyId, company, env, datastream };
}

/**
 * Opens an Experience Cloud URL in a new tab based on the provided mode and context.
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.mode - The mode for redirection (e.g., 'edgeConfig', 'catalog', etc.).
 */
export function openExperienceUrl({ mode }) {
  const { env, company, datastream, propertyId } = useExperienceRedirectionContext();
  console.log('[openExperienceUrl] mode:', mode);
  console.log('[openExperienceUrl] env:', env);
  console.log('[openExperienceUrl] company:', company);
  console.log('[openExperienceUrl] datastream:', datastream);
  console.log('[openExperienceUrl] propertyId:', propertyId);
  const BASE_URL = {
    local: 'https://experience-qa.adobe.com/',
    dev: 'https://experience-qa.adobe.com/',
    qa: 'https://experience-qa.adobe.com/',
    stage: 'https://experience-stage.adobe.com/?shell_ims=prod#/',
    prod: 'https://experience.adobe.com/'
  };
  const baseUrl = BASE_URL[env] || BASE_URL['prod'];
  let url: string;
  switch (mode) {
    case 'edgeConfig':
      url = `${baseUrl}data-collection/scramjet/${datastream}`;
      break;
    case 'catalog':
      url = `${baseUrl}launch/companies/${company}/properties/${propertyId}/extensions/catalog`;
      break;
    case 'environments':
      url = `${baseUrl}launch/companies/${company}/properties/${propertyId}/environments`;
      break;
    case 'installed':
      url = `${baseUrl}launch/companies/${company}/properties/${propertyId}/extensions/installed`;
      break;
    case 'publishing':
      url = `${baseUrl}launch/companies/${company}/properties/${propertyId}/publishing`;
      break;
    default:
      url = `${baseUrl}data-collection/appSurfaces/companies/${company}/appSurfaces`;
      break;
  }
  console.log('[openExperienceUrl] final url:', url);
  window.open(url, '_blank');
}