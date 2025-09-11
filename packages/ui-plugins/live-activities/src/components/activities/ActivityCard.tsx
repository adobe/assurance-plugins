import React from 'react';
import { Flex, Text, StatusLight, Badge } from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LiveActivity } from '../../hooks/useActivities';
import SpectrumCard from '../atoms/SpectrumCard';

dayjs.extend(relativeTime);

const messages = defineMessages({
  eventsCount: {
    id: 'activities.card.eventsCount',
    defaultMessage: 'events'
  },
  noEvents: {
    id: 'activities.card.noEvents',
    defaultMessage: 'No events'
  }
});

interface ActivityCardProps {
  activity: LiveActivity;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function ActivityCard({ activity, isSelected, onSelect }: ActivityCardProps) {
  const { formatMessage } = useIntl();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'info';
      case 'completed':
        return 'positive';
      case 'inactive':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown time';
    return dayjs(timestamp).fromNow();
  };

  const eventCount = activity.events?.length || 0;
  const lastActivityTime = activity.updateEvents?.[0]?.timestamp || activity.startTime;

  return (
    <SpectrumCard
      isSelected={isSelected}
      onPress={() => {
        console.log('ActivityCard onPress called for:', activity.id);
        onSelect(activity.id);
      }}
      marginBottom="size-100"
      padding="size-200"
    >
      <Flex direction="column" gap="size-100">
        <Flex alignItems="center" gap="size-100">
          <StatusLight variant={getStatusVariant(activity.status)} />
          <Text UNSAFE_style={{ fontWeight: 'bold', fontSize: 'var(--spectrum-global-dimension-size-150)' }}>
            {activity.name}
          </Text>
        </Flex>
        
        <Text UNSAFE_style={{ fontSize: 'var(--spectrum-global-dimension-size-100)', color: 'var(--spectrum-global-color-gray-700)' }}>
          ID: {activity.id}
        </Text>
        
        <Text UNSAFE_style={{ fontSize: 'var(--spectrum-global-dimension-size-100)', color: 'var(--spectrum-global-color-gray-700)' }}>
          Status: {activity.status}
        </Text>
      </Flex>
    </SpectrumCard>
  );
}

export default React.memo(ActivityCard);
