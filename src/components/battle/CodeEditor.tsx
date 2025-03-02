
import React from 'react';
import { Language } from '@/types/battle';
import { LanguageSelector } from './LanguageSelector';
import { TokenizedCode } from './TokenizedCode';
import { Button } from "@/components/ui/button";
import { Play, Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CodeEditorProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  currentRoom: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onLanguageChange,
  onChange,
  onKeyDown,
  textareaRef
}) => {
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [currentOperation, setCurrentOperation] = React.useState<'run' | 'submit' | null>(null);

  const getLanguageId = (lang: Language): number => {
    switch (lang) {
      case 'javascript':
        return 63; // Node.js
      case 'python':
        return 71; // Python 3
      case 'cpp':
        return 54; // C++
      default:
        return 63; // Default to Node.js
    }
  };

  const handleJudge0Response = (data: any, isSubmission: boolean) => {
    if (data.compile_output) {
      // Show detailed compilation error
      const errorMessage = `Compilation Error:\n${data.compile_output}`;
      toast.error(errorMessage, {
        duration: 5000,
      });
      return false;
    }

    if (data.stderr) {
      // Show detailed runtime error
      const errorMessage = `Runtime Error:\n${data.stderr}`;
      toast.error(errorMessage, {
        duration: 5000,
      });
      return false;
    }

    if (data.status?.description === "Wrong Answer") {
      toast.error("Your solution produced incorrect output. Please check your logic and try again.", {
        duration: 5000,
      });
      return false;
    }

    if (isSubmission) {
      if (!data.isCorrect) {
        toast.error("Your solution didn't pass all test cases. Make sure your function handles all possible inputs correctly.", {
          duration: 5000,
        });
        return false;
      }
      return true;
    }

    return data.status?.id === 3; // Accepted status
  };

  const executeCode = async (operation: 'run' | 'submit') => {
    // Prevent execution if already running or if trying to trigger multiple operations
    if (isExecuting) {
      console.log('Operation in progress, ignoring click');
      return;
    }

    try {
      setIsExecuting(true);
      setCurrentOperation(operation);
      console.log(`Starting ${operation} operation`);
      
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          sourceCode: code,
          languageId: getLanguageId(language),
          isSubmission: operation === 'submit'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Judge0 response:', data);
      const success = handleJudge0Response(data, operation === 'submit');
      
      if (success) {
        if (operation === 'submit') {
          toast.success('Solution submitted successfully! All test cases passed.');
        } else {
          toast.success('Code ran successfully!');
          if (data.stdout) {
            console.log('Output:', data.stdout);
            toast.message('Execution Output', {
              description: data.stdout,
              duration: 5000,
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error during ${operation}:`, error);
      toast.error(`Error executing code: ${(error as Error).message}`);
    } finally {
      setIsExecuting(false);
      // Add a small delay before clearing the operation state to prevent rapid re-clicks
      setTimeout(() => {
        setCurrentOperation(null);
      }, 500);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Code Editor</h3>
            <LanguageSelector 
              language={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
          <div className="flex gap-4">
            <Button 
              className={`gap-2 ${currentOperation === 'run' ? 'opacity-50' : ''}`}
              onClick={() => executeCode('run')}
              disabled={isExecuting || currentOperation !== null}
            >
              <Play className="w-4 h-4" />
              {currentOperation === 'run' ? 'Running...' : 'Run Code'}
            </Button>
            <Button 
              variant="secondary" 
              className={`gap-2 ${currentOperation === 'submit' ? 'opacity-50' : ''}`}
              onClick={() => executeCode('submit')}
              disabled={isExecuting || currentOperation !== null}
            >
              <Send className="w-4 h-4" />
              {currentOperation === 'submit' ? 'Submitting...' : 'Submit Solution'}
            </Button>
          </div>
        </div>
        <div className="relative w-full h-[500px]">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="absolute inset-0 w-full h-full bg-[#1E1E1E] font-mono p-4 text-[#D4D4D4] text-sm leading-6 resize-none outline-none"
            style={{ 
              tabSize: 2,
              color: 'transparent',
              caretColor: '#D4D4D4',
              whiteSpace: 'pre',
              fontFamily: 'monospace'
            }}
          />
          <TokenizedCode code={code} />
        </div>
      </div>
    </div>
  );
};

