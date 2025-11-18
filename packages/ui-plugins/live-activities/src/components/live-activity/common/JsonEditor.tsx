/**
 * Flexible JSON Editor Component
 * Supports both controlled and ref-based usage
 */

import React from 'react';
import { View, Text } from '@adobe/react-spectrum';
import { Editor } from '@monaco-editor/react';
import { EDITOR_CONFIG } from '../../../constants/liveActivitiesConfig';
import { configureMonacoEditor } from '../../../utils/editorUtils';

interface JsonEditorProps {
  /**
   * Current JSON value
   */
  value: string;
  
  /**
   * Change handler for controlled mode
   */
  onChange: (value: string | undefined) => void;
  
  /**
   * Label to display above editor
   */
  label?: string;
  
  /**
   * Optional ref to access editor instance
   */
  editorRef?: React.MutableRefObject<any>;
  
  /**
   * Whether to show line numbers
   * @default false
   */
  showLineNumbers?: boolean;
  
  /**
   * Height of the editor
   * @default "400px"
   */
  height?: string;
  
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * JSON Editor with Monaco
 * Supports both ref-based and controlled usage patterns
 * 
 * Features:
 * - JSON validation
 * - Auto-formatting on paste
 * - Optional line numbers
 * - Configurable height
 * - Ref support for advanced usage
 * 
 * @example
 * // With ref (launch-live-activity pattern)
 * <JsonEditor
 *   value={payload}
 *   onChange={setPayload}
 *   editorRef={editorRef}
 *   label="APS Payload"
 * />
 * 
 * @example
 * // Without ref, with line numbers (update-activity pattern)
 * <JsonEditor
 *   value={payload}
 *   onChange={setPayload}
 *   label="APS Payload"
 *   showLineNumbers
 * />
 */
export function JsonEditor({
  value,
  onChange,
  label,
  editorRef,
  showLineNumbers = false,
  height = '400px',
  className
}: Readonly<JsonEditorProps>) {
  const editorOptions = showLineNumbers
    ? EDITOR_CONFIG.OPTIONS_WITH_LINE_NUMBERS
    : EDITOR_CONFIG.OPTIONS;

  return (
    <View UNSAFE_className={className}>
      {label && <Text marginBottom="size-100">{label}</Text>}
      <Editor
        onMount={(editor, monaco) => {
          if (editorRef) {
            editorRef.current = editor;
          }
          configureMonacoEditor(editor, monaco);
        }}
        height={height}
        defaultLanguage="json"
        value={value}
        onChange={(val) => onChange(val ?? "{}")}
        options={editorOptions}
      />
    </View>
  );
}

