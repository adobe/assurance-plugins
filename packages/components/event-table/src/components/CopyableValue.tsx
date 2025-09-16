import React, { useState } from 'react';
import { Button, TooltipTrigger, Tooltip } from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { defineMessages, useIntl } from 'react-intl';

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

interface CopyableValueProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
  copyButtonSize?: 'XS' | 'S' | 'M' | 'L';
  showCopyButton?: boolean;
  standalone?: boolean; // New prop for standalone copy button mode
  tooltipText?: string; // Custom tooltip text
}

const CopyableValue: React.FC<CopyableValueProps> = ({
  value,
  children,
  className = '',
  copyButtonSize = 'XS',
  showCopyButton = true,
  standalone = false,
  tooltipText
}) => {
  const { formatMessage } = useIntl();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value);
        } catch (clipboardError) {
          // If clipboard API fails, fall back to execCommand
          throw clipboardError;
        }
      } else {
        // Fallback for older browsers or non-secure contexts
        throw new Error('Clipboard API not available');
      }
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback method when clipboard API fails
      try {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } else {
          throw new Error('execCommand copy failed');
        }
      } catch (fallbackError) {
        console.error('All copy methods failed:', fallbackError);
        // You could show a toast notification here if needed
      }
    }
  };

  if (!showCopyButton) {
    return <span className={className}>{children}</span>;
  }

  const copyButton = (
    <Button
      variant="secondary"
      isQuiet
      onPress={handleCopy}
      UNSAFE_style={{
        padding: '2px',
        minWidth: 'auto',
        width: '20px',
        height: '20px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '2px',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      {copySuccess ? (
        <Checkmark size={copyButtonSize} UNSAFE_style={{ color: 'var(--spectrum-global-color-green-400)' }} />
      ) : (
        <Copy size={copyButtonSize} />
      )}
    </Button>
  );

  const tooltipContent = copySuccess 
    ? formatMessage(messages.valueCopied) 
    : (tooltipText || formatMessage(messages.copyValue));

  // Standalone mode - just the copy button
  if (standalone) {
    return (
      <TooltipTrigger>
        {copyButton}
        <Tooltip>
          {tooltipContent}
        </Tooltip>
      </TooltipTrigger>
    );
  }

  // Default mode - copy button with children
  return (
    <div className={`copyable-value ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ flex: 1 }}>{children}</span>
      <TooltipTrigger>
        {copyButton}
        <Tooltip>
          {tooltipContent}
        </Tooltip>
      </TooltipTrigger>
    </div>
  );
};

export default CopyableValue;
