import React from 'react';
import { combineAny } from '@adobe/griffon-toolkit';
import { EventTable, defaultColumns, validationColumn, flaggedColumn } from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';
import useSelectedActivity from '../hooks/useSelectedActivity';
import { Event } from '@assurance/common-utils';
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
  accessorFn: (event) => event.payload?.ACPExtensionEventName,
};

function ActivityEvents() {
  const activity = useSelectedActivity();
  const events = useEvents<LiveActivityEvent[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.liveActivityID',
        'payload.ACPExtensionEventData.data.liveActivityID',
        'payload.ACPExtensionEventData.isLiveActivityPushToStartTokenEvent'
      ])
    ],
    sorted: 'desc'
  });

  if (!activity) {
    return null;
  }

  // Filter events for the selected activity using the same ID logic as useActivities
  const activityEvents = events.filter(event => {
    const eventActivityId = event.payload?.ACPExtensionEventData?.liveActivityID ||
      event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
      event.payload?.ACPExtensionEventData?.activityId;
    
    return eventActivityId === activity.id;
  });

  return (
    <EventTable
      columns={[...defaultColumns, eventNameColumn, validationColumn, flaggedColumn]}
      data={activityEvents}
    />
  );
}

export default ActivityEvents; 