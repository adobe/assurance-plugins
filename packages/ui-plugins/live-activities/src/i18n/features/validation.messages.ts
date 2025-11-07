import { defineMessages } from 'react-intl';

/**
 * Validation feature messages
 * Used for validation screens and status displays
 */
export const validationMessages = defineMessages({
  // Title
  title: {
    id: 'validation.liveActivities.title',
    defaultMessage: 'Live Activities'
  },
  
  // Not Supported
  notSupported: {
    id: 'validation.liveActivities.notSupported',
    defaultMessage: 'Live Activities Not Supported'
  },
  notSupportedDetails: {
    id: 'validation.liveActivities.notSupportedDetails',
    defaultMessage: 'Live Activities require iOS 16.1 or later. This device is running iOS {version}.'
  },
  
  // Basic Support
  basicSupport: {
    id: 'validation.liveActivities.basicSupport',
    defaultMessage: 'Basic Live Activities Support'
  },
  basicSupportDetails: {
    id: 'validation.liveActivities.basicSupportDetails',
    defaultMessage: 'This device supports basic Live Activities features (iOS {version}). Validating: Registration, Update tokens, Per-activity schema.'
  },
  
  // Full Support
  fullSupport: {
    id: 'validation.liveActivities.fullSupport',
    defaultMessage: 'Full Live Activities Support'
  },
  fullSupportDetails: {
    id: 'validation.liveActivities.fullSupportDetails',
    defaultMessage: 'This device supports all Live Activities features (iOS {version}). Validating: Registration, Update tokens, Push-to-start tokens, Per-activity schema.'
  },
  
  // Unknown/Not iOS
  unknown: {
    id: 'validation.liveActivities.unknown',
    defaultMessage: 'iOS Version Unknown'
  },
  unknownDetails: {
    id: 'validation.liveActivities.unknownDetails',
    defaultMessage: 'Unable to determine iOS version. Please ensure the device is properly connected.'
  },
  notIOS: {
    id: 'validation.liveActivities.notIOS',
    defaultMessage: 'Not an iOS Device'
  },
  notIOSDetails: {
    id: 'validation.liveActivities.notIOSDetails',
    defaultMessage: 'Live Activities are only supported on iOS devices.'
  },
  
  // Form Labels
  status: {
    id: 'validation.form.status',
    defaultMessage: 'Status'
  },
  iosVersion: {
    id: 'validation.form.iosVersion',
    defaultMessage: 'iOS Version'
  },
  deviceType: {
    id: 'validation.form.deviceType',
    defaultMessage: 'Device Type'
  },
  minimumRequired: {
    id: 'validation.form.minimumRequired',
    defaultMessage: 'Minimum Required'
  },
  nsSupportsLiveActivities: {
    id: 'validation.form.nsSupportsLiveActivities',
    defaultMessage: 'NSSupportsLiveActivities'
  },
  nsSupportsLiveActivitiesFrequentUpdates: {
    id: 'validation.form.nsSupportsLiveActivitiesFrequentUpdates',
    defaultMessage: 'NSSupportsLiveActivitiesFrequentUpdates'
  },
  appMinimumOSVersion: {
    id: 'validation.form.appMinimumOSVersion',
    defaultMessage: 'App MinimumOSVersion'
  },
  liveActivities: {
    id: 'validation.form.liveActivities',
    defaultMessage: 'Live Activities'
  },
  pushToStartToken: {
    id: 'validation.form.pushToStartToken',
    defaultMessage: 'PushToStart Token'
  },
  
  // Form Values
  yes: {
    id: 'validation.values.yes',
    defaultMessage: 'Yes'
  },
  no: {
    id: 'validation.values.no',
    defaultMessage: 'No'
  },
  unknownValue: {
    id: 'validation.values.unknown',
    defaultMessage: 'Unknown'
  },
  noneDetected: {
    id: 'validation.values.noneDetected',
    defaultMessage: 'None detected'
  },
  registered: {
    id: 'validation.values.registered',
    defaultMessage: 'registered'
  },
  notAvailable: {
    id: 'validation.values.notAvailable',
    defaultMessage: 'Not available'
  },
  
  // Tooltips
  statusTooltip: {
    id: 'validation.tooltips.status',
    defaultMessage: 'Current Live Activities support status based on iOS version and app configuration.'
  },
  iosVersionTooltip: {
    id: 'validation.tooltips.iosVersion',
    defaultMessage: 'The iOS version running on this device. Live Activities require iOS 16.1 or later.'
  },
  deviceTypeTooltip: {
    id: 'validation.tooltips.deviceType',
    defaultMessage: 'The type of device (iPhone, iPad, etc.). Live Activities are supported on all iOS devices with iOS 16.1+.'
  },
  minimumRequiredTooltip: {
    id: 'validation.tooltips.minimumRequired',
    defaultMessage: 'The minimum iOS version required for Live Activities. This is iOS 16.1, which introduced Live Activities.'
  },
  nsSupportsLiveActivitiesTooltip: {
    id: 'validation.tooltips.nsSupportsLiveActivities',
    defaultMessage: "Indicates whether the app declares support for Live Activities in its Info.plist. This should be 'Yes' for Live Activities to work."
  },
  nsSupportsLiveActivitiesFrequentUpdatesTooltip: {
    id: 'validation.tooltips.nsSupportsLiveActivitiesFrequentUpdates',
    defaultMessage: 'Indicates whether the app supports frequent Live Activities updates. This enables more dynamic content updates.'
  },
  appMinimumOSVersionTooltip: {
    id: 'validation.tooltips.appMinimumOSVersion',
    defaultMessage: 'The minimum iOS version the app declares it supports. If this is below the device version, there may be compatibility issues.'
  },
  appMinimumOSVersionWarningTooltip: {
    id: 'validation.tooltips.appMinimumOSVersionWarning',
    defaultMessage: "The device iOS version is below the app's minimum required version. This may cause compatibility issues with Live Activities."
  },
  appMinimumOSVersionWarning: {
    id: 'validation.warnings.appMinimumOSVersionWarning',
    defaultMessage: 'Device iOS {iosVersion} below app minimum'
  },
  liveActivitiesTooltipNone: {
    id: 'validation.tooltips.liveActivitiesNone',
    defaultMessage: 'No Live Activities have been registered in this session. This could indicate that the app does not have Live Activities configured or no activities have been started.'
  },
  liveActivitiesTooltipFound: {
    id: 'validation.tooltips.liveActivitiesFound',
    defaultMessage: 'Found {count} Live Activity type(s) registered in this session.'
  },
  pushToStartTokenTooltip: {
    id: 'validation.tooltips.pushToStartToken',
    defaultMessage: 'PushToStart token for Live Activities push notifications'
  },
  pushToStartTokenTooltipNone: {
    id: 'validation.tooltips.pushToStartTokenNone',
    defaultMessage: 'No PushToStart token available'
  },
  
  // Table
  registeredActivities: {
    id: 'validation.table.registeredActivities',
    defaultMessage: 'Registered Live Activities'
  },
  activityType: {
    id: 'validation.table.activityType',
    defaultMessage: 'Activity Type'
  },
  noRegisteredActivitiesTitle: {
    id: 'validation.empty.noRegisteredActivitiesTitle',
    defaultMessage: 'No Registered Live Activities'
  },
  noRegisteredActivitiesDescription: {
    id: 'validation.empty.noRegisteredActivitiesDescription',
    defaultMessage: 'No Live Activities have been registered in this session. This could indicate that the app does not have Live Activities configured or no activities have been started yet.'
  },
  
  // Links
  learnMore: {
    id: 'validation.links.learnMore',
    defaultMessage: 'Learn more about Live Activities requirements'
  }
});

