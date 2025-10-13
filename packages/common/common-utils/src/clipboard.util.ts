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

/**
 * Utility functions for clipboard operations
 */

/**
 * Copy text to clipboard with fallback support
 *
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves to true if copy was successful, false otherwise
 *
 * @example
 * ```tsx
 * const handleCopy = async () => {
 *   const success = await copyToClipboard('Hello, World!');
 *   if (success) {
 *     console.log('Copied successfully!');
 *   } else {
 *     console.error('Copy failed');
 *   }
 * };
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    console.warn('No text provided to copy');
    return false;
  }

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (clipboardError) {
        // If clipboard API fails, fall back to execCommand
        throw clipboardError;
      }
    } else {
      // Fallback for older browsers or non-secure contexts
      throw new Error('Clipboard API not available');
    }
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

      return successful;
    } catch (fallbackError) {
      console.error('All copy methods failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Copy JSON object to clipboard as formatted string
 *
 * @param obj - Object to copy as JSON
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Promise that resolves to true if copy was successful, false otherwise
 *
 * @example
 * ```tsx
 * const data = { name: 'John', age: 30 };
 * const success = await copyJsonToClipboard(data, 2);
 * ```
 */
export async function copyJsonToClipboard(obj: any, indent: number = 2): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(obj, null, indent);
    return await copyToClipboard(jsonString);
  } catch (error) {
    console.error('Failed to stringify object for clipboard:', error);
    return false;
  }
}

/**
 * Copy event data to clipboard as formatted JSON
 *
 * @param event - Event object to copy
 * @returns Promise that resolves to true if copy was successful, false otherwise
 *
 * @example
 * ```tsx
 * const success = await copyEventToClipboard(event);
 * ```
 */
export async function copyEventToClipboard(event: any): Promise<boolean> {
  return await copyJsonToClipboard(event, 2);
}
