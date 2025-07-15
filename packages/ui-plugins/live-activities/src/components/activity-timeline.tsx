import React, { useState } from 'react';
import { Heading, Text, View, Flex, ActionGroup, Item } from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import useSelectedActivity from '../hooks/useSelectedActivity';
import Card from './card/card';
import MoreSmallListVert from '@spectrum-icons/workflow/MoreSmallListVert';
import ClassicGridView from '@spectrum-icons/workflow/ClassicGridView';

const messages = defineMessages({
  timelineLabel: {
    id: 'activities.details.timeline',
    defaultMessage: 'Timeline'
  },
  noEvents: {
    id: 'activities.details.noEvents',
    defaultMessage: 'No events available'
  }
});

function ActivityTimeline() {
  const { formatMessage } = useIntl();
  const activity = useSelectedActivity();
  const events = activity?.events || [];
  const [view, setView] = useState<'list' | 'grid'>('grid');

  // Sort events by timestamp in descending order
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (!activity) {
    return null;
  }

  return (
    <Card>
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Heading level={2} marginY="size-0">
          {formatMessage(messages.timelineLabel)}
        </Heading>
        <ActionGroup
          isEmphasized
          selectionMode="single"
          selectedKeys={[view]}
          onSelectionChange={keys => {
            const key = Array.from(keys)[0];
            if (key === 'list' || key === 'grid') setView(key);
          }}
        >
          <Item key="grid" aria-label="Grid view">
            <ClassicGridView size="S" />
          </Item>
          <Item key="list" aria-label="List view">
            <MoreSmallListVert size="S" />
          </Item>
        </ActionGroup>
      </Flex>

      <View marginY="size-200">
        {view === 'list' ? (
          sortedEvents.length > 0 ? (
            <View>
              {sortedEvents.map((event, index) => (
                <Flex key={event.uuid} direction="row" gap="size-100" alignItems="stretch">
                  <Flex
                    direction="column"
                    width="size-600"
                    alignItems="center"
                    minHeight="100%"
                    position="relative"
                  >
                    {/* Line above the dot (not for the first event) */}
                    {index !== 0 && (
                      <View
                        width="2px"
                        height="calc(100% - 2rem)"
                        backgroundColor="gray-400"
                        position="absolute"
                        top={0}
                        zIndex={0}
                      />
                    )}
                    {/* The dot */}
                    <View
                      width="size-175"
                      height="size-175"
                      borderColor="informative"
                      backgroundColor="static-white"
                      borderWidth="thick"
                      UNSAFE_style={{
                        borderRadius: '50%',
                        zIndex: 1,
                        transform: 'translateY(-50%)'
                      }}
                      top="50%"
                      position="absolute"
                    />
                    {/* Line below the dot (not for the last event) */}
                    {index !== sortedEvents.length - 1 && (
                      <View
                        width="2px"
                        height="calc(100% - 2rem)"
                        backgroundColor="gray-400"
                        zIndex={0}
                      />
                    )}
                  </Flex>
                  <View flex="1" paddingY="size-300">
                    <View>
                      <Text UNSAFE_style={{ fontWeight: 'bold' }}>
                        {dayjs(event.timestamp).toISOString()}
                      </Text>
                    </View>
                    <View>
                      <Text marginTop="size-75">{event.payload.ACPExtensionEventName}</Text>
                      <View marginTop="size-100">
                        <Text
                          UNSAFE_style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {JSON.stringify(event.payload, null, 2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Flex>
              ))}
            </View>
          ) : (
            <Text>{formatMessage(messages.noEvents)}</Text>
          )
        ) : sortedEvents.length > 0 ? (
          <View
            UNSAFE_style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--spectrum-global-dimension-size-200)'
            }}
          >
            {sortedEvents.map(event => (
              <Card key={event.uuid}>
                <View
                  minHeight="200px"
                  height="auto"
                  UNSAFE_style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Text UNSAFE_style={{ fontWeight: 'bold' }}>
                    {dayjs(event.timestamp).toISOString()}
                  </Text>
                  <View>
                    <Text marginTop="size-75">{event.payload.ACPExtensionEventName}</Text>
                    <View marginTop="size-100">
                      <Text
                        UNSAFE_style={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          whiteSpace: 'pre-wrap',
                          overflowWrap: 'anywhere'
                        }}
                      >
                        {JSON.stringify(event.payload, null, 2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Text>{formatMessage(messages.noEvents)}</Text>
        )}
      </View>
    </Card>
  );
}

export default ActivityTimeline;
