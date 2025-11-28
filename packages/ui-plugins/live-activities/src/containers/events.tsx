import React from 'react';

import { View } from '@adobe/react-spectrum';
import { Event } from '@assurance/common-utils';
import {
  EventTable,
  defaultColumns,
  flaggedColumn,
  validationColumn
} from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';
import { ColumnDef } from '@tanstack/react-table';

interface LiveActivityEvent extends Event {
  payload?: {
    ACPExtensionEventName?: string;
    ACPExtensionEventData?: {
      liveActivityID?: string;
      data?: {
        liveActivityID?: string;
      };
      activityId?: string;
    };
  };
}

const eventNameColumn: ColumnDef<LiveActivityEvent> = {
  header: 'Event Name',
  accessorFn: event => event.payload?.ACPExtensionEventName
};

function Events() {
  const events = useEvents();

  return (
    <View>
      <EventTable
        columns={[...defaultColumns, eventNameColumn, validationColumn, flaggedColumn]}
        data={events}
      />
    </View>
  );
}

export default Events;
