import React from 'react';
import { View, Button, Flex, Heading } from '@adobe/react-spectrum';
import { getHealthIcon } from '../../constants';

interface ShouldMatch {
  app: string;
  platform: string;
  propertyId?: string;
  orgId?: string;
}

interface PushCredentialsStatusDetailsProps {
  pushCredentialsStatus: string | boolean;
  shouldMatch: ShouldMatch;
  onRefresh?: () => void;
}

// Messages & constants
const MSG = {
  appId: 'App ID',
  manageApps: 'Manage App Configurations',
  propertyId: 'Property ID',
  orgId: 'Org ID',
  service: 'Messaging Service'
} as const;

const STATUS_MESSAGE: Record<string, string> = {
  'device-not-configured': 'Client Must Be Configured Correctly',
  error: 'App Configuration Error',
  'no-apps': 'No App Configurations',
  'no-matching-app': 'No Matching App Detected',
  'property-not-loaded': 'Property Not Found',
  valid: 'Matching App Successfully Detected'
};

const STATUS_DETAILS: Record<string, string> = {
  error:
    'There was a problem fetching the apps. This could be a temporary network issue or potentially a provisioning issue.',
  noAppsPara1: "You haven't created any App Configurations yet.",
  noAppsPara2: 'Make sure to create an App Configuration with the following details:',
  noMatchPara1:
    'There is not an App Configurations that matches the stored App ID and Platform for this App.',
  noMatchPara2: 'Make sure there is an App Configuration that matches the following details:',
  useTheFollowing: 'Use the following link to manage your App Configurations:',
  noPropertyPara1:
    'Could not load this property in Launch. Make sure that you are provisioned for Launch, that the property exists, and that it exists for the specified Org'
};

// Utility functions
const chooseStatus = (status: string | boolean): string => {
  if (status === false) return 'valid';
  if (status === 'loading') return 'loading';
  if (status === 'device-not-configured') return 'info';
  return 'invalid';
};

const chooseStatusMessage = (status: string | boolean): string => {
  if (status === false) return STATUS_MESSAGE.valid;
  const key = String(status);
  return STATUS_MESSAGE[key] || 'Something went wrong!';
};

const chooseStatusDetails = (status: string | boolean): string => {
  const key = String(status);
  return STATUS_DETAILS[key] || '';
};

const serviceString = (platform?: string) =>
  platform === 'apnsSandbox' || platform === 'apns'
    ? 'Apple Push Notification Service'
    : 'Firebase Cloud Messaging V1';

const onManageApps = () => {
  window.open('https://experience.adobe.com/#/apps/configurations', '_blank');
};

/**
 * Renders status details for push credentials based on the current status.
 */
const PushCredentialsStatusDetails: React.FC<PushCredentialsStatusDetailsProps> = ({
  pushCredentialsStatus: status,
  shouldMatch,
  onRefresh
}) => {
  let details: React.ReactNode;

  if (status === 'no-apps' || status === 'no-matching-app') {
    details = (
      <div>
        <div>{status === 'no-apps' ? STATUS_DETAILS.noAppsPara1 : STATUS_DETAILS.noMatchPara1}</div>
        <div>{STATUS_DETAILS.useTheFollowing}</div>
        <View margin="size-200">
          <Button data-testid="manageApps" variant="secondary" onPress={onManageApps}>
            {MSG.manageApps}
          </Button>
        </View>
        <div>{status === 'no-apps' ? STATUS_DETAILS.noAppsPara2 : STATUS_DETAILS.noMatchPara2}</div>
        <View margin="size-200">
          <div>
            {MSG.appId}: {shouldMatch.app}
          </div>
          <div>
            {MSG.service}: {serviceString(shouldMatch.platform)}
          </div>
        </View>
      </div>
    );
  } else if (status === 'property-not-loaded') {
    details = (
      <div>
        <div>{STATUS_DETAILS.noPropertyPara1}</div>
        <View margin="size-200">
          <div data-testid="app-info-property">
            {MSG.propertyId}: {shouldMatch.propertyId}
          </div>
          <div data-testid="app-info-orgId">
            {MSG.orgId}: {shouldMatch.orgId}
          </div>
        </View>
      </div>
    );
  } else {
    details = <div>{chooseStatusDetails(status)}</div>;
  }

  const chosenStatus = chooseStatusMessage(status);
  const healthIconStatus = chooseStatus(status);

  return (
    <React.Fragment>
      <Flex gap="size-100" alignItems="center" marginTop="size-200">
        {getHealthIcon(healthIconStatus, 'L')}
        <Heading level={4}>{chosenStatus}</Heading>
      </Flex>
      {details && <View marginTop="size-200">{details}</View>}

      {onRefresh && (
        <View marginTop="size-200">
          <Button variant="primary" onPress={onRefresh} data-testid="refresh-push-credentials">
            Refresh
          </Button>
        </View>
      )}
    </React.Fragment>
  );
};

export default PushCredentialsStatusDetails;
