/**
 * CopyableValue component for displaying values with copy functionality.
 * Supports truncation for long values and provides visual feedback.
 */

import React, { useState } from 'react';
import { ActionButton, Flex, Tooltip, TooltipTrigger, Text } from '@adobe/react-spectrum';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Copy from '@spectrum-icons/workflow/Copy';
import { UnknownBadge } from './UnknownBadge';
import { copyToClipboard } from '../../utils/clipboard';
import { COPYABLE_VALUE_CONSTANTS } from '../../constants';

export interface CopyableValueProps {
  /** The value to display and copy */
  value: string | number | null | undefined;
  /** Maximum length before truncation (default: 50) */
  maxLength?: number;
  /** Whether to show full value regardless of length */
  showFullValue?: boolean;
  /** Localized copy tooltip message */
  copyTooltip?: string;
  /** Localized copy full value tooltip message */
  copyFullValueTooltip?: string;
  /** Localized copied feedback message */
  copiedMessage?: string;
}

/**
 * Component that displays a value with copy functionality.
 * Long values are truncated with ellipsis and show full value on copy.
 */
export function CopyableValue({ 
  value, 
  maxLength = COPYABLE_VALUE_CONSTANTS.DEFAULT_MAX_LENGTH, 
  showFullValue = false,
  copyTooltip = 'Copy value',
  copyFullValueTooltip = 'Copy full value',
  copiedMessage = 'Copied!'
}: CopyableValueProps) {
  if (!value) return <UnknownBadge />;
  
  const stringValue = String(value);
  const isLong = stringValue.length > maxLength;
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await copyToClipboard(stringValue);
    setCopied(true);
    // Reset the copied state after timeout
    setTimeout(() => setCopied(false), COPYABLE_VALUE_CONSTANTS.COPY_FEEDBACK_TIMEOUT);
  };
  
  if (!isLong || showFullValue) {
    return (
      <Flex alignItems="center" gap="size-100">
        <Text>{stringValue}</Text>
        <TooltipTrigger>
          <ActionButton
            isQuiet
            onPress={handleCopy}
            aria-label="Copy"
            UNSAFE_style={{ cursor: 'pointer' }}
          >
            {copied ? <Checkmark size="XS" color="positive" /> : <Copy size="XS" />}
          </ActionButton>
          <Tooltip>
            <Text>{copied ? copiedMessage : copyTooltip}</Text>
          </Tooltip>
        </TooltipTrigger>
      </Flex>
    );
  }
  
  // Truncate long values
  const truncatedValue = stringValue.substring(0, maxLength) + COPYABLE_VALUE_CONSTANTS.ELLIPSIS;
  
  return (
    <Flex alignItems="center" gap="size-100">
      <Text UNSAFE_style={{ 
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: COPYABLE_VALUE_CONSTANTS.TRUNCATED_TEXT_MAX_WIDTH,
        color: 'inherit'
      }}>
        {truncatedValue}
      </Text>
      <TooltipTrigger>
        <ActionButton
          isQuiet
          onPress={handleCopy}
          aria-label="Copy full value"
          UNSAFE_style={{ cursor: 'pointer' }}
        >
          {copied ? <Checkmark size="XS" color="positive" /> : <Copy size="XS" />}
        </ActionButton>
        <Tooltip>
          <Text>{copied ? copiedMessage : copyFullValueTooltip}</Text>
        </Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}
