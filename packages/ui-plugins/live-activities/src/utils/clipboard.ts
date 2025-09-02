/**
 * Clipboard utility functions with fallback support.
 * Handles both modern clipboard API and legacy fallback methods.
 */

/**
 * Robust clipboard copy function with fallback support.
 * Handles both modern clipboard API and legacy fallback methods.
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Check if clipboard API is actually available and not blocked
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
    } else {
      // Use legacy method directly
      fallbackCopy(text);
    }
  } catch (error) {
    // If clipboard API fails, fall back to legacy method
    fallbackCopy(text);
  }
}

/**
 * Legacy fallback copy method using document.execCommand.
 * @param text - Text to copy to clipboard
 */
function fallbackCopy(text: string): void {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch (error) {
    console.warn('Fallback copy failed:', error);
  }
}
