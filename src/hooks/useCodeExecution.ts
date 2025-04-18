import { useState } from 'react';
import { Language, QuestionData } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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
      case 'java':
        return 62; // Java
      default:
        return 63; // Default to Node.js
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, make them start from the top
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.4, 1)
      });
    }, 250);
  };

  const handleJudge0Response = (data: any, isSubmission: boolean, testCases: any[]) => {
    console.log('Raw Judge0 response:', data);
    console.log('Submission type:', isSubmission ? 'SUBMIT' : 'RUN');
    console.log('Status ID:', data?.status?.id, 'Description:', data?.status?.description);
    
    if (!data || data.error) {
      console.error('Execution Error:', data?.error || 'Unknown error occurred');
      toast.error('Execution Error', {
        description: data.error || 'Unknown error occurred',
        duration: 5000,
      });
      return false;
    }

    if (data.status?.id === 429) {
      console.error('Rate limit exceeded (429)');
      toast.error('Too Many Requests', {
        description: 'Please wait a moment before trying again.',
        duration: 5000,
      });
      return false;
    }

    if (data.status?.id === 6) {
      const errorMessage = atob(data.compile_output || '');
      console.error('Compilation Error:', errorMessage);
      toast.error("Compilation Error", {
        description: errorMessage,
        duration: 10000,
      });
      return false;
    }

    if (data.status?.id === 11 || data.status?.id === 12) {
      const errorMessage = atob(data.stderr || '');
      console.error('Runtime Error:', errorMessage);
      toast.error("Runtime Error", {
        description: errorMessage,
        duration: 10000,
      });
      return false;
    }

    try {
      // Handle both Accepted (3) and Wrong Answer (4) statuses
      if (data.status?.id === 3 || data.status?.id === 4) {
        const stdout = atob(data.stdout || '');
        console.log('Raw stdout:', stdout);
        let results;
        try {
          results = JSON.parse(stdout);
          console.log('Parsed test results:', results);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.log('Problematic stdout content:', stdout);
          throw parseError;
        }

        if (!isSubmission) {
          const testCase = testCases[0];
          console.log('Single test case run result:', results);
          if (results.passed) {
            toast.success('Code ran successfully!', {
              description: `Test case passed!\nInput: ${JSON.stringify(testCase.input)}\nOutput: ${JSON.stringify(results.output)}`,
              duration: 5000,
            });
          } else {
            toast.error('Wrong Answer', {
              description: `Input: ${JSON.stringify(testCase.input)}\nExpected: ${JSON.stringify(testCase.expected)}\nYour Output: ${JSON.stringify(results.output)}`,
              duration: 5000,
            });
          }
          return results.passed;
        }

        // For submissions, check our test results
        if (results.allPassed) {
          triggerConfetti();
          toast.success('Solution Accepted! All test cases passed.', {
            duration: 5000,
          });
          return true;
        } else {
          console.log('Not all tests passed. Results:', results.results);
          const failedTest = results.results.find((test: any) => !test.passed);
          if (failedTest) {
            console.error('Failed test case:', failedTest);
            toast.error("Wrong Answer", {
              description: `Failed test case:\nInput: ${JSON.stringify(failedTest.input)}\nExpected: ${JSON.stringify(failedTest.expected)}\nYour Output: ${JSON.stringify(failedTest.output)}`,
              duration: 10000,
            });
          }
          return false;
        }
      }
    } catch (error) {
      console.error('Error parsing test results:', error);
      console.error('Original response data:', data);
      console.error('Stdout (if available):', data.stdout ? atob(data.stdout) : 'No stdout');
      toast.error('Error processing test results');
      return false;
    }

    if (data.status?.id !== 3 && data.status?.id !== 4) {
      console.error(`Unexpected execution status: ${data.status?.id} - ${data.status?.description}`);
      toast.error(`Execution Error: ${data.status?.description || 'Unknown error'}`, {
        duration: 5000,
      });
      return false;
    }

    return false;
  };

  const executeCode = async (
    operation: 'run' | 'submit', 
    code: string, 
    language: Language,
    question?: QuestionData | null
  ) => {
    console.log(`Starting ${operation} operation for language: ${language}`);
    
    if (isExecuting || currentOperation || !question) {
      console.log('Execution blocked:', { isExecuting, currentOperation, hasQuestion: !!question });
      return;
    }

    const now = Date.now();
    if (now - lastExecutionTime < 2000) {
      console.log('Rate limiting applied, last execution:', lastExecutionTime);
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
          isSubmission: operation === 'submit',
          testCases: question.test_cases || []
        }
      });

      if (response.error) {
        console.error(`Error response from Supabase:`, response.error);
        throw response.error;
      }

      handleJudge0Response(response.data, operation === 'submit', question.test_cases || []);
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
