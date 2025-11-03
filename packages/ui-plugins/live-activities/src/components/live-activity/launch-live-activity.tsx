import React, { useState, useRef, useCallback } from 'react';
import {
  DialogTrigger,
  Button,
  Dialog,
  Heading,
  Divider,
  Content,
  View,
  Text,
  Picker,
  Item,
  
} from '@adobe/react-spectrum';
import classNames from 'classnames';
import Rocket from '@spectrum-icons/workflow/Launch';
import { defineMessages, useIntl } from 'react-intl';
import { useLiveActivitiesData, useRegisteredActivities } from '../../hooks/useActivities';
import {
  buildApiUrl,
  generateLiveActivityPayload,
  sendLiveActivityNotification
} from '../../api/liveActivityApi';
import { LIVE_ACTIVITY_DEFAULTS, MESSAGES as COMMON_MESSAGES } from '../../constants/liveActivitiesConfig';
import { ErrorMessage, JsonEditor, DialogActions } from '../activities/shared';
import { useLiveActivityContext } from '../../hooks/useLiveActivityContext';
import './launch-live-activity.css';

// ============================================================================
// I18N MESSAGES
// ============================================================================

const messages = defineMessages({
  launchLiveActivity: {
    id: 'launchLiveActivity',
    defaultMessage: 'Start Live Activity'
  },
  selectActivity: {
    id: 'selectActivity',
    defaultMessage: 'Select Live Activity'
  },
  apsPayloadDescription: {
    id: 'apsPayloadDescription',
    defaultMessage: 'Select a live activity and provide the APS payload content'
  },
  noActivitiesAvailable: {
    id: 'noActivitiesAvailable',
    defaultMessage: 'No registered live activities available'
  }
});

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Live Activity Picker Component
 */
interface ActivityPickerProps {
  activities: any[];
  selectedKey: string | null;
  onSelectionChange: (key: any) => void;
  label: string;
}

function ActivityPicker({ activities, selectedKey, onSelectionChange, label }: Readonly<ActivityPickerProps>) {
  return (
    <View marginBottom="size-200">
      <Picker
        label={label}
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
        width="100%"
        isRequired
      >
        {activities.map((activity) => (
          <Item key={activity.attributeType}>
            {activity.attributeType}
          </Item>
        ))}
      </Picker>
    </View>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function LaunchLiveActivity() {
  const { formatMessage } = useIntl();
  
  // State
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [apsPayload, setApsPayload] = useState('{}');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  // Live Activities Data
  const registeredActivities = useRegisteredActivities();
  const liveActivitiesData = useLiveActivitiesData();
  
  // Context (requires push token for launch operations)
  const context = useLiveActivityContext({ requirePushToken: true });
  // Get selected activity details
  const selectedActivity = registeredActivities.find(
    (activity) => activity.attributeType === selectedActivityType
  );
  const selectedLiveActivityData = liveActivitiesData.activityTypes.get(selectedActivityType);

  
  // Get push to start token from live activities data
  const pushToStartToken = selectedLiveActivityData?.pushToStartToken;

  // Handlers
  const handleLaunch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse and validate APS payload
      let parsedAps;
      try {
        parsedAps = JSON.parse(apsPayload);
      } catch {
        throw new Error('Invalid JSON format in APS payload');
      }

      // Validate selected activity
      if (!selectedActivity || !pushToStartToken) {
        // ToastQueue.negative('Please select a live activity with push-to-start token')
        console.error('Please select a live activity with push-to-start token');
        return;
      }

      // Generate complete payload
      const payload = generateLiveActivityPayload({
        apsContent: parsedAps,
        appId: context.appId!,
        platform: context.platform,
        token: pushToStartToken, // Using pushToStartToken for launch
        ecid: context.ecid!,
        imsOrg: context.imsOrg!,
        sessionId: context.sessionId!,
        sandboxName: context.sandbox?.name || LIVE_ACTIVITY_DEFAULTS.SANDBOX,
        environment: context.environment
      });

      console.log('payload ****', payload);

      // Make API call
      const url = buildApiUrl(context.environment);
      await sendLiveActivityNotification({
        url,
        token: context.token!,
        payload
      });

      console.log('Live Activity started successfully');
    } catch (err: any) {
      console.error('Failed to start Live Activity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start Live Activity';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apsPayload, context, selectedActivity, pushToStartToken]);

  const handleReset = useCallback(() => {
    setSelectedActivityType('');
    setApsPayload('{}');
    setError(null);
  }, []);

  const handleCancel = useCallback((close: () => void) => {
    handleReset();
    close();
  }, [handleReset]);

  const handleLaunchWithClose = useCallback(async (close: () => void) => {
    try {
      await handleLaunch();
      handleReset();
      close();
    } catch {
      // Error already handled in handleLaunch
    }
  }, [handleLaunch, handleReset]);

  // Computed values
  const hasRegisteredActivities = registeredActivities.length > 0;
  const canSubmit = selectedActivityType && apsPayload !== '{}' && context.isReady && !isLoading;
  const isButtonDisabled = !context.isReady || isLoading || !hasRegisteredActivities;
  const buttonTooltip = hasRegisteredActivities 
    ? formatMessage(messages.launchLiveActivity)
    : formatMessage(messages.noActivitiesAvailable);

  // Render
  return (
    <DialogTrigger>
      <Button 
        variant="cta" 
        isDisabled={isButtonDisabled}
        aria-label={buttonTooltip}
      >
        <Rocket marginEnd="size-50" />
        {formatMessage(messages.launchLiveActivity)}
      </Button>
      
      {(close) => (
        <Dialog>
          <Heading>{formatMessage(messages.launchLiveActivity)}</Heading>
          <Divider />
          
          <Content UNSAFE_className={classNames('dialogContent')}>
            <View marginBottom="size-200">
              <Text>{formatMessage(messages.apsPayloadDescription)}</Text>
            </View>

            <ActivityPicker
              activities={registeredActivities}
              selectedKey={selectedActivityType}
              onSelectionChange={setSelectedActivityType}
              label={formatMessage(messages.selectActivity)}
            />

            <JsonEditor
              value={apsPayload}
              onChange={(val) => setApsPayload(val || '{}')}
              editorRef={editorRef}
              label={formatMessage(COMMON_MESSAGES.apsPayload)}
              className={classNames('editorContainer')}
            />

            {error && <ErrorMessage message={error} />}
          </Content>
          
          <DialogActions
            isLoading={isLoading}
            isDisabled={!canSubmit}
            onCancel={() => handleCancel(close)}
            onAction={() => handleLaunchWithClose(close)}
            cancelLabel={formatMessage(COMMON_MESSAGES.cancel)}
            actionLabel={formatMessage(messages.launchLiveActivity)}
            loadingLabel={formatMessage(COMMON_MESSAGES.sending)}
          />
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default LaunchLiveActivity;
