import { StatusLight } from '@adobe/react-spectrum';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  active: {
    id: 'activity.status.active',
    defaultMessage: 'Active'
  },
  completed: {
    id: 'activity.status.completed',
    defaultMessage: 'Completed'
  }
});

interface ActivityStatusProps {
  status: 'active' | 'completed';
}

function ActivityStatus({ status }: ActivityStatusProps) {
  const { formatMessage } = useIntl();

  if (status === 'active') {
    return (
      <StatusLight variant="positive" UNSAFE_className="status-light-compact">
        {formatMessage(messages.active)}
      </StatusLight>
    );
  }

  return (
    <StatusLight variant="info" UNSAFE_className="status-light-compact">
      {formatMessage(messages.completed)}
    </StatusLight>
  );
}

export default ActivityStatus;
