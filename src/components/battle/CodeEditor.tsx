
import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { Language, QuestionData } from '@/types/battle';
import { EditorToolbar } from './EditorToolbar';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { ViewUpdate } from '@codemirror/view';
import { defaultInitialCode, validParenthesesSolution, reverseStringSolution, magesMaximumPowerSolution } from '@/constants/defaultCode';
import confetti from 'canvas-confetti';

interface CodeEditorProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onChange: (value: string, viewUpdate?: ViewUpdate) => void;
  currentRoom: string | null;
  question: QuestionData | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onLanguageChange,
  onChange,
  currentRoom,
  question
}) => {
  const { isExecuting, currentOperation, executeCode, lastExecutionResult } = useCodeExecution();

  useEffect(() => {
    // Trigger confetti when all test cases pass
    if (lastExecutionResult && 
        lastExecutionResult.operation === 'submit' && 
        lastExecutionResult.success && 
        lastExecutionResult.results?.allPassed) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [lastExecutionResult]);

  const handleRunCode = () => {
    if (isExecuting) return;
    executeCode('run', code, language, question);
  };

  const handleSubmitCode = () => {
    if (isExecuting) return;
    executeCode('submit', code, language, question);
  };

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

  // Get the appropriate code based on question and language
  const getInitialCodeForQuestion = () => {
    if (!question) {
      return defaultInitialCode[language];
    }

    // Choose solution template based on question title
    if (question.title.includes('Valid Parentheses')) {
      return validParenthesesSolution[language];
    } else if (question.title.includes('Reverse String')) {
      return reverseStringSolution[language];
    } else if (question.title.includes("Mage's Maximum Power")) {
      return magesMaximumPowerSolution[language];
    } else if (question.initial_code && question.initial_code[language]) {
      return question.initial_code[language];
    }
    
    return defaultInitialCode[language];
  };

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
            value={code || getInitialCodeForQuestion()}
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
