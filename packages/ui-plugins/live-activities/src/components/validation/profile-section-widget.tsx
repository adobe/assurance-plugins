import { View, Heading, Flex, ProgressCircle } from '@adobe/react-spectrum';

import { useSandbox } from '@assurance/plugin-bridge-provider';

import React from 'react';

import { VALIDATION_STATUS } from '../../constants';
import { tableStyles } from '../atoms/KeyValueRow';
import { KeyValueRow } from '../atoms/KeyValueRow';
import { UnknownBadge } from '../atoms/UnknownBadge';
import Card from '../atoms/card';
import useDataStreamValidationStatus from '../../hooks/useDataStreamValidationStatus';
import { useLiveActivitiesValidationStatus } from '../../hooks/useLiveActivitiesValidationStatus';
import useProfile from '../../hooks/useProfile';
import { renderValue } from '../../utils/utils';
import { CopyableValue } from '@assurance/common-utils';

import DataStreamStatusDetails from './DataStreamStatusDetails';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  copyValue: {
    id: 'profile.copyValue',
    defaultMessage: 'Copy value'
  },
  copyFullValue: {
    id: 'profile.copyFullValue',
    defaultMessage: 'Copy full value'
  },
  copied: {
    id: 'profile.copied',
    defaultMessage: 'Copied!'
  }
});

const ProfileSectionWidget: React.FC = () => {
  const { formatMessage } = useIntl();
  const sandbox = useSandbox();
  const profile = useProfile();
  const liveActivitiesValidationStatus = useLiveActivitiesValidationStatus();
  const sandboxName = sandbox?.name;
  const profilePush = profile?.data?.entity?.pushNotificationDetails?.[0];
  const profilePushToStart = profile?.data?.entity?.liveActivityPushNotificationDetails?.[0];
  const validationStatus = useDataStreamValidationStatus();
  const isLoading = profile.isLoading || !profile.data;
  const profileId = profile?.data?.entityId;

  return (
    <Card>
      <Heading marginTop="size-0">Profile</Heading>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100px">
          <ProgressCircle aria-label="Loading…" isIndeterminate />
        </Flex>
      ) : (
        <View marginTop="size-200">
          <DataStreamStatusDetails status={validationStatus} profileId={profileId} />
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={{ display: 'none' }}>Label</th>
                <th style={{ display: 'none' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <KeyValueRow label="ECID">
                {profile.data!.entity?.pushNotificationDetails?.[0]?.identity?.id || (
                  <UnknownBadge />
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
              {/* Only show PushToStart Token for iOS devices with full support */}
              {liveActivitiesValidationStatus === VALIDATION_STATUS.FULL_SUPPORT && (
                <KeyValueRow label="PushToStart Token" wrap>
                  {profilePushToStart?.token ? (
                    <CopyableValue
                      value={profilePushToStart.token}
                      copyTooltip={formatMessage(messages.copyValue)}
                      copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                      copiedMessage={formatMessage(messages.copied)}
                    />
                  ) : (
                    <UnknownBadge />
                  )}
                </KeyValueRow>
              )}
            </tbody>
          </table>
        </View>
      )}
    </Card>
  );
};

export default ProfileSectionWidget;
