import {
  DialogTrigger,
  Button,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  TextField,
  Picker,
  Item,
  Flex,
  View,
  Text,
  Well
} from '@adobe/react-spectrum';

import { Editor, Monaco, MonacoDiffEditor } from '@monaco-editor/react';
import classNames from 'classnames';

import Rocket from '@spectrum-icons/workflow/Launch';

import React, { useState, useEffect, useRef } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { Controller, useForm } from 'react-hook-form';

import { useRegisteredActivities } from '../../hooks/useActivities';
import useLaunchLiveActivity from '../../hooks/useLaunchLiveActivity';
import { FormValues } from '../../types/liveActivities';
import './launch-live-activity.css';

const messages = defineMessages({
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  launchLiveActivity: {
    id: 'launchLiveActivity',
    defaultMessage: 'Start Live Activity'
  },
  launch: {
    id: 'launch',
    defaultMessage: 'Start Activity'
  },
  payload: {
    id: 'payload',
    defaultMessage: 'Payload'
  },
  state: {
    id: 'state',
    defaultMessage: 'State'
  },
  selectActivity: {
    id: 'selectActivity',
    defaultMessage: 'Select Activity Type'
  },
  noRegisteredActivities: {
    id: 'noRegisteredActivities',
    defaultMessage: 'No registered activities available for remote start'
  },
  pushToStartToken: {
    id: 'pushToStartToken',
    defaultMessage: 'Push-to-Start Token'
  },
  liveActivityId: {
    id: 'liveActivityId',
    defaultMessage: 'Live Activity ID'
  }
});


function LaunchLiveActivity() {
  const { formatMessage } = useIntl();
  const launchLiveActivity = useLaunchLiveActivity();
  const registeredActivities = useRegisteredActivities();

  // Refs for Monaco Editor instances
  const payloadEditorRef = useRef<any>(null);
  const stateEditorRef = useRef<any>(null);
  const lastSelectedActivityRef = useRef<string | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      payload: '{}',
      state: '{}'
    }
  });

  const selectedAttributeType = watch('attributeType');
  const selectedActivity = registeredActivities.find(
    activity => activity.attributeType === selectedAttributeType
  );

  // Editor configuration options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full' as const
  };

  // Helper function to configure Monaco Editor
  const configureEditor = (editor: MonacoDiffEditor, monacoInstance: Monaco) => {
    // Configure JSON formatting
    monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: []
    });

    // Set up auto-formatting on paste with debounced approach
    let formatTimeout: NodeJS.Timeout;
    editor.onDidPaste(() => {
      clearTimeout(formatTimeout);
      formatTimeout = setTimeout(() => {
        editor.getAction('editor.action.formatDocument')?.run();
      }, 300);
    });
  };

  // Generate placeholders from actual schema and example data
  const getPayloadPlaceholder = () => {
    if (!selectedActivity) {
      return '{}';
    }

    if (selectedActivity.examplePayload) {
      try {
        return JSON.stringify(selectedActivity.examplePayload, null, 2);
      } catch (error) {
        console.warn('Failed to parse example payload:', error);
        return '{}';
      }
    }

    return '{}';
  };

  const getStatePlaceholder = () => {
    if (!selectedActivity) {
      return '{}';
    }

    // Use example state from schema if available
    if (selectedActivity.schema?.exampleState) {
      try {
        return JSON.stringify(selectedActivity.schema.exampleState, null, 2);
      } catch (error) {
        console.warn('Failed to parse example state:', error);
        return '{}';
      }
    }

    return '{}';
  };

  // Auto-populate form when activity type changes
  useEffect(() => {
    if (selectedActivity && selectedActivity.attributeType !== lastSelectedActivityRef.current) {
      lastSelectedActivityRef.current = selectedActivity.attributeType;

      const payloadPlaceholder = getPayloadPlaceholder();
      const statePlaceholder = getStatePlaceholder();

      // Update form with example data immediately
      reset({
        attributeType: selectedActivity.attributeType,
        payload: payloadPlaceholder,
        state: statePlaceholder
      });

      // Format the editors after auto-populating
      setTimeout(() => {
        if (payloadEditorRef.current) {
          payloadEditorRef.current.getAction('editor.action.formatDocument')?.run();
        }
        if (stateEditorRef.current) {
          stateEditorRef.current.getAction('editor.action.formatDocument')?.run();
        }
      }, 100);
    }
  }, [selectedActivity]);

  const onSubmit = (data: FormValues) => {
    // TODO: Implement actual launch logic with pushToStartToken
    launchLiveActivity();
  };

  // Show message if no registered activities available
  if (registeredActivities.length === 0) {
    return (
      <Button variant="cta" isDisabled>
        <Rocket marginEnd="size-50" /> {formatMessage(messages.launchLiveActivity)}
      </Button>
    );
  }

  return (
    <DialogTrigger>
      <Button variant="cta">
        <Rocket marginEnd="size-50" /> {formatMessage(messages.launchLiveActivity)}
      </Button>
      {close => (
        <Dialog>
          <Heading>{formatMessage(messages.launchLiveActivity)}</Heading>
          <Divider />
          <Content UNSAFE_className={classNames('dialogContent')}>
            <View marginBottom="size-200">
              <Controller
                name="attributeType"
                control={control}
                render={({ field }) => (
                  <Picker
                    label={formatMessage(messages.selectActivity)}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    isRequired
                    width="100%"
                    UNSAFE_className={classNames('pickerContainer')}
                  >
                    {registeredActivities.map(activity => (
                      <Item key={activity.attributeType}>{activity.attributeType}</Item>
                    ))}
                  </Picker>
                )}
                rules={{ required: 'Activity type is required' }}
              />
            </View>

            <View marginBottom="size-200">
              <Controller
                name="activityId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label={formatMessage(messages.liveActivityId)}
                    {...field}
                    errorMessage={error?.message}
                    validationState={error ? 'invalid' : undefined}
                    placeholder="Enter unique Live Activity ID"
                    width="100%"
                  />
                )}
                rules={{ required: 'Live Activity ID is required' }}
              />
            </View>

            <View marginBottom="size-200" UNSAFE_className={classNames('editorContainer')}>
              <Text marginBottom="size-100">{formatMessage(messages.payload)}</Text>
              <Controller
                name="payload"
                control={control}
                render={({ field }) => (
                  <Editor
                    onMount={(editor, monaco) => {
                      payloadEditorRef.current = editor;
                      configureEditor(editor, monaco);
                    }}
                    height="200px"
                    defaultLanguage="json"
                    value={field.value || '{}'}
                    onChange={field.onChange}
                    options={editorOptions}
                  />
                )}
                rules={{ required: 'Payload is required' }}
              />
            </View>

            <View UNSAFE_className={classNames('editorContainer')}>
              <Text marginBottom="size-100">{formatMessage(messages.state)}</Text>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Editor
                    onMount={(editor, monaco) => {
                      stateEditorRef.current = editor;
                      configureEditor(editor, monaco);
                    }}
                    height="200px"
                    defaultLanguage="json"
                    value={field.value || '{}'}
                    onChange={field.onChange}
                    options={editorOptions}
                  />
                )}
                rules={{ required: 'State is required' }}
              />
            </View>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={() => reset()}>
              Reset Form
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                reset();
                close();
              }}
            >
              {formatMessage(messages.cancel)}
            </Button>
            <Button
              variant="accent"
              onPress={handleSubmit(onSubmit) as any}
              isDisabled={!selectedActivity?.hasPushToStartToken}
            >
              {formatMessage(messages.launch)}
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default LaunchLiveActivity;
