/**
 * Error Message Component
 * Displays error messages with consistent styling across Live Activity components
 */

import React from 'react';
import { View, Text } from '@adobe/react-spectrum';

interface ErrorMessageProps {
  message: string;
}

/**
 * Displays an error message with red text styling
 * Used by both launch and update live activity components
 * 
 * @param message - Error message to display
 */
export function ErrorMessage({ message }: Readonly<ErrorMessageProps>) {
  return (
    <View marginTop="size-200">
      <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-red-600)' }}>
        {message}
      </Text>
    </View>
  );
}

