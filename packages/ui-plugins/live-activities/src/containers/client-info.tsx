import {
  ActionButton,
  Button,
  Flex,
  Heading,
  LabeledValue,
  View,
  ProgressCircle
} from '@adobe/react-spectrum';
import { useImsOrg, useSandbox } from '@assurance/plugin-bridge-provider';
import React, { useMemo } from 'react';
import { useDataStream } from '@assurance/plugin-bridge-provider';
import useProfile from '../hooks/useProfile';
import styles from './client-info.module.scss';
import Card from '../components/card/card';
import useECID from '../hooks/useECID';
import usePushCredentialsData from '../hooks/usePushCredentialsData';
import PushCredentialsStatusDetails from '../hooks/PushCredentialsStatusDetails';

const MSG = {
  appId: 'App ID',
  info: "This is the app configuration details that matches the client's App ID and Platform.",
  manageApps: 'Manage App Configurations',
  sandbox: 'Sandbox',
  propertyId: 'Property ID',
  orgId: 'Org ID',
  refresh: 'Refresh',
  service: 'Messaging Service',
  title: 'App Store Credentials & Configuration',
  unknown: 'unknown'
};

const SERVICE = {
  apns: 'Apple Push Notification Service',
  fcm: 'Firebase Cloud Messaging V1'
};

const STATUS_MESSAGE = {
  'device-not-configured': 'Client Must Be Configured Correctly',
  error: 'App Configuration Error',
  'no-apps': 'No App Configurations',
  'no-matching-app': 'No Matching App Detected',
  'property-not-loaded': 'Property Not Found',
  valid: 'Matching App Successfully Detected'
};

