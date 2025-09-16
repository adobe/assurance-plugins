import { defineMessages } from 'react-intl';

// UI Configuration
export const UI_CONFIG = {
  MAX_COPY_LENGTH: 50,
  TOOLTIP_THRESHOLD: 50,
  DEBOUNCE_DELAY: 300,
  COPY_FEEDBACK_TIMEOUT: 2000,
  TRUNCATED_TEXT_MAX_WIDTH: '300px',
  ELLIPSIS: '...'
} as const;

// Event Configuration
export const EVENT_CONFIG = {
  TYPES: ['start', 'content-update', 'token-update', 'ended', 'dismissed', 'other'] as const,
  STATUSES: ['active', 'inactive', 'completed'] as const,
  EVENT_NAMES: {
    START: 'Live Activity start event',
    UPDATED: 'Live Activity updated',
    UPDATE_TOKEN: 'Live Activity update token',
    ENDED: 'Live Activity ended',
    DISMISSED: 'Live Activity dismissed'
  } as const
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  MIN_IOS_VERSION: [16, 0] as [number, number],
  SUPPORTED_PLATFORMS: ['ios', 'android'] as const,
  MESSAGING_SERVICES: ['apns', 'apnsSandbox', 'fcm'] as const
} as const;

// API Configuration
export const API_CONFIG = {
  DEBOUNCE_DELAY: 300,
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000
} as const;

// Internationalization Messages
export const MESSAGES = defineMessages({
  // Activity Overview
  activityOverview: {
    id: 'activities.overview.title',
    defaultMessage: 'Activity Overview'
  },
  basicInfo: {
    id: 'activities.overview.basicInfo',
    defaultMessage: 'Basic Information'
  },
  activityMetrics: {
    id: 'activities.overview.metrics',
    defaultMessage: 'Activity Metrics'
  },
  contentState: {
    id: 'activities.overview.contentState',
    defaultMessage: 'Current Content State'
  },
  
  // Activity Details
  liveActivityIdLabel: {
    id: 'activities.details.liveActivityId',
    defaultMessage: 'Live Activity ID'
  },
  attributeSetLabel: {
    id: 'activities.details.attributeSet',
    defaultMessage: 'Attribute Set'
  },
  startTimeLabel: {
    id: 'activities.details.startTime',
    defaultMessage: 'Start Time'
  },
  endTimeLabel: {
    id: 'activities.details.endTime',
    defaultMessage: 'End Time'
  },
  durationLabel: {
    id: 'activities.overview.duration',
    defaultMessage: 'Duration'
  },
  updateCountLabel: {
    id: 'activities.overview.updateCount',
    defaultMessage: 'Update Count'
  },
  eventCountLabel: {
    id: 'activities.overview.eventCount',
    defaultMessage: 'Event Count'
  },
  lastUpdateLabel: {
    id: 'activities.overview.lastUpdate',
    defaultMessage: 'Last Update'
  },
  
  // Copy functionality
  copyValue: {
    id: 'activities.details.copyValue',
    defaultMessage: 'Copy value'
  },
  copyFullValue: {
    id: 'activities.details.copyFullValue',
    defaultMessage: 'Copy full value'
  },
  copied: {
    id: 'activities.details.copied',
    defaultMessage: 'Copied!'
  },
  contentCopied: {
    id: 'contentState.contentCopied',
    defaultMessage: 'Content copied to clipboard'
  },
  copyContent: {
    id: 'contentState.copyContent',
    defaultMessage: 'Copy Content'
  },
  
  // Content State
  noContentState: {
    id: 'activities.details.noContentState',
    defaultMessage: 'No content state available'
  },
  viewMode: {
    id: 'contentState.viewMode',
    defaultMessage: 'View Mode'
  },
  formatted: {
    id: 'contentState.formatted',
    defaultMessage: 'Formatted'
  },
  raw: {
    id: 'contentState.raw',
    defaultMessage: 'Raw JSON'
  },
  
  // Event Details
  eventDetails: {
    id: 'activities.eventDetails.title',
    defaultMessage: 'Event Details'
  },
  eventSummary: {
    id: 'activities.eventDetails.summary',
    defaultMessage: 'Event Summary'
  },
  searchEvents: {
    id: 'activities.eventDetails.searchEvents',
    defaultMessage: 'Search events...'
  },
  filterByType: {
    id: 'activities.eventDetails.filterByType',
    defaultMessage: 'Filter by Type'
  },
  allEvents: {
    id: 'activities.eventDetails.allEvents',
    defaultMessage: 'All Events'
  },
  startEvents: {
    id: 'activities.eventDetails.startEvents',
    defaultMessage: 'Start Events'
  },
  updateEvents: {
    id: 'activities.eventDetails.updateEvents',
    defaultMessage: 'Update Events'
  },
  endEvents: {
    id: 'activities.eventDetails.endEvents',
    defaultMessage: 'End Events'
  },
  otherEvents: {
    id: 'activities.eventDetails.otherEvents',
    defaultMessage: 'Other Events'
  },
  noEventsFound: {
    id: 'activities.eventDetails.noEventsFound',
    defaultMessage: 'No events found for this Live Activity'
  },
  totalEvents: {
    id: 'activities.eventDetails.totalEvents',
    defaultMessage: 'Total Events'
  },
  eventTypes: {
    id: 'activities.eventDetails.eventTypes',
    defaultMessage: 'Event Types'
  },
  timeRange: {
    id: 'activities.eventDetails.timeRange',
    defaultMessage: 'Time Range'
  },
  
  // Activity Flow
  activityFlow: {
    id: 'activities.flow.title',
    defaultMessage: 'Activity Flow'
  },
  lifecycleEvents: {
    id: 'activities.flow.lifecycleEvents',
    defaultMessage: 'Lifecycle Events'
  },
  noEvents: {
    id: 'activities.flow.noEvents',
    defaultMessage: 'No events available'
  },
  eventType: {
    id: 'activities.flow.eventType',
    defaultMessage: 'Event Type'
  },
  timestamp: {
    id: 'activities.flow.timestamp',
    defaultMessage: 'Timestamp'
  },
  details: {
    id: 'activities.flow.details',
    defaultMessage: 'Details'
  },
  
  // Activity List
  searchPlaceholder: {
    id: 'activities.list.searchPlaceholder',
    defaultMessage: 'Search activities...'
  },
  allActivities: {
    id: 'activities.list.allActivities',
    defaultMessage: 'All'
  },
  activeActivities: {
    id: 'activities.list.activeActivities',
    defaultMessage: 'Active'
  },
  completedActivities: {
    id: 'activities.list.completedActivities',
    defaultMessage: 'Completed'
  },
  inactiveActivities: {
    id: 'activities.list.inactiveActivities',
    defaultMessage: 'Inactive'
  },
  noActivitiesFound: {
    id: 'activities.list.noActivitiesFound',
    defaultMessage: 'No activities found'
  },
  loadingActivities: {
    id: 'activities.list.loadingActivities',
    defaultMessage: 'Loading activities...'
  },
  
  // Activity Details
  noActivitySelected: {
    id: 'activities.details.noActivitySelected',
    defaultMessage: 'Select an activity to view details'
  },
  activityDetails: {
    id: 'activities.details.activityDetails',
    defaultMessage: 'Activity Details'
  },
  status: {
    id: 'activities.details.status',
    defaultMessage: 'Status'
  },
  type: {
    id: 'activities.details.type',
    defaultMessage: 'Type'
  },
  events: {
    id: 'activities.details.events',
    defaultMessage: 'Events'
  },
  started: {
    id: 'activities.details.started',
    defaultMessage: 'Started'
  },
  lastActivity: {
    id: 'activities.details.lastActivity',
    defaultMessage: 'Last Activity'
  },
  eventDetails: {
    id: 'activities.details.eventDetails',
    defaultMessage: 'Event Details'
  },
  
  // Events Count
  eventsCount: {
    id: 'activities.card.eventsCount',
    defaultMessage: 'events'
  },
  noEvents: {
    id: 'activities.card.noEvents',
    defaultMessage: 'No events'
  }
});

