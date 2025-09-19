/**
 * Clipboard utility functions with fallback support.
 * Handles both modern clipboard API and legacy fallback methods.
 */

/**
 * Robust clipboard copy function with fallback support.
 * Handles both modern clipboard API and legacy fallback methods.
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Check if clipboard API is actually available and not blocked
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Use legacy method directly
      return fallbackCopy(text);
    }
  } catch (error) {
    // If clipboard API fails, fall back to legacy method
    console.warn('Clipboard API failed, using fallback:', error);
    return fallbackCopy(text);
  }
}

/**
 * Legacy fallback copy method using document.execCommand.
 * @param text - Text to copy to clipboard
 * @returns true if successful, false otherwise
 */
function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (!successful) {
      console.warn('document.execCommand("copy") returned false - copy may have failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Fallback copy failed:', error);
    return false;
  }
}
