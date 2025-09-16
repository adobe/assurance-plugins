import React, { useState, useMemo } from 'react';
import { Flex, View, Tabs, TabList, TabPanels, Item, Text, Tooltip, TooltipTrigger, Button, Heading } from '@adobe/react-spectrum';
import Info from '@spectrum-icons/workflow/Info';
import { defineMessages, useIntl } from 'react-intl';
import useActivities, { useRegisteredActivities } from '../hooks/useActivities';

import usePluginState from '../hooks/usePluginState';
import { useLiveActivitiesValidationStatus } from '../hooks/useLiveActivitiesValidationStatus';
import { VALIDATION_STATUS } from '../constants';
import ActivityList from '../components/activities/ActivityList';
import ActivityOverview from '../components/live-activity/activity-overview';
import ActivityFlow from '../components/live-activity/activity-flow';
import ActivityEventDetails from '../components/live-activity/activity-event-details';
import LaunchLiveActivity from '../components/live-activity/launch-live-activity';

const messages = defineMessages({
  activitiesEnhanced: {
    id: 'activities.enhanced.title',
    defaultMessage: 'Activities Enhanced'
  },
  overviewTab: {
    id: 'activities.tabs.overview',
    defaultMessage: 'Overview'
  },
  activityFlowTab: {
    id: 'activities.tabs.activityFlow',
    defaultMessage: 'Activity Flow'
  },
  eventDetailsTab: {
    id: 'activities.tabs.eventDetails',
    defaultMessage: 'Event Details'
  },
  noActivitiesMessage: {
    id: 'activities.noActivities',
    defaultMessage: 'No Live Activities have been started on this client'
  },
  noActivitiesMessageIosSupported: {
    id: 'activities.noActivities.ios.supported',
    defaultMessage: 'No Live Activities have been started on this iOS device'
  },
  noActivitiesMessageIosUnsupported: {
    id: 'activities.noActivities.ios.unsupported',
    defaultMessage: 'Live Activities are not supported on this iOS version (requires iOS 16.1+)'
  },
  noActivitiesMessageIosPartial: {
    id: 'activities.noActivities.ios.partial',
    defaultMessage: 'No Live Activities have been started on this iOS device'
  },
  noActivitiesMessageUnsupported: {
    id: 'activities.noActivities.unsupported',
    defaultMessage: 'Live Activities are not supported on this platform'
  },
  startActivityHintIosSupported: {
    id: 'activities.startHint.ios.supported',
    defaultMessage: 'Start a Live Activity on your iOS device to see it appear here'
  },
  startActivityHintIosPartial: {
    id: 'activities.startHint.ios.partial',
    defaultMessage: 'Start a Live Activity on your iOS device to see it appear here. Remote start requires iOS 17.1+'
  },
  startActivityHintIosUnsupported: {
    id: 'activities.startHint.ios.unsupported',
    defaultMessage: 'Live Activities require iOS 16.1 or later. Please update your device to use this feature.'
  },
  startActivityHintUnsupported: {
    id: 'activities.startHint.unsupported',
    defaultMessage: 'Live Activities are only supported on iOS devices'
  },
  startLiveActivityTooltip: {
    id: 'activities.startLiveActivity.tooltip',
    defaultMessage: 'Start a new Live Activity remotely using registered activity types and push-to-start tokens from the client.'
  },
  startLiveActivityTooltipIos: {
    id: 'activities.startLiveActivity.tooltip.ios',
    defaultMessage: 'Start a new Live Activity remotely using registered activity types and push-to-start tokens. Requires iOS 17.1+ and proper push notification setup.'
  },
  startLiveActivityTooltipUnsupported: {
    id: 'activities.startLiveActivity.tooltip.unsupported',
    defaultMessage: 'Remote Live Activity start is not supported on this platform. Live Activities can only be started locally on iOS 16.1+ devices.'
  },
  selectActivity: {
    id: 'activities.enhanced.selectActivity',
    defaultMessage: 'Select an Activity'
  },
  selectActivityDescription: {
    id: 'activities.enhanced.selectActivityDescription',
    defaultMessage: 'Choose an activity from the list to view its overview, flow, and event details.'
  }
});

