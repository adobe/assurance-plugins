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
  }
});

