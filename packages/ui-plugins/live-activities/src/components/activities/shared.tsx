
import React from 'react';
import { View, Text, ButtonGroup, Button } from '@adobe/react-spectrum';
import { Editor } from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import { EDITOR_CONFIG } from '../../constants/liveActivitiesConfig';

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


interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: Readonly<ErrorMessageProps>) {
  return (
    <View marginTop="size-200">
      <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-red-600)' }}>
        {message}
      </Text>
    </View>
  );
}


interface JsonEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  label: string;
  editorRef?: React.MutableRefObject<any>;
  showLineNumbers?: boolean;
  height?: string;
  className?: string;
}

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
      {/* <View marginBottom="size-100">{label}</View> */}
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
        onChange={(val) => onChange(val || '{}')}
        options={editorOptions}
      />
    </View>
  );
}


interface DialogActionsProps {
  isLoading: boolean;
  isDisabled: boolean;
  onCancel: () => void;
  onAction: () => void | Promise<void>;
  cancelLabel: string;
  actionLabel: string;
  loadingLabel: string;
}

export function DialogActions({
  isLoading,
  isDisabled,
  onCancel,
  onAction,
  cancelLabel,
  actionLabel,
  loadingLabel
}: Readonly<DialogActionsProps>) {
  return (
    <ButtonGroup>
      <Button variant="secondary" onPress={onCancel}>
        {cancelLabel}
      </Button>
      <Button
        variant="accent"
        onPress={onAction}
        isDisabled={isDisabled}
      >
        {isLoading ? loadingLabel : actionLabel}
      </Button>
    </ButtonGroup>
  );
}

