import { defineMessages } from 'react-intl';

/**
 * Shared state/status messages
 * Common states like active, completed, pending, etc.
 */
export const stateMessages = defineMessages({
  active: {
    id: 'common.state.active',
    defaultMessage: 'Active'
  },
  completed: {
    id: 'common.state.completed',
    defaultMessage: 'Completed'
  },
  pending: {
    id: 'common.state.pending',
    defaultMessage: 'Pending'
  },
  status: {
    id: 'common.state.status',
    defaultMessage: 'Status'
  }
});

