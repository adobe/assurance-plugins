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
  ToastQueue,
  RadioGroup,
  Radio,
  TextField,
  TooltipTrigger,
  Tooltip
} from '@adobe/react-spectrum';
import classNames from 'classnames';
import Rocket from '@spectrum-icons/workflow/Launch';
import Add from '@spectrum-icons/workflow/Add';
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

interface LaunchLiveActivityProps {
  compact?: boolean;
}

function LaunchLiveActivity({ compact = false }: LaunchLiveActivityProps) {
  const { formatMessage } = useIntl();
  
  // State
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [apsPayload, setApsPayload] = useState(
    JSON.stringify(generateLaunchTemplate(), null, 2)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityTypeSelection, setActivityTypeSelection] = useState<'unitary' | 'broadcast'>('unitary');
  const [broadcastChannelId, setBroadcastChannelId] = useState<string>('');
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

      // Validate broadcast channel ID if broadcast type is selected
      if (activityTypeSelection === 'broadcast' && !broadcastChannelId.trim()) {
        throw new Error(formatMessage(liveActivityMessages.broadcastChannelIdRequired));
      }

      // Build complete APS payload by merging user input with auto-generated fields
      const completeApsPayload = buildCompleteApsPayload({
        userPayload,
        eventType: 'start',
        attributesType: selectedActivityType,
        broadcastChannelId: activityTypeSelection === 'broadcast' ? broadcastChannelId : undefined
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
        environment: context.environment,
        type: activityTypeSelection,
        broadcastChannelId: activityTypeSelection === 'broadcast' ? broadcastChannelId : undefined
      });

      // Make API call
      const url = buildApiUrl(context.environment);
      await sendLiveActivityNotification({
        url,
        token: context.token!,
        payload
      });
      ToastQueue.positive('Live Activity started successfully', {timeout: 3000});
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start Live Activity';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apsPayload, context, selectedActivity, pushToStartToken, selectedActivityType, activityTypeSelection, broadcastChannelId, formatMessage]);

  const handleReset = useCallback(() => {
    setSelectedActivityType('');
    setApsPayload(JSON.stringify(generateLaunchTemplate(), null, 2));
    setActivityTypeSelection('unitary');
    setBroadcastChannelId('');
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
  const canSubmit = selectedActivityType && 
                    apsPayload.trim() !== '' && 
                    context.isReady && 
                    !isLoading &&
                    (activityTypeSelection === 'unitary' || (activityTypeSelection === 'broadcast' && broadcastChannelId.trim() !== ''));
  const isButtonDisabled = !context.isReady || isLoading || !hasRegisteredActivities;
  const buttonTooltip = hasRegisteredActivities 
    ? formatMessage(liveActivityMessages.launchLiveActivity)
    : formatMessage(liveActivityMessages.noActivitiesAvailable);

  // Render
  return (
    <DialogTrigger>
      {compact ? (
        // Compact mode: Icon-only button with tooltip
        <TooltipTrigger delay={0}>
          <Button 
            variant="cta" 
            isDisabled={isButtonDisabled}
            aria-label={buttonTooltip}
            UNSAFE_style={{
              padding: '8px',
              minWidth: 'max-content',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <Add size='XS' />
          </Button>
          <Tooltip>
            <Text>Start a new live activity</Text>
          </Tooltip>
        </TooltipTrigger>
      ) : (
        // Full mode: Button with icon and text
        <Button 
          variant="cta" 
          isDisabled={isButtonDisabled}
          aria-label={buttonTooltip}
        >
          <Rocket />
          <Text>{formatMessage(liveActivityMessages.launchLiveActivity)}</Text>
        </Button>
      )}
      
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

            <View marginBottom="size-200">
              <RadioGroup 
                label={formatMessage(liveActivityMessages.activityType)}
                value={activityTypeSelection}
                onChange={(value) => setActivityTypeSelection(value as 'unitary' | 'broadcast')}
                orientation="horizontal"
              >
                <Radio value="unitary">{formatMessage(liveActivityMessages.activityTypeUnitary)}</Radio>
                <Radio value="broadcast">{formatMessage(liveActivityMessages.activityTypeBroadcast)}</Radio>
              </RadioGroup>
            </View>

            {activityTypeSelection === 'broadcast' && (
              <View marginBottom="size-200">
                <TextField
                  label={formatMessage(liveActivityMessages.broadcastChannelId)}
                  placeholder={formatMessage(liveActivityMessages.broadcastChannelIdPlaceholder)}
                  value={broadcastChannelId}
                  onChange={setBroadcastChannelId}
                  width="100%"
                  isRequired
                />
              </View>
            )}
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
