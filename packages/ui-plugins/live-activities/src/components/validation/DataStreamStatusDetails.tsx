import React from 'react';
import { View, Button, Flex, Heading, Text, ProgressCircle } from '@adobe/react-spectrum';
import { getHealthIcon } from '../../constants';

interface DataStreamStatusDetailsProps {
  status: string | boolean;
}

const MSG = {
  viewInstalled: 'View Installed Extensions',
  viewEdge: 'View Edge Configuration',
  viewSchema: 'View Profile Schema',
  viewTrackingSchema: 'View Tracking Schema'
};

const STATUS_MESSAGE: Record<string, string> = {
  'device-not-configured': 'Client Must Be Configured Correctly',
  'no-sandbox': "Couldn't Detect Sandbox",
  'not-in-platform': 'Credentials Not Found',
  'no-dataset-access': 'Permissions Error',
  'token-mismatch': 'Push Token Mismatch',
  'deny-listed': 'Push Credentials on Deny List',
  'invalid-dataset': 'Invalid Dataset',
  'sandbox-error': 'Invalid Edge Configuration',
  'invalid-schema': 'Invalid Dataset Schema',
  'invalid-messaging-dataset': 'Invalid Message Tracking Dataset',
  'missing-messaging-dataset': 'Missing Message Tracking Dataset',
  'no-profile-dataset': 'Missing Profile Dataset',
  valid: 'Push Data Received By Platform'
};

const STATUS_DETAILS: Record<string, string> = {
  'no-sandbox':
    "The sandbox is pulled out of the Edge Streaming Validation events. It's possible events aren't making it to the Platform yet. Check and make sure the Platform has been set up correctly.",
  'not-in-platform': 'No matching profile with this ECID was found on the Platform.',
  'token-mismatch':
    'The push token stored in this profile does not match the push token on the device.',
  'no-dataset-access':
    'Your user does not have permission to access Platform information. Make sure you\'ve been provisioned for the Platform and have access to the sandbox named "{sandbox}".'
};

const MESSAGES = {
  noEdgeInvalid:
    'It appears the Edge Configuration for this extension is invalid. Make sure that the datastreams are valid.',
  noEdgePara3Pre: "Finally, make sure you aren't overriding the",
  noEdgePara3Post: 'configuration value in your app code.',
  noProfilePara1:
    'The Edge Configuration chosen for this property does not have a profile dataset selected. Sending a test push message with AJO requires a profile dataset.',
  noProfileButton1: 'View Edge Configuration',
  invalidDsPara1:
    "It appears the Profile Dataset for this extension is invalid. Make sure that the dataset you've chosen in the Edge Configuration is still valid:",
  denyListPara1:
    'The push token for this profile has been added to the Deny List. You cannot send messages to it. This could be because:',
  denyListOption1: 'The user uninstalled the app after this token was sent',
  denyListOption2: 'The user disabled push notifications for the app',
  missingDatasetPara1:
    'The dataset you are using for event tracking appears to not exist. Check your configuration and make sure the Dataset selected still exists.',
  missingDatasetPara2Pre: "Finally, make sure you aren't overriding the",
  missingDatasetPara2Post: 'configuration value in your app code.',
  invalidMessagingDatasetPara1:
    'The dataset used for message tracking requires the following mixins: ',
  invalidMessagingDatasetPara2: "Please make sure the dataset you've chosen includes these mixins.",
  invalidSchemaPara1:
    'For messaging, the "pushNotificationDetails" and "identityMap" mixins are required for the profile dataset. Please make sure the profile you\'ve configured has these mixins.'
};

const chooseStatus = (status: string | boolean) => {
  if (!status) return 'valid';
  if (status === 'loading') return 'loading';
  if (status === 'device-not-configured') return 'info';
  return 'warning';
};

const chooseStatusMessage = (status: string | boolean) =>
  !status ? STATUS_MESSAGE.valid : STATUS_MESSAGE[status as string] || '';

const chooseStatusDetails = (status: string | boolean) => STATUS_DETAILS[status as string];

const onManageApps = () => {
  window.open('https://experience.adobe.com/#/apps/configurations', '_blank');
};

// Data Stream Status callback handlers
const onOpenEdgeConfig = () => {
  window.open('https://experience.adobe.com/#/data-collection/datastreams', '_blank');
};

const onOpenInstalled = () => {
  window.open('https://experience.adobe.com/#/apps/configurations', '_blank');
};

const onOpenSchema = () => {
  window.open('https://experience.adobe.com/#/data-management/schemas', '_blank');
};

