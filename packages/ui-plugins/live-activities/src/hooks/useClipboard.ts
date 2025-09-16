import { useState, useCallback } from 'react';
import { COPYABLE_VALUE_CONSTANTS } from '../constants/liveActivitiesConfig';

interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  isCopied: boolean;
  error: Error | null;
  reset: () => void;
}

export function useClipboard(): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Check if we're in a restricted environment (permissions policy)
      const isRestricted = !navigator.permissions || 
        (window.location !== window.parent.location); // iframe check
      
      if (isRestricted) {
        // Skip clipboard API and go straight to fallback
        return fallbackCopy(text);
      }
      
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), COPYABLE_VALUE_CONSTANTS.COPY_FEEDBACK_TIMEOUT);
        return true;
      }
      
      // Fallback method
      return fallbackCopy(text);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown clipboard error');
      setError(error);
      console.warn('Clipboard API failed, trying fallback method:', error);
      
      // Try fallback method
      return fallbackCopy(text);
    }
  }, []);

  const fallbackCopy = (text: string): boolean => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
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
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), COPYABLE_VALUE_CONSTANTS.COPY_FEEDBACK_TIMEOUT);
        return true;
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Fallback copy failed');
      setError(error);
      console.error('Failed to copy content:', error);
      return false;
    }
  };

  const reset = useCallback(() => {
    setIsCopied(false);
    setError(null);
  }, []);

  return {
    copyToClipboard,
    isCopied,
    error,
    reset
  };
}
