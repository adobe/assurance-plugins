import {
  View,
  Heading,
  Text,
  Flex,
  Link,
  StatusLight,
  ActionButton,
  Tooltip,
  TooltipTrigger,
  IllustratedMessage,
  Content,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell
} from '@adobe/react-spectrum';

import Info from '@spectrum-icons/workflow/InfoOutline';
import Search from '@spectrum-icons/workflow/Search';
import Alert from '@spectrum-icons/workflow/Alert';

import React from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { LIVE_ACTIVITIES_MIN_VERSION, VALIDATION_STATUS } from '../../constants';
import { COPYABLE_VALUE_CONSTANTS } from '../../constants';
import { CopyableValue } from '@assurance/common-utils';
import { TEST_IDS } from '../../constants/testIds';
import { 
  useLiveActivitiesData
} from '../../hooks/useActivities';
import { useClientIOSVersion, useClientLiveActivitiesSupport, useClientDeviceType, useSelectedClientPushToStartToken } from '../../hooks/useClientInfo';
import { useLiveActivitiesValidationStatus } from '../../hooks/useLiveActivitiesValidationStatus';
import { type LiveActivitiesValidationStatus } from '../../types/liveActivities';
import { createLiveActivitiesTableData } from '../../utils/liveActivitiesDisplay';
import { getStatusDisplayConfig, isDeviceVersionBelowAppMinimum } from '../../utils/liveActivitiesValidation';


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
  updateToken: {
    id: 'liveActivities.validation.updateToken',
    defaultMessage: 'Update Token'
  },
  registeredActivities: {
    id: 'liveActivities.validation.registeredActivities',
    defaultMessage: 'Registered Live Activities'
  },
  liveActivityId: {
    id: 'liveActivities.validation.liveActivityId',
    defaultMessage: 'Live Activity ID'
  },
  activityAttributeType: {
    id: 'liveActivities.validation.activityAttributeType',
    defaultMessage: 'Activity Attribute Type'
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
  },
  pushToStartToken: {
    id: 'liveActivities.validation.pushToStartToken',
    defaultMessage: 'PushToStart Token'
  },
  pushToStartTokenTooltip: {
    id: 'liveActivities.validation.pushToStartTokenTooltip',
    defaultMessage: 'PushToStart token for Live Activities push notifications'
  },
  noPushToStartTokenTooltip: {
    id: 'liveActivities.validation.noPushToStartTokenTooltip',
    defaultMessage: 'No PushToStart token available'
  },
  // Additional localized strings
  unknownValue: {
    id: 'liveActivities.validation.unknownValue',
    defaultMessage: 'Unknown'
  },
  yes: {
    id: 'liveActivities.validation.yes',
    defaultMessage: 'Yes'
  },
  no: {
    id: 'liveActivities.validation.no',
    defaultMessage: 'No'
  },
  noneDetected: {
    id: 'liveActivities.validation.noneDetected',
    defaultMessage: 'None detected'
  },
  registered: {
    id: 'liveActivities.validation.registered',
    defaultMessage: 'registered'
  },
  noActivitiesTooltip: {
    id: 'liveActivities.validation.noActivitiesTooltip',
    defaultMessage: 'No Live Activities have been registered in this session. This could indicate that the app does not have Live Activities configured or no activities have been started.'
  },
  foundActivitiesTooltip: {
    id: 'liveActivities.validation.foundActivitiesTooltip',
    defaultMessage: 'Found {count} Live Activity type(s) registered in this session.'
  },
  notAvailable: {
    id: 'liveActivities.validation.notAvailable',
    defaultMessage: 'Not available'
  },
  nextActivity: {
    id: 'liveActivities.validation.nextActivity',
    defaultMessage: 'Next Activity'
  },
  // Empty state messages
  noRegisteredActivitiesTitle: {
    id: 'liveActivities.validation.noRegisteredActivitiesTitle',
    defaultMessage: 'No Registered Live Activities'
  },
  noRegisteredActivitiesDescription: {
    id: 'liveActivities.validation.noRegisteredActivitiesDescription',
    defaultMessage: 'No Live Activities have been registered in this session. This could indicate that the app does not have Live Activities configured or no activities have been started yet.'
  },
  noLiveActivitiesDataTitle: {
    id: 'liveActivities.validation.noLiveActivitiesDataTitle',
    defaultMessage: 'No Live Activities Data'
  },
  noLiveActivitiesDataDescription: {
    id: 'liveActivities.validation.noLiveActivitiesDataDescription',
    defaultMessage: 'No Live Activities data is available. This could be due to device compatibility, app configuration, or no activities being used.'
  }
});

