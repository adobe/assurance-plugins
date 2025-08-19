import React from 'react';
import { View, Heading, Flex, ProgressCircle } from '@adobe/react-spectrum';
import Card from '../atoms/card';
import useProfile from '../../hooks/useProfile';
import DataStreamStatusDetails from './DataStreamStatusDetails';
import { useSandbox } from '@assurance/plugin-bridge-provider';
import useDataStreamValidationStatus from '../../hooks/useDataStreamValidationStatus';

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

function KeyValueRow({ label, children, wrap = false }: { label: string; children: React.ReactNode; wrap?: boolean }) {
  return (
    <tr style={tableStyles.row}>
      <td style={tableStyles.labelCell}>{label}</td>
      <td style={wrap ? tableStyles.wrapValueCell : tableStyles.valueCell}>{children}</td>
    </tr>
  );
}

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
                {profile.data!.entity?.identityMap?.ecid?.[0]?.id || <UnknownBadge />}
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
