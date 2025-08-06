import React from 'react';
import { View, Button, Flex, Heading } from '@adobe/react-spectrum';
import { getHealthIcon } from '../constants';

interface ShouldMatch {
  app: string;
  platform: string;
  propertyId?: string;
  orgId?: string;
}

interface PushCredentialsStatusDetailsProps {
  pushCredentialsStatus: string | boolean;
  shouldMatch: ShouldMatch;
  onManageApps: () => void;
  MSG: Record<string, string>;
  STATUS_DETAILS: Record<string, string>;
  serviceString: (platform: string) => string;
  chooseStatusDetails: (status: string | boolean) => string;
  chooseStatusMessage: (status: string | boolean) => string;
  onRefresh?: () => void;
  healthIconStatus?: string;
}

/**
 * Renders status details for push credentials based on the current status.
 * Uses only the provided data, no translation helpers.
 * Shows a Refresh button if onRefresh is provided.
 */
const PushCredentialsStatusDetails: React.FC<PushCredentialsStatusDetailsProps> = ({
  pushCredentialsStatus: status,
  shouldMatch,
  onManageApps,
  MSG,
  STATUS_DETAILS,
  serviceString,
  chooseStatusDetails,
  chooseStatusMessage,
  onRefresh,
  healthIconStatus
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

  console.log(chosenStatus, 'chosenStatus', status, details, healthIconStatus);

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
