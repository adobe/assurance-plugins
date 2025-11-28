/**
 * Update Live Activity Component
 *
 * Allows users to update an existing Live Activity by pasting a new APS payload
 * and sending it through the Griffon API using the activity's update token.
 */
import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  Radio,
  RadioGroup,
  Text,
  ToastQueue,
  View
} from '@adobe/react-spectrum';
import Send from '@spectrum-icons/workflow/Send';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import {
  buildApiUrl,
  buildCompleteApsPayload,
  generateLiveActivityPayload,
  generateUpdateTemplate,
  sendLiveActivityNotification
} from '../../api/liveActivityApi';
import {
  MESSAGES as COMMON_MESSAGES,
  LIVE_ACTIVITY_DEFAULTS
} from '../../constants/liveActivitiesConfig';
import { LiveActivity } from '../../hooks/useActivities';
import { useLiveActivityContext } from '../../hooks/useLiveActivityContext';
import { actionMessages, liveActivityMessages } from '../../i18n';
import { DialogActions, ErrorMessage, JsonEditor } from './common';

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
  const [eventType, setEventType] = useState<'update' | 'end'>('update');

  // Context (doesn't require push token for update operations)
  const context = useLiveActivityContext({ requirePushToken: false });

  // Form - Initialize with simplified template
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      payload: JSON.stringify(generateUpdateTemplate(activity), null, 2)
    }
  });

  useEffect(() => {
    if (activity?.id) {
      reset({
        payload: JSON.stringify(generateUpdateTemplate(activity), null, 2)
      });
    }
  }, [activity?.id, activity?.currentContentState, reset]);

  // Handlers
  const handleUpdate = useCallback(
    async (data: FormValues) => {
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

        // Validate update token exists
        if (!activity.updateToken) {
          throw new Error('Update token not available for this activity');
        }

        // Build complete APS payload by merging user input with auto-generated fields
        const completeApsPayload = buildCompleteApsPayload({
          userPayload,
          eventType,
          attributesType: activity.attributes || 'unknown'
        });

        // Generate complete payload using update token
        const payload = generateLiveActivityPayload({
          apsContent: completeApsPayload,
          appId: context.appId!,
          platform: context.platform,
          token: activity.updateToken, // Using updateToken for updates
          ecid: context.ecid!,
          imsOrg: context.imsOrg!,
          sessionId: context.sessionId!,
          sandboxName: context.sandbox?.name || LIVE_ACTIVITY_DEFAULTS.SANDBOX,
          environment: context.environment
        });

        // Make API call
        const url = buildApiUrl(context.environment);
        await sendLiveActivityNotification({
          url,
          token: context.token!,
          payload
        });
        ToastQueue.positive('Live Activity updated successfully', { timeout: 3000 });
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to update Live Activity';
        setError(errorMessage);
        throw err; // Re-throw to prevent dialog from closing on error
      } finally {
        setIsLoading(false);
      }
    },
    [activity, context, eventType]
  );

  const handleReset = useCallback(() => {
    reset();
    setEventType('update');
    setError(null);
  }, [reset]);

  // Computed values
  const isButtonDisabled =
    !context.isReady || isLoading || !activity.updateToken || activity.status === 'completed';

  return (
    <DialogTrigger>
      <Button variant="primary" isDisabled={isButtonDisabled}>
        <Send marginEnd="size-50" />
        {formatMessage(liveActivityMessages.updateLiveActivity)}
      </Button>

      {close => (
        <Dialog>
          <Heading>
            {formatMessage(liveActivityMessages.updateLiveActivityHeading, {
              activityId: activity.id || activity.name
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
                onChange={value => setEventType(value as 'update' | 'end')}
                orientation="horizontal"
              >
                <Radio value="update">{formatMessage(liveActivityMessages.eventTypeUpdate)}</Radio>
                <Radio value="end">{formatMessage(liveActivityMessages.eventTypeEnd)}</Radio>
              </RadioGroup>
            </View>

            <Controller
              name="payload"
              control={control}
              render={({ field: { onChange, value } }) => (
                <JsonEditor value={value} onChange={onChange} showLineNumbers />
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
