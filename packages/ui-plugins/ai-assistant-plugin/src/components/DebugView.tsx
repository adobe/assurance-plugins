/*
Copyright 2024 Adobe. All rights reserved.
*/

import React from 'react';
import { View, Text, Heading, Flex } from '@adobe/react-spectrum';
import {
  useFilteredEvents,
  useSession,
  useEnvironment,
} from '@adobe/assurance-plugin-bridge-provider';
import { PluginView } from '@adobe/assurance-timeline-bar';

export default function DebugView() {
  try {
    const events = useFilteredEvents({ sorted: true, filtered: false });
    const session = useSession();
    const environment = useEnvironment();

    return (
      <PluginView>
        <View padding="size-400">
          <Flex direction="column" gap="size-200">
            <Heading level={1}>🔍 Debug View</Heading>
            <Text>Session: {session?.name || 'No session'}</Text>
            <Text>Events: {events?.length || 0}</Text>
            <Text>Environment: {environment || 'Unknown'}</Text>
            <Text>✅ Plugin Bridge working!</Text>
          </Flex>
        </View>
      </PluginView>
    );
  } catch (error) {
    return (
      <View padding="size-400">
        <Heading level={1}>❌ Error</Heading>
        <Text>{String(error)}</Text>
      </View>
    );
  }
}

