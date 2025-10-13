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

import { useState, useCallback } from 'react';

export interface UseClipboardOptions {
  /** Duration in milliseconds to show success state (default: 2000) */
  successDuration?: number;
  /** Callback when copy succeeds */
  onSuccess?: () => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

export interface UseClipboardReturn {
  /** Copy text to clipboard */
  copyToClipboard: (text: string) => Promise<boolean>;
  /** Whether copy was successful (shows success state) */
  isCopied: boolean;
  /** Whether copy is currently in progress */
  isCopying: boolean;
  /** Last error that occurred during copy */
  error: Error | null;
  /** Reset the copy state */
  reset: () => void;
}

/**
 * Custom hook for clipboard operations with fallback support
 *
 * @param options - Configuration options for the clipboard hook
 * @returns Object with copy functionality and state
 *
 * @example
 * ```tsx
 * const { copyToClipboard, isCopied, isCopying } = useClipboard({
 *   successDuration: 3000,
 *   onSuccess: () => console.log('Copied!'),
 *   onError: (error) => console.error('Copy failed:', error)
 * });
 *
 * const handleCopy = () => {
 *   copyToClipboard('Hello, World!');
 * };
 * ```
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { successDuration = 2000, onSuccess, onError } = options;

  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setIsCopied(false);
    setIsCopying(false);
    setError(null);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) {
        const error = new Error('No text provided to copy');
        setError(error);
        onError?.(error);
        return false;
      }

      setIsCopying(true);
      setError(null);

      try {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
          } catch (clipboardError) {
            // If clipboard API fails, fall back to execCommand
            throw clipboardError;
          }
        } else {
          // Fallback for older browsers or non-secure contexts
          throw new Error('Clipboard API not available');
        }

        setIsCopied(true);
        onSuccess?.();

        // Reset success state after duration
        setTimeout(() => {
          setIsCopied(false);
        }, successDuration);

        return true;
      } catch (err) {
        // Fallback method when clipboard API fails
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          textArea.style.opacity = '0';
          textArea.setAttribute('readonly', '');
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
            setIsCopied(true);
            onSuccess?.();

            // Reset success state after duration
            setTimeout(() => {
              setIsCopied(false);
            }, successDuration);

            return true;
          } else {
            throw new Error('execCommand copy failed');
          }
        } catch (fallbackError) {
          const error = new Error(
            `Copy failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`
          );
          setError(error);
          onError?.(error);
          return false;
        } finally {
          setIsCopying(false);
        }
      }
    },
    [successDuration, onSuccess, onError]
  );

  return {
    copyToClipboard,
    isCopied,
    isCopying,
    error,
    reset
  };
}
