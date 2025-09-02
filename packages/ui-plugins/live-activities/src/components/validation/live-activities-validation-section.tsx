import {
  View,
  Heading,
  Text,
  Flex,
  Link,
  StatusLight,
  ActionButton,
  Tooltip,
  TooltipTrigger
} from '@adobe/react-spectrum';

import Info from '@spectrum-icons/workflow/InfoOutline';

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { LIVE_ACTIVITIES_MIN_VERSION, VALIDATION_STATUS } from '../../constants';
import { useClientIOSVersion, useClientLiveActivitiesSupport, useClientDeviceType } from '../../hooks/useClientInfo';
import { useLiveActivitiesData } from '../../hooks/useLiveActivitiesData';
import { useLiveActivitiesValidationStatus } from '../../hooks/useLiveActivitiesValidationStatus';
import { type LiveActivitiesValidationStatus } from '../../types/liveActivities';
import { createLiveActivitiesTableData } from '../../utils/liveActivitiesDisplay';
import { getStatusDisplayConfig, isDeviceVersionBelowAppMinimum } from '../../utils/liveActivitiesValidation';
import { CopyableValue } from '../atoms/CopyableValue';
import { COPYABLE_VALUE_CONSTANTS } from '../../constants';


const messages = defineMessages({
  title: {
    id: 'liveActivities.validation.title',
    defaultMessage: 'Live Activities'
  },
  notSupported: {
    id: 'liveActivities.validation.notSupported',
    defaultMessage: 'Live Activities Not Supported'
  },
  notSupportedDetails: {
    id: 'liveActivities.validation.notSupportedDetails',
    defaultMessage: 'Live Activities require iOS 16.1 or later. This device is running iOS {version}.'
  },
  basicSupport: {
    id: 'liveActivities.validation.basicSupport',
    defaultMessage: 'Basic Live Activities Support'
  },
  basicSupportDetails: {
    id: 'liveActivities.validation.basicSupportDetails',
    defaultMessage: 'This device supports basic Live Activities features (iOS {version}). Validating: Registration, Update tokens, Per-activity schema.'
  },
  fullSupport: {
    id: 'liveActivities.validation.fullSupport',
    defaultMessage: 'Full Live Activities Support'
  },
  fullSupportDetails: {
    id: 'liveActivities.validation.fullSupportDetails',
    defaultMessage: 'This device supports all Live Activities features including PushToStart (iOS {version}). Validating: Registration, Update tokens, Per-activity schema, PushToStart tokens.'
  },
  unknown: {
    id: 'liveActivities.validation.unknown',
    defaultMessage: 'iOS Version Unknown'
  },
  unknownDetails: {
    id: 'liveActivities.validation.unknownDetails',
    defaultMessage: 'Unable to determine iOS version. Please ensure the device is properly connected.'
  },
  notIOS: {
    id: 'liveActivities.validation.notIOS',
    defaultMessage: 'Not an iOS Device'
  },
  notIOSDetails: {
    id: 'liveActivities.validation.notIOSDetails',
    defaultMessage: 'Live Activities are only supported on iOS devices.'
  },
  learnMore: {
    id: 'liveActivities.validation.learnMore',
    defaultMessage: 'Learn more about Live Activities requirements'
  },
  // Table row tooltips
  statusTooltip: {
    id: 'liveActivities.validation.statusTooltip',
    defaultMessage: 'Current Live Activities support status based on iOS version and app configuration.'
  },
  iosVersionTooltip: {
    id: 'liveActivities.validation.iosVersionTooltip',
    defaultMessage: 'The iOS version running on this device. Live Activities require iOS 16.1 or later.'
  },
  deviceTypeTooltip: {
    id: 'liveActivities.validation.deviceTypeTooltip',
    defaultMessage: 'The type of device (iPhone, iPad, etc.). Live Activities are supported on all iOS devices with iOS 16.1+.'
  },
  minimumRequiredTooltip: {
    id: 'liveActivities.validation.minimumRequiredTooltip',
    defaultMessage: 'The minimum iOS version required for Live Activities. This is iOS 16.1, which introduced Live Activities.'
  },
  nsSupportsLiveActivitiesTooltip: {
    id: 'liveActivities.validation.nsSupportsLiveActivitiesTooltip',
    defaultMessage: 'Indicates whether the app declares support for Live Activities in its Info.plist. This should be "Yes" for Live Activities to work.'
  },
  nsSupportsLiveActivitiesFrequentUpdatesTooltip: {
    id: 'liveActivities.validation.nsSupportsLiveActivitiesFrequentUpdatesTooltip',
    defaultMessage: 'Indicates whether the app supports frequent Live Activities updates. This enables more dynamic content updates.'
  },
  appMinimumOSVersionTooltip: {
    id: 'liveActivities.validation.appMinimumOSVersionTooltip',
    defaultMessage: 'The minimum iOS version the app declares it supports. If this is below the device version, there may be compatibility issues.'
  },
  appMinimumOSVersionWarningTooltip: {
    id: 'liveActivities.validation.appMinimumOSVersionWarningTooltip',
    defaultMessage: 'The device iOS version is below the app\'s minimum required version. This may cause compatibility issues with Live Activities.'
  },
  // Copy functionality messages
  copyValue: {
    id: 'liveActivities.validation.copyValue',
    defaultMessage: 'Copy value'
  },
  copyFullValue: {
    id: 'liveActivities.validation.copyFullValue',
    defaultMessage: 'Copy full value'
  },
  copied: {
    id: 'liveActivities.validation.copied',
    defaultMessage: 'Copied!'
  },
  // Table headers
  activityType: {
    id: 'liveActivities.validation.activityType',
    defaultMessage: 'Activity Type'
  },
  pushToStartToken: {
    id: 'liveActivities.validation.pushToStartToken',
    defaultMessage: 'PushToStart Token'
  },
  updateToken: {
    id: 'liveActivities.validation.updateToken',
    defaultMessage: 'Update Token'
  },
  registeredActivities: {
    id: 'liveActivities.validation.registeredActivities',
    defaultMessage: 'Registered Live Activities'
  },
  // Table row labels
  status: {
    id: 'liveActivities.validation.status',
    defaultMessage: 'Status'
  },
  iosVersion: {
    id: 'liveActivities.validation.iosVersion',
    defaultMessage: 'iOS Version'
  },
  deviceType: {
    id: 'liveActivities.validation.deviceType',
    defaultMessage: 'Device Type'
  },
  minimumRequired: {
    id: 'liveActivities.validation.minimumRequired',
    defaultMessage: 'Minimum Required'
  },
  nsSupportsLiveActivities: {
    id: 'liveActivities.validation.nsSupportsLiveActivities',
    defaultMessage: 'NSSupportsLiveActivities'
  },
  nsSupportsLiveActivitiesFrequentUpdates: {
    id: 'liveActivities.validation.nsSupportsLiveActivitiesFrequentUpdates',
    defaultMessage: 'NSSupportsLiveActivitiesFrequentUpdates'
  },
  appMinimumOSVersion: {
    id: 'liveActivities.validation.appMinimumOSVersion',
    defaultMessage: 'App MinimumOSVersion'
  },
  liveActivities: {
    id: 'liveActivities.validation.liveActivities',
    defaultMessage: 'Live Activities'
  }
});

