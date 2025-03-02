import React, { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { Language } from '@/types/battle';
import { EditorToolbar } from './EditorToolbar';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { ViewUpdate } from '@codemirror/view';

interface CodeEditorProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onChange: (value: string, viewUpdate?: ViewUpdate) => void;
  currentRoom: string | null;
}

const getExtensionsForLanguage = (language: Language) => {
  switch (language) {
    case 'javascript':
      return [javascript({ jsx: true })];
    case 'python':
      return [python()];
    case 'cpp':
      return [cpp()];
    case 'java':
      return [java()];
    default:
      return [javascript({ jsx: true })];
  }
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onLanguageChange,
  onChange,
  currentRoom
}) => {
  const { isExecuting, currentOperation, executeCode } = useCodeExecution();

  const handleRunCode = () => executeCode('run', code, language);
  const handleSubmitCode = () => executeCode('submit', code, language);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <EditorToolbar
          language={language}
          onLanguageChange={onLanguageChange}
          onRun={handleRunCode}
          onSubmit={handleSubmitCode}
          isExecuting={isExecuting}
          currentOperation={currentOperation}
        />
        <div className="relative w-full h-auto overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            extensions={getExtensionsForLanguage(language)}
            theme="dark"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};
