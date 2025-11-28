import React from 'react';

import { ColumnDef, EventTable } from '@assurance/event-table';

import useGroupedEvents from '../hooks/useGroupedEvents';

const typeColumn: ColumnDef<any> = {
  accessorKey: 'type',
  header: 'Type'
};

const countColumn: ColumnDef<any> = {
  accessorKey: 'events',
  header: 'Count',
  cell: props => props.getValue<any[]>().length
};

function GroupedEvents() {
  const events = useGroupedEvents(); // Returns our grouped data list

  return <EventTable columns={[typeColumn, countColumn]} data={events as any[]} />;
}

export default GroupedEvents;