const LiveActivitiesValidationSection = () => {
  const { formatMessage } = useIntl();
  const validationStatus = useLiveActivitiesValidationStatus();
  const iosVersion = useClientIOSVersion();
  const liveActivitiesSupport = useClientLiveActivitiesSupport();
  const deviceType = useClientDeviceType();
  const liveActivities = useLiveActivitiesData();

  // Get status display configuration using utility function
  const statusConfig = getStatusDisplayConfig(validationStatus);

  // Data rows for Live Activities table - conditional based on support status
  const dataRows: Array<{
    label: string;
    value: any;
    showCopy: boolean;
    isLongData?: boolean;
    tooltip?: string;
  }> = [
    {
      label: formatMessage(messages.status),
      value: statusConfig.title,
      showCopy: false,
      tooltip: formatMessage(messages.statusTooltip)
    }
  ];

  // Only show iOS-specific rows for iOS devices
  if (validationStatus !== VALIDATION_STATUS.NOT_IOS) {
    dataRows.push(
      {
        label: formatMessage(messages.iosVersion),
        value: iosVersion || 'Unknown',
        showCopy: true,
        tooltip: formatMessage(messages.iosVersionTooltip)
      },
      {
        label: formatMessage(messages.deviceType),
        value: deviceType || 'Unknown',
        showCopy: false,
        tooltip: formatMessage(messages.deviceTypeTooltip)
      }
    );

    // Only show minimum required for iOS devices that don't support Live Activities
    if (validationStatus === VALIDATION_STATUS.NOT_SUPPORTED) {
      dataRows.push({
        label: formatMessage(messages.minimumRequired),
        value: `iOS ${LIVE_ACTIVITIES_MIN_VERSION}`,
        showCopy: false,
        tooltip: formatMessage(messages.minimumRequiredTooltip)
      });
    }

    // Add app configuration rows if available and device supports Live Activities
    if (liveActivitiesSupport && (validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT)) {
      dataRows.push(
        {
          label: formatMessage(messages.nsSupportsLiveActivities),
          value: liveActivitiesSupport.supportsLiveActivities ? 'Yes' : 'No',
          showCopy: false,
          tooltip: formatMessage(messages.nsSupportsLiveActivitiesTooltip)
        },
        {
          label: formatMessage(messages.nsSupportsLiveActivitiesFrequentUpdates),
          value: liveActivitiesSupport.supportsFrequentUpdates ? 'Yes' : 'No',
          showCopy: false,
          tooltip: formatMessage(messages.nsSupportsLiveActivitiesFrequentUpdatesTooltip)
        }
      );

      // Only show App MinimumOSVersion if there's a potential mismatch
      if (liveActivitiesSupport.minimumOSVersion && iosVersion) {
        const appMinVersion = liveActivitiesSupport.minimumOSVersion;
        
        // Use utility function to check version compatibility
        if (isDeviceVersionBelowAppMinimum(iosVersion, appMinVersion)) {
          dataRows.push({
            label: formatMessage(messages.appMinimumOSVersion),
            value: `${appMinVersion} (⚠️ Device iOS ${iosVersion} below app minimum)`,
            showCopy: false,
            tooltip: formatMessage(messages.appMinimumOSVersionWarningTooltip)
          });
        } else {
          dataRows.push({
            label: formatMessage(messages.appMinimumOSVersion),
            value: appMinVersion,
            showCopy: false,
            tooltip: formatMessage(messages.appMinimumOSVersionTooltip)
          });
        }
      }
    }

    // Add Live Activities count if device supports them
    if (validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT) {
      const activityCount = liveActivities.activityTypes.size;
      dataRows.push({
        label: formatMessage(messages.liveActivities),
        value: activityCount === 0 ? 'None detected' : `${activityCount} registered`,
        showCopy: false,
        tooltip: activityCount === 0 
          ? 'No Live Activities have been registered in this session. This could indicate that the app does not have Live Activities configured or no activities have been started.'
          : `Found ${activityCount} Live Activity type(s) registered in this session.`
      });
    }


  }

  // Get Live Activities table data for horizontal display
  const liveActivitiesTableData = (validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT) 
    ? createLiveActivitiesTableData(liveActivities.activityTypes, validationStatus)
    : [];

  return (
    <View>
      <Flex gap="size-100" alignItems="center" marginBottom="size-200">
        <StatusLight variant={statusConfig.variant} />
        <Heading level={4}>
          {formatMessage(messages.title)}
        </Heading>
      </Flex>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <tbody>
          {dataRows.map(row => {
            // Handle separator rows
            if (row.label === '---') {
              return (
                <tr key={`separator-${Math.random()}`} style={{ borderBottom: '2px solid #e1e1e1' }}>
                  <td colSpan={2} style={{ padding: '8px 16px', backgroundColor: '#f5f5f5' }}>
                    <Text UNSAFE_style={{ fontSize: '12px', color: '#666' }}>Next Activity</Text>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={row.label} style={{ borderBottom: '1px solid #e1e1e1' }}>
                <td style={{ fontWeight: 500, padding: '12px 16px' }}>
                  <Flex alignItems="center" gap="size-100">
                    <Text>{row.label}</Text>
                    {row.tooltip && (
                      <TooltipTrigger delay={200}>
                        <ActionButton isQuiet aria-label={`${row.label} information`}>
                          <Info size="XS" />
                        </ActionButton>
                        <Tooltip>
                          <Text>{row.tooltip}</Text>
                        </Tooltip>
                      </TooltipTrigger>
                    )}
                  </Flex>
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    maxWidth: row.isLongData ? 300 : undefined,
                    wordBreak: row.isLongData ? 'break-all' : undefined
                  }}
                >
                  {row.showCopy ? (
                    <CopyableValue 
                      value={row.value} 
                      maxLength={row.isLongData ? COPYABLE_VALUE_CONSTANTS.LONG_DATA_MAX_LENGTH : COPYABLE_VALUE_CONSTANTS.DEFAULT_MAX_LENGTH}
                      copyTooltip={formatMessage(messages.copyValue)}
                      copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                      copiedMessage={formatMessage(messages.copied)}
                    />
                  ) : (
                    <Text>{row.value}</Text>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Live Activities Table */}
      {liveActivitiesTableData.length > 0 && (
        <View marginTop="size-300">
          <Heading level={5} marginBottom="size-200">{formatMessage(messages.registeredActivities)}</Heading>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e1e1e1' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e1e1e1' }}>
                  <Text UNSAFE_style={{ fontWeight: 600 }}>{formatMessage(messages.activityType)}</Text>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e1e1e1' }}>
                  <Text UNSAFE_style={{ fontWeight: 600 }}>{formatMessage(messages.pushToStartToken)}</Text>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #e1e1e1' }}>
                  <Text UNSAFE_style={{ fontWeight: 600 }}>{formatMessage(messages.updateToken)}</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {liveActivitiesTableData.map((activity, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e1e1e1' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                    <Text>{activity.activityType}</Text>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                    {activity.pushToStartToken !== 'Not available' ? (
                      <CopyableValue 
                        value={activity.pushToStartToken} 
                        maxLength={COPYABLE_VALUE_CONSTANTS.TOKEN_MAX_LENGTH}
                        copyTooltip={formatMessage(messages.copyValue)}
                        copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                        copiedMessage={formatMessage(messages.copied)}
                      />
                    ) : (
                      <Text UNSAFE_style={{ color: '#666' }}>{activity.pushToStartToken}</Text>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                    {activity.updateToken !== 'Not available' ? (
                      <CopyableValue 
                        value={activity.updateToken} 
                        maxLength={COPYABLE_VALUE_CONSTANTS.TOKEN_MAX_LENGTH}
                        copyTooltip={formatMessage(messages.copyValue)}
                        copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                        copiedMessage={formatMessage(messages.copied)}
                      />
                    ) : (
                      <Text UNSAFE_style={{ color: '#666' }}>{activity.updateToken}</Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </View>
      )}
      
      <View marginTop="size-200">
        <Link href="https://developer.apple.com/documentation/activitykit" target="_blank">
          {formatMessage(messages.learnMore)}
        </Link>
      </View>
    </View>
  );
};

export default LiveActivitiesValidationSection;
