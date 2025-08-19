import React from 'react';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';
import Info from '@spectrum-icons/workflow/Info';
import { ActionButton, Flex, ProgressCircle, Tooltip, Text } from '@adobe/react-spectrum';
import Help from '@spectrum-icons/workflow/Help';
import UnknownBadge from '../components/atoms/UnknownBadge';
import Copy from '@spectrum-icons/workflow/Copy';

// Only allow valid sizes for Spectrum icons and ProgressCircle
const allowedSizes = ['S', 'M', 'L'] as const;
type AllowedSize = (typeof allowedSizes)[number];

function getValidSize(size: any): AllowedSize {
  return allowedSizes.includes(size) ? size : 'S';
}

export const getHealthIcon = (status, size = 'S') => {
  const validSize = getValidSize(size);
  switch (status) {
    case 'valid':
      return (
        <span data-testid="health-positive">
          <Checkmark size={validSize} color="positive" />
        </span>
      );
    case 'invalid':
      return (
        <span data-testid="health-negative">
          <Alert size={validSize} color="negative" />
        </span>
      );
    case 'warning':
      return (
        <span data-testid="health-warning">
          <Alert size={validSize} color="notice" />
        </span>
      );
    case 'info':
      return (
        <span data-testid="health-info">
          <Info size={validSize} color="informative" />
        </span>
      );
    case 'wait':
      return (
        <span data-testid="health-loading">
          <ProgressCircle aria-label="Loading…" size={validSize} isIndeterminate />
        </span>
      );
    default:
      return (
        <span data-testid="health-help" color="informative">
          <Help size={validSize} />
        </span>
      );
  }
};

export function renderValue(value) {
  if (value == null || value === 'N/A') {
    return <UnknownBadge message= {'Unknown'} />;
  }
  return String(value);
}


export function CopyableValue({ value }) {
  if (!value) return <UnknownBadge message= {'Unknown'} />;
  return (
    <Flex alignItems="center" gap="size-100">
      <Text>{value}</Text>
      <Tooltip UNSAFE_style={{ zIndex: 9999 }}>
        <ActionButton
          isQuiet
          onPress={() => navigator.clipboard.writeText(value)}
          aria-label="Copy"
        >
          <Copy size="XS" />
        </ActionButton>
      </Tooltip>
    </Flex>
  );
}