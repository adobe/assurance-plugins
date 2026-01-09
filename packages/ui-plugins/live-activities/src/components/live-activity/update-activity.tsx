/**
 * Update Live Activity Component
 * 
 * Allows users to update an existing Live Activity by pasting a new APS payload
 * and sending it through the Griffon API using the activity's update token.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  DialogTrigger,
  Button,
  Dialog,
  Heading,
  Divider,
  Content,
  View,
  Text,
  RadioGroup,
  Radio,
  ToastQueue,
  TextField
} from '@adobe/react-spectrum';
import { useIntl } from 'react-intl';
import Send from '@spectrum-icons/workflow/Send';
import { Controller, useForm } from 'react-hook-form';

import {
  buildApiUrl,
  generateLiveActivityPayload,
  sendLiveActivityNotification,
  generateUpdateTemplate,
  buildCompleteApsPayload,
  ACTIVITY_TYPE,
  ActivityType,
  EVENT_TYPE
} from '../../api/liveActivityApi';
import { LiveActivity } from '../../hooks/useActivities';
import { LIVE_ACTIVITY_DEFAULTS, MESSAGES as COMMON_MESSAGES } from '../../constants/liveActivitiesConfig';
import { ErrorMessage, JsonEditor, DialogActions } from './common';
import { useLiveActivityContext } from '../../hooks/useLiveActivityContext';
import { liveActivityMessages, actionMessages } from '../../i18n';

// ============================================================================
// TYPES
// ============================================================================

interface FormValues {
  payload: string;
}

interface UpdateActivityProps {
  activity: LiveActivity;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function UpdateActivity({ activity }: Readonly<UpdateActivityProps>) {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventType, setEventType] = useState<typeof EVENT_TYPE.UPDATE | typeof EVENT_TYPE.END>(EVENT_TYPE.UPDATE);
  const [activityTypeSelection, setActivityTypeSelection] = useState<ActivityType>(activity.type || ACTIVITY_TYPE.UNITARY);
  const [broadcastChannelId, setBroadcastChannelId] = useState<string>(activity.broadcastChannelId || '');

  // Context (doesn't require push token for update operations)
  const context = useLiveActivityContext({ requirePushToken: false });

  // Form - Initialize with simplified template
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      payload: JSON.stringify(generateUpdateTemplate(activity), null, 2)
    }
  });

  useEffect(() => {
    if (activity?.id || activity?.broadcastChannelId) {
      reset({
        payload: JSON.stringify(generateUpdateTemplate(activity), null, 2)
      });
      setActivityTypeSelection(activity.type || ACTIVITY_TYPE.UNITARY);
      setBroadcastChannelId(activity.broadcastChannelId || '');
    }
  }, [activity?.id, activity?.broadcastChannelId, activity?.currentContentState, activity?.type, reset]);

  // Handlers
  const handleUpdate = useCallback(async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse user's JSON input
      let userPayload;
      try {
        userPayload = JSON.parse(data.payload);
      } catch {
        throw new Error('Invalid JSON format in payload');
      }

      // Validate update token exists for unitary activities
      // Broadcast activities don't require an update token
      if (activityTypeSelection === ACTIVITY_TYPE.UNITARY && !activity.updateToken) {
        throw new Error('Update token not available for this activity');
      }

      // Validate broadcast channel ID if broadcast type is selected
      if (activityTypeSelection === ACTIVITY_TYPE.BROADCAST && !broadcastChannelId.trim()) {
        throw new Error(formatMessage(liveActivityMessages.broadcastChannelIdRequired));
      }

      // Build complete APS payload by merging user input with auto-generated fields
      const completeApsPayload = buildCompleteApsPayload({
        userPayload,
        eventType,
        attributesType: activity.attributes || 'unknown',
        broadcastChannelId: activityTypeSelection === ACTIVITY_TYPE.BROADCAST ? broadcastChannelId : undefined
      });

      // Generate complete payload
      // For unitary: use updateToken
      // For broadcast: use pushToStartToken or empty string (token not required for broadcast updates)
      const token = activityTypeSelection === ACTIVITY_TYPE.UNITARY 
        ? activity.updateToken 
        : (activity.pushToStartToken || '');

      const payload = generateLiveActivityPayload({
        apsContent: completeApsPayload,
        appId: context.appId!,
        platform: context.platform,
        token: token!,
        ecid: context.ecid!,
        imsOrg: context.imsOrg!,
        sessionId: context.sessionId!,
        sandboxName: context.sandbox?.name || LIVE_ACTIVITY_DEFAULTS.SANDBOX,
        environment: context.environment,
        type: activityTypeSelection,
        broadcastChannelId: activityTypeSelection === ACTIVITY_TYPE.BROADCAST ? broadcastChannelId : undefined
      });

      // Make API call
      const url = buildApiUrl(context.environment);
      await sendLiveActivityNotification({
        url,
        token: context.token!,
        payload
      });
      ToastQueue.positive('Live Activity updated successfully', {timeout: 3000});
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update Live Activity';
      setError(errorMessage);
      throw err; // Re-throw to prevent dialog from closing on error
    } finally {
      setIsLoading(false);
    }
  }, [activity, context, eventType, activityTypeSelection, broadcastChannelId, formatMessage]);

  const handleReset = useCallback(() => {
    reset();
    setEventType(EVENT_TYPE.UPDATE);
    setActivityTypeSelection(activity.type || ACTIVITY_TYPE.UNITARY);
    setBroadcastChannelId(activity.broadcastChannelId || '');
    setError(null);
  }, [reset, activity.type, activity.broadcastChannelId]);

  // Computed values
  // For unitary activities: require update token
  // For broadcast activities: update token is not required
  const requiresToken = activityTypeSelection === ACTIVITY_TYPE.UNITARY && !activity.updateToken;
  // Only disable for unitary completed activities (broadcast channels can be reused)
  // const isButtonDisabled = !context.isReady || isLoading || requiresToken || 
  //   (activityTypeSelection === 'unitary' && activity.status === 'completed');

  // Disable if not ready or loading or requires token (Enabling for other cases)
  const isButtonDisabled = !context.isReady || isLoading || requiresToken;

  return (
    <DialogTrigger>
      <Button 
        variant="primary"
        isDisabled={isButtonDisabled}
      >
        <Send marginEnd="size-50" />
        {formatMessage(liveActivityMessages.updateLiveActivity)}
      </Button>
      
      {(close) => (
        <Dialog>
          <Heading>
            {formatMessage(liveActivityMessages.updateLiveActivityHeading, { 
              activityId: activity.id || activity.broadcastChannelId || activity.name
            })}
          </Heading>
          <Divider />
          
          <Content>
            <View marginBottom="size-200">
              <Text>{formatMessage(liveActivityMessages.apsPayloadDescription)}</Text>
            </View>

            <View marginBottom="size-200">
              <RadioGroup 
                label={formatMessage(liveActivityMessages.eventType)}
                value={eventType}
                onChange={(value) => setEventType(value as typeof EVENT_TYPE.UPDATE | typeof EVENT_TYPE.END)}
                orientation="horizontal"
              >
                <Radio value={EVENT_TYPE.UPDATE}>{formatMessage(liveActivityMessages.eventTypeUpdate)}</Radio>
                <Radio value={EVENT_TYPE.END}>{formatMessage(liveActivityMessages.eventTypeEnd)}</Radio>
              </RadioGroup>
            </View>

            <View marginBottom="size-200">
              <RadioGroup 
                label={formatMessage(liveActivityMessages.activityType)}
                value={activityTypeSelection}
                onChange={(value) => setActivityTypeSelection(value as ActivityType)}
                orientation="horizontal"
                isDisabled
              >
                <Radio value={ACTIVITY_TYPE.UNITARY}>{formatMessage(liveActivityMessages.activityTypeUnitary)}</Radio>
                <Radio value={ACTIVITY_TYPE.BROADCAST}>{formatMessage(liveActivityMessages.activityTypeBroadcast)}</Radio>
              </RadioGroup>
            </View>

            {activityTypeSelection === ACTIVITY_TYPE.BROADCAST && (
              <View marginBottom="size-200">
                <TextField
                  label={formatMessage(liveActivityMessages.broadcastChannelId)}
                  placeholder={formatMessage(liveActivityMessages.broadcastChannelIdPlaceholder)}
                  value={broadcastChannelId}
                  onChange={setBroadcastChannelId}
                  width="100%"
                  isRequired
                  isDisabled
                  isReadOnly
                />
              </View>
            )}

            <Controller
              name="payload"
              control={control}
              render={({ field: { onChange, value } }) => (
                <JsonEditor
                  value={value}
                  onChange={onChange}
                  showLineNumbers
                />
              )}
              rules={{ required: 'Payload is required' }}
            />

            {error && <ErrorMessage message={error} />}
          </Content>
          
          <DialogActions
            isLoading={isLoading}
            isDisabled={isButtonDisabled}
            onCancel={() => {
              handleReset();
              close();
            }}
            onAction={async () => {
              try {
                await handleSubmit(handleUpdate)();
                handleReset();
                close();
              } catch {
                // Error already handled in handleUpdate
              }
            }}
            cancelLabel={formatMessage(COMMON_MESSAGES.cancel)}
            actionLabel={formatMessage(actionMessages.update)}
            loadingLabel={formatMessage(COMMON_MESSAGES.sending)}
          />
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default UpdateActivity;
