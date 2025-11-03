/**
 * Update Live Activity Component
 * 
 * Allows users to update an existing Live Activity by pasting a new APS payload
 * and sending it through the Griffon API using the activity's update token.
 */

import React, { useState, useCallback } from 'react';
import {
  DialogTrigger,
  Button,
  Dialog,
  Heading,
  Divider,
  Content,
  View,
  Text,
  ToastQueue
} from '@adobe/react-spectrum';
import { defineMessages, useIntl } from 'react-intl';
import Send from '@spectrum-icons/workflow/Send';
import { Controller, useForm } from 'react-hook-form';

import {
  buildApiUrl,
  generateLiveActivityPayload,
  sendLiveActivityNotification
} from '../../api/liveActivityApi';
import { LiveActivity } from '../../hooks/useActivities';
import { LIVE_ACTIVITY_DEFAULTS, MESSAGES as COMMON_MESSAGES } from '../../constants/liveActivitiesConfig';
import { ErrorMessage, JsonEditor, DialogActions } from '../activities/shared';
import { useLiveActivityContext } from '../../hooks/useLiveActivityContext';

// ============================================================================
// I18N MESSAGES
// ============================================================================

const messages = defineMessages({
  updateLiveActivity: {
    id: 'updateLiveActivity',
    defaultMessage: 'Send Update'
  },
  updateLiveActivityHeading: {
    id: 'updateLiveActivityHeading',
    defaultMessage: 'Update Live Activity {activityName}'
  },
  update: {
    id: 'update',
    defaultMessage: 'Send Update'
  },
  apsPayloadDescription: {
    id: 'apsPayloadDescription',
    defaultMessage: 'Paste the updated APS payload content below'
  }
});

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

  // Context (doesn't require push token for update operations)
  const context = useLiveActivityContext({ requirePushToken: false });

  console.log('activity ****', activity);

  // Form
  const {
    control,
    handleSubmit,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      payload: JSON.stringify(activity.examplePayload?.['content-state'] || {}, null, 2)
    }
  });

  // Handlers
  const handleUpdate = useCallback(async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse and validate APS payload
      let parsedAps;
      try {
        parsedAps = JSON.parse(data.payload);
      } catch {
        // ToastQueue.negative('Invalid JSON format in APS payload');
        return;
      }

      // Validate update token exists
      if (!activity.updateToken) {
        // ToastQueue.negative('Update token not available for this activity');
        return;
      }

      // Generate complete payload using update token
      const payload = generateLiveActivityPayload({
        apsContent: parsedAps,
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

      console.log('Live Activity updated successfully');
      
    } catch (err: any) {
      console.error('Failed to update Live Activity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update Live Activity';
      setError(errorMessage);
      // ToastQueue.negative(`Failed to update Live Activity: ${errorMessage}`);
      throw err; // Re-throw to prevent dialog from closing on error
    } finally {
      setIsLoading(false);
    }
  }, [activity, context]);

  const handleReset = useCallback(() => {
    reset();
    setError(null);
  }, [reset]);

  // Computed values
  const isButtonDisabled = !context.isReady || isLoading || !activity.updateToken;

  return (
    <DialogTrigger>
      <Button 
        variant="primary"
        isDisabled={isButtonDisabled}
      >
        <Send marginEnd="size-50" />
        {formatMessage(messages.updateLiveActivity)}
      </Button>
      
      {(close) => (
        <Dialog>
          <Heading>
            {formatMessage(messages.updateLiveActivityHeading, { 
              activityName: activity.name || activity.id 
            })}
          </Heading>
          <Divider />
          
          <Content>
            <View marginBottom="size-200">
              <Text>{formatMessage(messages.apsPayloadDescription)}</Text>
            </View>

            <Controller
              name="payload"
              control={control}
              render={({ field: { onChange, value } }) => (
                <JsonEditor
                  value={value}
                  onChange={onChange}
                  label={formatMessage(COMMON_MESSAGES.apsPayload)}
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
            actionLabel={formatMessage(messages.update)}
            loadingLabel={formatMessage(COMMON_MESSAGES.sending)}
          />
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default UpdateActivity;
