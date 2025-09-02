import React from 'react';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Alert from '@spectrum-icons/workflow/Alert';
import Info from '@spectrum-icons/workflow/Info';
import { ProgressCircle } from '@adobe/react-spectrum';
import Help from '@spectrum-icons/workflow/Help';

// Only allow valid sizes for Spectrum icons and ProgressCircle
const allowedSizes = ['S', 'M', 'L'] as const;
type AllowedSize = (typeof allowedSizes)[number];

function getValidSize(size: string): AllowedSize {
  return allowedSizes.includes(size as AllowedSize) ? (size as AllowedSize) : 'S';
}

/**
 * Constants for Live Activities version requirements
 */
export const LIVE_ACTIVITIES_MIN_VERSION = '16.1';
export const LIVE_ACTIVITIES_FULL_SUPPORT_VERSION = '17.1';

/**
 * Validation status constants
 */
export const VALIDATION_STATUS = {
  NOT_SUPPORTED: 'not-supported',
  BASIC_SUPPORT: 'basic-support',
  FULL_SUPPORT: 'full-support',
  NOT_IOS: 'not-ios',
  UNKNOWN: 'unknown'
} as const;

/**
 * UI Constants for CopyableValue component
 */
export const COPYABLE_VALUE_CONSTANTS = {
  DEFAULT_MAX_LENGTH: 50,
  LONG_DATA_MAX_LENGTH: 60,
  TOKEN_MAX_LENGTH: 40,
  COPY_FEEDBACK_TIMEOUT: 2000, // 2 seconds
  TRUNCATED_TEXT_MAX_WIDTH: '200px',
  ELLIPSIS: '...'
} as const;



export const getHealthIcon = (status: string, size: string = 'S') => {
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
