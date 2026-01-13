/**
 * Monaco Editor utilities for Live Activities
 */

import type { Monaco } from '@monaco-editor/react';

/**
 * Configures Monaco Editor for JSON editing with auto-formatting
 * 
 * Features:
 * - JSON validation enabled
 * - No comments allowed
 * - Auto-format on paste with debounce
 * 
 * @param editor - Monaco editor instance
 * @param monacoInstance - Monaco instance
 */
export function configureMonacoEditor(editor: any, monacoInstance: Monaco): void {
  monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
    schemas: []
  });

  // Auto-format on paste with debounce
  let formatTimeout: NodeJS.Timeout;
  editor.onDidPaste(() => {
    clearTimeout(formatTimeout);
    formatTimeout = setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 300);
  });
}

