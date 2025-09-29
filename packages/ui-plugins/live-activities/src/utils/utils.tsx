import React, { useMemo, useCallback } from 'react';
import { UnknownBadge } from '../components/atoms/UnknownBadge';
import { getPropertyId, getClientDataStream } from '../hooks/useClientInfo';
import useLaunchProperty from '../hooks/useLaunchProperty';
import {
  useEnvironmentValue,
  useImsOrg,
  useSandbox,
  useTenant
} from '@assurance/plugin-bridge-provider';

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
  const sandbox = useSandbox();
  const org = useImsOrg();
  const tenant = useTenant();

  const env = useEnvironmentValue({
    local: 'local',
    dev: 'dev',
    qa: 'qa',
    stage: 'stage',
    prod: 'prod'
  });

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

// /**
//  * Opens an Experience Cloud URL in a new tab based on the provided mode and context.
//  * @param {Object} params - The parameters for URL construction.
//  * @param {string} params.mode - The mode for redirection (e.g., 'edgeConfig', 'catalog', etc.).
//  */
export function openExperienceUrl({
  mode,
  env,
  company,
  datastream,
  propertyId,
  tenant,
  sandbox
}: any) {
  const BASE_URL = {
    local: 'https://experience-qa.adobe.com/',
    dev: 'https://experience-qa.adobe.com/',
    qa: 'https://experience-qa.adobe.com/',
    stage: 'https://experience-stage.adobe.com/',
    prod: 'https://experience.adobe.com/'
  };
  const baseUrl = BASE_URL[env] || BASE_URL['prod'];
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
      console.log(url, 'url made ********insallleddd');
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

export function openHelpUrl({ mode }: any) {
  let url: string | undefined;

  if (mode === 'setupIos') {
    url =
      'https://developer.apple.com/documentation/usernotifications/asking_permission_to_use_notifications';
  } else if (mode === 'setupAndroid') {
    url = 'https://firebase.google.com/docs/cloud-messaging/android/client';
  }

  if (url) {
    window.open(url, '_blank');
  }
}

// Helper to compute Experience Cloud base URL by environment
function getExperienceBaseUrl(env: string) {
  const BASE_URL: Record<string, string> = {
    local: 'https://experience-qa.adobe.com/',
    dev: 'https://experience-qa.adobe.com/',
    qa: 'https://experience-qa.adobe.com/',
    stage: 'https://experience-stage.adobe.com/',
    prod: 'https://experience.adobe.com/'
  };
  return BASE_URL[env] || BASE_URL['prod'];
}

export function openProfileUrl({ env, sandbox, profileId }: any) {
  const baseUrl = getExperienceBaseUrl(env);
  const url = `${baseUrl}sname:${sandbox.name}/platform/profile/browse/${profileId}`;
  window.open(url, '_blank');
}

export const onOpenTrackingSchema = ({
  env,
  sandbox,
  messagingSchemaId
}: {
  env: string;
  sandbox: any;
  messagingSchemaId?: string;
}) => {
  const baseUrl = getExperienceBaseUrl(env);
  const url = `${baseUrl}sname:${sandbox.name}/data-collection/platform/schema/browse/${encodeURIComponent(
    messagingSchemaId || ''
  )}`;
  window.open(url, '_blank');
};

export const onOpenSchema = ({
  env,
  sandbox,
  profileSchemaId
}: {
  env: string;
  sandbox: any;
  profileSchemaId?: string;
}) => {
  const baseUrl = getExperienceBaseUrl(env);
  const url = `${baseUrl}sname:${sandbox.name}/data-collection/platform/schema/browse/${encodeURIComponent(
    profileSchemaId || ''
  )}`;
  window.open(url, '_blank');
};