const STATUS_DETAILS = {
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

const chooseStatus = status =>
  !status
    ? 'valid'
    : status === 'loading'
      ? 'loading'
      : status === 'device-not-configured'
        ? 'info'
        : 'invalid';

const chooseStatusMessage = status =>
  !status ? STATUS_MESSAGE.valid : STATUS_MESSAGE[status] || 'Something went wrong!';

const chooseStatusDetails = status => STATUS_DETAILS[status];

function ClientInfo() {
  const datastream = useDataStream();
  console.log(datastream);
  const sandbox = useSandbox();
  console.log(sandbox);
  const profile = useProfile();
  console.log(
    profile.data,
    profile.isLoading,
    profile.isError,
    profile,
    'profule data in client info'
  );

  const imsOrg = useImsOrg();
  console.log(imsOrg, 'imsOrg');

  const pushCredentials = usePushCredentialsData();
  console.log({ ...pushCredentials }, 'pushCredentials');

  const ecid = useECID();
  const sandboxName = sandbox?.name;
  const platform = profile?.data?.entity?.pushNotificationDetails?.[0]?.platform;

  const pushCredentialsStatus = useMemo(() => {
    const loaded = pushCredentials?.data;
    const loading = pushCredentials?.isLoading;
    const error = pushCredentials?.error;
    const appData = pushCredentials?.data;
    const apps = pushCredentials?.data?.data;

    if (error) {
      return 'error';
    }
    if (!loaded || loading) {
      return 'loading';
    }
    if (!appData && (apps || []).length === 0) {
      return 'no-apps';
    }
    if (!appData) {
      return 'no-matching-app';
    }
    return false;
  }, [pushCredentials]);

  // Helper for service string
  const serviceString = (platform?: string) => {
    return platform === 'apnsSandbox' || platform === 'apns'
      ? 'Apple Push Notification Service'
      : 'Firebase Cloud Messaging V1';
  };

  // Construct shouldMatch from available data
  const shouldMatch = {
    app: profile?.data?.entity?.pushNotificationDetails?.[0]?.appID || '',
    platform: profile?.data?.entity?.pushNotificationDetails?.[0]?.platform || '',
    orgId: imsOrg || ''
  };

  // Dummy onManageApps handler (replace with real navigation if needed)
  const onManageApps = () => {
    window.open('https://experience.adobe.com/#/apps/configurations', '_blank');
  };

  return (
    <View UNSAFE_className={styles.clientInfo}>
      <Card>
        <Heading marginTop="size-0">Client</Heading>
        {profile.isLoading && (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {!profile.isLoading && (
            <tbody>
              <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                <td style={{ fontWeight: 500, padding: '12px 16px' }}>ECID</td>
                <td style={{ padding: '12px 16px' }}>{ecid || renderUnknown()}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                <td style={{ fontWeight: 500, padding: '12px 16px' }}>Push Token</td>
                <td style={{ padding: '12px 16px', maxWidth: '300px', wordBreak: 'break-all' }}>
                  {renderProfileValue(profile?.data?.entity?.pushNotificationDetails?.[0]?.token)}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </Card>

      <Card>
        <Heading marginTop="size-0">Profile</Heading>
        {profile.isLoading && (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>
        )}
        {!profile.isLoading && profile.data && (
          <View marginTop="size-200">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ display: 'none' }}>Label</th>
                  <th style={{ display: 'none' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>ECID</td>
                  <td style={{ padding: '12px 16px' }}>
                    {profile.data.entity?.identityMap?.ecid?.[0]?.id || renderUnknown()}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Sandbox</td>
                  <td style={{ padding: '12px 16px' }}>{sandboxName}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Push Token</td>
                  <td style={{ padding: '12px 16px', maxWidth: '300px', wordBreak: 'break-all' }}>
                    {renderProfileValue(profile.data.entity?.pushNotificationDetails?.[0]?.token)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>App ID</td>
                  <td style={{ padding: '12px 16px' }}>
                    {renderProfileValue(profile.data.entity?.pushNotificationDetails?.[0]?.appID)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Platform</td>
                  <td style={{ padding: '12px 16px' }}>
                    {renderProfileValue(
                      profile.data.entity?.pushNotificationDetails?.[0]?.platform
                    )}
                  </td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Denylisted</td>
                  <td style={{ padding: '12px 16px' }}>
                    {renderProfileValue(
                      profile.data.entity?.pushNotificationDetails?.[0]?.denylisted === true
                        ? 'Yes'
                        : profile.data.entity?.pushNotificationDetails?.[0]?.denylisted === false
                          ? 'No'
                          : undefined
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </View>
        )}
      </Card>

      <Card>
        <Heading marginTop="size-0">App Store Credentials & Configuration</Heading>
        {pushCredentials.isLoading || pushCredentials.isRefetching ? (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>
        ) : (
          <PushCredentialsStatusDetails
            pushCredentialsStatus={pushCredentialsStatus}
            shouldMatch={shouldMatch}
            onManageApps={onManageApps}
            MSG={MSG}
            STATUS_DETAILS={STATUS_DETAILS}
            serviceString={serviceString}
            chooseStatusDetails={chooseStatusDetails}
            chooseStatusMessage={chooseStatusMessage}
            onRefresh={pushCredentials.refetch}
            healthIconStatus={chooseStatus(pushCredentialsStatus)}
          />
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ display: 'none' }}>Label</th>
              <th style={{ display: 'none' }}>Value</th>
            </tr>
          </thead>

          <tbody>
            <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
              <td style={{ fontWeight: 500, padding: '12px 16px' }}>Sandbox</td>
              <td style={{ padding: '12px 16px' }}>{sandboxName}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
              <td style={{ fontWeight: 500, padding: '12px 16px' }}>App ID</td>
              <td style={{ padding: '12px 16px' }}>
                {renderProfileValue(profile?.data?.entity?.pushNotificationDetails?.[0]?.appID)}
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
              <td style={{ fontWeight: 500, padding: '12px 16px' }}>Messaging Service</td>
              <td style={{ padding: '12px 16px' }}>{serviceString(platform)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      {/* Render the push credentials status details below the card */}
    </View>
  );
}

// Helper functions for rendering unknown values
function renderProfileValue(value: string | undefined | null) {
  if (value == null || value === 'N/A') {
    return (
      <span
        style={{
          background: '#e34850',
          color: 'white',
          borderRadius: 4,
          padding: '2px 12px',
          fontWeight: 500
        }}
      >
        unknown
      </span>
    );
  }
  return String(value);
}

function renderUnknown() {
  return (
    <span
      style={{
        background: '#e34850',
        color: 'white',
        borderRadius: 4,
        padding: '2px 12px',
        fontWeight: 500
      }}
    >
      unknown
    </span>
  );
}

export default ClientInfo;
