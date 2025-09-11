import React from 'react';
import { combineAny } from '@adobe/griffon-toolkit';
import { EventTable, defaultColumns, flaggedColumn } from '@assurance/event-table';
import { useEvents } from '@assurance/plugin-bridge-provider';
import { View, Text, Heading, Flex } from '@adobe/react-spectrum';
import { LiveActivity } from '../../hooks/useActivities';
import { Event } from '@assurance/common-utils';
import { ColumnDef } from '@tanstack/react-table';

interface ActivityEventsProps {
  activity?: LiveActivity;
}

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

function ActivityEvents({ activity }: ActivityEventsProps) {
  if (!activity) {
    return null;
  }

  // Fetch events for this specific Live Activity
  const allEvents = useEvents<LiveActivityEvent[]>({
    matchers: [
      combineAny([
        'payload.ACPExtensionEventData.liveActivityID',
        'payload.ACPExtensionEventData.data.liveActivityID',
        'payload.ACPExtensionEventData.activityId'
      ])
    ],
    sorted: 'desc'
  });

  // Filter events by Live Activity ID
  const activityEvents = allEvents.filter(event => {
    const eventLiveActivityID = event.payload?.ACPExtensionEventData?.liveActivityID ||
                               event.payload?.ACPExtensionEventData?.data?.liveActivityID ||
                               event.payload?.ACPExtensionEventData?.activityId;
    
    return eventLiveActivityID === activity.id;
  });

  if (activityEvents.length === 0) {
    return (
      <View height="100%" overflow="auto" padding="size-400">
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Text>No events found for this Live Activity</Text>
        </Flex>
      </View>
    );
  }

  return (
    <View height="100%" overflow="auto" padding="size-200">
      <Flex alignItems="center" gap="size-100" marginBottom="size-200">
        <Heading level={3} marginY="size-0">Live Activity Events</Heading>
        <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-gray-700)' }}>({activityEvents.length} events)</Text>
      </Flex>
      <EventTable
        columns={[...defaultColumns, eventNameColumn, flaggedColumn]}
        data={activityEvents}
      />
    </View>
  );
}

export default ActivityEvents; 