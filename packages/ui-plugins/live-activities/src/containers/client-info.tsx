import {
  ActionButton,
  Button,
  Flex,
  Heading,
  LabeledValue,
  View,
  ProgressCircle
} from '@adobe/react-spectrum';
import { useSandbox } from '@assurance/plugin-bridge-provider';
import React from 'react';
import Link from '@spectrum-icons/workflow/Link';
import { useDataStream } from '@assurance/plugin-bridge-provider';
import useProfile from '../hooks/useProfile';
import styles from './client-info.module.scss';
import Card from '../components/card/card';
import useSharedStateData from '../hooks/useSharedStateData';

function ClientInfo() {
  const datastream = useDataStream();
  console.log(datastream);
  const sandbox = useSandbox();
  console.log(sandbox);
  const profile = useProfile();
  console.log(profile.data, profile.isLoading, profile.isError);

  const sharedStateData = useSharedStateData();
  console.log('ssd', sharedStateData);

  return (
    <View UNSAFE_className={styles.clientInfo}>
      <Card>
        <Heading marginTop='size-0'>Client</Heading>
        {profile.isLoading && (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>
        )}
        {!profile.isLoading && sharedStateData?.ecid && (
          <LabeledValue label="ECID" value={sharedStateData.ecid} />
        )}
        {/* {sandbox?.name && (
          <Flex>
            <LabeledValue label="Sandbox" value={sandbox.name} />
            <ActionButton onPress={() => window.open(sandbox.id)}>
              <Link />
            </ActionButton>
          </Flex>
        )}
        {datastream?.id && <LabeledValue label="Datastream" value={datastream.id} />} */}
        {!profile.isLoading && profile.data && (
          <Button
            variant="accent"
            onPress={() =>
              window.open(
                `https://experience.adobe.com/sname:${sandbox}/platform/profile/browse/${encodeURIComponent(profile.data?.entityId || '')}`,
                '_blank'
              )
            }
          >
            View Profile
          </Button>
        )}
      </Card>

      <Card>
        <Heading marginTop='size-0'>Profile</Heading>
        {profile.isLoading && (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>
        )}
        {!profile.isLoading && profile.data && (
          <View marginTop="size-200">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>ECID</td>
                  <td style={{ padding: '12px 16px' }}>{profile.data.entity?.identityMap?.ecid?.[0]?.id || sharedStateData?.ecid || renderUnknown()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Platform</td>
                  <td style={{ padding: '12px 16px' }}>{renderProfileValue(profile.data.entity?.pushNotificationDetails?.[0]?.platform)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>App ID</td>
                  <td style={{ padding: '12px 16px' }}>{renderProfileValue(profile.data.entity?.pushNotificationDetails?.[0]?.appID)}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 500, padding: '12px 16px' }}>Denylisted</td>
                  <td style={{ padding: '12px 16px' }}>{renderProfileValue(
                    profile.data.entity?.pushNotificationDetails?.[0]?.denylisted === true
                      ? 'Yes'
                      : profile.data.entity?.pushNotificationDetails?.[0]?.denylisted === false
                      ? 'No'
                      : undefined
                  )}</td>
                </tr>
              </tbody>
            </table>
          </View>
        )}
      </Card>

      <Card>
        <Heading marginTop='size-0'>Datastream</Heading>
        {datastream?.id && <LabeledValue label="Datastream" value={datastream.id} />}
      </Card>
    </View>
  );
}

// Helper functions for rendering unknown values
function renderProfileValue(value: string | undefined | null) {
  if (!value || value === 'N/A') {
    return (
      <span style={{ background: '#e34850', color: 'white', borderRadius: 4, padding: '2px 12px', fontWeight: 500 }}>
        unknown
      </span>
    );
  }
  return value;
}

function renderUnknown() {
  return (
    <span style={{ background: '#e34850', color: 'white', borderRadius: 4, padding: '2px 12px', fontWeight: 500 }}>
      unknown
    </span>
  );
}

export default ClientInfo;
