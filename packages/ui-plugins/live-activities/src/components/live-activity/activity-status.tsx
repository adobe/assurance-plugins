import { StatusLight } from '@adobe/react-spectrum';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  active: {
    id: 'activity.status.active',
    defaultMessage: 'Active'
  },
  inactive: {
    id: 'activity.status.inactive',
    defaultMessage: 'Inactive'
  },
  completed: {
    id: 'activity.status.completed',
    defaultMessage: 'Completed'
  }
});

interface ActivityStatusProps {
  status: 'active' | 'inactive' | 'completed';
}

function ActivityStatus({ status }: ActivityStatusProps) {
  const { formatMessage } = useIntl();

  if (status === 'active') {
    return (
      <StatusLight variant="info" UNSAFE_className="status-light-compact">
        {formatMessage(messages.active)}
      </StatusLight>
    );
  }

  if (status === 'inactive') {
    return (
      <StatusLight variant="negative" UNSAFE_className="status-light-compact">
        {formatMessage(messages.inactive)}
      </StatusLight>
    );
  }

  return (
    <StatusLight variant="positive" UNSAFE_className="status-light-compact">
      {formatMessage(messages.completed)}
    </StatusLight>
  );
}

export default ActivityStatus;
