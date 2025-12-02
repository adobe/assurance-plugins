import { defineMessages } from 'react-intl';

/**
 * Events feature messages
 * Used for event lists, details, and filtering
 */
export const eventsMessages = defineMessages({
  // Main
  events: {
    id: 'events.title',
    defaultMessage: 'Events'
  },
  eventDetails: {
    id: 'events.details.title',
    defaultMessage: 'Event Details'
  },
  eventSummary: {
    id: 'events.summary',
    defaultMessage: 'Event Summary'
  },

  // Search & Filter
  searchEvents: {
    id: 'events.search',
    defaultMessage: 'Search events...'
  },
  filterByType: {
    id: 'events.filter.byType',
    defaultMessage: 'Filter by Type'
  },
  allEvents: {
    id: 'events.filter.all',
    defaultMessage: 'All Events'
  },
  startEvents: {
    id: 'events.filter.start',
    defaultMessage: 'Start Events'
  },
  updateEvents: {
    id: 'events.filter.update',
    defaultMessage: 'Update Events'
  },
  endEvents: {
    id: 'events.filter.end',
    defaultMessage: 'End Events'
  },
  otherEvents: {
    id: 'events.filter.other',
    defaultMessage: 'Other Events'
  },

  // Empty states
  noEventsFound: {
    id: 'events.empty.notFound',
    defaultMessage: 'No events found for this Live Activity'
  },

  // Metrics
  totalEvents: {
    id: 'events.metrics.total',
    defaultMessage: 'Total Events'
  },
  eventTypes: {
    id: 'events.metrics.types',
    defaultMessage: 'Event Types'
  },
  timeRange: {
    id: 'events.metrics.timeRange',
    defaultMessage: 'Time Range'
  }
});
