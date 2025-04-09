
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const JUDGE0_API_KEY = Deno.env.get('JUDGE0_RAPIDAPI_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceCode, languageId, isSubmission, testCases, questionTitle } = await req.json();
    console.log('Received request:', { 
      languageId, 
      isSubmission, 
      testCasesCount: testCases?.length,
      questionTitle
    });

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      console.error('No valid test cases provided');
      throw new Error('Valid test cases must be provided');
    }

    if (!JUDGE0_API_KEY) {
      console.error('JUDGE0_RAPIDAPI_KEY is not set');
      throw new Error('Judge0 API key not configured');
    }

    // Log the complete test cases for debugging
    console.log('Test cases:', JSON.stringify(testCases));

    // Generate validation logic based on question title
    let validationCode = '';
    
    // Default validation for Two Sum problem
    validationCode = `
function validateSolution(testCase) {
  const result = solution(testCase.input.nums, testCase.input.target);
  if (!Array.isArray(result)) return false;
  if (result.length !== 2) return false;
  
  // Sort both arrays to handle different valid solutions
  const sortedResult = [...result].sort((a, b) => a - b);
  const sortedExpected = [...testCase.expected].sort((a, b) => a - b);
  
  return JSON.stringify(sortedResult) === JSON.stringify(sortedExpected);
}`;

    // Use the question title to determine which validation to use
    if (questionTitle && questionTitle.includes('Valid Parentheses')) {
      validationCode = `
function validateSolution(testCase) {
  const result = solution(testCase.input.s);
  return result === testCase.expected;
}`;
    } else if (questionTitle && questionTitle.includes('Reverse String')) {
      validationCode = `
function validateSolution(testCase) {
  const inputArray = [...testCase.input.s];
  solution(inputArray);
  return JSON.stringify(inputArray) === JSON.stringify(testCase.expected);
}`;
    } else if (questionTitle && questionTitle.includes("Mage's Maximum Power")) {
      validationCode = `
function validateSolution(testCase) {
  try {
    console.log('Validating test case:', JSON.stringify(testCase));
    
    // For Mage's Maximum Power, we expect a numeric result
    let result;
    
    // Handle various test case structures
    if (testCase.input && testCase.input.nums) {
      console.log('Using input.nums:', testCase.input.nums);
      result = solution(testCase.input.nums);
    } else if (Array.isArray(testCase.input)) {
      console.log('Using input directly as array:', testCase.input);
      result = solution(testCase.input);
    } else if (Array.isArray(testCase)) {
      console.log('Test case is directly an array');
      result = solution(testCase);
    } else {
      console.error('Cannot determine input array from test case');
      return false;
    }
    
    console.log('Got result:', result, 'Expected:', testCase.expected);
    
    // For numbers, compare directly
    if (typeof testCase.expected === 'number' && typeof result === 'number') {
      return result === testCase.expected;
    }
    
    // If expected is somehow not a number, try to be flexible
    return String(result) === String(testCase.expected);
  } catch (error) {
    console.error('Validation error:', error.message);
    return false;
  }
}`;
    }
    // Add more question-specific validations here

    // Preprocess test cases for Mage's Maximum Power if needed
    let processedTestCases = testCases;
    if (questionTitle && questionTitle.includes("Mage's Maximum Power")) {
      console.log('Processing test cases for Mage\'s Maximum Power');
      
      // For this problem, we need to transform the test cases
      // Let's check the structure of the first test case
      const firstCase = testCases[0];
      console.log('First test case structure:', JSON.stringify(firstCase));
      
      // Try to create proper test cases for maximum subarray problem
      processedTestCases = [
        { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
        { input: { nums: [1] }, expected: 1 },
        { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
        { input: { nums: [-1] }, expected: -1 },
        { input: { nums: [-2, -1] }, expected: -1 }
      ];
      
      console.log('Restructured test cases:', JSON.stringify(processedTestCases));
    }

    // Common validation function for both run and submit modes
    const processedCode = `
${sourceCode}

// Function to validate if the solution is correct for the given test case
${validationCode}

${isSubmission ? `
// Test all cases for submit mode
const testCases = ${JSON.stringify(processedTestCases)};
let allPassed = true;
const results = [];

for (const test of testCases) {
  try {
    // Debug the test case structure
    console.log('Processing test case:', JSON.stringify(test));

    const userResult = ${questionTitle && questionTitle.includes('Reverse String') 
      ? `(() => { const arr = [...test.input.s]; solution(arr); return arr; })()` 
      : questionTitle && questionTitle.includes('Valid Parentheses')
        ? `solution(test.input.s)` 
        : questionTitle && questionTitle.includes("Mage's Maximum Power")
        ? `solution(test.input.nums)`
        : `solution(test.input.nums, test.input.target)`};
    
    const passed = validateSolution(test);
    
    console.log('Test result:', {
      input: test.input,
      output: userResult,
      expected: test.expected,
      passed
    });
    
    if (!passed) {
      allPassed = false;
    }
    
    results.push({
      input: test.input,
      output: userResult,
      expected: test.expected,
      passed
    });
    
    if (!passed) break;
  } catch (error) {
    console.error('Error executing test case:', error.message);
    results.push({
      input: test.input,
      error: error.message,
      passed: false
    });
    allPassed = false;
    break;
  }
}

console.log(JSON.stringify({ allPassed, results }));
` : `
// Single test case for run mode (just use the first test case)
const test = ${JSON.stringify(processedTestCases[0])};
try {
  // Debug the test case structure
  console.log('Processing test case:', JSON.stringify(test));

  const userResult = ${questionTitle && questionTitle.includes('Reverse String') 
    ? `(() => { const arr = [...test.input.s]; solution(arr); return arr; })()` 
    : questionTitle && questionTitle.includes('Valid Parentheses')
      ? `solution(test.input.s)` 
      : questionTitle && questionTitle.includes("Mage's Maximum Power")
      ? `solution(test.input.nums)`
      : `solution(test.input.nums, test.input.target)`};
      
  const passed = validateSolution(test);

  console.log(JSON.stringify({
    input: test.input,
    output: userResult,
    expected: test.expected,
    passed
  }));
} catch (error) {
  console.error('Error executing test case:', error.message);
  console.log(JSON.stringify({
    input: test.input,
    error: error.message,
    passed: false
  }));
}
`}`;

    console.log('Sending code to Judge0...');

    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
      },
      body: JSON.stringify({
        source_code: btoa(processedCode),
        language_id: languageId,
        stdin: '',
        expected_output: '',
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    });

    if (submitResponse.status === 429) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          status: { id: 429, description: 'Too Many Requests' }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    if (!submitResponse.ok) {
      console.error('Judge0 API error:', submitResponse.status, await submitResponse.text());
      throw new Error(`Judge0 API error: ${submitResponse.status}`);
    }

    const result = await submitResponse.json();
    console.log('Judge0 execution result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to execute code',
        status: { id: -1, description: 'Error' }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
