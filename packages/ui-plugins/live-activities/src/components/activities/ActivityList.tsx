import { 
  Flex, 
  SearchField, 
  ActionGroup, 
  Item, 
  Text, 
  Heading,
  View,
  ProgressCircle
} from '@adobe/react-spectrum';

import React, { useState, useMemo } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { LiveActivity } from '../../hooks/useActivities';

import ActivityCard from './ActivityCard';
import styles from './ActivityList.css';

const messages = defineMessages({
  searchPlaceholder: {
    id: 'activities.list.searchPlaceholder',
    defaultMessage: 'Search activities...'
  },
  allActivities: {
    id: 'activities.list.allActivities',
    defaultMessage: 'All'
  },
  activeActivities: {
    id: 'activities.list.activeActivities',
    defaultMessage: 'Active'
  },
  completedActivities: {
    id: 'activities.list.completedActivities',
    defaultMessage: 'Completed'
  },
  noActivitiesFound: {
    id: 'activities.list.noActivitiesFound',
    defaultMessage: 'No activities found'
  },
  loadingActivities: {
    id: 'activities.list.loadingActivities',
    defaultMessage: 'Loading activities...'
  }
});

interface ActivityListProps {
  activities: LiveActivity[];
  selectedActivityId?: string;
  onActivitySelect: (id: string) => void;
  isLoading?: boolean;
}

function ActivityList({ 
  activities, 
  selectedActivityId, 
  onActivitySelect, 
  isLoading = false 
}: ActivityListProps) {
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Memoized filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.attributes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || activity.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activities, searchQuery, selectedFilter]);

  // Count activities by status
  const activityCounts = useMemo(() => {
    return {
      all: activities.length,
      active: activities.filter(a => a.status === 'active').length,
      completed: activities.filter(a => a.status === 'completed').length
    };
  }, [activities]);

  if (isLoading) {
    return (
      <View padding="size-200">
        <Flex justifyContent="center" alignItems="center" height="size-2000">
          <ProgressCircle size="L" />
          <Text marginStart="size-100">{formatMessage(messages.loadingActivities)}</Text>
        </Flex>
      </View>
    );
  }

  return (
    <View padding="size-200" height="100%">
      <Flex direction="column" gap="size-200" height="100%">
        {/* Header */}
        <Flex direction="column" gap="size-100">
          <Heading level={2} margin="size-0">
            Live Activities ({activities.length})
          </Heading>
          <Text UNSAFE_className={styles.subtitleText}>
            Each activity is identified by its unique Live Activity ID
          </Text>
          
          {/* Search */}
          <SearchField
            placeholder={formatMessage(messages.searchPlaceholder)}
            value={searchQuery}
            onChange={setSearchQuery}
            width="100%"
          />
          
          {/* Filters */}
          <ActionGroup
            selectionMode="single"
            selectedKeys={[selectedFilter]}
            onSelectionChange={(keys) => setSelectedFilter(Array.from(keys)[0] as string)}
          >
            <Item key="all">
              {formatMessage(messages.allActivities)} ({activityCounts.all})
            </Item>
            <Item key="active">
              {formatMessage(messages.activeActivities)} ({activityCounts.active})
            </Item>
            <Item key="completed">
              {formatMessage(messages.completedActivities)} ({activityCounts.completed})
            </Item>
          </ActionGroup>
        </Flex>

        {/* Activities List */}
        <View flex="1" overflow="auto">
          {filteredActivities.length === 0 ? (
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              height="size-2000"
              direction="column"
              gap="size-100"
            >
              <Text UNSAFE_className={styles.noActivitiesText}>
                {searchQuery || selectedFilter !== 'all' 
                  ? formatMessage(messages.noActivitiesFound)
                  : 'No activities available'
                }
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="size-50">
              {filteredActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivityId === activity.id}
                  onSelect={onActivitySelect}
                />
              ))}
            </Flex>
          )}
        </View>
      </Flex>
    </View>
  );
}

export default ActivityList;
