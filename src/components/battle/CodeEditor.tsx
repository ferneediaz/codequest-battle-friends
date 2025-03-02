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
    if (!data || data.error) {
      toast.error('Execution Error', {
        description: data.error || 'Unknown error occurred',
        duration: 5000,
      });
      return false;
    }

    if (data.status?.id === 6) {
      const errorMessage = atob(data.compile_output || '');
      toast.error("Compilation Error", {
        description: errorMessage,
        duration: 10000,
      });
      return false;
    }

    if (data.status?.id === 11 || data.status?.id === 12) {
      const errorMessage = atob(data.stderr || '');
      toast.error("Runtime Error", {
        description: errorMessage,
        duration: 10000,
      });
      return false;
    }

    try {
      if (data.status?.id === 3) {
        const stdout = atob(data.stdout || '');
        console.log('Parsed stdout:', stdout);
        const results = JSON.parse(stdout);

        if (!isSubmission) {
          if (results.passed) {
            toast.success('Code ran successfully!', {
              description: `Input: nums = [${results.input.nums}], target = ${results.input.target}
Output: [${results.output}]`,
              duration: 5000,
            });
          } else {
            toast.error('Wrong Answer', {
              description: `Input: nums = [${results.input.nums}], target = ${results.input.target}
Expected: [${results.input.expected}]
Your Output: [${results.output}]`,
              duration: 5000,
            });
          }
          return results.passed;
        }

        if (results.allPassed) {
          toast.success('Solution Accepted! All test cases passed.', {
            duration: 5000,
          });
          return true;
        } else {
          const failedTest = results.results.find((test: any) => !test.passed);
          if (failedTest) {
            toast.error("Wrong Answer", {
              description: `Failed test case:
Input: nums = [${failedTest.input.nums}], target = ${failedTest.input.target}
Expected: [${failedTest.input.expected}]
Your Output: [${failedTest.output}]`,
              duration: 10000,
            });
          }
          return false;
        }
      }
    } catch (error) {
      console.error('Error parsing test results:', error);
      toast.error('Error processing test results');
      return false;
    }

    if (data.status?.id !== 3) {
      toast.error(`Execution Error: ${data.status?.description || 'Unknown error'}`, {
        duration: 5000,
      });
      return false;
    }

    return false;
  };

  const executeCode = async (operation: 'run' | 'submit') => {
    if (isExecuting || currentOperation) {
      return;
    }

    setIsExecuting(true);
    setCurrentOperation(operation);

    try {
      const response = await supabase.functions.invoke('execute-code', {
        body: {
          sourceCode: code,
          languageId: getLanguageId(language),
          isSubmission: operation === 'submit'
        }
      });

      if (response.error) {
        throw response.error;
      }

      console.log('Judge0 response:', response.data);
      handleJudge0Response(response.data, operation === 'submit');
    } catch (error) {
      console.error(`Error during ${operation}:`, error);
      toast.error(`Error executing code: ${(error as Error).message}`);
    } finally {
      setIsExecuting(false);
      setTimeout(() => setCurrentOperation(null), 1000);
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
              className={`gap-2 ${isExecuting && currentOperation === 'run' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => executeCode('run')}
              disabled={isExecuting || currentOperation !== null}
            >
              <Play className="w-4 h-4" />
              {currentOperation === 'run' ? 'Running...' : 'Run Code'}
            </Button>
            <Button 
              variant="secondary" 
              className={`gap-2 ${isExecuting && currentOperation === 'submit' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
