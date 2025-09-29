/**
 * Test IDs for Live Activities validation components
 * Used for reliable testing and accessibility
 */
export const TEST_IDS = {
  // Main sections
  LIVE_ACTIVITIES_VALIDATION_SECTION: 'live-activities-validation-section',
  LIVE_ACTIVITIES_STATUS: 'live-activities-status',
  LIVE_ACTIVITIES_SUMMARY: 'live-activities-summary',

  // Status indicators
  STATUS_LIGHT: 'live-activities-status-light',
  STATUS_TOOLTIP: 'live-activities-status-tooltip',

  // Tables
  REGISTERED_ACTIVITIES_TABLE: 'registered-activities-table',
  ACTIVE_ACTIVITIES_TABLE: 'active-activities-table',

  // Table headers
  REGISTERED_ACTIVITIES_HEADER: 'registered-activities-header',
  ACTIVE_ACTIVITIES_HEADER: 'active-activities-header',

  // Table columns
  ACTIVITY_TYPE_COLUMN: 'activity-type-column',
  PUSH_TO_START_TOKEN_COLUMN: 'push-to-start-token-column',
  LIVE_ACTIVITY_ID_COLUMN: 'live-activity-id-column',
  ACTIVITY_ATTRIBUTE_TYPE_COLUMN: 'activity-attribute-type-column',
  UPDATE_TOKEN_COLUMN: 'update-token-column',

  // Table rows
  REGISTERED_ACTIVITY_ROW: (index: number) => `registered-activity-row-${index}`,
  ACTIVE_ACTIVITY_ROW: (index: number) => `active-activity-row-${index}`,

  // Table cells
  REGISTERED_ACTIVITY_TYPE_CELL: (index: number) => `registered-activity-type-cell-${index}`,
  REGISTERED_PUSH_TO_START_TOKEN_CELL: (index: number) =>
    `registered-push-to-start-token-cell-${index}`,
  ACTIVE_ACTIVITY_ID_CELL: (index: number) => `active-activity-id-cell-${index}`,
  ACTIVE_ACTIVITY_ATTRIBUTE_TYPE_CELL: (index: number) =>
    `active-activity-attribute-type-cell-${index}`,
  ACTIVE_UPDATE_TOKEN_CELL: (index: number) => `active-update-token-cell-${index}`,

  // Copy buttons
  COPY_BUTTON: (type: string, index: number) => `copy-button-${type}-${index}`,
  COPY_TOOLTIP: (type: string, index: number) => `copy-tooltip-${type}-${index}`,

  // Empty states
  NO_REGISTERED_ACTIVITIES_MESSAGE: 'no-registered-activities-message',
  NO_ACTIVE_ACTIVITIES_MESSAGE: 'no-active-activities-message',

  // Links
  APPLE_DOCUMENTATION_LINK: 'apple-documentation-link',

  // Tooltips
  IOS_VERSION_TOOLTIP: 'ios-version-tooltip',
  DEVICE_TYPE_TOOLTIP: 'device-type-tooltip',
  APP_MINIMUM_VERSION_TOOLTIP: 'app-minimum-version-tooltip',
  LIVE_ACTIVITIES_SUPPORT_TOOLTIP: 'live-activities-support-tooltip',
  NSSUPPORTS_LIVE_ACTIVITIES_TOOLTIP: 'nssupports-live-activities-tooltip'
} as const;

export type TestIdKey = keyof typeof TEST_IDS;
