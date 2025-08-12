import React from 'react';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';
import Info from '@spectrum-icons/workflow/Info';
import { ProgressCircle } from '@adobe/react-spectrum';
import Help from '@spectrum-icons/workflow/Help';

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
