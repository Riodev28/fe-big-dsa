'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  filename?: string;
  className?: string;
}

const CodeEditor: FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col h-72 lg:h-full', className)}>
      <div className="flex-1 overflow-hidden min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(value) => onChange(value ?? '')}
          options={{
            readOnly: readOnly,
            fontSize: 18,
            fontFamily: "'Geist Mono', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: { verticalScrollbarSize: 4 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
