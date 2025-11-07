import { defineMessages } from 'react-intl';

/**
 * Shared content state display messages
 * Used for content state cards and viewers
 */
export const contentStateMessages = defineMessages({
  viewMode: {
    id: 'common.contentState.viewMode',
    defaultMessage: 'View Mode'
  },
  formatted: {
    id: 'common.contentState.formatted',
    defaultMessage: 'Formatted'
  },
  raw: {
    id: 'common.contentState.raw',
    defaultMessage: 'Raw JSON'
  },
  noContentState: {
    id: 'common.contentState.empty',
    defaultMessage: 'No content state available'
  },
  title: {
    id: 'common.contentState.title',
    defaultMessage: 'Current Content State'
  },
  viewModeAriaLabel: {
    id: 'common.contentState.viewModeAriaLabel',
    defaultMessage: 'Content view mode'
  },
  properties: {
    id: 'common.contentState.properties',
    defaultMessage: 'Content State ({count} properties)'
  },
  viewEventDetails: {
    id: 'common.contentState.viewEventDetails',
    defaultMessage: 'View Event Details'
  },
  viewEventDetailsTooltip: {
    id: 'common.contentState.viewEventDetailsTooltip',
    defaultMessage: 'Navigate to the event that generated this content state'
  },
  lastUpdated: {
    id: 'common.contentState.lastUpdated',
    defaultMessage: 'Last updated'
  },
  unknown: {
    id: 'common.contentState.unknown',
    defaultMessage: 'Unknown'
  },
  emptyHint: {
    id: 'common.contentState.emptyHint',
    defaultMessage: 'Content state will appear here when the activity is updated'
  }
});

