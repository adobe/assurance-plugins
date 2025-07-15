import {
  Button,
  Flex,
  Heading,
  Item,
  Picker,
  View,
  TabList,
  TabPanels,
  Tabs,
  StatusLight
} from '@adobe/react-spectrum';
import useActivities from '../hooks/useActivities';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import LaunchLiveActivity from '../components/launch-live-activity';
import './activities.scss';
import usePluginState from '../hooks/usePluginState';
import ActivityInfo from '../components/activity-info';
import ActivityTimeline from '../components/activity-timeline';
import ActivityEvents from '../components/activity-events';

const messages = defineMessages({
  liveActivitiesHeading: {
    id: 'activities.heading',
    defaultMessage: 'Live Activities'
  },
  activityPickerLabel: {
    id: 'activities.picker.label',
    defaultMessage: 'Select activity'
  },
  activityPickerPlaceholder: {
    id: 'activities.picker.placeholder',
    defaultMessage: 'Choose an activity'
  },
  infoTab: {
    id: 'activities.tabs.info',
    defaultMessage: 'Info'
  },
  timelineTab: {
    id: 'activities.tabs.timeline',
    defaultMessage: 'Timeline'
  },
  eventsTab: {
    id: 'activities.tabs.events',
    defaultMessage: 'Events'
  },
  noActivitiesMessage: {
    id: 'activities.noActivities',
    defaultMessage: 'No Live Activities have been started on this client'
  }
});

function Activities() {
  const activities = useActivities();
  const { formatMessage } = useIntl();
  const { selectedActivityId, setSelectedActivityId } = usePluginState();
  console.log(selectedActivityId)

  return (
    <>
      <Flex direction="row" justifyContent="space-between" alignItems="start" marginTop="size-200">
        <View>
          <Heading level={2} marginTop="size-0">
            {formatMessage(messages.liveActivitiesHeading)} ({activities.length})
          </Heading>
          <Picker
            defaultSelectedKey={selectedActivityId as any}
            label={formatMessage(messages.activityPickerLabel)}
            selectedKey={selectedActivityId}
            onSelectionChange={key => setSelectedActivityId(key as string)}
            placeholder={formatMessage(messages.activityPickerPlaceholder)}
          >
            {activities.map(activity => (
              <Item key={activity.id}>
                <Flex alignItems="center" gap="size-100">
                  <StatusLight
                    UNSAFE_className="status-light-compact"
                    variant={
                      activity.status === 'active'
                        ? 'info'
                        : activity.status === 'inactive'
                          ? 'negative'
                          : 'positive'
                    }
                  />
                  {activity.name}
                </Flex>
              </Item>
            ))}
          </Picker>
        </View>
        <LaunchLiveActivity />
      </Flex>

      {!activities.length && (
        <Flex
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap="size-200"
          marginY="size-200"
        >
          <Heading level={3}>{formatMessage(messages.noActivitiesMessage)}</Heading>
          <LaunchLiveActivity />
        </Flex>
      )}

      {selectedActivityId && (
        <Tabs marginY="size-200">
          <TabList>
            <Item key="info">{formatMessage(messages.infoTab)}</Item>
            <Item key="timeline">{formatMessage(messages.timelineTab)}</Item>
            <Item key="events">{formatMessage(messages.eventsTab)}</Item>
          </TabList>
          <TabPanels>
            <Item key="info">
              <ActivityInfo />
            </Item>
            <Item key="timeline">
              <ActivityTimeline />
            </Item>
            <Item key="events">
              <ActivityEvents />
            </Item>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
}

export default Activities;
