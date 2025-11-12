import React, { useState, useMemo } from 'react';
import { Heading, Text, View, Flex, ActionGroup, Item, Well, Divider } from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { LiveActivity } from '../../hooks/useActivities';
import { EVENT_CONFIG } from '../../constants/liveActivitiesConfig';
import { activitiesMessages } from '../../i18n';
import Card from '../atoms/card';
import './activity-flow.css';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import ClassicGridView from '@spectrum-icons/workflow/ClassicGridView';
import Play from '@spectrum-icons/workflow/Play';
import Pause from '@spectrum-icons/workflow/Pause';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';
import classNames from 'classnames';

interface ActivityFlowProps {
  activity?: LiveActivity;
}

interface FlowEvent {
  id: string;
  type: 'start' | 'content-update' | 'token-update' | 'ended' | 'dismissed';
  timestamp: string;
  title: string;
  description: string;
  payload?: any;
  icon: React.ReactNode;
  color: string;
  contentState?: any;
  token?: string;
  origin?: 'local' | 'remote';
  state?: string;
}

function ActivityFlow({ activity }: ActivityFlowProps) {
  const { formatMessage } = useIntl();
  const [view, setView] = useState<'timeline' | 'cards'>('timeline');

  if (!activity) {
    return null;
  }

  // Process events into flow events
  const flowEvents: FlowEvent[] = useMemo(() => {
    const events: FlowEvent[] = [];
    
    // Process all events from the activity
    const allEvents = [
      ...(activity.events || []),
      ...(activity.updateEvents || [])
    ];

    allEvents.forEach((event, index) => {
      const eventName = event.payload?.ACPExtensionEventName || '';
      const eventData = event.payload?.ACPExtensionEventData || {};
      
      if (eventName === EVENT_CONFIG.EVENT_NAMES.START) {
        events.push({
          id: `start-${index}`,
          type: 'start',
          timestamp: event.timestamp,
          title: 'Activity Started',
          description: `Live Activity "${activity.name}" was initiated.`,
          payload: event.payload,
          icon: <Play size="S" />,
          color: 'positive',
          origin: eventData.origin
        });
      } else if (eventName === EVENT_CONFIG.EVENT_NAMES.UPDATED) {
        events.push({
          id: `content-update-${index}`,
          type: 'content-update',
          timestamp: event.timestamp,
          title: 'Content Updated',
          description: 'Activity content state was updated',
          payload: event.payload,
          contentState: eventData.contentState,
          icon: <Pause size="S" />,
          color: 'informative'
        });
      } else if (eventName === 'Live Activity update token') {
        events.push({
          id: `token-update-${index}`,
          type: 'token-update',
          timestamp: event.timestamp,
          title: 'Token Updated',
          description: 'Activity update token was refreshed',
          payload: event.payload,
          token: eventData.token,
          icon: <Alert size="S" />,
          color: 'informative'
        });
      } else if (eventName === 'Live Activity ended') {
        events.push({
          id: `ended-${index}`,
          type: 'ended',
          timestamp: event.timestamp,
          title: 'Activity Ended',
          description: `Live Activity "${activity.name}" was completed`,
          payload: event.payload,
          state: eventData.state,
          icon: <Checkmark size="S" />,
          color: 'positive'
        });
      } else if (eventName === 'Live Activity dismissed') {
        events.push({
          id: `dismissed-${index}`,
          type: 'dismissed',
          timestamp: event.timestamp,
          title: 'Activity Dismissed',
          description: `Live Activity "${activity.name}" was dismissed by user`,
          payload: event.payload,
          state: eventData.state,
          icon: <Alert size="S" />,
          color: 'negative'
        });
      }
    });

    // Sort by timestamp
    return events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [activity, activity?.events, activity?.updateEvents,  activity?.events?.length]);

  const getEventTypeColor = (type: FlowEvent['type']) => {
    switch (type) {
      case 'start':
      case 'ended':
        return 'var(--spectrum-global-color-green-500)';
      case 'content-update':
      case 'token-update':
        return 'var(--spectrum-global-color-blue-500)';
      case 'dismissed':
        return 'var(--spectrum-global-color-red-500)';
      default:
        return 'var(--spectrum-global-color-gray-500)';
    }
  };

  return (
    <View height="100%" overflow="auto">
      <Card>
        <View padding="size-200">
          <Flex direction="column" gap="size-200">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Heading level={2} marginY="size-0">
              {formatMessage(activitiesMessages.activityFlow)}
            </Heading>
            <ActionGroup
              isEmphasized
              selectionMode="single"
              selectedKeys={[view]}
              onSelectionChange={keys => {
                const key = Array.from(keys)[0];
                if (key === 'timeline' || key === 'cards') setView(key);
              }}
            >
              <Item key="timeline" aria-label="Timeline view">
                <MoreSmallListVert size="S" />
              </Item>
              <Item key="cards" aria-label="Cards view">
                <ClassicGridView size="S" />
              </Item>
            </ActionGroup>
          </Flex>

          <Divider />

          <View>
            <Heading level={3} marginY="size-0" marginBottom="size-200">
              {formatMessage(activitiesMessages.lifecycleEvents)}
            </Heading>
            
            {flowEvents.length === 0 ? (
              <Text>{formatMessage(activitiesMessages.noEvents)}</Text>
            ) : view === 'timeline' ? (
              // Timeline View
              <View>
                {flowEvents?.map((event, index) => (
                  <Flex key={event.id} direction="row" gap="size-200" alignItems="start" marginBottom="size-300">
                    {/* Timeline line and icon */}
                    <Flex
                      direction="column"
                      alignItems="center"
                      width="size-400"
                      minHeight="100%"
                      position="relative"
                    >
                      {/* Line above the icon (not for the first event) */}
                      {index !== 0 && (
                        <View
                          width="3px"
                          height="var(--spectrum-global-dimension-size-200)"
                          backgroundColor="gray-400"
                          position="absolute"
                          top={0}
                          zIndex={0}
                        />
                      )}
                      {/* Icon */}
                      <View
                        width="size-300"
                        height="size-300"
                        backgroundColor="static-white"
                        borderWidth="thick"
                        UNSAFE_style={{
                          borderRadius: '50%',
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: getEventTypeColor(event.type)
                        }}
                      >
                        {event.icon}
                      </View>
                      {/* Line below the icon (not for the last event) */}
                      {index !== flowEvents.length - 1 && (
                        <View
                          width="3px"
                          height="var(--spectrum-global-dimension-size-200)"
                          backgroundColor="gray-400"
                          zIndex={0}
                        />
                      )}
                    </Flex>
                    
                    {/* Event content */}
                    <View flex="1">
                      <Card>
                        <View padding="size-200">
                          <Flex direction="column" gap="size-100">
                          <Flex direction="row" alignItems="center" justifyContent="space-between">
                            <Text UNSAFE_className={classNames('eventTitle')}>
                              {event.title}
                            </Text>
                            <Text UNSAFE_className={classNames('eventTimestamp')}>
                              {dayjs(event.timestamp).format('HH:mm:ss.SSS')}
                            </Text>
                          </Flex>
                          <Text UNSAFE_className={classNames('eventDescription')}>
                            {event.description}
                          </Text>
                          
                          {/* Show origin for start events */}
                          {event.type === 'start' && event.origin && (
                            <Text UNSAFE_className={classNames('eventOrigin')}>
                              Origin: {event.origin}
                            </Text>
                          )}
                          
                          {/* Show content state for content updates */}
                          {event.type === 'content-update' && event.contentState && (
                            <Well>
                              <Text UNSAFE_className={classNames('contentStateLabel')}>
                                Content State:
                              </Text>
                              <Text
                                UNSAFE_className={classNames('contentStateText')}
                              >
                                {JSON.stringify(event.contentState, null, 2)}
                              </Text>
                            </Well>
                          )}
                          
                          {/* Show token for token updates */}
                          {event.type === 'token-update' && event.token && (
                            <Well>
                              <Text UNSAFE_className={classNames('tokenLabel')}>
                                New Token:
                              </Text>
                              <Text
                                UNSAFE_className={classNames('tokenText')}
                              >
                                {event.token}
                              </Text>
                            </Well>
                          )}
                          
                          {/* Show state for end/dismissal events */}
                          {event.type === 'ended' && event.state && (
                            <Text UNSAFE_className={classNames('stateText')}>
                              State: {event.state}
                            </Text>
                          )}
                          
                          {event.type === 'dismissed' && event.state && (
                            <Text UNSAFE_className={classNames('stateText')}>
                              State: {event.state}
                            </Text>
                          )}
                          </Flex>
                        </View>
                      </Card>
                    </View>
                  </Flex>
                )).reverse()}
              </View>
            ) : (
              // Cards View
              <View
                UNSAFE_className={classNames('cardsGrid')}
              >
                {flowEvents.map(event => (
                  <Card key={event.id}>
                    <View padding="size-200" marginBottom="size-200">
                      <Flex direction="column" gap="size-100">
                      <Flex direction="row" alignItems="center" gap="size-100">
                        <View
                          UNSAFE_style={{
                            color: getEventTypeColor(event.type)
                          }}
                        >
                          {event.icon}
                        </View>
                        <Text UNSAFE_style={{ fontWeight: 'bold' }}>
                          {event.title}
                        </Text>
                      </Flex>
                      <Text UNSAFE_className={classNames('eventTimestamp')}>
                        {dayjs(event.timestamp).format('lll')}
                      </Text>
                      <Text UNSAFE_className={classNames('eventDescription')}>
                        {event.description}
                      </Text>
                      {event.payload && (
                        <Well>
                          <Text
                            UNSAFE_className={classNames('contentStateText')}
                          >
                            {JSON.stringify(event.payload, null, 2)}
                          </Text>
                        </Well>
                      )}
                      </Flex>
                    </View>
                  </Card>
                )).reverse()}
              </View>
            )}
          </View>
          </Flex>
        </View>
      </Card>
    </View>
  );
}

export default ActivityFlow;
