import { defineMessages } from 'react-intl';

/**
 * Shared action messages used across multiple components
 * These are common UI actions like cancel, save, send, etc.
 */
export const actionMessages = defineMessages({
  cancel: {
    id: 'common.action.cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'common.action.save',
    defaultMessage: 'Save'
  },
  send: {
    id: 'common.action.send',
    defaultMessage: 'Send'
  },
  sending: {
    id: 'common.action.sending',
    defaultMessage: 'Sending...'
  },
  delete: {
    id: 'common.action.delete',
    defaultMessage: 'Delete'
  },
  update: {
    id: 'common.action.update',
    defaultMessage: 'Update'
  },
  retry: {
    id: 'common.action.retry',
    defaultMessage: 'Try Again'
  },
  refresh: {
    id: 'common.action.refresh',
    defaultMessage: 'Refresh Page'
  }
});

