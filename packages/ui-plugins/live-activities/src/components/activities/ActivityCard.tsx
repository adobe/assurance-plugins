import { Flex, Text, StatusLight, View } from '@adobe/react-spectrum';

import React from 'react';

import { useIntl } from 'react-intl';
import classNames from 'classnames';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import SpectrumCard from '../atoms/SpectrumCard';
import { LiveActivity, getActivityKey } from '../../hooks/useActivities';
import { activitiesMessages } from '../../i18n';
import './ActivityCard.css';

dayjs.extend(relativeTime);

interface ActivityCardProps {
  activity: LiveActivity;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

function ActivityCard({ activity, isSelected, onSelect }: ActivityCardProps) {
  const { formatMessage } = useIntl();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': 
        return 'positive';
      case 'completed':
        return 'info';
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
        onSelect(getActivityKey(activity));
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
        paddingTop: '16px',
        margin: '2px',
        position: 'relative'
      }}
    >
      {/* Type Pill - Absolutely Positioned Top Right */}
      <View
        borderRadius="regular"
        UNSAFE_style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          backgroundColor: activity.type === 'broadcast' ? '#f3e8ff' : '#dbeafe',
          border: `1px solid ${activity.type === 'broadcast' ? '#e9d5ff' : '#bfdbfe'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px 6px',
          zIndex: 1
        }}
      >
        <Text
          UNSAFE_style={{
            color: activity.type === 'broadcast' ? '#7c3aed' : '#2563eb',
            fontSize: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap'
          }}
        >
          {activity.type === 'broadcast' ? 'Broadcast' : 'Unitary'}
        </Text>
      </View>
      
      <Flex 
        direction="column" 
        gap="size-75" 
        height="100%"
        justifyContent="space-between"        
      >
        {/* Header with status and Live Activity ID/Channel (primary identifier) */}
        <Flex alignItems="center" gap="size-100">
          <StatusLight variant={getStatusVariant(activity.status)} />
          <Flex direction="column" gap="size-25">
            {activity.type === 'broadcast' && activity.broadcastChannelId ? (
              <>
                <Text UNSAFE_className={classNames('activityIdText')}>
                  Channel: {activity.broadcastChannelId}
                </Text>
                <Text 
                  UNSAFE_className={classNames('typeValue')}
                  UNSAFE_style={{ fontSize: '11px', color: '#6b7280' }}
                >
                  Activity: {activity.name}
                </Text>
              </>
            ) : (
              <Text UNSAFE_className={classNames('activityIdText')}>
                {activity.id}
              </Text>
            )}
          </Flex>
        </Flex>
        
        {/* Attribute Type (secondary info) - Only show for unitary activities */}
        {activity.type !== 'broadcast' && (
          <Flex alignItems="center" gap="size-50">
            <Text 
              UNSAFE_className={classNames('typeLabel')}
            >
              Type:
            </Text>
            <Text 
              UNSAFE_className={classNames('typeValue')}
            >
              {activity.name}
            </Text>
          </Flex>
        )}
        
        {/* Footer with event count and timing */}
        <Flex alignItems="center" justifyContent="space-between" gap="size-100">
          <Text 
            UNSAFE_className={classNames('eventCountText')}
          >
            {eventCount} {formatMessage(activitiesMessages.eventsCount)}
          </Text>
          
          {lastActivityTime && (
            <Text 
              UNSAFE_className={classNames('timestampText')}
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
