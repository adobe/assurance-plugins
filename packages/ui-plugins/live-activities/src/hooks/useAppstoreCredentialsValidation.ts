import { useMemo } from 'react';
import useLaunchProperty from './useLaunchProperty';
import { getPropertyId } from './useClientInfo';

export function useAppstoreCredentialsValidation({ pushCredentials, selectedClientEvents, sandbox, imsOrg }) {
  // Get propertyId from client info
  const propertyId = getPropertyId();
  // Fetch property data
  const property = useLaunchProperty(propertyId);

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
        attributes?.app_id === clientAppIDFromEvent &&
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

  // Combined loading and error logic for both APIs
  const pushCredentialsStatus = useMemo(() => {
    const loaded = pushCredentials?.data;
    const loading = pushCredentials?.isLoading || property.isLoading;
    const pushCredentialerror = pushCredentials?.error;
    const propertyError = property?.error;
    const appData = appCredentialValidation;
    const apps = pushCredentials?.data?.data;
    if (pushCredentialerror) return 'error';
    if (propertyError) return 'property-not-loaded';
    if (!loaded || loading) return 'loading';
    if (!appData && (apps || []).length === 0) return 'no-apps';
    if (!appData) return 'no-matching-app';
    return false;
  }, [pushCredentials, appCredentialValidation, property.isLoading, property.error]);

  const shouldMatch = useMemo(() => ({
    app: clientAppIDFromEvent || '',
    platform: platformName || '',
    orgId: imsOrg || ''
  }), [clientAppIDFromEvent, platformName, imsOrg]);

  return {
    clientAppIDFromEvent,
    platformName,
    appCredentialValidation,
    pushCredentialsStatus,
    shouldMatch,
    property
  };
}
