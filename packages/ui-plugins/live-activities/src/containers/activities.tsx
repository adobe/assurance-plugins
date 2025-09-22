import { Flex, View, Tabs, TabList, TabPanels, Item, Text, Tooltip, TooltipTrigger, Button, Heading } from '@adobe/react-spectrum';

import { ResizeHandle } from '@assurance/event-table';
import { useResizePanel, useResizeObserver } from '@assurance/common-utils';

import Info from '@spectrum-icons/workflow/Info';

import React, { useState, useMemo } from 'react';

import { defineMessages, useIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './activities.css';

import { VALIDATION_STATUS } from '../constants';
import { NAVIGATION_CONFIG } from '../constants/liveActivitiesConfig';
import useActivities, { useRegisteredActivities } from '../hooks/useActivities';
import { useLiveActivitiesValidationStatus } from '../hooks/useLiveActivitiesValidationStatus';
import type { ActivityTab } from '../hooks/usePluginState';
import usePluginState from '../hooks/usePluginState';
import ActivityList from '../components/activities/ActivityList';
import ActivityEventDetails from '../components/live-activity/activity-event-details';
import ActivityFlow from '../components/live-activity/activity-flow';
import ActivityOverview from '../components/live-activity/activity-overview';
import LaunchLiveActivity from '../components/live-activity/launch-live-activity';

const messages = defineMessages({
  activities: {
    id: 'activities.title',
    defaultMessage: 'Activities'
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
    id: 'activities.selectActivity',
    defaultMessage: 'Select an Activity'
  },
  selectActivityDescription: {
    id: 'activities.selectActivityDescription',
    defaultMessage: 'Choose an activity from the list to view its overview, flow, and event details.'
  }
});

// Main activities component using Zustand
function Activities() {
  const { formatMessage } = useIntl();
  const realActivities = useActivities();
  const registeredActivities = useRegisteredActivities();
  const { 
    activityNavigation: {
      selectedActivityId, 
      setSelectedActivityId, 
      activeTab, 
      setActiveTab, 
      selectedEventId, 
      setSelectedEventId 
    }
  } = usePluginState();
  const validationStatus = useLiveActivitiesValidationStatus();
  
  // Use only real activities - no mock data
  const activities = realActivities;
  
  // Resize functionality
  const { ref: containerRef, width: containerWidth } = useResizeObserver<HTMLDivElement>({
    onResize: () => {},
    observeHeight: false,
    debounceDelay: 50
  });

  const {
    panelWidth,
    isResizing,
    handleMouseDown,
    updateContainerWidth
  } = useResizePanel({
    initialWidth: 400,
    minWidth: 300,
    maxWidthPercentage: 0.6,
    containerWidth: containerWidth,
    isOpen: activities.length > 0,
    onWidthChange: () => {}
  });

  // Update panel width when container width changes
  React.useEffect(() => {
    updateContainerWidth(containerWidth);
  }, [containerWidth, updateContainerWidth]);

  // Memoize the selected activity tabs content
  const selectedActivityTabs = useMemo(() => {
    if (!selectedActivityId) return null;
    
    const selectedActivity = activities.find(a => a.id === selectedActivityId);
    return (
      <Tabs
        height="100%"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as ActivityTab)}
      >
        <TabList>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.OVERVIEW}>{formatMessage(messages.overviewTab)}</Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.ACTIVITY_FLOW}>{formatMessage(messages.activityFlowTab)}</Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS}>{formatMessage(messages.eventDetailsTab)}</Item>
        </TabList>
        <TabPanels flex="1" maxHeight="calc(100vh - 14%)">
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.OVERVIEW}>
            <View height="100%" overflow="auto">
              <ActivityOverview activity={selectedActivity} />
            </View>
          </Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.ACTIVITY_FLOW}>
            <View height="100%" overflow="auto">
              <ActivityFlow activity={selectedActivity} />
            </View>
          </Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS}>
            <View height="100%" overflow="auto">
              <ActivityEventDetails 
                activity={selectedActivity} 
              />
            </View>
          </Item>
        </TabPanels>
      </Tabs>
    );
  }, [selectedActivityId, activities, activeTab, setActiveTab, formatMessage]);
  

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivityId(activityId);    
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
            <Flex direction="row" justifyContent="end" alignItems="center">              
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
          <View UNSAFE_className={styles.noActivitiesContainer}>
            <View UNSAFE_className={styles.noActivitiesContent}>
              <Flex direction="column" alignItems="center" gap="size-300">
                <Text UNSAFE_className={styles.noActivitiesText}>
                  {getNoActivitiesMessage()}
                </Text>
                <Text UNSAFE_className={styles.noActivitiesHint}>
                  {getStartActivityHint()}
                </Text>
                {platform.hasLiveActivities && (
                  <Flex alignItems="center" gap="size-200" marginTop="size-200">
                    <LaunchLiveActivity />
                    <InfoButton />
                  </Flex>
                )}
              </Flex>
            </View>
          </View>
        )}

        {/* Main Content - Resizable Split View */}
        {activities.length > 0 && (
          <div 
            ref={containerRef} 
            className={classNames(styles.activitiesResizableContainer, {
              [styles.resizing]: isResizing
            })}
          >
            {/* Left Panel - Activities List */}
            <View
              UNSAFE_className={classNames(styles.leftPanel, {
                [styles.resizing]: isResizing
              })}
              UNSAFE_style={{
                width: `${panelWidth}px`,
                minWidth: '300px',
                maxWidth: '600px'
              }}
            >
              <ActivityList
                activities={activities}
                selectedActivityId={selectedActivityId ?? undefined}
                onActivitySelect={handleActivitySelect}
                isLoading={false}
              />
            </View>

            {/* Resize Handle */}
            <ResizeHandle
              isResizing={isResizing}
              onMouseDown={handleMouseDown}
              isVisible={true}
            />

            {/* Right Panel - Activity Details with Tabs */}
            <View
              UNSAFE_className={classNames(styles.rightPanel, {
                [styles.resizing]: isResizing
              })}
            >
              {selectedActivityTabs || (
                <View padding="size-400">
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    direction="column"
                    gap="size-300"
                  >
                  <View UNSAFE_className={styles.selectActivityContainer}>
                    <Heading level={2} marginY="size-0" marginBottom="size-200">
                      {formatMessage(messages.selectActivity)}
                    </Heading>
                    <Text UNSAFE_className={styles.selectActivityDescription}>
                      {formatMessage(messages.selectActivityDescription)}
                    </Text>
                  </View>
                  </Flex>
                </View>
              )}
            </View>
          </div>
        )}

      </Flex>
    </View>
  );
}

export default Activities;