const onOpenTrackingSchema = () => {
  window.open('https://experience.adobe.com/#/data-management/schemas', '_blank');
};

/**
 * Renders status details for data stream validation based on the current status.
 */
const DataStreamStatusDetails: React.FC<DataStreamStatusDetailsProps> = ({ status }) => {
  let details: React.ReactNode;

  // Helper function to determine data stream status health icon
  const chooseDataStreamStatus = (status: string | boolean): string => {
    if (status === false) return 'valid';
    if (status === 'loading') return 'loading';
    if (status === 'device-not-configured') return 'info';
    return 'warning';
  };

  if (status === 'no-profile-dataset') {
    details = (
      <div>
        <div>
          {MESSAGES.noProfilePara1}
          <View margin="size-200">
            <Button data-testid="viewEdgeConfig" onPress={onOpenEdgeConfig} variant="secondary">
              <Text>{MESSAGES.noProfileButton1}</Text>
            </Button>
          </View>
        </div>
      </div>
    );
  } else if (status === 'sandbox-error') {
    details = (
      <div>
        <div>{MESSAGES.noEdgeInvalid}</div>
        <View margin="size-200">
          <Button data-testid="viewInstalled" onPress={onOpenInstalled} variant="secondary">
            <Text>{MSG.viewInstalled}</Text>
          </Button>
        </View>
        <div>
          {MESSAGES.noEdgePara3Pre} <i>edge.configId</i> {MESSAGES.noEdgePara3Post}
        </div>
      </div>
    );
  } else if (status === 'invalid-dataset') {
    details = (
      <div>
        <div>{MESSAGES.invalidDsPara1}</div>
        <View margin="size-200">
          <Button data-testid="viewEdgeConfig" onPress={onOpenEdgeConfig} variant="secondary">
            <Text>{MSG.viewEdge}</Text>
          </Button>
        </View>
      </div>
    );
  } else if (status === 'missing-messaging-dataset') {
    details = (
      <div>
        <div>{MESSAGES.missingDatasetPara1}</div>
        <View margin="size-200">
          <Button data-testid="viewInstalled" onPress={onOpenInstalled} variant="secondary">
            <Text>{MSG.viewInstalled}</Text>
          </Button>
        </View>
        <div>
          {MESSAGES.missingDatasetPara2Pre} <i>messaging.*</i>
          {MESSAGES.missingDatasetPara2Post}
        </div>
      </div>
    );
  } else if (status === 'invalid-messaging-dataset') {
    details = (
      <div>
        <div>{MESSAGES.invalidMessagingDatasetPara1}</div>
        <div>
          <ul>
            <li>Push Notification Tracking</li>
            <li>Environment details</li>
            <li>Application details</li>
            <li>Adobe CJM ExperienceEvent - Message Profile Details</li>
            <li>Adobe CJM ExperienceEvent - Message Execution Details</li>
          </ul>
        </div>
        <div>{MESSAGES.invalidMessagingDatasetPara2}</div>
        <View margin="size-200">
          <Button
            data-testid="viewTrackingSchema"
            onPress={onOpenTrackingSchema}
            variant="secondary"
          >
            <Text>{MSG.viewTrackingSchema}</Text>
          </Button>
        </View>
      </div>
    );
  } else if (status === 'invalid-schema') {
    details = (
      <div>
        <div>
          {MESSAGES.invalidSchemaPara1}
          <View margin="size-200">
            <Button data-testid="viewSchema" onPress={onOpenSchema} variant="secondary">
              <Text>{MSG.viewSchema}</Text>
            </Button>
          </View>
        </div>
      </div>
    );
  } else if (status === 'deny-listed') {
    details = (
      <div>
        {MESSAGES.denyListPara1}
        <ul>
          <li>{MESSAGES.denyListOption1}</li>
          <li>{MESSAGES.denyListOption2}</li>
        </ul>
      </div>
    );
  } else {
    const statusDetails = chooseStatusDetails(status);
    details = statusDetails ? <div>{statusDetails}</div> : <></>;
  }

  const statusText = chooseStatusMessage(status);

  const healthIconStatus = chooseDataStreamStatus(status);

  return (
    <React.Fragment>
      {status === 'loading' ? (
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      ) : (
        <>
          <Flex gap="size-100" alignItems="center" marginTop="size-200">
            {getHealthIcon(healthIconStatus || chooseStatus(status), 'L')}
            <Heading level={4}>{statusText}</Heading>
          </Flex>
          {details && <View marginTop="size-200">{details}</View>}
        </>
      )}
    </React.Fragment>
  );
};

export default DataStreamStatusDetails;
