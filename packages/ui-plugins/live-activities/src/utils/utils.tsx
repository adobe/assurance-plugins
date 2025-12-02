import React from 'react';

import { UnknownBadge } from '../components/atoms/UnknownBadge';

// Environment mapping constant used across multiple components
export const ENVIRONMENT_MAPPING = {
  local: 'local',
  dev: 'dev',
  qa: 'qa',
  stage: 'stage',
  prod: 'prod'
} as const;

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
 * Helper to compute Experience Cloud base URL by environment
 */
export function getExperienceBaseUrl(env: string = 'prod') {
  const BASE_URL: Record<string, string> = {
    local: 'https://experience-qa.adobe.com/',
    dev: 'https://experience-qa.adobe.com/',
    qa: 'https://experience-qa.adobe.com/',
    stage: 'https://experience-stage.adobe.com/',
    prod: 'https://experience.adobe.com/'
  };
  return BASE_URL[env];
}

/**
 * Opens a profile URL in a new tab
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.env - The environment.
 * @param {Object} params.sandbox - The sandbox object.
 * @param {string} params.profileId - The profile ID.
 */
export function openProfileUrl({ env, sandbox, profileId }: any) {
  const baseUrl = getExperienceBaseUrl(env);
  const url = `${baseUrl}sname:${sandbox.name}/platform/profile/browse/${profileId}`;
  window.open(url, '_blank');
}

/**
 * Opens a tracking schema URL in a new tab
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.env - The environment.
 * @param {Object} params.sandbox - The sandbox object.
 * @param {string} params.messagingSchemaId - The messaging schema ID.
 */
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

/**
 * Opens a profile schema URL in a new tab
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.env - The environment.
 * @param {Object} params.sandbox - The sandbox object.
 * @param {string} params.profileSchemaId - The profile schema ID.
 */
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

/**
 * Opens a help URL in a new tab based on the provided mode.
 * @param {Object} params - The parameters for URL construction.
 * @param {string} params.mode - The mode for help redirection (e.g., 'setupIos', 'setupAndroid').
 */
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