const LiveActivitiesValidationSection = () => {
  const { formatMessage } = useIntl();
  const validationStatus = useLiveActivitiesValidationStatus();
  const iosVersion = useClientIOSVersion();
  const liveActivitiesSupport = useClientLiveActivitiesSupport();
  const deviceType = useClientDeviceType();
  const liveActivities = useLiveActivitiesData();
  const pushToStartToken = useSelectedClientPushToStartToken();

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
        value: iosVersion || formatMessage(messages.unknownValue),
        showCopy: true,
        tooltip: formatMessage(messages.iosVersionTooltip)
      },
      {
        label: formatMessage(messages.deviceType),
        value: deviceType || formatMessage(messages.unknownValue),
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
          value: liveActivitiesSupport.supportsLiveActivities ? formatMessage(messages.yes) : formatMessage(messages.no),
          showCopy: false,
          tooltip: formatMessage(messages.nsSupportsLiveActivitiesTooltip)
        },
        {
          label: formatMessage(messages.nsSupportsLiveActivitiesFrequentUpdates),
          value: liveActivitiesSupport.supportsFrequentUpdates ? formatMessage(messages.yes) : formatMessage(messages.no),
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
        value: activityCount === 0 ? formatMessage(messages.noneDetected) : `${activityCount} ${formatMessage(messages.registered)}`,
        showCopy: false,
        tooltip: activityCount === 0 
          ? formatMessage(messages.noActivitiesTooltip)
          : formatMessage(messages.foundActivitiesTooltip, { count: activityCount })
      });

      // Add PushToStart Token for iOS 17.1+ (full support only)
      if (validationStatus === VALIDATION_STATUS.FULL_SUPPORT) {
        dataRows.push({
          label: formatMessage(messages.pushToStartToken),
          value: pushToStartToken || formatMessage(messages.notAvailable),
          showCopy: !!pushToStartToken,
          isLongData: true,
          tooltip: pushToStartToken 
            ? formatMessage(messages.pushToStartTokenTooltip)
            : formatMessage(messages.noPushToStartTokenTooltip)
        });
      }
    }


  }

  // Get registered Live Activities table data (always show activities, push-to-start tokens only for iOS 17.1+)
  const registeredActivitiesTableData = (validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT)
    ? createLiveActivitiesTableData(liveActivities.activityTypes, validationStatus)
    : [];


  // Empty state renderers
  const renderRegisteredActivitiesEmptyState = () => (
    <IllustratedMessage data-testid={TEST_IDS.NO_REGISTERED_ACTIVITIES_MESSAGE}>
      <Search />
      <Heading>{formatMessage(messages.noRegisteredActivitiesTitle)}</Heading>
      <Content>{formatMessage(messages.noRegisteredActivitiesDescription)}</Content>
    </IllustratedMessage>
  );


  return (
    <View data-testid={TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION}>
      <Flex gap="size-100" alignItems="center" marginBottom="size-200">
        <StatusLight variant={statusConfig.variant} data-testid={TEST_IDS.STATUS_LIGHT} />
        <Heading level={4}>
          {formatMessage(messages.title)}
        </Heading>
      </Flex>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <tbody>
          {dataRows.map((row, index) => {
            // Handle separator rows
            if (row.label === '---') {
              return (
                <tr key={`separator-${index}`} style={{ borderBottom: '2px solid #e1e1e1' }}>
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

      {/* Registered Live Activities Section - Show for iOS 16.1+ */}
      {(validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT) && (
        <View marginTop="size-300">
          <Heading level={5} marginBottom="size-200">{formatMessage(messages.registeredActivities)}</Heading>
          <TableView
            aria-label={formatMessage(messages.registeredActivities)}
            data-testid={TEST_IDS.REGISTERED_ACTIVITIES_TABLE}
            renderEmptyState={renderRegisteredActivitiesEmptyState}
          >
            <TableHeader data-testid={TEST_IDS.REGISTERED_ACTIVITIES_HEADER}>
              <Column data-testid={TEST_IDS.ACTIVITY_TYPE_COLUMN}>
                {formatMessage(messages.activityType)}
              </Column>
            </TableHeader>
            <TableBody>
              {registeredActivitiesTableData.map((activity, index) => (
                <Row key={index} data-testid={TEST_IDS.REGISTERED_ACTIVITY_ROW(index)}>
                  <Cell data-testid={TEST_IDS.REGISTERED_ACTIVITY_TYPE_CELL(index)}>
                    <Text>{activity.activityType}</Text>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        </View>
      )}

      
      <View marginTop="size-200">
        <Link 
          href="https://developer.apple.com/documentation/activitykit" 
          target="_blank"
          data-testid={TEST_IDS.APPLE_DOCUMENTATION_LINK}
        >
          {formatMessage(messages.learnMore)}
        </Link>
      </View>
    </View>
  );
};

export default LiveActivitiesValidationSection;
