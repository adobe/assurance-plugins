import { Flex, View, Tabs, TabList, TabPanels, Item, Text, Tooltip, TooltipTrigger, Button, Heading } from '@adobe/react-spectrum';

import { ResizeHandle } from '@assurance/event-table';
import { useResizePanel, useResizeObserver } from '@assurance/common-utils';

import Info from '@spectrum-icons/workflow/Info';

import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';
import classNames from 'classnames';

import './activities.css';

import { VALIDATION_STATUS } from '../constants';
import { NAVIGATION_CONFIG } from '../constants/liveActivitiesConfig';
import useActivities, { useRegisteredActivities } from '../hooks/useActivities';
import { useLiveActivitiesValidationStatus } from '../hooks/useLiveActivitiesValidationStatus';
import type { ActivityTab } from '../hooks/usePluginState';
import usePluginState from '../hooks/usePluginState';
import { activitiesMessages } from '../i18n';
import ActivityList from '../components/activities/ActivityList';
import ActivityEventDetails from '../components/live-activity/activity-event-details';
import ActivityFlow from '../components/live-activity/activity-flow';
import ActivityOverview from '../components/live-activity/activity-overview';
import LaunchLiveActivity from '../components/live-activity/launch-live-activity';

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
      setActiveTab
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
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.OVERVIEW}>{formatMessage(activitiesMessages.overviewTab)}</Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.ACTIVITY_FLOW}>{formatMessage(activitiesMessages.activityFlowTab)}</Item>
          <Item key={NAVIGATION_CONFIG.ACTIVITY_TABS.EVENT_DETAILS}>{formatMessage(activitiesMessages.eventDetailsTab)}</Item>
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
        return formatMessage(activitiesMessages.noActivitiesMessage);
      case VALIDATION_STATUS.NOT_SUPPORTED:
        return formatMessage(activitiesMessages.noActivitiesIosUnsupported);
      case VALIDATION_STATUS.BASIC_SUPPORT:
        return formatMessage(activitiesMessages.noActivitiesIosSupported);
      case VALIDATION_STATUS.FULL_SUPPORT:
        return formatMessage(activitiesMessages.noActivitiesIosSupported);
      default:
        return formatMessage(activitiesMessages.noActivitiesMessage);
    }
  };

  const getStartActivityHint = () => {
    switch (validationStatus) {
      case VALIDATION_STATUS.NOT_IOS:
        return formatMessage(activitiesMessages.startActivityHintNotIos);
      case VALIDATION_STATUS.NOT_SUPPORTED:
        return formatMessage(activitiesMessages.startActivityHintIosUnsupported);
      case VALIDATION_STATUS.BASIC_SUPPORT:
        return formatMessage(activitiesMessages.startActivityHintIosBasicSupport);
      case VALIDATION_STATUS.FULL_SUPPORT:
        return formatMessage(activitiesMessages.startActivityHintIosFullSupport);
      default:
        return formatMessage(activitiesMessages.startActivityHintNotIos);
    }
  };

  const getTooltipMessage = () => {
    if (!platform.hasRemoteStart) {
      return formatMessage(activitiesMessages.launchTooltipUnsupported);
    }
    return formatMessage(activitiesMessages.launchTooltipSupported);
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
          <View UNSAFE_className={classNames('noActivitiesContainer')}>
            <View UNSAFE_className={classNames('noActivitiesContent')}>
              <Flex direction="column" alignItems="center" gap="size-300">
                <Text UNSAFE_className={classNames('noActivitiesText')}>
                  {getNoActivitiesMessage()}
                </Text>
                <Text UNSAFE_className={classNames('noActivitiesHint')}>
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
            className={classNames('activitiesResizableContainer', {
              'resizing': isResizing
            })}
          >
            {/* Left Panel - Activities List */}
            <View
              UNSAFE_className={classNames('leftPanel', {
                'resizing': isResizing
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
              UNSAFE_className={classNames('rightPanel', {
                'resizing': isResizing
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
                  <View UNSAFE_className={classNames('selectActivityContainer')}>
                    <Heading level={2} marginY="size-0" marginBottom="size-200">
                      {formatMessage(activitiesMessages.selectActivityTitle)}
                    </Heading>
                    <Text UNSAFE_className={classNames('selectActivityDescription')}>
                      {formatMessage(activitiesMessages.selectActivityDescription)}
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
