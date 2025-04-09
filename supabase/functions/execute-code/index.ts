
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
  const result = solution(testCase.input.nums);
  return result === testCase.expected;
}`;
    }
    // Add more question-specific validations here

    // Common validation function for both run and submit modes
    const processedCode = `
${sourceCode}

// Function to validate if the solution is correct for the given test case
${validationCode}

${isSubmission ? `
// Test all cases for submit mode
const testCases = ${JSON.stringify(testCases)};
let allPassed = true;
const results = [];

for (const test of testCases) {
  try {
    const userResult = ${questionTitle && questionTitle.includes('Reverse String') 
      ? `(() => { const arr = [...test.input.s]; solution(arr); return arr; })()` 
      : questionTitle && questionTitle.includes('Valid Parentheses')
        ? `solution(test.input.s)` 
        : questionTitle && questionTitle.includes("Mage's Maximum Power")
        ? `solution(test.input.nums)`
        : `solution(test.input.nums, test.input.target)`};
    
    const passed = validateSolution(test);
    
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
const test = ${JSON.stringify(testCases[0])};
try {
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
