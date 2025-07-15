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
  View
} from '@adobe/react-spectrum';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Rocket from '@spectrum-icons/workflow/Launch';
import useLaunchLiveActivity from '../hooks/useLaunchLiveActivity';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';
import useActivities from '../hooks/useActivities';

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
  }
});

interface FormValues {
  name: string;
  code: string;
  attributeSet: string;
  attributes: string;
  state: string;
}

function LaunchLiveActivity() {
  const { formatMessage } = useIntl();
  const launchLiveActivity = useLaunchLiveActivity();
  const activities = useActivities();
  const { control, register, handleSubmit, reset } = useForm<FormValues>({});

  const onSubmit = (data: FormValues) => {
    console.log(data);
    launchLiveActivity(data);
  };

  const attributeSets = Array.from(new Set(activities.map(activity => activity.attributes)));

  return (
    <DialogTrigger>
      <Button variant="cta">
        <Rocket marginEnd="size-50" /> {formatMessage(messages.launchLiveActivity)}
      </Button>
      {close => (
        <Dialog>
          <Heading>{formatMessage(messages.launchLiveActivity)}</Heading>
          <Divider />
          <Content UNSAFE_style={{ overflow: 'scroll' }}>
            <View>
              <Picker label="Attribute Set" {...register('attributeSet')}>
                {attributeSets.map(attributes => (
                  <Item key={attributes}>{attributes}</Item>
                ))}
              </Picker>
            </View>

            <View>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Live Activity ID"
                    {...field}
                    marginBottom="size-150"
                    errorMessage={error?.message}
                    validationState={error ? 'invalid' : undefined}
                  />
                )}
                rules={{ required: 'Name is required' }}
              />
            </View>
            <View UNSAFE_style={{ minHeight: '200px' }}>
              <label>{formatMessage(messages.payload)}</label>
              <Controller
                name="attributes"
                control={control}
                render={({ field }) => (
                  <Editor height="200px" defaultLanguage="json" defaultValue="{}" {...field} />
                )}
                rules={{ required: 'Attributes is required' }}
              />
            </View>
            <View UNSAFE_style={{ minHeight: '200px' }}>
              <label>{formatMessage(messages.state)}</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Editor height="200px" defaultLanguage="json" defaultValue="{}" {...field} />
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
            <Button variant="accent" onPress={handleSubmit(onSubmit) as any}>
              {formatMessage(messages.launch)}
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default LaunchLiveActivity;
