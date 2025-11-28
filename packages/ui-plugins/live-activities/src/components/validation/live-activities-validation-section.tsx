import React from 'react';

import {
  ActionButton,
  Cell,
  Column,
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Link,
  Row,
  StatusLight,
  TableBody,
  TableHeader,
  TableView,
  Text,
  Tooltip,
  TooltipTrigger,
  View
} from '@adobe/react-spectrum';
import { CopyableValue } from '@assurance/common-utils';
import Info from '@spectrum-icons/workflow/InfoOutline';
import Search from '@spectrum-icons/workflow/Search';
import { useIntl } from 'react-intl';

import {
  COPYABLE_VALUE_CONSTANTS,
  LIVE_ACTIVITIES_MIN_VERSION,
  VALIDATION_STATUS
} from '../../constants';
import { TEST_IDS } from '../../constants/testIds';
import { useLiveActivitiesData } from '../../hooks/useActivities';
import {
  useClientDeviceType,
  useClientIOSVersion,
  useClientLiveActivitiesSupport,
  useSelectedClientPushToStartToken
} from '../../hooks/useClientInfo';
import { useLiveActivitiesValidationStatus } from '../../hooks/useLiveActivitiesValidationStatus';
import { copyMessages, validationMessages } from '../../i18n';
import { createLiveActivitiesTableData } from '../../utils/liveActivitiesDisplay';
import {
  getStatusDisplayConfig,
  isDeviceVersionBelowAppMinimum
} from '../../utils/liveActivitiesValidation';

