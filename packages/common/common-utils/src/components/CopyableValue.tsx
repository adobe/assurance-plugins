/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import React from 'react';
import { Button, TooltipTrigger, Tooltip, Text, ActionButton, Flex } from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { defineMessages, useIntl } from 'react-intl';
import { useClipboard } from '../hooks/useClipboard';

const messages = defineMessages({
  copyValue: {
    id: 'copyableValue.copyValue',
    defaultMessage: 'Copy value'
  },
  valueCopied: {
    id: 'copyableValue.valueCopied',
    defaultMessage: 'Copied!'
  }
});

export interface CopyableValueProps {
  /** The value to display and copy */
  value: string | number | null | undefined;
  /** Children to display alongside the copy button (for non-standalone mode) */
  children?: React.ReactNode;
  /** CSS class name */
  className?: string;
  /** Size of the copy button */
  copyButtonSize?: 'XS' | 'S' | 'M' | 'L';
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  /** Standalone mode - just the copy button without children */
  standalone?: boolean;
  /** Custom tooltip text */
  tooltipText?: string;
  /** Optional label to display with the button */
  label?: string;
  /** Maximum length before truncation (default: 50) */
  maxLength?: number;
  /** Whether to show full value regardless of length */
  showFullValue?: boolean;
  /** Test ID for the copy button */
  testId?: string;
  /** Use ActionButton instead of Button (for more compact display) */
  useActionButton?: boolean;
  /** Localized copy tooltip message */
  copyTooltip?: string;
  /** Localized copy full value tooltip message */
  copyFullValueTooltip?: string;
  /** Localized copied feedback message */
  copiedMessage?: string;
}

/**
 * Component that displays a value with copy functionality.
 * Supports truncation for long values and provides visual feedback.
 * Can be used in standalone mode (just button) or with children.
 */
export function CopyableValue({
  value,
  children,
  className = '',
  copyButtonSize = 'XS',
  showCopyButton = true,
  standalone = false,
  tooltipText,
  label,
  maxLength = 50,
  showFullValue = false,
  testId,
  useActionButton = false,
  copyTooltip,
  copyFullValueTooltip,
  copiedMessage
}: CopyableValueProps) {
  const { formatMessage } = useIntl();
  const { copyToClipboard, isCopied } = useClipboard({
    successDuration: 2000,
    onError: (error) => console.error('Copy failed:', error)
  });

  const handleCopy = async () => {
    if (!value) return;
    const stringValue = String(value);
    await copyToClipboard(stringValue);
  };

  if (!showCopyButton) {
    return <span className={className}>{children}</span>;
  }

  if (!value) {
    return <span className={className}>{children}</span>;
  }

  const stringValue = String(value);
  const isLong = stringValue.length > maxLength;
  const shouldTruncate = isLong && !showFullValue;

  const tooltipContent = isCopied 
    ? (copiedMessage || formatMessage(messages.valueCopied))
    : (tooltipText || (shouldTruncate ? copyFullValueTooltip : copyTooltip) || formatMessage(messages.copyValue));

  // Create the copy button
  const copyButton = useActionButton ? (
    <ActionButton
      isQuiet
      onPress={handleCopy}
      aria-label="Copy"
      UNSAFE_style={{ cursor: 'pointer' }}
      data-testid={testId}
    >
      {isCopied ? (
        <Checkmark size={copyButtonSize} color="positive" />
      ) : (
        <Copy size={copyButtonSize} />
      )}
    </ActionButton>
  ) : (
    <Button
      variant="secondary"
      isQuiet
      onPress={handleCopy}
      data-testid={testId}
    >
      {isCopied ? (
        <Checkmark size={copyButtonSize} UNSAFE_style={{ color: 'var(--spectrum-global-color-green-400)' }} />
      ) : (
        <Copy size={copyButtonSize} />
      )}
      {label && (
        <Text UNSAFE_style={{ marginLeft: 'var(--spectrum-global-dimension-size-150)' }}>
          {label}
        </Text>
      )}
    </Button>
  );

  // Standalone mode - just the copy button
  if (standalone) {
    return (
      <TooltipTrigger>
        {copyButton}
        <Tooltip>
          <Text>{tooltipContent}</Text>
        </Tooltip>
      </TooltipTrigger>
    );
  }

  // Default mode with children and optional truncation
  const displayValue = shouldTruncate 
    ? stringValue.substring(0, maxLength) + '...'
    : stringValue;

  return (
    <div className={`copyable-value ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ flex: 1 }}>
        {children || (
          <Text UNSAFE_style={{ 
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
            color: 'inherit'
          }}>
            {displayValue}
          </Text>
        )}
      </span>
      <TooltipTrigger>
        {copyButton}
        <Tooltip>
          <Text>{tooltipContent}</Text>
        </Tooltip>
      </TooltipTrigger>
    </div>
  );
}

export default CopyableValue;
