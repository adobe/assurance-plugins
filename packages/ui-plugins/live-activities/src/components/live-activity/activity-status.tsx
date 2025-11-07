import { StatusLight } from '@adobe/react-spectrum';
import React from 'react';
import { useIntl } from 'react-intl';
import { stateMessages } from '../../i18n';

interface ActivityStatusProps {
  status: 'active' | 'completed';
}

function ActivityStatus({ status }: ActivityStatusProps) {
  const { formatMessage } = useIntl();

  if (status === 'active') {
    return (
      <StatusLight variant="positive" UNSAFE_className="status-light-compact">
        {formatMessage(stateMessages.active)}
      </StatusLight>
    );
  }

  return (
    <StatusLight variant="info" UNSAFE_className="status-light-compact">
      {formatMessage(stateMessages.completed)}
    </StatusLight>
  );
}

export default ActivityStatus;
