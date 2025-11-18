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
  ToastQueue
} from '@adobe/react-spectrum';
import classNames from 'classnames';
import Rocket from '@spectrum-icons/workflow/Launch';
import { useIntl } from 'react-intl';
import { useLiveActivitiesData, useRegisteredActivities } from '../../hooks/useActivities';
import {
  buildApiUrl,
  generateLiveActivityPayload,
  sendLiveActivityNotification,
  generateLaunchTemplate,
  buildCompleteApsPayload
} from '../../api/liveActivityApi';
import { LIVE_ACTIVITY_DEFAULTS, MESSAGES as COMMON_MESSAGES } from '../../constants/liveActivitiesConfig';
import { ErrorMessage, JsonEditor, DialogActions } from './common';
import { useLiveActivityContext } from '../../hooks/useLiveActivityContext';
import { liveActivityMessages } from '../../i18n';
import './launch-live-activity.css';

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
  const [apsPayload, setApsPayload] = useState(
    JSON.stringify(generateLaunchTemplate(), null, 2)
  );
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
      // Parse user's JSON input
      let userPayload;
      try {
        userPayload = JSON.parse(apsPayload);
      } catch {
        throw new Error('Invalid JSON format in payload');
      }

      // Validate selected activity
      if (!selectedActivity || !pushToStartToken) {
        throw new Error('Please select a live activity with push-to-start token');
      }

      // Build complete APS payload by merging user input with auto-generated fields
      const completeApsPayload = buildCompleteApsPayload({
        userPayload,
        eventType: 'start',
        attributesType: selectedActivityType
      });

      // Generate complete payload
      const payload = generateLiveActivityPayload({
        apsContent: completeApsPayload,
        appId: context.appId!,
        platform: context.platform,
        token: pushToStartToken, // Using pushToStartToken for launch
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
      ToastQueue.positive('Live Activity started successfully. Please refresh the page.', {timeout: 3000});
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start Live Activity';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apsPayload, context, selectedActivity, pushToStartToken, selectedActivityType]);

  const handleReset = useCallback(() => {
    setSelectedActivityType('');
    setApsPayload(JSON.stringify(generateLaunchTemplate(), null, 2));
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
  const canSubmit = selectedActivityType && apsPayload.trim() !== '' && context.isReady && !isLoading;
  const isButtonDisabled = !context.isReady || isLoading || !hasRegisteredActivities;
  const buttonTooltip = hasRegisteredActivities 
    ? formatMessage(liveActivityMessages.launchLiveActivity)
    : formatMessage(liveActivityMessages.noActivitiesAvailable);

  // Render
  return (
    <DialogTrigger>
      <Button 
        variant="cta" 
        isDisabled={isButtonDisabled}
        aria-label={buttonTooltip}
      >
        <Rocket marginEnd="size-50" />
        {formatMessage(liveActivityMessages.launchLiveActivity)}
      </Button>
      
      {(close) => (
        <Dialog>
          <Heading>{formatMessage(liveActivityMessages.launchLiveActivity)}</Heading>
          <Divider />
          
          <Content UNSAFE_className={classNames('dialogContent')}>
            <View marginBottom="size-200">
              <Text>{formatMessage(liveActivityMessages.apsPayloadDescription)}</Text>
            </View>

            <ActivityPicker
              activities={registeredActivities}
              selectedKey={selectedActivityType}
              onSelectionChange={setSelectedActivityType}
              label={formatMessage(liveActivityMessages.selectActivity)}
            />

            <JsonEditor
              value={apsPayload}
              onChange={(val) => setApsPayload(val || '{}')}
              editorRef={editorRef}
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
            actionLabel={formatMessage(liveActivityMessages.launchLiveActivity)}
            loadingLabel={formatMessage(COMMON_MESSAGES.sending)}
          />
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default LaunchLiveActivity;
