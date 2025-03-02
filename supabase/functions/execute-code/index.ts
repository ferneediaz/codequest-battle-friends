
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
    console.log('Source code:', sourceCode);

    if (!JUDGE0_API_KEY) {
      console.error('JUDGE0_RAPIDAPI_KEY is not set');
      throw new Error('Judge0 API key not configured');
    }

    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: isSubmission ? '[2,7,11,15]\n9' : '',
        expected_output: isSubmission ? '[0,1]' : '',
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

    // For submissions, compare with expected output directly from Judge0
    let isCorrect = false;
    if (isSubmission) {
      isCorrect = result.status?.id === 3; // Accepted status means correct
    }

    return new Response(
      JSON.stringify({
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
        isCorrect
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
