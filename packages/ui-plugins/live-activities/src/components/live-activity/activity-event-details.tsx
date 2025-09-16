import { defaultColumns } from '@assurance/event-table';

import { View, Text, Heading, Flex, SearchField, ActionGroup, Item, Well, Divider, Grid } from '@adobe/react-spectrum';

import { EventTableWithDetails } from '@assurance/event-table';

import { ColumnDef } from '@tanstack/react-table';

import React, { useState, useMemo } from 'react';

import dayjs from 'dayjs';

import { useIntl } from 'react-intl';

import InfoField from '../atoms/InfoField';
import MetricCard from '../atoms/MetricCard';
import Card from '../atoms/card';
import { MESSAGES, EVENT_CONFIG } from '../../constants/liveActivitiesConfig';
import { LiveActivity } from '../../hooks/useActivities';
import { LiveActivityEvent } from '../../types/liveActivityEvent';
import { useActivityEvents, useEventStatistics, useEventTimeRange, filterEventsByType, filterEventsBySearch } from '../../utils/eventProcessing';

interface ActivityEventDetailsProps {
  activity?: LiveActivity;
}

// Use centralized messages

const eventNameColumn: ColumnDef<LiveActivityEvent> = {
  header: 'Event Name',
  accessorFn: (event) => event.payload?.ACPExtensionEventName,
};

const eventTypeColumn: ColumnDef<LiveActivityEvent> = {
  header: 'Type',
  accessorFn: (event) => {
    const eventName = event.payload?.ACPExtensionEventName || '';
    if (eventName === 'Live Activity start event') return 'Start';
    if (eventName === 'Live Activity updated') return 'Content Update';
    if (eventName === 'Live Activity update token') return 'Token Update';
    if (eventName === 'Live Activity ended') return 'Ended';
    if (eventName === 'Live Activity dismissed') return 'Dismissed';
    return 'Other';
  },
};

function ActivityEventDetails({ activity }: ActivityEventDetailsProps) {
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<LiveActivityEvent | undefined>();
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

  if (!activity) {
    return null;
  }

  // Use new event processing utilities
  const activityEvents = useActivityEvents(activity.id);
  const eventStats = useEventStatistics(activityEvents);
  const timeRange = useEventTimeRange(activityEvents);

  // Filter events based on search and type filter
  const filteredEvents = useMemo(() => {
    let filtered = activityEvents;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filterEventsBySearch(filtered, searchQuery);
    }
    
    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filterEventsByType(filtered, selectedFilter);
    }
    
    return filtered;
  }, [activityEvents, searchQuery, selectedFilter]);

  if (activityEvents.length === 0) {
    return (
      <View height="100%" overflow="auto" padding="size-400">
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Text>{formatMessage(MESSAGES.noEventsFound)}</Text>
        </Flex>
      </View>
    );
  }

  return (
    <View height="100%" padding="size-200">
      <Flex direction="column" gap="size-200" maxHeight="50vh">
        {/* Header */}
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <Heading level={2} marginY="size-0">
            {formatMessage(MESSAGES.eventDetails)}
          </Heading>
        </Flex>

        {/* Event Summary */}
        <Card>
          <View padding="size-200">
            <Flex direction="column" gap="size-200">
            <Heading level={3} marginY="size-0">
              {formatMessage(MESSAGES.eventSummary)}
            </Heading>
            <Divider />
            <Grid
              areas={['stats stats', 'timeRange timeRange']}
              columns={['1fr', '1fr']}
              rows={['auto', 'auto']}
              gap="size-200"
            >
              {/* Event Statistics */}
              <View gridArea="stats">
                <Flex gap="size-200" wrap>
                  <MetricCard 
                    label={formatMessage(MESSAGES.totalEvents)}
                    value={eventStats.total}
                    tooltip="Total number of events for this Live Activity across all types"
                  />
                  <MetricCard 
                    label="Start Events"
                    value={eventStats.start}
                    tooltip="Number of Live Activity start events (local or remote initiation)"
                  />
                  <MetricCard 
                    label="Content Updates"
                    value={eventStats.contentUpdate}
                    tooltip="Number of content state update events with new data"
                  />
                  <MetricCard 
                    label="Token Updates"
                    value={eventStats.tokenUpdate}
                    tooltip="Number of update token refresh events for push notifications"
                  />
                  <MetricCard 
                    label="Ended Events"
                    value={eventStats.ended}
                    tooltip="Number of Live Activity end events (natural completion)"
                  />
                  <MetricCard 
                    label="Dismissed Events"
                    value={eventStats.dismissed}
                    tooltip="Number of Live Activity dismiss events (user-initiated dismissal)"
                  />
                </Flex>
              </View>

              {/* Time Range */}
              {timeRange && (
                <View gridArea="timeRange">
                  <Card>
                    <View padding="size-200">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <InfoField
                            label={formatMessage(MESSAGES.timeRange)}
                            value={`${dayjs(timeRange.earliest).format('lll')} - ${dayjs(timeRange.latest).format('lll')}`}
                          />
                          <InfoField
                            label="Duration"
                            value={`${timeRange.duration} minutes`}
                          />
                        </tbody>
                      </table>
                    </View>
                  </Card>
                </View>
              )}
            </Grid>
            </Flex>
          </View>
        </Card>

        {/* Filters and Search */}
        <Flex direction="column" gap="size-200">
          <SearchField
            placeholder={formatMessage(MESSAGES.searchEvents)}
            value={searchQuery}
            onChange={setSearchQuery}
            width="100%"
          />
          
          <ActionGroup
            selectionMode="single"
            selectedKeys={[selectedFilter]}
            onSelectionChange={(keys) => setSelectedFilter(Array.from(keys)[0] as string)}
          >
            <Item key="all">
              {formatMessage(MESSAGES.allEvents)} ({eventStats.total})
            </Item>
            <Item key="start">
              {formatMessage(MESSAGES.startEvents)} ({eventStats.start})
            </Item>
            <Item key="content-update">
              Content Updates ({eventStats.contentUpdate})
            </Item>
            <Item key="token-update">
              Token Updates ({eventStats.tokenUpdate})
            </Item>
            <Item key="ended">
              {formatMessage(MESSAGES.endEvents)} ({eventStats.ended})
            </Item>
            <Item key="dismissed">
              Dismissed Events ({eventStats.dismissed})
            </Item>
          </ActionGroup>
        </Flex>

        {/* Event Table with Details Panel */}
        <View flex="1" minHeight="0">
          <EventTableWithDetails<LiveActivityEvent>
            columns={[...defaultColumns, eventNameColumn, eventTypeColumn] as ColumnDef<LiveActivityEvent>[]}
            data={filteredEvents}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
            detailsPanelOpen={detailsPanelOpen}
            onDetailsPanelToggle={setDetailsPanelOpen}
            defaultPanelWidth={500}
            minPanelWidth={400}
            maxPanelWidthPercentage={0.7}
          />
        </View>
      </Flex>
    </View>
  );
}

export default ActivityEventDetails;
