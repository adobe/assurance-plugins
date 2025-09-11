import React from 'react';
import { Flex, Heading, View, Text } from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import ActivityStatus from './activity-status';
import UpdateActivity from './update-activity';
import { LiveActivity } from '../../hooks/useActivities';
import { CopyableValue } from '../atoms/CopyableValue';
import './activity-info.scss';

dayjs.extend(localizedFormat);

interface ActivityInfoProps {
  activity?: LiveActivity;
}

const messages = defineMessages({
  liveActivityIdLabel: {
    id: 'activities.details.liveActivityId',
    defaultMessage: 'Live Activity ID'
  },
  copyValue: {
    id: 'activities.details.copyValue',
    defaultMessage: 'Copy value'
  },
  copyFullValue: {
    id: 'activities.details.copyFullValue',
    defaultMessage: 'Copy full value'
  },
  copied: {
    id: 'activities.details.copied',
    defaultMessage: 'Copied!'
  },
  attributeSetLabel: {
    id: 'activities.details.attributeSet',
    defaultMessage: 'Attribute Set'
  },
  startTimeLabel: {
    id: 'activities.details.startTime',
    defaultMessage: 'Start Time'
  },
  endTimeLabel: {
    id: 'activities.details.endTime',
    defaultMessage: 'End Time'
  },
  pushToStartTokenLabel: {
    id: 'activities.details.pushToStartToken',
    defaultMessage: 'Push to Start Token'
  },
  updateTokenLabel: {
    id: 'activities.details.updateToken',
    defaultMessage: 'Update Token'
  },
  contentStateLabel: {
    id: 'activities.details.contentState',
    defaultMessage: 'Current Content State'
  },
  schemaLabel: {
    id: 'activities.details.schema',
    defaultMessage: 'Activity Schema'
  },
  examplePayloadLabel: {
    id: 'activities.details.examplePayload',
    defaultMessage: 'Sample Payload'
  },
  noContentState: {
    id: 'activities.details.noContentState',
    defaultMessage: 'No content state available'
  },
  noSchema: {
    id: 'activities.details.noSchema',
    defaultMessage: 'No schema available'
  },
  noexamplePayload: {
    id: 'activities.details.noexamplePayload',
    defaultMessage: 'No sample payload available'
  }
});

function ActivityInfo({ activity }: ActivityInfoProps) {
  const { formatMessage } = useIntl();

  console.log('ActivityInfo received activity:', activity);

  if (!activity) {
    console.log('ActivityInfo: No activity provided');
    return <div>No activity selected</div>;
  }

  // Get the latest content state from update events
  const latestContentState =
    activity.updateEvents?.[0]?.payload?.ACPExtensionEventData?.contentState;

  return (
    <View marginY="size-200" height="100%" overflow="auto">
      <div className="live-activity">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex direction="row" alignItems="start" marginY="size-200" gap="size-200">
            <Heading level={2} marginY="size-0">
              {activity.name}
            </Heading>
            <ActivityStatus status={activity.status} />
          </Flex>
          <UpdateActivity activity={activity} />
        </Flex>

        <Heading level={3} marginY="size-0">
          Properties
        </Heading>
        <dl className="live-activity-details">
          <dt>{formatMessage(messages.liveActivityIdLabel)}</dt>
          <dd>
            <CopyableValue 
              value={activity.id}
              copyTooltip={formatMessage(messages.copyValue)}
              copyFullValueTooltip={formatMessage(messages.copyFullValue)}
              copiedMessage={formatMessage(messages.copied)}
            />
          </dd>
          <dt>{formatMessage(messages.attributeSetLabel)}</dt>
          <dd>{activity.attributes}</dd>
          <dt>{formatMessage(messages.startTimeLabel)}</dt>
          {activity.startTime && <dd>{dayjs(activity.startTime).format('lll')}</dd>}
          <dt>{formatMessage(messages.endTimeLabel)}</dt>
          {activity.endTime && <dd>{dayjs(activity.endTime).format('lll')}</dd>}
        </dl>

        <Heading level={3} marginY="size-0">
          Tokens
        </Heading>
        <dl className="live-activity-details">
          {activity.pushToStartToken && (
            <>
              <dt>{formatMessage(messages.pushToStartTokenLabel)}</dt>
              <dd>
                <CopyableValue 
                  value={activity.pushToStartToken}
                  copyTooltip={formatMessage(messages.copyValue)}
                  copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                  copiedMessage={formatMessage(messages.copied)}
                />
              </dd>
            </>
          )}
          {activity.updateToken && (
            <>
              <dt>{formatMessage(messages.updateTokenLabel)}</dt>
              <dd>
                <CopyableValue 
                  value={activity.updateToken}
                  copyTooltip={formatMessage(messages.copyValue)}
                  copyFullValueTooltip={formatMessage(messages.copyFullValue)}
                  copiedMessage={formatMessage(messages.copied)}
                />
              </dd>
            </>
          )}
        </dl>

        <Heading level={3} marginY="size-0">
          {formatMessage(messages.contentStateLabel)}
        </Heading>
        <div className="live-activity-content">
          {latestContentState ? (
            <pre className="content-state">{JSON.stringify(latestContentState, null, 2)}</pre>
          ) : (
            <Text>{formatMessage(messages.noContentState)}</Text>
          )}
        </div>

        <Heading level={3} marginY="size-0">
          {formatMessage(messages.schemaLabel)}
        </Heading>
        <div className="live-activity-content">
          {activity.schema ? (
            <pre className="schema">{JSON.stringify(activity.schema, null, 2)}</pre>
          ) : (
            <Text>{formatMessage(messages.noSchema)}</Text>
          )}
        </div>

        <Heading level={3} marginY="size-0">
          {formatMessage(messages.examplePayloadLabel)}
        </Heading>
        <div className="live-activity-content">
          {activity.examplePayload ? (
            <pre className="sample-payload">{JSON.stringify(activity.examplePayload, null, 2)}</pre>
          ) : (
            <Text>{formatMessage(messages.noexamplePayload)}</Text>
          )}
        </div>
      </div>
    </View>
  );
}

export default ActivityInfo;