// Test IDs
export const TEST_IDS = {
  COPY_BUTTON: (prefix: string, index: number) => `copy-button-${prefix}-${index}`,
  ACTIVITY_CARD: (id: string) => `activity-card-${id}`,
  METRIC_CARD: (label: string) => `metric-card-${label.toLowerCase().replace(/\s+/g, '-')}`,
  EVENT_TABLE: 'event-table',
  DETAILS_PANEL: 'details-panel',
  RESIZE_HANDLE: 'resize-handle'
} as const;

// Copyable Value Constants
export const COPYABLE_VALUE_CONSTANTS = {
  DEFAULT_MAX_LENGTH: UI_CONFIG.MAX_COPY_LENGTH,
  COPY_FEEDBACK_TIMEOUT: UI_CONFIG.COPY_FEEDBACK_TIMEOUT,
  TRUNCATED_TEXT_MAX_WIDTH: UI_CONFIG.TRUNCATED_TEXT_MAX_WIDTH,
  ELLIPSIS: UI_CONFIG.ELLIPSIS
} as const;

// Live Activities Matchers
export const LIVE_ACTIVITIES_MATCHERS = {
  LIVE_ACTIVITY_EVENTS: [
    'payload.ACPExtensionEventData.liveActivityID',
    'payload.ACPExtensionEventData.data.liveActivityID',
    'payload.ACPExtensionEventData.activityId'
  ],
  LIVE_ACTIVITY_START: 'payload.ACPExtensionEventName',
  LIVE_ACTIVITY_UPDATE: 'payload.ACPExtensionEventName',
  LIVE_ACTIVITY_END: 'payload.ACPExtensionEventName'
} as const;

// Export all configuration as a single object
export const LIVE_ACTIVITIES_CONFIG = {
  UI: UI_CONFIG,
  EVENTS: EVENT_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  API: API_CONFIG,
  MESSAGES,
  TEST_IDS,
  COPYABLE_VALUE: COPYABLE_VALUE_CONSTANTS,
  MATCHERS: LIVE_ACTIVITIES_MATCHERS
} as const;
