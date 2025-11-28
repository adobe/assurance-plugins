import { defineMessages } from 'react-intl';

/**
 * Shared error messages
 * Common error states and messages
 */
export const errorMessages = defineMessages({
  errorTitle: {
    id: 'common.error.title',
    defaultMessage: 'Something went wrong'
  },
  errorDescription: {
    id: 'common.error.description',
    defaultMessage: 'An unexpected error occurred. Please try again.'
  },
  errorDetails: {
    id: 'common.error.details',
    defaultMessage: 'Error Details'
  },
  notFound: {
    id: 'common.error.notFound',
    defaultMessage: 'Not found'
  },
  noData: {
    id: 'common.error.noData',
    defaultMessage: 'No data available'
  }
});
