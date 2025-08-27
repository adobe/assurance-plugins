import React from 'react';
import { View, Heading, Flex, ProgressCircle } from '@adobe/react-spectrum';
import Card from '../atoms/card';
import useProfile from '../../hooks/useProfile';
import DataStreamStatusDetails from './DataStreamStatusDetails';
import { useSandbox } from '@assurance/plugin-bridge-provider';
import useDataStreamValidationStatus from '../../hooks/useDataStreamValidationStatus';
import { tableStyles } from '../atoms/KeyValueRow';
import { renderValue } from '../../utils/utils';
import { UnknownBadge } from '../atoms/UnknownBadge';
import { KeyValueRow } from '../atoms/KeyValueRow';

const ProfileSectionWidget: React.FC = () => {
  const sandbox = useSandbox();
  const profile = useProfile();
  const sandboxName = sandbox?.name;
  const profilePush = profile?.data?.entity?.pushNotificationDetails?.[0];
  const validationStatus = useDataStreamValidationStatus();
  const isLoading = profile.isLoading || !profile.data;

  return (
    <Card>
      <Heading marginTop="size-0">Profile</Heading>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100px">
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View marginTop="size-200">
          <DataStreamStatusDetails status={validationStatus} />
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={{ display: 'none' }}>Label</th>
                <th style={{ display: 'none' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <KeyValueRow label="ECID">
                {profile.data!.entity?.identityMap?.ecid?.[0]?.id || (
                  <UnknownBadge/>
                )}
              </KeyValueRow>
              <KeyValueRow label="Sandbox">{sandboxName}</KeyValueRow>
              <KeyValueRow label="Push Token" wrap>
                {renderValue(profilePush?.token)}
              </KeyValueRow>
              <KeyValueRow label="App ID">{renderValue(profilePush?.appID)}</KeyValueRow>
              <KeyValueRow label="Platform">{renderValue(profilePush?.platform)}</KeyValueRow>
              <KeyValueRow label="Denylisted">
                {renderValue(
                  profilePush?.denylisted === true
                    ? 'Yes'
                    : profilePush?.denylisted === false
                      ? 'No'
                      : undefined
                )}
              </KeyValueRow>
            </tbody>
          </table>
        </View>
      )}
    </Card>
  );
};

export default ProfileSectionWidget;
