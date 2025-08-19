import {
  DialogTrigger,
  Button,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup
} from '@adobe/react-spectrum';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Send from '@spectrum-icons/workflow/Send';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';
import useUpdateActivity from '../../hooks/useUpdateActivity';
import { LiveActivity } from '../../hooks/useActivities';

const messages = defineMessages({
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
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
  }
});

interface FormValues {
  payload: string;
}

interface UpdateActivityProps {
  activity: LiveActivity;
}

function UpdateActivity({ activity }: UpdateActivityProps) {
  const { formatMessage } = useIntl();
  const updateActivity = useUpdateActivity();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      payload: JSON.stringify(activity.examplePayload?.['content-state'] || {}, null, 2)
    }
  });

  // console.log('ahhhh',activity.examplePayload);

  const onSubmit = (data: FormValues) => {
    // console.log(data);
    updateActivity(data.payload);
  };

  // console.log('updateActivity', activity.examplePayload);

  return (
    <DialogTrigger>
      <Button variant="primary">
        <Send marginEnd="size-50" /> {formatMessage(messages.updateLiveActivity)}
      </Button>
      {close => (
        <Dialog>
          <Heading>
            {formatMessage(messages.updateLiveActivityHeading, { activityName: activity.name })}
          </Heading>
          <Divider />
          <Content>
            <label>Payload</label>
            <Controller
              name="payload"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Editor defaultLanguage="json" value={value} onChange={onChange} />
              )}
              rules={{ required: 'Payload is required' }}
            />
          </Content>
          <ButtonGroup>
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
              isDisabled={isSubmitting}
              onPress={() => {
                handleSubmit(onSubmit) as any;
                close();
              }}
            >
              {formatMessage(messages.update)}
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogTrigger>
  );
}

export default UpdateActivity;
