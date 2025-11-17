import { defineMessages } from 'react-intl';

/**
 * Activities feature messages
 * Used for activity list, details, overview, and flow screens
 */
export const activitiesMessages = defineMessages({
  // Main title
  activities: {
    id: 'activities.title',
    defaultMessage: 'Activities'
  },
  
  // Tabs
  overviewTab: {
    id: 'activities.tabs.overview',
    defaultMessage: 'Overview'
  },
  activityFlowTab: {
    id: 'activities.tabs.activityFlow',
    defaultMessage: 'Activity Flow'
  },
  eventDetailsTab: {
    id: 'activities.tabs.eventDetails',
    defaultMessage: 'Event Details'
  },
  
  // Overview
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
  duration: {
    id: 'activities.overview.duration',
    defaultMessage: 'Duration'
  },
  updateCount: {
    id: 'activities.overview.updateCount',
    defaultMessage: 'Update Count'
  },
  eventCount: {
    id: 'activities.overview.eventCount',
    defaultMessage: 'Event Count'
  },
  lastUpdate: {
    id: 'activities.overview.lastUpdate',
    defaultMessage: 'Last Update'
  },
  
  // Details
  liveActivityId: {
    id: 'activities.details.liveActivityId',
    defaultMessage: 'Live Activity ID'
  },
  attributeSet: {
    id: 'activities.details.attributeSet',
    defaultMessage: 'Attribute Set'
  },
  startTime: {
    id: 'activities.details.startTime',
    defaultMessage: 'Start Time'
  },
  endTime: {
    id: 'activities.details.endTime',
    defaultMessage: 'End Time'
  },
  noActivitySelected: {
    id: 'activities.details.noActivitySelected',
    defaultMessage: 'Select an activity to view details'
  },
  activityDetails: {
    id: 'activities.details.activityDetails',
    defaultMessage: 'Activity Details'
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
  activityEventDetails: {
    id: 'activities.details.eventDetails',
    defaultMessage: 'Event Details'
  },
  
  // Flow
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
  
  // List
  searchActivities: {
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
  noActivitiesFound: {
    id: 'activities.list.noActivitiesFound',
    defaultMessage: 'No activities found'
  },
  loadingActivities: {
    id: 'activities.list.loadingActivities',
    defaultMessage: 'Loading activities...'
  },
  noActivitiesMessage: {
    id: 'activities.noActivities',
    defaultMessage: 'No Live Activities have been started on this client'
  },
  
  // Card
  eventsCount: {
    id: 'activities.card.eventsCount',
    defaultMessage: 'events'
  },
  cardNoEvents: {
    id: 'activities.card.noEvents',
    defaultMessage: 'No events'
  },
  
  // Empty States - Platform specific
  noActivitiesIosUnsupported: {
    id: 'activities.empty.iosUnsupported',
    defaultMessage: 'Live Activities are not supported on this iOS version (requires iOS 16.1+)'
  },
  noActivitiesIosSupported: {
    id: 'activities.empty.iosSupported',
    defaultMessage: 'No Live Activities have been started on this iOS device'
  },
  
  // Hints - Platform specific
  startActivityHintIosUnsupported: {
    id: 'activities.hints.iosUnsupported',
    defaultMessage: 'Live Activities require iOS 16.1 or later. Please update your device to use this feature.'
  },
  startActivityHintIosBasicSupport: {
    id: 'activities.hints.iosBasicSupport',
    defaultMessage: 'Start a Live Activity on your iOS device to see it appear here. Remote start requires iOS 17.1+'
  },
  startActivityHintIosFullSupport: {
    id: 'activities.hints.iosFullSupport',
    defaultMessage: 'Start a Live Activity on your iOS device to see it appear here'
  },
  startActivityHintNotIos: {
    id: 'activities.hints.notIos',
    defaultMessage: 'Live Activities are only supported on iOS devices'
  },
  
  // Tooltips for Launch Button
  launchTooltipUnsupported: {
    id: 'activities.launch.tooltipUnsupported',
    defaultMessage: 'Remote Live Activity start is not supported on this platform. Live Activities can only be started locally on iOS 16.1+ devices.'
  },
  launchTooltipSupported: {
    id: 'activities.launch.tooltipSupported',
    defaultMessage: 'Start a new Live Activity remotely using registered activity types and push-to-start tokens. Requires iOS 17.1+ and proper push notification setup.'
  },
  
  // Selection prompts
  selectActivityTitle: {
    id: 'activities.select.title',
    defaultMessage: 'Select an Activity'
  },
  selectActivityDescription: {
    id: 'activities.select.description',
    defaultMessage: 'Choose an activity from the list to view its overview, flow, and event details.'
  },
  selectActivityInDetailsDescription: {
    id: 'activities.select.detailsDescription',
    defaultMessage: 'Choose an activity from the list to view its details, timeline, and events.'
  },
  
  // Empty states for filtered views
  noActivitiesAvailable: {
    id: 'activities.empty.noActivitiesAvailable',
    defaultMessage: 'No activities available'
  },
  noEventsAvailable: {
    id: 'activities.empty.noEventsAvailable',
    defaultMessage: 'No events available'
  }
});

