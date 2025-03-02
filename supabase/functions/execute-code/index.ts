
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

    // For submissions, wrap the solution function with test case validation
    const processedCode = isSubmission ? `
${sourceCode}

// Test cases
const testCases = [
  { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
  { nums: [3, 2, 4], target: 6, expected: [1, 2] },
  { nums: [3, 3], target: 6, expected: [0, 1] }
];

let allPassed = true;
const results = [];

for (const test of testCases) {
  const result = solution(test.nums, test.target);
  const passed = JSON.stringify(result.sort()) === JSON.stringify(test.expected.sort());
  if (!passed) {
    allPassed = false;
    console.log(\`Test failed:
    Input: nums = [\${test.nums}], target = \${test.target}
    Expected: [\${test.expected}]
    Got: [\${result}]\`);
  }
  results.push({ input: test, output: result, passed });
}

if (allPassed) {
  console.log("All test cases passed!");
} else {
  console.log("Some test cases failed.");
}

console.log(JSON.stringify({ allPassed, results }, null, 2));
` : sourceCode;

    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
      },
      body: JSON.stringify({
        source_code: processedCode,
        language_id: languageId,
        stdin: '',
        expected_output: '',
        cpu_time_limit: 2,
        memory_limit: 128000,
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Judge0 API error:', submitResponse.status, errorText);
      throw new Error(`Judge0 API error: ${submitResponse.status} ${errorText}`);
    }

    const result = await submitResponse.json();
    console.log('Judge0 execution result:', result);

    // For submissions, check if all test cases pass
    let isCorrect = false;
    if (isSubmission && result.stdout) {
      try {
        const outputJson = JSON.parse(result.stdout.match(/{.*}/s)?.[0] || '{}');
        isCorrect = outputJson.allPassed === true;
        console.log('Test results:', outputJson);
        
        if (!isCorrect && outputJson.results) {
          // Include detailed test case results in the response
          result.testResults = outputJson.results;
        }
      } catch (e) {
        console.error('Error parsing test results:', e);
      }
    }

    return new Response(
      JSON.stringify({
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
        isCorrect,
        testResults: result.testResults
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        status: 500,
      }
    );
  }
});
