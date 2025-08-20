import React, { useMemo } from 'react';
import { View, Heading, Flex, ProgressCircle } from '@adobe/react-spectrum';
import Card from '../atoms/card';
import usePushCredentialsData from '../../hooks/usePushCredentialsData';
import PushCredentialsStatusDetails from './PushCredentialsStatusDetails';
import { useSandbox, useImsOrg, useEvents } from '@assurance/plugin-bridge-provider';
import { KeyValueRow, tableStyles } from '../atoms/KeyValueRow';
import { renderValue } from '../../utils/utils';

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

  // App Credential Validation
  const appCredentialValidation = useMemo(() => {
    const apps = pushCredentials?.data?.data || [];
    const match = apps.find(
      ({ attributes }: any) =>
        (attributes?.app_id === clientAppIDFromEvent) &&
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
  }, [pushCredentials, clientAppIDFromEvent, platformName, sandbox]);

  const pushCredentialsStatus = useMemo(() => {
    const loaded = pushCredentials?.data;
    const loading = pushCredentials?.isLoading;
    const error = pushCredentials?.error;
    const appData = appCredentialValidation;
    const apps = pushCredentials?.data?.data;
    if (error) return 'error';
    if (!loaded || loading) return 'loading';
    if (!appData && (apps || []).length === 0) return 'no-apps';
    if (!appData) return 'no-matching-app';
    return false;
  }, [pushCredentials, appCredentialValidation]);

  const shouldMatch = {
    app: clientAppIDFromEvent || '',
    platform: platformName || '',
    orgId: imsOrg || ''
  };

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
