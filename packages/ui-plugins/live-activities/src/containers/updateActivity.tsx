import { View, Text, ActionButton, TextField } from '@adobe/react-spectrum';
import React from 'react';
import usePluginState from '../hooks/usePluginState';
import useActivityData from '../hooks/useActivityData';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';

function UpdateActivity() {
  const selectedActivity = useActivityData();
  const { control } = useForm({
    defaultValues: {
      payload: JSON.stringify(selectedActivity?.examplePayload, null, 2)
    }
  });

  console.log('updateActivity', selectedActivity?.examplePayload);

  const fields = [];

  return (
    <View>
      <Text>Update Activity</Text>

      {/* {fields.map(field => (
        <View key={field.id}>
          <TextField label={field.label} value={field.value} />
        </View>
      ))} */}

      <Controller
        name="payload"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor defaultLanguage="json" value={value} onChange={onChange} />
        )}
      />

      <ActionButton onPress={() => {}}>Send Update</ActionButton>
    </View>
  );
}

export default UpdateActivity;
