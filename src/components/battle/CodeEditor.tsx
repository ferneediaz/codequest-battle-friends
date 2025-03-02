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
    // Check for compilation errors first
    if (data.compile_output) {
      toast.error(`Compilation Error: ${data.compile_output}`);
      return false;
    }

    // Check runtime errors
    if (data.stderr) {
      toast.error(`Runtime Error: ${data.stderr}`);
      return false;
    }

    // For submissions, check if the answer is correct
    if (isSubmission) {
      if (data.status?.id === 3) { // Accepted
        return data.isCorrect === true;
      }
    } else {
      // For run only, we just need to check if it executed successfully
      if (data.status?.id === 3) {
        return true;
      }
    }

    // Handle other status codes
    switch (data.status?.id) {
      case 4: // Wrong Answer
        toast.error("Wrong Answer");
        return false;
      case 5: // Time Limit Exceeded
        toast.error("Time Limit Exceeded");
        return false;
      case 6: // Compilation Error
        toast.error(`Compilation Error: ${data.compile_output || "Unknown error"}`);
        return false;
      case 7: // Runtime Error (SIGSEGV)
        toast.error(`Runtime Error: ${data.stderr || "Segmentation fault"}`);
        return false;
      case 8: // Runtime Error (SIGXFSZ)
        toast.error("Runtime Error: Output Limit Exceeded");
        return false;
      case 9: // Runtime Error (SIGFPE)
        toast.error("Runtime Error: Floating Point Error");
        return false;
      case 10: // Runtime Error (SIGABRT)
        toast.error("Runtime Error: Aborted");
        return false;
      case 11: // Runtime Error (NZEC)
        toast.error("Runtime Error: Non-Zero Exit Code");
        return false;
      case 12: // Runtime Error (Other)
        toast.error(`Runtime Error: ${data.stderr || "Unknown error"}`);
        return false;
      default:
        toast.error("Execution failed with unknown status");
        return false;
    }
  };

  const executeCode = async (isSubmission: boolean = false) => {
    try {
      setIsExecuting(true);
      
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          sourceCode: code,
          languageId: getLanguageId(language),
          isSubmission
        }
      });

      if (error) throw error;

      const success = handleJudge0Response(data, isSubmission);
      if (success) {
        toast.success(isSubmission ? 'Solution submitted successfully!' : 'Code ran successfully!');
        if (!isSubmission) {
          console.log('Output:', data.stdout);
        }
      } else if (isSubmission && data.status?.id === 3 && !data.isCorrect) {
        toast.error('Code executed successfully but the answer is incorrect');
      }
    } catch (error) {
      toast.error('Error executing code: ' + (error as Error).message);
    } finally {
      setIsExecuting(false);
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
              className="gap-2" 
              onClick={() => executeCode(false)}
              disabled={isExecuting}
            >
              <Play className="w-4 h-4" />
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => executeCode(true)}
              disabled={isExecuting}
            >
              <Send className="w-4 h-4" />
              {isExecuting ? 'Submitting...' : 'Submit Solution'}
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