function ActivitiesEnhanced() {
  const { formatMessage } = useIntl();
  const realActivities = useActivities();
  const registeredActivities = useRegisteredActivities();
  const { selectedActivityId, setSelectedActivityId } = usePluginState();
  const validationStatus = useLiveActivitiesValidationStatus();
  
  // Use only real activities - no mock data
  const activities = realActivities;
  
  // Debug logging
  console.log('=== ActivitiesEnhanced Debug ===');
  console.log('Real activities from useActivities():', realActivities);
  console.log('Real activities length:', realActivities.length);
  
  // Log each real activity in detail
  realActivities.forEach((activity, index) => {
    console.log(`Real Activity ${index}:`, {
      id: activity.id,
      name: activity.name,
      attributes: activity.attributes,
      status: activity.status,
      startTime: activity.startTime,
      endTime: activity.endTime,
      eventsCount: activity.events?.length || 0,
      updateEventsCount: activity.updateEvents?.length || 0,
      pushToStartToken: activity.pushToStartToken,
      updateToken: activity.updateToken
    });
  });
  
  console.log('Activities to display:', activities);
  console.log('Activities length:', activities.length);
  console.log('Current selectedActivityId:', selectedActivityId);
  console.log('=== End ActivitiesEnhanced Debug ===');

  const handleActivitySelect = (activityId: string) => {
    console.log('Activity selected:', activityId);
    console.log('Current selectedActivityId before:', selectedActivityId);
    setSelectedActivityId(activityId);
    console.log('Activity selection handler called');
  };

  // Determine platform capabilities based on validation status
  const platform = {
    hasLiveActivities: validationStatus === VALIDATION_STATUS.BASIC_SUPPORT || validationStatus === VALIDATION_STATUS.FULL_SUPPORT,
    hasRemoteStart: validationStatus === VALIDATION_STATUS.FULL_SUPPORT && registeredActivities.length > 0,
    supportLevel: validationStatus
  };
  
  // Get appropriate messages based on validation status
  const getNoActivitiesMessage = () => {
    switch (validationStatus) {
      case VALIDATION_STATUS.NOT_IOS:
        return formatMessage(messages.noActivitiesMessageUnsupported);
      case VALIDATION_STATUS.NOT_SUPPORTED:
        return formatMessage(messages.noActivitiesMessageIosUnsupported);
      case VALIDATION_STATUS.BASIC_SUPPORT:
        return formatMessage(messages.noActivitiesMessageIosPartial);
      case VALIDATION_STATUS.FULL_SUPPORT:
        return formatMessage(messages.noActivitiesMessageIosSupported);
      default:
        return formatMessage(messages.noActivitiesMessageUnsupported);
    }
  };

  const getStartActivityHint = () => {
    switch (validationStatus) {
      case VALIDATION_STATUS.NOT_IOS:
        return formatMessage(messages.startActivityHintUnsupported);
      case VALIDATION_STATUS.NOT_SUPPORTED:
        return formatMessage(messages.startActivityHintIosUnsupported);
      case VALIDATION_STATUS.BASIC_SUPPORT:
        return formatMessage(messages.startActivityHintIosPartial);
      case VALIDATION_STATUS.FULL_SUPPORT:
        return formatMessage(messages.startActivityHintIosSupported);
      default:
        return formatMessage(messages.startActivityHintUnsupported);
    }
  };

  const getTooltipMessage = () => {
    if (!platform.hasRemoteStart) {
      return formatMessage(messages.startLiveActivityTooltipUnsupported);
    }
    return formatMessage(messages.startLiveActivityTooltipIos);
  };

  // Info button component with conditional rendering
  const InfoButton = () => {
    if (!platform.hasRemoteStart) {
      return null; // Don't show info button if not supported
    }
    
    return (
      <TooltipTrigger>
        <Button 
          variant="secondary" 
          isQuiet
          UNSAFE_style={{ 
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
          }}
        >
          <Info />
        </Button>
        <Tooltip>
          <Text>{getTooltipMessage()}</Text>
        </Tooltip>
      </TooltipTrigger>
    );
  };

  return (
    <View height="100vh" overflow="hidden">
      <Flex direction="column" height="100%">
        {/* Header with Launch Button - Only show when there are activities */}
        {activities.length > 0 && (
          <View borderBottomWidth="thin" borderBottomColor="gray-300" padding="size-200">
            <Flex direction="row" justifyContent="space-between" alignItems="center">
              <View>
                <h2 style={{ margin: 0 }}>
                  {formatMessage(messages.activitiesEnhanced)} ({activities.length})
                </h2>
                {/* Debug info */}
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                  Debug: {activities.length} activities loaded
                </p>
              </View>
              {platform.hasLiveActivities && (
                <Flex alignItems="center" gap="size-100">
                  <LaunchLiveActivity />
                  <InfoButton />
                </Flex>
              )}
            </Flex>
          </View>
        )}

        {/* No Activities State */}
        {!activities.length && (
          <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            gap="size-300"
            flex="1"
            UNSAFE_style={{ padding: 'size-400' }}
          >
            <View
              backgroundColor="gray-100"
              borderWidth="thin"
              borderColor="gray-300"
              borderRadius="medium"
              padding="size-400"
              maxWidth="size-5000"
            >
              <Flex direction="column" alignItems="center" gap="size-200">
                <Text UNSAFE_style={{ fontSize: 'size-300', color: 'text-secondary', textAlign: 'center' }}>
                  {getNoActivitiesMessage()}
                </Text>
                <Text UNSAFE_style={{ fontSize: 'size-100', color: 'text-secondary', textAlign: 'center' }}>
                  {getStartActivityHint()}
                </Text>
                {platform.hasLiveActivities && (
                  <Flex alignItems="center" gap="size-100">
                    <LaunchLiveActivity />
                    <InfoButton />
                  </Flex>
                )}
              </Flex>
            </View>
          </Flex>
        )}

        {/* Main Content - Master Detail Layout */}
        {activities.length > 0 && (
          <Flex direction="row" flex="1" gap="size-200" minHeight="0">
            {/* Left Panel - Activities List */}
            <View
              width="size-4000"
              minWidth="size-3000"
              maxWidth="size-5000"
              borderEndWidth="thin"
              borderEndColor="gray-300"
              height="100%"
            >
              <ActivityList
                activities={activities}
                selectedActivityId={selectedActivityId ?? undefined}
                onActivitySelect={handleActivitySelect}
                isLoading={false}
              />
            </View>

            {/* Right Panel - Activity Details with Tabs */}
            <View flex="1" minWidth="size-4000" overflow="hidden">
              {selectedActivityId ? (
                (() => {
                  const selectedActivity = activities.find(a => a.id === selectedActivityId);
                  console.log('Selected activity found:', selectedActivity);
                  return (
                <Tabs height="100%">
                  <TabList>
                    <Item key="overview">{formatMessage(messages.overviewTab)}</Item>
                    <Item key="activityFlow">{formatMessage(messages.activityFlowTab)}</Item>
                    <Item key="eventDetails">{formatMessage(messages.eventDetailsTab)}</Item>
                  </TabList>
                  <TabPanels flex="1" height="100%">
                    <Item key="overview">
                      <View height="100%" overflow="auto">
                        <ActivityOverview activity={selectedActivity} />
                      </View>
                    </Item>
                    <Item key="activityFlow">
                      <View height="100%" overflow="auto">
                        <ActivityFlow activity={selectedActivity} />
                      </View>
                    </Item>
                    <Item key="eventDetails">
                      <View height="100%" overflow="auto">
                        <ActivityEventDetails activity={selectedActivity} />
                      </View>
                    </Item>
                  </TabPanels>
                </Tabs>
                  );
                })()
              ) : (
                <View padding="size-400">
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    direction="column"
                    gap="size-300"
                  >
                  <View
                    UNSAFE_style={{
                      textAlign: 'center',
                      maxWidth: '400px'
                    }}
                  >
                    <Heading level={2} marginY="size-0" marginBottom="size-200">
                      {formatMessage(messages.selectActivity)}
                    </Heading>
                    <Text UNSAFE_style={{ 
                      fontSize: 'var(--spectrum-global-dimension-size-200)',
                      color: 'var(--spectrum-global-color-gray-700)',
                      lineHeight: '1.5'
                    }}>
                      {formatMessage(messages.selectActivityDescription)}
                    </Text>
                  </View>
                  </Flex>
                </View>
              )}
            </View>
          </Flex>
        )}

      </Flex>
    </View>
  );
}

export default ActivitiesEnhanced;
