
import { useState } from 'react';
import { Language } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCodeExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<'run' | 'submit' | null>(null);
  const [lastExecutionTime, setLastExecutionTime] = useState(0);

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

    if (data.status?.id === 429) {
      toast.error('Too Many Requests', {
        description: 'Please wait a moment before trying again.',
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

  const executeCode = async (operation: 'run' | 'submit', code: string, language: Language) => {
    if (isExecuting || currentOperation) {
      return;
    }

    const now = Date.now();
    if (now - lastExecutionTime < 2000) {
      toast.error('Please wait', {
        description: 'Please wait a couple of seconds between attempts.',
        duration: 3000,
      });
      return;
    }

    setIsExecuting(true);
    setCurrentOperation(operation);
    setLastExecutionTime(now);

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

  return {
    isExecuting,
    currentOperation,
    executeCode
  };
};
