import { 
  Flex, 
  View, 
  Text, 
  Heading, 
  Well,
  StatusLight,
  SearchField,
  ActionGroup,
  Item
} from '@adobe/react-spectrum';

import React, { useState, useMemo } from 'react';

import { useIntl } from 'react-intl';
import classNames from 'classnames';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import SpectrumCard from '../atoms/SpectrumCard';
import { LiveActivity } from '../../hooks/useActivities';
import { activitiesMessages, stateMessages, eventsMessages } from '../../i18n';
import './ActivityDetails.css';

dayjs.extend(relativeTime);

interface ActivityDetailsProps {
  selectedActivity?: LiveActivity;
}

function ActivityDetails({ selectedActivity }: ActivityDetailsProps) {
  const { formatMessage } = useIntl();
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'info';
      case 'completed':
        return 'positive';
      default:
        return 'neutral';
    }
  };

  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown time';
    return dayjs(timestamp).fromNow();
  };

  // Get all events for the selected activity
  const allActivityEvents = useMemo(() => {
    if (!selectedActivity) return [];
    
    const events = [
      ...(selectedActivity.events || []),
      ...(selectedActivity.updateEvents || [])
    ];
    
    // Sort by timestamp (newest first)
    return events.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [selectedActivity]);

  // Filter events based on search and filter
  const filteredEvents = useMemo(() => {
    return allActivityEvents.filter(event => {
      const matchesSearch = eventSearchQuery === '' || 
        (event.id && event.id.toLowerCase().includes(eventSearchQuery.toLowerCase()));
      
      const matchesFilter = selectedEventFilter === 'all' || 
        (selectedEventFilter === 'start' && selectedActivity?.startEvent?.id === event.id) ||
        (selectedEventFilter === 'update' && selectedActivity?.updateEvents?.some(e => e.id === event.id)) ||
        (selectedEventFilter === 'end' && selectedActivity?.endEvent?.id === event.id);
      
      return matchesSearch && matchesFilter;
    });
  }, [allActivityEvents, eventSearchQuery, selectedEventFilter, selectedActivity]);

  // Count events by type
  const eventCounts = useMemo(() => {
    if (!selectedActivity) return { all: 0, start: 0, update: 0, end: 0 };
    
    return {
      all: allActivityEvents.length,
      start: selectedActivity.startEvent ? 1 : 0,
      update: selectedActivity.updateEvents?.length || 0,
      end: selectedActivity.endEvent ? 1 : 0
    };
  }, [selectedActivity, allActivityEvents.length]);

  if (!selectedActivity) {
    return (
      <View padding="size-200" height="100%">
        <Flex 
          justifyContent="center" 
          alignItems="center" 
          height="100%"
          direction="column"
          gap="size-200"
        >
          <Heading level={2} UNSAFE_className={classNames('noActivityHeading')}>
            {formatMessage(activitiesMessages.noActivitySelected)}
          </Heading>
          <Text UNSAFE_className={classNames('noActivityText')}>
            Choose an activity from the list to view its details, timeline, and events.
          </Text>
        </Flex>
      </View>
    );
  }

  const eventCount = selectedActivity.events?.length || 0;
  const lastActivityTime = selectedActivity.updateEvents?.[0]?.timestamp || selectedActivity.startTime;

  return (
    <View padding="size-200" height="100%">
      <Flex direction="column" gap="size-200" height="100%">
        {/* Activity Header */}
        <Well>
          <Flex direction="column" gap="size-100">
            <Heading level={2} margin="size-0">
              {selectedActivity.name}
            </Heading>
            <Text UNSAFE_className={classNames('activitySubtitle')}>
              {selectedActivity.attributes} • {eventCount} events
            </Text>
          </Flex>
        </Well>

        {/* Activity Details */}
        <View flex="1" overflow="auto">
          <Flex direction="column" gap="size-200">
            <Well>
              <Flex direction="column" gap="size-150">
                <Heading level={3} margin="size-0">
                  {formatMessage(activitiesMessages.activityDetails)}
                </Heading>
                
                <Flex direction="column" gap="size-100">
                  <Flex alignItems="center" gap="size-100">
                    <Text UNSAFE_className={classNames('infoLabel')}>
                      {formatMessage(stateMessages.status)}:
                    </Text>
                    <StatusLight variant={getStatusVariant(selectedActivity.status)} />
                    <Text UNSAFE_className={classNames('statusText')}>
                      {selectedActivity.status}
                    </Text>
                  </Flex>
                  
                  <Flex alignItems="center" gap="size-100">
                    <Text UNSAFE_className={classNames('infoLabel')}>
                      {formatMessage(activitiesMessages.type)}:
                    </Text>
                    <Text>{selectedActivity.attributes}</Text>
                  </Flex>
                  
                  <Flex alignItems="center" gap="size-100">
                    <Text UNSAFE_className={classNames('infoLabel')}>
                      {formatMessage(activitiesMessages.events)}:
                    </Text>
                    <Text>{eventCount}</Text>
                  </Flex>
                  
                  {selectedActivity.startTime && (
                    <Flex alignItems="center" gap="size-100">
                      <Text UNSAFE_className={classNames('infoLabel')}>
                        {formatMessage(activitiesMessages.started)}:
                      </Text>
                      <Text>{formatRelativeTime(selectedActivity.startTime)}</Text>
                    </Flex>
                  )}
                  
                  {lastActivityTime && lastActivityTime !== selectedActivity.startTime && (
                    <Flex alignItems="center" gap="size-100">
                      <Text UNSAFE_className={classNames('infoLabel')}>
                        {formatMessage(activitiesMessages.lastActivity)}:
                      </Text>
                      <Text>{formatRelativeTime(lastActivityTime)}</Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Well>

            {/* Events Section */}
            <Well>
              <Flex direction="column" gap="size-150">
                <Heading level={3} margin="size-0">
                  {formatMessage(activitiesMessages.activityEventDetails)}
                </Heading>
                
                {/* Event Search and Filters */}
                <Flex direction="column" gap="size-100">
                  <SearchField
                    placeholder={formatMessage(eventsMessages.searchEvents)}
                    value={eventSearchQuery}
                    onChange={setEventSearchQuery}
                    width="100%"
                  />
                  
                  <ActionGroup
                    selectionMode="single"
                    selectedKeys={[selectedEventFilter]}
                    onSelectionChange={(keys) => setSelectedEventFilter(Array.from(keys)[0] as string)}
                  >
                    <Item key="all">
                      {formatMessage(eventsMessages.allEvents)} ({eventCounts.all})
                    </Item>
                    <Item key="start">
                      {formatMessage(eventsMessages.startEvents)} ({eventCounts.start})
                    </Item>
                    <Item key="update">
                      {formatMessage(eventsMessages.updateEvents)} ({eventCounts.update})
                    </Item>
                    <Item key="end">
                      {formatMessage(eventsMessages.endEvents)} ({eventCounts.end})
                    </Item>
                  </ActionGroup>
                </Flex>

                {/* Events List */}
                <View maxHeight="size-3000" overflow="auto">
                  {filteredEvents.length === 0 ? (
                    <Flex 
                      justifyContent="center" 
                      alignItems="center" 
                      height="size-1000"
                      direction="column"
                      gap="size-100"
                    >
                      <Text UNSAFE_className={classNames('noEventsText')}>
                        {eventSearchQuery || selectedEventFilter !== 'all' 
                          ? formatMessage(eventsMessages.noEventsFound)
                          : 'No events available'
                        }
                      </Text>
                    </Flex>
                  ) : (
                    <Flex direction="column" gap="size-100">
                      {filteredEvents.map((event, index) => (
                        <SpectrumCard key={event.id || index} isQuiet>
                          <Flex direction="column" gap="size-50">
                            <Flex alignItems="center" gap="size-100">
                              <Text UNSAFE_className={classNames('eventTitle')}>
                                {event.id || `Event ${index + 1}`}
                              </Text>
                              {event.timestamp && (
                                <Text UNSAFE_className={classNames('eventTimestamp')}>
                                  {formatRelativeTime(event.timestamp)}
                                </Text>
                              )}
                            </Flex>
                            {event.timestamp && (
                              <Text UNSAFE_className={classNames('eventDateTime')}>
                                {new Date(event.timestamp).toLocaleString()}
                              </Text>
                            )}
                          </Flex>
                        </SpectrumCard>
                      ))}
                    </Flex>
                  )}
                </View>
              </Flex>
            </Well>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}

export default ActivityDetails;