// Constants for UI elements
const WARNING_EMOJI = '⚠️';

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
      label: formatMessage(validationMessages.status),
      value: statusConfig.title,
      showCopy: false,
      tooltip: formatMessage(validationMessages.statusTooltip)
    }
  ];

  // Only show iOS-specific rows for iOS devices
  if (validationStatus !== VALIDATION_STATUS.NOT_IOS) {
    dataRows.push(
      {
        label: formatMessage(validationMessages.iosVersion),
        value: iosVersion || formatMessage(validationMessages.unknownValue),
        showCopy: true,
        tooltip: formatMessage(validationMessages.iosVersionTooltip)
      },
      {
        label: formatMessage(validationMessages.deviceType),
        value: deviceType || formatMessage(validationMessages.unknownValue),
        showCopy: false,
        tooltip: formatMessage(validationMessages.deviceTypeTooltip)
      }
    );

    // Only show minimum required for iOS devices that don't support Live Activities
    if (validationStatus === VALIDATION_STATUS.NOT_SUPPORTED) {
      dataRows.push({
        label: formatMessage(validationMessages.minimumRequired),
        value: `iOS ${LIVE_ACTIVITIES_MIN_VERSION}`,
        showCopy: false,
        tooltip: formatMessage(validationMessages.minimumRequiredTooltip)
      });
    }

    // Add app configuration rows if available and device supports Live Activities
    if (
      liveActivitiesSupport &&
      (validationStatus === VALIDATION_STATUS.BASIC_SUPPORT ||
        validationStatus === VALIDATION_STATUS.FULL_SUPPORT)
    ) {
      dataRows.push(
        {
          label: formatMessage(validationMessages.nsSupportsLiveActivities),
          value: liveActivitiesSupport.supportsLiveActivities
            ? formatMessage(validationMessages.yes)
            : formatMessage(validationMessages.no),
          showCopy: false,
          tooltip: formatMessage(validationMessages.nsSupportsLiveActivitiesTooltip)
        },
        {
          label: formatMessage(validationMessages.nsSupportsLiveActivitiesFrequentUpdates),
          value: liveActivitiesSupport.supportsFrequentUpdates
            ? formatMessage(validationMessages.yes)
            : formatMessage(validationMessages.no),
          showCopy: false,
          tooltip: formatMessage(validationMessages.nsSupportsLiveActivitiesFrequentUpdatesTooltip)
        }
      );

      // Only show App MinimumOSVersion if there's a potential mismatch
      if (liveActivitiesSupport.minimumOSVersion && iosVersion) {
        const appMinVersion = liveActivitiesSupport.minimumOSVersion;

        // Use utility function to check version compatibility
        if (isDeviceVersionBelowAppMinimum(iosVersion, appMinVersion)) {
          dataRows.push({
            label: formatMessage(validationMessages.appMinimumOSVersion),
            value: `${appMinVersion} (${WARNING_EMOJI} ${formatMessage(validationMessages.appMinimumOSVersionWarning, { iosVersion })})`,
            showCopy: false,
            tooltip: formatMessage(validationMessages.appMinimumOSVersionWarningTooltip)
          });
        } else {
          dataRows.push({
            label: formatMessage(validationMessages.appMinimumOSVersion),
            value: appMinVersion,
            showCopy: false,
            tooltip: formatMessage(validationMessages.appMinimumOSVersionTooltip)
          });
        }
      }
    }

    // Add Live Activities count if device supports them
    if (
      validationStatus === VALIDATION_STATUS.BASIC_SUPPORT ||
      validationStatus === VALIDATION_STATUS.FULL_SUPPORT
    ) {
      const activityCount = liveActivities.activityTypes.size;
      dataRows.push({
        label: formatMessage(validationMessages.liveActivities),
        value:
          activityCount === 0
            ? formatMessage(validationMessages.noneDetected)
            : `${activityCount} ${formatMessage(validationMessages.registered)}`,
        showCopy: false,
        tooltip:
          activityCount === 0
            ? formatMessage(validationMessages.liveActivitiesTooltipNone)
            : formatMessage(validationMessages.liveActivitiesTooltipFound, { count: activityCount })
      });

      // Add PushToStart Token for iOS 17.1+ (full support only)
      if (validationStatus === VALIDATION_STATUS.FULL_SUPPORT) {
        dataRows.push({
          label: formatMessage(validationMessages.pushToStartToken),
          value: pushToStartToken || formatMessage(validationMessages.notAvailable),
          showCopy: !!pushToStartToken,
          isLongData: true,
          tooltip: pushToStartToken
            ? formatMessage(validationMessages.pushToStartTokenTooltip)
            : formatMessage(validationMessages.pushToStartTokenTooltipNone)
        });
      }
    }
  }

  // Get registered Live Activities table data (always show activities, push-to-start tokens only for iOS 17.1+)
  const registeredActivitiesTableData =
    validationStatus === VALIDATION_STATUS.BASIC_SUPPORT ||
    validationStatus === VALIDATION_STATUS.FULL_SUPPORT
      ? createLiveActivitiesTableData(liveActivities.activityTypes, validationStatus)
      : [];

  // Empty state renderers
  const renderRegisteredActivitiesEmptyState = () => (
    <IllustratedMessage data-testid={TEST_IDS.NO_REGISTERED_ACTIVITIES_MESSAGE}>
      <Search />
      <Heading>{formatMessage(validationMessages.noRegisteredActivitiesTitle)}</Heading>
      <Content>{formatMessage(validationMessages.noRegisteredActivitiesDescription)}</Content>
    </IllustratedMessage>
  );

  return (
    <div
      data-testid={TEST_IDS.LIVE_ACTIVITIES_VALIDATION_SECTION}
      role="region"
      aria-labelledby="live-activities-validation-title"
    >
      <Flex gap="size-100" alignItems="center" marginBottom="size-200">
        <StatusLight
          variant={statusConfig.variant}
          data-testid={TEST_IDS.STATUS_LIGHT}
          aria-label={`Live Activities validation status: ${statusConfig.title}`}
        />
        <Heading level={4} id="live-activities-validation-title">
          {formatMessage(validationMessages.title)}
        </Heading>
      </Flex>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 'var(--spectrum-global-dimension-size-200)'
        }}
      >
        <tbody>
          {dataRows.map((row, index) => {
            // Handle separator rows
            if (row.label === '---') {
              return (
                <tr
                  key={`separator-${index}`}
                  style={{ backgroundColor: 'var(--spectrum-global-color-gray-100)' }}
                >
                  <td
                    colSpan={2}
                    style={{
                      padding:
                        'var(--spectrum-global-dimension-size-100) var(--spectrum-global-dimension-size-200)',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--spectrum-global-color-gray-700)'
                    }}
                  >
                    <Text
                      UNSAFE_style={{
                        fontSize: 'var(--spectrum-global-dimension-size-100)',
                        color: 'var(--spectrum-global-color-gray-700)'
                      }}
                    >
                      Next Activity
                    </Text>
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={row.label}
                style={{ borderBottom: '1px solid var(--spectrum-global-color-gray-300)' }}
              >
                <td
                  style={{
                    padding:
                      'var(--spectrum-global-dimension-size-100) var(--spectrum-global-dimension-size-200)',
                    fontWeight: 600,
                    verticalAlign: 'top',
                    width: '40%'
                  }}
                >
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
                    padding:
                      'var(--spectrum-global-dimension-size-100) var(--spectrum-global-dimension-size-200)',
                    verticalAlign: 'top',
                    wordBreak: row.isLongData ? 'break-all' : 'break-word',
                    maxWidth: row.isLongData ? '300px' : 'none'
                  }}
                >
                  {row.showCopy ? (
                    <CopyableValue
                      value={row.value}
                      maxLength={
                        row.isLongData
                          ? COPYABLE_VALUE_CONSTANTS.LONG_DATA_MAX_LENGTH
                          : COPYABLE_VALUE_CONSTANTS.DEFAULT_MAX_LENGTH
                      }
                      copyTooltip={formatMessage(copyMessages.copyValue)}
                      copyFullValueTooltip={formatMessage(copyMessages.copyFullValue)}
                      copiedMessage={formatMessage(copyMessages.copied)}
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
      {(validationStatus === VALIDATION_STATUS.BASIC_SUPPORT ||
        validationStatus === VALIDATION_STATUS.FULL_SUPPORT) && (
        <View marginTop="size-300">
          <Heading level={5} marginBottom="size-200">
            {formatMessage(validationMessages.registeredActivities)}
          </Heading>
          <TableView
            aria-label={formatMessage(validationMessages.registeredActivities)}
            data-testid={TEST_IDS.REGISTERED_ACTIVITIES_TABLE}
            renderEmptyState={renderRegisteredActivitiesEmptyState}
          >
            <TableHeader data-testid={TEST_IDS.REGISTERED_ACTIVITIES_HEADER}>
              <Column data-testid={TEST_IDS.ACTIVITY_TYPE_COLUMN}>
                {formatMessage(validationMessages.activityType)}
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
          {formatMessage(validationMessages.learnMore)}
        </Link>
      </View>
    </div>
  );
};

export default LiveActivitiesValidationSection;
