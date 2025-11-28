import React from 'react';

import { Button, Flex, Heading, View } from '@adobe/react-spectrum';

import { getHealthIcon } from '../../constants';
import { useOpenExperienceUrl } from '../../hooks/useOpenExperienceUrl';

// Types
type PushCredentialsStatus =
  | 'device-not-configured'
  | 'error'
  | 'no-apps'
  | 'no-matching-app'
  | 'property-not-loaded'
  | 'loading'
  | false; // false = valid state

type HealthStatus = 'valid' | 'loading' | 'info' | 'invalid';

interface ShouldMatch {
  app: string;
  platform: string;
  propertyId?: string;
  orgId?: string;
}

interface PushCredentialsStatusDetailsProps {
  pushCredentialsStatus: PushCredentialsStatus | string | boolean;
  shouldMatch: ShouldMatch;
  onRefresh?: () => void;
}

// Constants
const BUTTON_LABELS = {
  appId: 'App ID',
  manageApps: 'Manage App Configurations',
  propertyId: 'Property ID',
  orgId: 'Org ID',
  service: 'Messaging Service',
  refresh: 'Refresh'
} as const;

const STATUS_MESSAGES = {
  'device-not-configured': 'Client Must Be Configured Correctly',
  error: 'App Configuration Error',
  'no-apps': 'No App Configurations',
  'no-matching-app': 'No Matching App Detected',
  'property-not-loaded': 'Property Not Found',
  loading: 'Loading...',
  false: 'Matching App Successfully Detected'
} as const;

const STATUS_DETAILS = {
  error:
    'There was a problem fetching the apps. This could be a temporary network issue or potentially a provisioning issue.',
  'no-apps': "You haven't created any App Configurations yet.",
  'no-matching-app':
    'There is not an App Configurations that matches the stored App ID and Platform for this App.',
  'property-not-loaded':
    'Could not load this property in Launch. Make sure that you are provisioned for Launch, that the property exists, and that it exists for the specified Org'
} as const;

const MESSAGES = {
  noAppsPara2: 'Make sure to create an App Configuration with the following details:',
  noMatchPara2: 'Make sure there is an App Configuration that matches the following details:',
  useTheFollowing: 'Use the following link to manage your App Configurations:'
} as const;

// Utility functions
const getHealthStatus = (status: PushCredentialsStatus | string | boolean): HealthStatus => {
  if (status === false) return 'valid';
  if (status === 'loading') return 'loading';
  if (status === 'device-not-configured') return 'info';
  return 'invalid';
};

const getStatusMessage = (status: PushCredentialsStatus | string | boolean): string => {
  return STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] || 'Something went wrong!';
};

const getStatusDetails = (status: PushCredentialsStatus | string | boolean): string => {
  return STATUS_DETAILS[status as keyof typeof STATUS_DETAILS] || '';
};

const getServiceName = (platform?: string): string => {
  return platform === 'apnsSandbox' || platform === 'apns'
    ? 'Apple Push Notification Service'
    : 'Firebase Cloud Messaging V1';
};

// Component for rendering status-specific details
const StatusDetailsRenderer: React.FC<{
  status: PushCredentialsStatus | string | boolean;
  shouldMatch: ShouldMatch;
  openExpUrl: (params: { mode: string }) => void;
}> = ({ status, shouldMatch, openExpUrl }) => {
  const renderNoAppsOrMatching = () => (
    <div>
      <div>{getStatusDetails(status)}</div>
      <div>{MESSAGES.useTheFollowing}</div>
      <View margin="size-200">
        <Button
          data-testid="manage"
          variant="secondary"
          onPress={() => openExpUrl({ mode: 'manage' })}
        >
          {BUTTON_LABELS.manageApps}
        </Button>
      </View>
      <div>{status === 'no-apps' ? MESSAGES.noAppsPara2 : MESSAGES.noMatchPara2}</div>
      <View margin="size-200">
        <div>
          {BUTTON_LABELS.appId}: {shouldMatch.app}
        </div>
        <div>
          {BUTTON_LABELS.service}: {getServiceName(shouldMatch.platform)}
        </div>
      </View>
    </div>
  );

  const renderPropertyNotLoaded = () => (
    <div>
      <div>{getStatusDetails(status)}</div>
      <View margin="size-200">
        <div data-testid="app-info-property">
          {BUTTON_LABELS.propertyId}: {shouldMatch.propertyId}
        </div>
        <div data-testid="app-info-orgId">
          {BUTTON_LABELS.orgId}: {shouldMatch.orgId}
        </div>
      </View>
    </div>
  );

  const renderDefaultDetails = () => {
    const statusDetails = getStatusDetails(status);
    return statusDetails ? <div>{statusDetails}</div> : null;
  };

  // Render status-specific details
  switch (status) {
    case 'no-apps':
      return renderNoAppsOrMatching();
    case 'no-matching-app':
      return renderNoAppsOrMatching();
    case 'property-not-loaded':
      return renderPropertyNotLoaded();
    default:
      return renderDefaultDetails();
  }
};

/**
 * Renders status details for push credentials based on the current status.
 */
const PushCredentialsStatusDetails: React.FC<PushCredentialsStatusDetailsProps> = ({
  pushCredentialsStatus: status,
  shouldMatch,
  onRefresh
}) => {
  const { openExpUrl } = useOpenExperienceUrl();

  const statusMessage = getStatusMessage(status);
  const healthStatus = getHealthStatus(status);

  return (
    <>
      <Flex gap="size-100" alignItems="center" marginTop="size-200">
        {getHealthIcon(healthStatus, 'L')}
        <Heading level={4}>{statusMessage}</Heading>
      </Flex>

      <View marginTop="size-200">
        <StatusDetailsRenderer status={status} shouldMatch={shouldMatch} openExpUrl={openExpUrl} />
      </View>

      {onRefresh && (
        <View marginTop="size-200">
          <Button variant="secondary" onPress={onRefresh} data-testid="refresh-push-credentials">
            {BUTTON_LABELS.refresh}
          </Button>
        </View>
      )}
    </>
  );
};

export default PushCredentialsStatusDetails;
