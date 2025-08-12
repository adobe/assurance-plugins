import { Flex, Heading, ProgressCircle, View } from '@adobe/react-spectrum';
import { useClients, useEvents, useImsOrg, useSandbox } from '@assurance/plugin-bridge-provider';
import React, { useMemo } from 'react';
import useProfile from '../hooks/useProfile';
import Card from '../components/card/card';
import useECID from '../hooks/useECID';
import usePushCredentialsData from '../hooks/usePushCredentialsData';
import PushCredentialsStatusDetails from '../hooks/PushCredentialsStatusDetails';
import styles from './client-info.module.scss';
import useSelectedClientId from '../hooks/useSelectedClientId';

// Messages & constants kept local to file
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

// Utilities
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

// Simple presentational helpers scoped to this file only
const tableStyles = {
  table: { width: '100%', borderCollapse: 'collapse' as const },
  row: { borderBottom: '1px solid #e1e1e1' },
  labelCell: { fontWeight: 500, padding: '12px 16px' },
  valueCell: { padding: '12px 16px' },
  wrapValueCell: { padding: '12px 16px', maxWidth: '300px', wordBreak: 'break-all' as const }
};

function UnknownBadge() {
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

function renderValue(value: string | undefined | null) {
  if (value == null || value === 'N/A') {
    return <UnknownBadge />;
  }
  return String(value);
}

function LoadingBlock() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100px">
      <ProgressCircle aria-label="Loading…" isIndeterminate />
    </Flex>
  );
}

function KeyValueRow({
  label,
  children,
  wrap = false
}: {
  label: string;
  children: React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <tr style={tableStyles.row}>
      <td style={tableStyles.labelCell}>{label}</td>
      <td style={wrap ? tableStyles.wrapValueCell : tableStyles.valueCell}>{children}</td>
    </tr>
  );
}

function ClientInfo() {
  // Data hooks
  const sandbox = useSandbox();
  const imsOrg = useImsOrg();
  const profile = useProfile();
  const ecid = useECID();
  const selectedClientEvents = useEvents();
  const pushCredentials = usePushCredentialsData();
  const selectedClientId = useSelectedClientId();

  // Derived profile values
  const sandboxName = sandbox?.name;
  const profilePush = profile?.data?.entity?.pushNotificationDetails?.[0];
  const appIdFromProfile = profilePush?.appID;
  const platformFromProfile = profilePush?.platform;

  // Derive App ID and Platform from events
  const eventWithAppId = useMemo(
    () =>
      ((selectedClientEvents as any[]) || []).find(e => {
        const payload = (e as any)?.payload;
        const appSettings = payload?.appSettings;
        return appSettings?.CFBundleIdentifier || appSettings?.manifest?.package;
      }),
    [selectedClientEvents]
  );

  const clientAppIDFromEvent =
    (eventWithAppId as any)?.payload?.appSettings?.CFBundleIdentifier ||
    (eventWithAppId as any)?.payload?.appSettings?.manifest?.package;

  const platformEvent = useMemo(
    () =>
      ((selectedClientEvents as any[]) || []).find(
        e => (e as any)?.payload?.deviceInfo?.['Canonical platform name']
      ),
    [selectedClientEvents]
  );

  const platformName =
    (platformEvent as any)?.payload?.deviceInfo?.['Canonical platform name'] === 'iOS'
      ? 'apns'
      : 'fcm';

  // Validate credentials against push credentials list
  const appCredentialValidation = useMemo(() => {
    const apps = pushCredentials?.data?.data || [];
    const match = apps.find(
      ({ attributes }: any) =>
        (attributes?.app_id === clientAppIDFromEvent || attributes?.app_id === appIdFromProfile) &&
        attributes?.messaging_service === platformName
    );

    return match
      ? {
          id: match.id,
          appId: match.attributes.app_id,
          platform: match.attributes.messaging_service,
          sandbox
        }
      : null;
  }, [
    pushCredentials,
    clientAppIDFromEvent,
    appIdFromProfile,
    platformName,
    sandbox,
    selectedClientId
  ]);

  const pushCredentialsStatus = useMemo(() => {
    const loaded = pushCredentials?.data;
    const loading = pushCredentials?.isLoading;
    const error = pushCredentials?.error;
    const appData = appCredentialValidation;
    const apps = pushCredentials?.data?.data;

    console.log({ appData, apps, loaded, loading, error }, 'appData, apps, loaded, loading, error');

    // property error is not handled yet not sure about this as this is coming from launchToolkit

    if (error) return 'error';
    if (!loaded || loading) return 'loading';
    if (!appData && (apps || []).length === 0) return 'no-apps';
    if (!appData) return 'no-matching-app';

    return false;
  }, [pushCredentials, appCredentialValidation, selectedClientId]);

  // Construct the target match details for status details component
  const shouldMatch = {
    app: appIdFromProfile || '',
    platform: platformFromProfile || '',
    orgId: imsOrg || ''
  };

  const onManageApps = () => {
    window.open('https://experience.adobe.com/#/apps/configurations', '_blank');
  };

  return (
    <View UNSAFE_className={styles.clientInfo}>
      {/* Client Section */}
      <Card>
        <Heading marginTop="size-0">Client</Heading>
        {profile.isLoading ? (
          <LoadingBlock />
        ) : (
          <table style={tableStyles.table}>
            <tbody>
              <KeyValueRow label="ECID">{ecid || <UnknownBadge />}</KeyValueRow>
              <KeyValueRow label="Push Token" wrap>
                {renderValue(profilePush?.token)}
              </KeyValueRow>
            </tbody>
          </table>
        )}
      </Card>

      {/* Profile Section */}
      <Card>
        <Heading marginTop="size-0">Profile</Heading>
        {profile.isLoading || !profile.data ? (
          <LoadingBlock />
        ) : (
          <View marginTop="size-200">
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={{ display: 'none' }}>Label</th>
                  <th style={{ display: 'none' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                <KeyValueRow label="ECID">
                  {profile.data.entity?.identityMap?.ecid?.[0]?.id || <UnknownBadge />}
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

      {/* App Store Credentials & Configuration */}
      <Card>
        <Heading marginTop="size-0">App Store Credentials & Configuration</Heading>
        {pushCredentials.isLoading || pushCredentials.isRefetching ? (
          <LoadingBlock />
        ) : (
          <>
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
    </View>
  );
}

export default ClientInfo;
