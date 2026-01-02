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

import { useIntl } from 'react-intl';
import classNames from 'classnames';

import { LiveActivity, getActivityKey } from '../../hooks/useActivities';
import { activitiesMessages } from '../../i18n';

import ActivityCard from './ActivityCard';
import './ActivityList.css';

interface ActivityListProps {
  activities: LiveActivity[];
  selectedActivityId?: string;
  onActivitySelect: (key: string) => void;
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
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'unitary' | 'broadcast'>('all');

  // Memoize lowercase search query to avoid repeated conversions
  const lowerSearchQuery = useMemo(() => searchQuery.toLowerCase(), [searchQuery]);

  // Memoized filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(lowerSearchQuery) ||
                           activity.attributes?.toLowerCase().includes(lowerSearchQuery) ||
                           activity.id?.toLowerCase().includes(lowerSearchQuery) ||
                           activity.broadcastChannelId?.toLowerCase().includes(lowerSearchQuery);
                           
      const matchesStatusFilter = selectedFilter === 'all' || activity.status === selectedFilter;
      const matchesTypeFilter = selectedTypeFilter === 'all' || activity.type === selectedTypeFilter;
      
      return matchesSearch && matchesStatusFilter && matchesTypeFilter;
    });
  }, [activities, lowerSearchQuery, selectedFilter, selectedTypeFilter]);

  // Count activities by status and type
  const activityCounts = useMemo(() => {
    return {
      all: activities.length,
      active: activities.filter(a => a.status === 'active').length,
      completed: activities.filter(a => a.status === 'completed').length,
      unitary: activities.filter(a => a.type === 'unitary').length,
      broadcast: activities.filter(a => a.type === 'broadcast').length
    };
  }, [activities]);

  if (isLoading) {
    return (
      <View padding="size-200">
        <Flex justifyContent="center" alignItems="center" height="size-2000">
          <ProgressCircle size="L" />
          <Text marginStart="size-100">{formatMessage(activitiesMessages.loadingActivities)}</Text>
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
          <Text UNSAFE_className={classNames('subtitleText')}>
            Each activity is identified by its unique Live Activity ID
          </Text>
          
          {/* Search */}
          <SearchField
            placeholder={formatMessage(activitiesMessages.searchActivities)}
            value={searchQuery}
            onChange={setSearchQuery}
            width="100%"
          />
          
          {/* Status Filters */}
          <ActionGroup
            selectionMode="single"
            selectedKeys={[selectedFilter]}
            onSelectionChange={(keys) => setSelectedFilter(Array.from(keys)[0] as string)}
          >
            <Item key="all">
              {formatMessage(activitiesMessages.allActivities)} ({activityCounts.all})
            </Item>
            <Item key="active">
              {formatMessage(activitiesMessages.activeActivities)} ({activityCounts.active})
            </Item>
            <Item key="completed">
              {formatMessage(activitiesMessages.completedActivities)} ({activityCounts.completed})
            </Item>
          </ActionGroup>
          
          {/* Type Filters */}
          <Flex alignItems="center" gap="size-100">
            <Text UNSAFE_className={classNames('filterLabel')}>Type:</Text>
            <ActionGroup
              selectionMode="single"
              selectedKeys={[selectedTypeFilter]}
              onSelectionChange={(keys) => setSelectedTypeFilter(Array.from(keys)[0] as 'all' | 'unitary' | 'broadcast')}
              density="compact"
            >
              <Item key="all">
                All ({activityCounts.all})
              </Item>
              <Item key="unitary">
                🎮 Unitary ({activityCounts.unitary})
              </Item>
              <Item key="broadcast">
                📡 Broadcast ({activityCounts.broadcast})
              </Item>
            </ActionGroup>
          </Flex>
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
              <Text UNSAFE_className={classNames('noActivitiesText')}>
                {searchQuery || selectedFilter !== 'all' 
                  ? formatMessage(activitiesMessages.noActivitiesFound)
                  : formatMessage(activitiesMessages.noActivitiesAvailable)
                }
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="size-50">
              {filteredActivities.map(activity => (
                <ActivityCard
                  key={getActivityKey(activity)}
                  activity={activity}
                  isSelected={selectedActivityId === getActivityKey(activity)}
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
