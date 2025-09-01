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

import { useClientIOSVersion, useClientLiveActivitiesSupport, useClientDeviceType } from '../../hooks/useClientInfo';
import { useLiveActivitiesValidationStatus } from '../../hooks/useLiveActivitiesValidationStatus';
import { LIVE_ACTIVITIES_MIN_VERSION } from '../../constants';
import { CopyableValue } from '../../utils/utils';
import { getStatusDisplayConfig, isDeviceVersionBelowAppMinimum } from '../../utils/liveActivitiesValidation';


const MSG = {
  title: 'Live Activities',
  notSupported: 'Live Activities Not Supported',
  notSupportedDetails: 'Live Activities require iOS 16.1 or later. This device is running iOS {version}.',
  basicSupport: 'Basic Live Activities Support',
  basicSupportDetails: 'This device supports basic Live Activities features (iOS {version}). Validating: Registration, Update tokens, Per-activity schema.',
  fullSupport: 'Full Live Activities Support',
  fullSupportDetails: 'This device supports all Live Activities features including PushToStart (iOS {version}). Validating: Registration, Update tokens, Per-activity schema, PushToStart tokens.',
  unknown: 'iOS Version Unknown',
  unknownDetails: 'Unable to determine iOS version. Please ensure the device is properly connected.',
  notIOS: 'Not an iOS Device',
  notIOSDetails: 'Live Activities are only supported on iOS devices.',
  learnMore: 'Learn more about Live Activities requirements',
  // Table row tooltips
  statusTooltip: 'Current Live Activities support status based on iOS version and app configuration.',
  iosVersionTooltip: 'The iOS version running on this device. Live Activities require iOS 16.1 or later.',
  deviceTypeTooltip: 'The type of device (iPhone, iPad, etc.). Live Activities are supported on all iOS devices with iOS 16.1+.',
  minimumRequiredTooltip: 'The minimum iOS version required for Live Activities. This is iOS 16.1, which introduced Live Activities.',
  nsSupportsLiveActivitiesTooltip: 'Indicates whether the app declares support for Live Activities in its Info.plist. This should be "Yes" for Live Activities to work.',
  nsSupportsLiveActivitiesFrequentUpdatesTooltip: 'Indicates whether the app supports frequent Live Activities updates. This enables more dynamic content updates.',
  appMinimumOSVersionTooltip: 'The minimum iOS version the app declares it supports. If this is below the device version, there may be compatibility issues.',
  appMinimumOSVersionWarningTooltip: 'The device iOS version is below the app\'s minimum required version. This may cause compatibility issues with Live Activities.'
};

const LiveActivitiesValidationSection = () => {
  const validationStatus = useLiveActivitiesValidationStatus();
  const iosVersion = useClientIOSVersion();
  const liveActivitiesSupport = useClientLiveActivitiesSupport();
  const deviceType = useClientDeviceType();

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
      label: 'Status',
      value: statusConfig.title,
      showCopy: false,
      tooltip: MSG.statusTooltip
    }
  ];

  // Only show iOS-specific rows for iOS devices
  if (validationStatus !== 'not-ios') {
    dataRows.push(
      {
        label: 'iOS Version',
        value: iosVersion || 'Unknown',
        showCopy: true,
        tooltip: MSG.iosVersionTooltip
      },
      {
        label: 'Device Type',
        value: deviceType || 'Unknown',
        showCopy: false,
        tooltip: MSG.deviceTypeTooltip
      }
    );

    // Only show minimum required for iOS devices that don't support Live Activities
    if (validationStatus === 'not-supported') {
      dataRows.push({
        label: 'Minimum Required',
        value: `iOS ${LIVE_ACTIVITIES_MIN_VERSION}`,
        showCopy: false,
        tooltip: MSG.minimumRequiredTooltip
      });
    }

    // Add app configuration rows if available and device supports Live Activities
    if (liveActivitiesSupport && (validationStatus === 'basic-support' || validationStatus === 'full-support')) {
      dataRows.push(
        {
          label: 'NSSupportsLiveActivities',
          value: liveActivitiesSupport.supportsLiveActivities ? 'Yes' : 'No',
          showCopy: false,
          tooltip: MSG.nsSupportsLiveActivitiesTooltip
        },
        {
          label: 'NSSupportsLiveActivitiesFrequentUpdates',
          value: liveActivitiesSupport.supportsFrequentUpdates ? 'Yes' : 'No',
          showCopy: false,
          tooltip: MSG.nsSupportsLiveActivitiesFrequentUpdatesTooltip
        }
      );

      // Only show App MinimumOSVersion if there's a potential mismatch
      if (liveActivitiesSupport.minimumOSVersion && iosVersion) {
        const appMinVersion = liveActivitiesSupport.minimumOSVersion;
        
        // Use utility function to check version compatibility
        if (isDeviceVersionBelowAppMinimum(iosVersion, appMinVersion)) {
          dataRows.push({
            label: 'App MinimumOSVersion',
            value: `${appMinVersion} (⚠️ Device iOS ${iosVersion} below app minimum)`,
            showCopy: false,
            tooltip: MSG.appMinimumOSVersionWarningTooltip
          });
        } else {
          dataRows.push({
            label: 'App MinimumOSVersion',
            value: appMinVersion,
            showCopy: false,
            tooltip: MSG.appMinimumOSVersionTooltip
          });
        }
      }
    }


  }

  return (
    <View>
      <Flex gap="size-100" alignItems="center" marginBottom="size-200">
        <StatusLight variant={statusConfig.variant} />
        <Heading level={4}>
          {MSG.title}
        </Heading>
      </Flex>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <tbody>
          {dataRows.map(row => (
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
                {row.showCopy ? <CopyableValue value={row.value} /> : <Text>{row.value}</Text>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <View marginTop="size-200">
        <Link href="https://developer.apple.com/documentation/activitykit" target="_blank">
          {MSG.learnMore}
        </Link>
      </View>
    </View>
  );
};

export default LiveActivitiesValidationSection;
