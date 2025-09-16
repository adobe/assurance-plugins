import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import CopyableValue from './CopyableValue';

interface CopyableMonacoEditorProps {
  value: string;
  language?: string;
  height?: string;
  title?: string;
  className?: string;
}

const CopyableMonacoEditor: React.FC<CopyableMonacoEditorProps> = ({
  value,
  language = 'json',
  height = '300px',
  title,
  className = ''
}) => {
  return (
    <div className={`copyable-monaco-editor ${className}`}>
      {title && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: 'var(--spectrum-global-dimension-size-250)',
            fontWeight: 600,
            color: 'var(--spectrum-global-color-gray-800)'
          }}>
            {title}
          </h4>
          <CopyableValue 
            value={value} 
            copyButtonSize="S"
            standalone={true}
            tooltipText="Copy JSON"
          />
        </div>
      )}
      <div className="monaco-editor-container">
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            fontSize: 12,
            lineNumbers: 'on',
            folding: true,
            automaticLayout: true,
            theme: 'vs-light'
          }}
        />
      </div>
    </div>
  );
};

export default CopyableMonacoEditor;
