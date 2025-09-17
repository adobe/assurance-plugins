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
      default:
        return 'neutral';
    }
  };

  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown time';
    return dayjs(timestamp).fromNow();
  };

  const eventCount = (activity.events?.length || 0) + (activity.updateEvents?.length || 0);
  const lastActivityTime = activity.updateEvents?.[0]?.timestamp || activity.startTime;

  return (
    <SpectrumCard
      isSelected={isSelected}
      onPress={() => {
        console.log('ActivityCard onPress called for:', activity.id);
        onSelect(activity.id);
      }}
      marginBottom="size-100"
      padding="2px"
      UNSAFE_style={{
        border: '2px solid',
        borderColor: isSelected ? '#3b82f6' : '#d1d5db',
        borderRadius: '8px',
        backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
        boxShadow: isSelected 
          ? '0 0 0 1px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.15)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        minHeight: '80px',
        margin: '2px'
      }}
    >
      <Flex 
        direction="column" 
        gap="size-75" 
        height="100%"
        justifyContent="space-between"        
      >
        {/* Header with status and Live Activity ID (primary identifier) */}
        <Flex alignItems="center" gap="size-100" justifyContent="space-between">
          <Flex wrap alignItems="center" gap="size-100" flex="1" minWidth="0">
            <StatusLight  variant={getStatusVariant(activity.status)} />
            <Text 
              UNSAFE_style={{ 
                fontWeight: '600', 
                fontSize: '14px',
                lineHeight: '1.4',
                color: '#1f2937',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginLeft: "-0.5rem",
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
              }}
            >
              {activity.id}
            </Text>
          </Flex>  
        </Flex>
        
        {/* Attribute Type (secondary info) */}
        <Flex alignItems="center" gap="size-50">
          <Text 
            UNSAFE_style={{ 
              fontSize: '11px', 
              color: '#9ca3af',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.025em'
            }}
          >
            Type:
          </Text>
          <Text 
            UNSAFE_style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontStyle: 'italic'
            }}
          >
            {activity.name}
          </Text>
        </Flex>
        
        {/* Footer with event count and timing */}
        <Flex alignItems="center" justifyContent="space-between" gap="size-100">
          <Text 
            UNSAFE_style={{ 
              fontSize: '11px', 
              color: '#9ca3af',
              fontWeight: '500'
            }}
          >
            {eventCount} {formatMessage(messages.eventsCount)}
          </Text>
          
          {lastActivityTime && (
            <Text 
              UNSAFE_style={{ 
                fontSize: '11px', 
                color: '#9ca3af',
                fontWeight: '400'
              }}
            >
              {formatRelativeTime(lastActivityTime)}
            </Text>
          )}
        </Flex>
      </Flex>
    </SpectrumCard>
  );
}

export default React.memo(ActivityCard);
