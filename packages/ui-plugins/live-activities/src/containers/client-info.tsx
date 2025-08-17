import { Flex, Heading, ProgressCircle, View } from '@adobe/react-spectrum';
import { useEvents, useImsOrg, useSandbox } from '@assurance/plugin-bridge-provider';
import React, { useMemo } from 'react';
import useProfile from '../hooks/useProfile';
import Card from '../components/card/card';
import { useECID, useSelectedClientId, useSelectedClientPushToken } from '../hooks/useClientInfo';
import usePushCredentialsData from '../hooks/usePushCredentialsData';
import PushCredentialsStatusDetails from '../hooks/PushCredentialsStatusDetails';
import DataStreamStatusDetails from '../hooks/DataStreamStatusDetails';
import styles from './client-info.module.scss';
import useDataStreamValidationStatus from '../hooks/useDataStreamValidationStatus';
import ClientValidationWidget from '../components/client-validation-widget';

// Utilities specific to this component
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
  const selectedClientEvents = useEvents();
  const pushCredentials = usePushCredentialsData();
  const selectedClientId = useSelectedClientId();
  const validationStatus = useDataStreamValidationStatus();

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

  return (
    <View UNSAFE_className={styles.clientInfo}>
      {/* Client Section */}
      {profile.isLoading ? (
        <LoadingBlock />
      ) : (
        <View>
          <ClientValidationWidget />
        </View>
      )}

      {/* Profile Section */}
      <Card>
        <Heading marginTop="size-0">Profile</Heading>
        {profile.isLoading || !profile.data ? (
          <LoadingBlock />
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
    </View>
  );
}

export default ClientInfo;
