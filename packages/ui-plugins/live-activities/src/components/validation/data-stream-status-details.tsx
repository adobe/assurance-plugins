import React from 'react';
import { View, Button, Flex, Heading, Text, ProgressCircle } from '@adobe/react-spectrum';
import { getHealthIcon } from '../../constants';
import {
  openProfileUrl,
  onOpenTrackingSchema,
  onOpenSchema,
  ENVIRONMENT_MAPPING
} from '../../utils/utils';
import { useOpenExperienceUrl } from '../../hooks/useOpenExperienceUrl';
import { useSandbox, useEnvironmentValue } from '@assurance/plugin-bridge-provider';
import {
  extractProfileDatasetId,
  extractSchemaFromDataset,
  useDataset,
  useDatastream,
  useDatastreamId,
  useEventDataset,
} from '../../hooks/useDataStreamValidationStatus';

// Types - Preserving original behavior where false = valid
type ValidationStatus = 
  | 'device-not-configured'
  | 'no-sandbox'
  | 'not-in-platform'
  | 'no-dataset-access'
  | 'token-mismatch'
  | 'deny-listed'
  | 'invalid-dataset'
  | 'sandbox-error'
  | 'invalid-schema'
  | 'invalid-messaging-dataset'
  | 'missing-messaging-dataset'
  | 'no-profile-dataset'
  | 'loading'
  | false; // false = all validations passed (CRITICAL for compatibility)

type HealthStatus = 'valid' | 'loading' | 'info' | 'warning';

interface DataStreamStatusDetailsProps {
  status: ValidationStatus | string | boolean;
  profileId?: string;
}

// Constants
const BUTTON_LABELS = {
  viewInstalled: 'View Installed Extensions',
  viewEdge: 'View Edge Configuration',
  viewSchema: 'View Profile Schema',
  viewTrackingSchema: 'View Tracking Schema',
  inspectProfile: 'Inspect Profile'
} as const;

const STATUS_MESSAGES = {
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
  'loading': 'Loading...',
  false: 'Push Data Received By Platform' // false = valid state
} as const;

const STATUS_DETAILS = {
  'no-sandbox':
    "The sandbox is pulled out of the Edge Streaming Validation events. It's possible events aren't making it to the Platform yet. Check and make sure the Platform has been set up correctly.",
  'not-in-platform': 'No matching profile with this ECID was found on the Platform.',
  'token-mismatch':
    'The push token stored in this profile does not match the push token on the device.',
  'no-dataset-access':
    'Your user does not have permission to access Platform information. Make sure you\'ve been provisioned for the Platform and have access to the sandbox named "{sandbox}".'
} as const;

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

// Utility functions - Preserving original logic
const getHealthStatus = (status: ValidationStatus | string | boolean): HealthStatus => {
  if (status === false) return 'valid'; // false = valid state
  if (status === 'loading') return 'loading';
  if (status === 'device-not-configured') return 'info';
  return 'warning';
};

const getStatusMessage = (status: ValidationStatus | string | boolean): string => {
  return STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] || '';
};

const getStatusDetails = (status: ValidationStatus | string | boolean): string | undefined => {
  return STATUS_DETAILS[status as keyof typeof STATUS_DETAILS];
};

