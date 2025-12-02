import React from 'react';

import {
  EventTable,
  flaggedColumn,
  timestampColumn,
  validationColumn,
  vendorColumn
} from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';

function Events() {
  const events = useEvents(); // Returns all events currently in the session

  return (
    <EventTable
      columns={[timestampColumn, vendorColumn, validationColumn, flaggedColumn]}
      data={events}
    />
  );
}

export default Events;
