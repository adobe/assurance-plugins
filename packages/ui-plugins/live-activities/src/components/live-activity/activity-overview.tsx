import { Flex, Heading, View, Text, Grid, Divider } from '@adobe/react-spectrum';

import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import ContentStateCard from '../atoms/ContentStateCard';
import { CopyableValue } from '@assurance/common-utils';
import InfoField from '../atoms/InfoField';
import MetricCard from '../atoms/MetricCard';
import Card from '../atoms/card';
import { LiveActivity } from '../../hooks/useActivities';
import { useActivityEvents } from '../../utils/eventProcessing';
import { activitiesMessages, copyMessages, contentStateMessages } from '../../i18n';

import './activity-overview.css';
import ActivityStatus from './activity-status';
import UpdateActivity from './update-activity';

dayjs.extend(localizedFormat);

interface ActivityOverviewProps {
  activity?: LiveActivity;
}

function ActivityOverview({ activity }: ActivityOverviewProps) {
  const { formatMessage } = useIntl();

  // Use the same deduplicated events as other components
  const activityEvents = useActivityEvents(activity?.id);

  // Get the latest content state from update events
  const { latestContentState, latestContentStateEventId } = useMemo(() => {
    if (!activity) return { latestContentState: null, latestContentStateEventId: null };
    
    const updateEvent = activityEvents
      .filter(event => event.payload?.ACPExtensionEventName === 'Live Activity updated')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return {
      latestContentState: updateEvent?.payload?.ACPExtensionEventData?.contentState,
      latestContentStateEventId: updateEvent?.uuid
    };
  }, [activity?.id, activityEvents]);

  // Calculate duration
  const startTime = activity?.startTime ? dayjs(activity.startTime) : null;
  const endTime = activity?.endTime ? dayjs(activity.endTime) : null;
  const now = dayjs();
  const duration = startTime ? (endTime || now).diff(startTime, 'minute') : 0;

  if (!activity) {
    return (
      <View padding="size-400">
        <Text>No activity selected</Text>
      </View>
    );
  }

  const updateCount = activityEvents.filter(event => 
    event.payload?.ACPExtensionEventName === 'Live Activity updated'
  ).length;
  
  const tokenUpdateCount = activityEvents.filter(event => 
    event.payload?.ACPExtensionEventName === 'Live Activity update token'
  ).length;
  
  const eventCount = activityEvents.length;
  
  const lastUpdate = activityEvents
    .filter(event => event.payload?.ACPExtensionEventName === 'Live Activity updated')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.timestamp;

  return (
    <View marginY="size-200" height="100%" overflow="auto">
      <div className="activity-overview">
        {/* Header */}
        <Flex alignItems="center" justifyContent="space-between" marginBottom="size-300">
          <Flex direction="row" alignItems="center" gap="size-200">
            <Heading level={2} marginY="size-0">
              {activity.name}
            </Heading>
            <ActivityStatus status={activity.status} />
          </Flex>
          <UpdateActivity activity={activity} />
        </Flex>

        {/* Metrics Cards */}
        <Grid
          areas={['metrics metrics', 'basicInfo contentState']}
          columns={['1fr', '1fr']}
          rows={['auto', '1fr']}
          gap="size-200"
          marginBottom="size-300"
        >
          {/* Metrics Row */}
          <View gridArea="metrics">
            <Heading level={3} marginY="size-0" marginBottom="size-200">
              {formatMessage(activitiesMessages.activityMetrics)}
            </Heading>
            <Flex gap="size-200" wrap>
              <MetricCard 
                label={formatMessage(activitiesMessages.duration)}
                value={duration > 0 ? `${duration} min` : 'N/A'}
                tooltip="Total time the Live Activity has been active, calculated from start time to end time (or current time if still active)"
              />
              <MetricCard 
                label="Content Updates"
                value={updateCount}
                tooltip="Number of times the activity content has been updated with new data"
              />
              <MetricCard 
                label="Token Updates"
                value={tokenUpdateCount}
                tooltip="Number of times the update token has been refreshed for push notifications"
              />
              <MetricCard 
                label={formatMessage(activitiesMessages.eventCount)}
                value={eventCount}
                tooltip="Total number of events associated with this Live Activity"
              />
              {lastUpdate && (
                <MetricCard 
                  label={formatMessage(activitiesMessages.lastUpdate)}
                  value={dayjs(lastUpdate).format('HH:mm:ss')}
                  tooltip="Time when the activity content was last updated"
                />
              )}
            </Flex>
          </View>

          {/* Basic Information */}
          <View gridArea="basicInfo">
            <Card>
              <View padding="size-200">
                <Flex direction="column" gap="size-200">
                <Heading level={3} marginY="size-0">
                  {formatMessage(activitiesMessages.basicInfo)}
                </Heading>
                <Divider />
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <InfoField
                      label={formatMessage(activitiesMessages.liveActivityId)}
                      value={
                        <CopyableValue 
                          value={activity.id}
                          copyTooltip={formatMessage(copyMessages.copyValue)}
                          copyFullValueTooltip={formatMessage(copyMessages.copyFullValue)}
                          copiedMessage={formatMessage(copyMessages.copied)}
                        />
                      }
                      wrap={true}
                    />
                    <InfoField
                      label={formatMessage(activitiesMessages.attributeSet)}
                      value={activity.attributes || 'N/A'}
                    />
                    {startTime && (
                      <InfoField
                        label={formatMessage(activitiesMessages.startTime)}
                        value={startTime.format('lll')}
                      />
                    )}
                    {endTime && (
                      <InfoField
                        label={formatMessage(activitiesMessages.endTime)}
                        value={endTime.format('lll')}
                      />
                    )}
                  </tbody>
                </table>
                </Flex>
              </View>
            </Card>
          </View>

          {/* Content State */}
          <View gridArea="contentState">
            <ContentStateCard 
              contentState={latestContentState}
              noContentStateMessage={formatMessage(contentStateMessages.noContentState)}
              lastUpdatedTimestamp={lastUpdate ? new Date(lastUpdate).getTime() : undefined}
              eventId={latestContentStateEventId || undefined}
            />
          </View>
        </Grid>
      </div>
    </View>
  );
}

export default ActivityOverview;
