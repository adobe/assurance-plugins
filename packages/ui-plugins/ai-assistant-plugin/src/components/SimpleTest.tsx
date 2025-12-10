import React from 'react';
import { View, Heading, Text } from '@adobe/react-spectrum';

export default function SimpleTest() {
  return (
    <View padding="size-400">
      <Heading level={1}>🎉 IT WORKS!</Heading>
      <Text>If you see this, the plugin is loading correctly.</Text>
    </View>
  );
}

