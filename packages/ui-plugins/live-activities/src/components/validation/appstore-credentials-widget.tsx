import React from 'react';

import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { useEvents, useImsOrg, useSandbox } from '@assurance/plugin-bridge-provider';

import { useAppstoreCredentialsValidation } from '../../hooks/useAppstoreCredentialsValidation';
import usePushCredentialsData from '../../hooks/usePushCredentialsData';
import { renderValue } from '../../utils/utils';
import { KeyValueRow, tableStyles } from '../atoms/KeyValueRow';
import Card from '../atoms/card';
import PushCredentialsStatusDetails from './push-credentials-status-details';

const serviceString = (platform?: string) =>
  platform === 'apnsSandbox' || platform === 'apns'
    ? 'Apple Push Notification Service'
    : 'Firebase Cloud Messaging V1';

const AppStoreCredentialsWidget: React.FC = () => {
  const sandbox = useSandbox();
  const imsOrg = useImsOrg();
  const pushCredentials = usePushCredentialsData();
  const selectedClientEvents = useEvents();
  const sandboxName = sandbox?.name;

  // Use the refactored validation hook
  const { clientAppIDFromEvent, platformName, pushCredentialsStatus, shouldMatch } =
    useAppstoreCredentialsValidation({ pushCredentials, selectedClientEvents, sandbox, imsOrg });

  return (
    <Card>
      <Heading marginTop="size-0">App Store Credentials & Configuration</Heading>
      {pushCredentials.isLoading || pushCredentials.isRefetching ? (
        <Flex justifyContent="center" alignItems="center" height="100px">
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <>
          <PushCredentialsStatusDetails
            pushCredentialsStatus={pushCredentialsStatus}
            shouldMatch={shouldMatch}
            onRefresh={pushCredentials.refetch}
          />
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={{ display: 'none' }}>Label</th>
                <th style={{ display: 'none' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <KeyValueRow label="Sandbox">{sandboxName}</KeyValueRow>
              <KeyValueRow label="App ID">{renderValue(clientAppIDFromEvent)}</KeyValueRow>
              <KeyValueRow label="Messaging Service">{serviceString(platformName)}</KeyValueRow>
            </tbody>
          </table>
        </>
      )}
    </Card>
  );
};

export default AppStoreCredentialsWidget;
