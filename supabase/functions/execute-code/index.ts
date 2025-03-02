
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
    const { sourceCode, languageId, isSubmission } = await req.json();
    console.log('Received request:', { languageId, isSubmission });

    if (!JUDGE0_API_KEY) {
      console.error('JUDGE0_RAPIDAPI_KEY is not set');
      throw new Error('Judge0 API key not configured');
    }

    // Common validation function for both run and submit modes
    const processedCode = `
${sourceCode}

function validateSolution(nums, target, expected) {
  const result = solution(nums, target);
  if (!Array.isArray(result)) return false;
  if (result.length !== 2) return false;
  
  // Sort both arrays to handle different valid solutions
  const sortedResult = [...result].sort((a, b) => a - b);
  const sortedExpected = [...expected].sort((a, b) => a - b);
  
  return JSON.stringify(sortedResult) === JSON.stringify(sortedExpected);
}

${isSubmission ? `
// Test cases for submit mode
const testCases = [
  { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
  { nums: [3, 2, 4], target: 6, expected: [1, 2] },
  { nums: [3, 3], target: 6, expected: [0, 1] },
  { nums: [-1, -2, -3, -4, -5], target: -8, expected: [2, 4] },
  { nums: [1, 5, 8, 10], target: 15, expected: [1, 3] }
];

let allPassed = true;
const results = [];

for (const test of testCases) {
  const userResult = solution(test.nums, test.target);
  const passed = validateSolution(test.nums, test.target, test.expected);
  
  if (!passed) {
    allPassed = false;
  }
  
  results.push({
    input: test,
    output: userResult,
    passed
  });
  
  if (!passed) break;
}

console.log(JSON.stringify({ allPassed, results }));
` : `
// Single test case for run mode
const test = { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] };
const userResult = solution(test.nums, test.target);
const passed = validateSolution(test.nums, test.target, test.expected);

console.log(JSON.stringify({
  input: test,
  output: userResult,
  passed
}));
`}`;

    console.log('Sending code to Judge0:', processedCode);

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

    if (!submitResponse.ok) {
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
