
import { useState } from 'react';
import { LANGUAGE_IDS, Language, QuestionData } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExecutionResult {
  operation: 'run' | 'submit';
  success: boolean;
  error?: string;
  results?: {
    allPassed?: boolean;
    [key: string]: any;
  };
}

export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<'run' | 'submit'>('run');
  const [lastExecutionResult, setLastExecutionResult] = useState<ExecutionResult | null>(null);

  const executeCode = async (
    operation: 'run' | 'submit',
    code: string,
    language: Language,
    question?: QuestionData | null
  ) => {
    try {
      if (!code || !question) {
        toast.error("Missing code or question data");
        return null;
      }

      setIsExecuting(true);
      setCurrentOperation(operation);

      // Get the test cases from the question
      const testCases = question.test_cases || [];
      if (testCases.length === 0) {
        toast.error("No test cases available for this question");
        setIsExecuting(false);
        return null;
      }

      // Send the code to the edge function for execution
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          sourceCode: code,
          languageId: LANGUAGE_IDS[language],
          isSubmission: operation === 'submit',
          testCases: testCases,
          questionTitle: question.title
        }
      });

      if (error) {
        toast.error("Error executing code", { description: error.message });
        setIsExecuting(false);
        
        const result: ExecutionResult = {
          operation,
          success: false,
          error: error.message
        };
        setLastExecutionResult(result);
        
        return result;
      }

      if (data.error) {
        toast.error("Error executing code", { description: data.error });
        setIsExecuting(false);
        
        const result: ExecutionResult = {
          operation,
          success: false,
          error: data.error
        };
        setLastExecutionResult(result);
        
        return result;
      }

      // Process the execution result
      if (data.status && data.status.id !== 3) {
        // Judge0 error response
        const statusDescription = data.status.description;
        toast.error(`Execution failed: ${statusDescription}`);
        setIsExecuting(false);
        
        const result: ExecutionResult = {
          operation,
          success: false,
          error: statusDescription
        };
        setLastExecutionResult(result);
        
        return result;
      }

      // Parse the output
      let results;
      try {
        if (data.stdout) {
          // Base64 decode the output
          const decodedOutput = atob(data.stdout);
          results = JSON.parse(decodedOutput);
        }
      } catch (parseError) {
        toast.error("Failed to parse execution results");
        setIsExecuting(false);
        
        const result: ExecutionResult = {
          operation,
          success: false,
          error: "Failed to parse execution results"
        };
        setLastExecutionResult(result);
        
        return result;
      }

      if (operation === 'run') {
        // Display run results
        if (results && results.passed) {
          toast.success("Test passed", {
            description: "Your code passed the test case",
          });
        } else if (results && results.error) {
          toast.error("Error in your code", {
            description: results.error,
          });
        } else {
          toast.error("Test failed", {
            description: "Your code did not produce the expected output",
          });
        }
      } else if (operation === 'submit') {
        // Display submission results
        if (results && results.allPassed) {
          toast.success("All tests passed!", {
            description: "Congratulations! Your solution is correct.",
          });
        } else {
          toast.error("Some tests failed", {
            description: "Your solution didn't pass all test cases.",
          });
        }
      }

      setIsExecuting(false);
      
      const result: ExecutionResult = {
        operation,
        success: true,
        results
      };
      setLastExecutionResult(result);
      
      return result;
    } catch (err) {
      console.error("Execution error:", err);
      toast.error("Failed to execute code");
      setIsExecuting(false);
      
      const result: ExecutionResult = {
        operation,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error"
      };
      setLastExecutionResult(result);
      
      return result;
    }
  };

  return {
    isExecuting,
    currentOperation,
    executeCode,
    lastExecutionResult
  };
}
