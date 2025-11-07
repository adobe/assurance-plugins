import { View, Heading } from '@adobe/react-spectrum';
import { defaultColumns, EventTable, flaggedColumn, validationColumn } from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Event } from '@assurance/common-utils';

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
  accessorFn: (event) => event.payload?.ACPExtensionEventName,
};

function Events() {
  const events = useEvents();
  console.log('events *** from events.tsx in la', events);

  return (
    <View>
      <EventTable columns={[...defaultColumns, eventNameColumn, validationColumn, flaggedColumn]} data={events} />
    </View>
  );
}

export default Events;
