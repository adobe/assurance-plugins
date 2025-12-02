import React from 'react';

import { propositionsResponse } from '@adobe/griffon-toolkit-aep-mobile';
import {
  EventTable,
  defaultColumns,
  flaggedColumn,
  validationColumn
} from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';

function Events() {
  const events = useEvents({
    matchers: [propositionsResponse.matcher]
  });

  return (
    <EventTable columns={[...defaultColumns, validationColumn, flaggedColumn]} data={events} />
  );
}

export default Events;