// Component for rendering status-specific details
const StatusDetailsRenderer: React.FC<{
  status: ValidationStatus | string | boolean;
  env: string;
  sandbox: any;
  messagingSchemaId?: string;
  profileSchemaId?: string;
  openExpUrl: (params: { mode: string }) => void;
}> = ({ status, env, sandbox, messagingSchemaId, profileSchemaId, openExpUrl }) => {
  const renderNoProfileDataset = () => (
    <div>
      <div>{MESSAGES.noProfilePara1}</div>
      <View margin="size-200">
        <Button
          data-testid="viewEdgeConfig"
          onPress={() => openExpUrl({ mode: 'edgeConfig' })}
          variant="secondary"
        >
          <Text>{MESSAGES.noProfileButton1}</Text>
        </Button>
      </View>
    </div>
  );

  const renderSandboxError = () => (
    <div>
      <div>{MESSAGES.noEdgeInvalid}</div>
      <View margin="size-200">
        <Button
          data-testid="viewInstalled"
          onPress={() => openExpUrl({ mode: 'installed' })}
          variant="secondary"
        >
          <Text>{BUTTON_LABELS.viewInstalled}</Text>
        </Button>
      </View>
      <div>
        {MESSAGES.noEdgePara3Pre} <i>edge.configId</i> {MESSAGES.noEdgePara3Post}
      </div>
    </div>
  );

  const renderInvalidDataset = () => (
    <div>
      <div>{MESSAGES.invalidDsPara1}</div>
      <View margin="size-200">
        <Button
          data-testid="viewEdgeConfig"
          onPress={() => openExpUrl({ mode: 'edgeConfig' })}
          variant="secondary"
        >
          <Text>{BUTTON_LABELS.viewEdge}</Text>
        </Button>
      </View>
    </div>
  );

  const renderMissingMessagingDataset = () => (
    <div>
      <div>{MESSAGES.missingDatasetPara1}</div>
      <View margin="size-200">
        <Button
          data-testid="viewInstalled"
          onPress={() => openExpUrl({ mode: 'installed' })}
          variant="secondary"
        >
          <Text>{BUTTON_LABELS.viewInstalled}</Text>
        </Button>
      </View>
      <div>
        {MESSAGES.missingDatasetPara2Pre} <i>messaging.*</i>
        {MESSAGES.missingDatasetPara2Post}
      </div>
    </div>
  );

  const renderInvalidMessagingDataset = () => (
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
          onPress={() =>
            onOpenTrackingSchema({
              env: env ?? 'prod',
              sandbox,
              messagingSchemaId: messagingSchemaId
            })
          }
          variant="secondary"
        >
          <Text>{BUTTON_LABELS.viewTrackingSchema}</Text>
        </Button>
      </View>
    </div>
  );

  const renderInvalidSchema = () => (
    <div>
      <div>{MESSAGES.invalidSchemaPara1}</div>
      <View margin="size-200">
        <Button
          data-testid="viewSchema"
          onPress={() =>
            onOpenSchema({
              env: env ?? 'prod',
              sandbox,
              profileSchemaId: profileSchemaId || undefined
            })
          }
          variant="secondary"
        >
          <Text>{BUTTON_LABELS.viewSchema}</Text>
        </Button>
      </View>
    </div>
  );

  const renderDenyListed = () => (
    <div>
      {MESSAGES.denyListPara1}
      <ul>
        <li>{MESSAGES.denyListOption1}</li>
        <li>{MESSAGES.denyListOption2}</li>
      </ul>
    </div>
  );

  const renderDefaultDetails = () => {
    const statusDetails = getStatusDetails(status);
    return statusDetails ? <div>{statusDetails}</div> : null;
  };

  // Render status-specific details - Preserving original logic
  switch (status) {
    case 'no-profile-dataset':
      return renderNoProfileDataset();
    case 'sandbox-error':
      return renderSandboxError();
    case 'invalid-dataset':
      return renderInvalidDataset();
    case 'missing-messaging-dataset':
      return renderMissingMessagingDataset();
    case 'invalid-messaging-dataset':
      return renderInvalidMessagingDataset();
    case 'invalid-schema':
      return renderInvalidSchema();
    case 'deny-listed':
      return renderDenyListed();
    default:
      return renderDefaultDetails();
  }
};

/**
 * Renders status details for data stream validation based on the current status.
 * 
 * CRITICAL: This component maintains full backward compatibility with the original
 * behavior where status=false means "all validations passed" and shows the inspect profile button.
 */
const DataStreamStatusDetails: React.FC<DataStreamStatusDetailsProps> = ({ status, profileId }) => {
  const sandbox = useSandbox();
  const env = useEnvironmentValue(ENVIRONMENT_MAPPING);
  const eventDataset = useEventDataset();
  const datastreamId = useDatastreamId();
  const messagingDatasetQuery = useDataset(eventDataset, !!eventDataset);
  const messagingSchemaId = extractSchemaFromDataset(messagingDatasetQuery.data);
  const datastreamQuery = useDatastream(datastreamId, !!datastreamId);
  const profileDatasetId = extractProfileDatasetId(datastreamQuery?.data?.data);
  const profileDatasetQuery = useDataset(profileDatasetId, !!profileDatasetId);
  const profileSchemaId = extractSchemaFromDataset(profileDatasetQuery.data);
  const { openExpUrl } = useOpenExperienceUrl();

  // Render action buttons for valid status (status === false)
  const renderActionButtons = () => {
    if (status !== false) return null; // Only show for valid state (false)
    
    return (
      <Button
        data-testid="inspectProfile"
        onPress={() => openProfileUrl({ env: env ?? 'prod', sandbox, profileId })}
        variant="secondary"
      >
        <Text>{BUTTON_LABELS.inspectProfile}</Text>
      </Button>
    );
  };

  const statusMessage = getStatusMessage(status);
  const healthStatus = getHealthStatus(status);

  if (status === 'loading') {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }

  return (
    <>
      <Flex gap="size-100" alignItems="center" marginTop="size-200">
        {getHealthIcon(healthStatus, 'L')}
        <Heading level={4}>{statusMessage}</Heading>
      </Flex>
      
      <View marginTop="size-200">
        <StatusDetailsRenderer
          status={status}
          env={env}
          sandbox={sandbox}
          messagingSchemaId={messagingSchemaId || undefined}
          profileSchemaId={profileSchemaId || undefined}
          openExpUrl={openExpUrl}
        />
      </View>
      
      {renderActionButtons() && (
        <View marginTop="size-200">
          {renderActionButtons()}
        </View>
      )}
    </>
  );
};

export default DataStreamStatusDetails;
