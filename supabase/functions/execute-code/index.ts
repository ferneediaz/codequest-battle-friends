
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const JUDGE0_API_KEY = Deno.env.get('JUDGE0_RAPIDAPI_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceCode, languageId } = await req.json();

    console.log('Executing code with Judge0:', { languageId });

    // Submit code to Judge0
    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': JUDGE0_API_KEY!,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: '',
      }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Judge0 submission failed: ${submitResponse.statusText}`);
    }

    const { token } = await submitResponse.json();
    if (!token) {
      throw new Error('No submission token received');
    }

    console.log('Submission token received:', token);

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': JUDGE0_API_KEY!,
        },
      });

      if (!resultResponse.ok) {
        throw new Error(`Failed to get submission results: ${resultResponse.statusText}`);
      }

      result = await resultResponse.json();
      attempts++;

      console.log('Polling attempt:', attempts, 'Status:', result.status?.description);

      if (attempts >= maxAttempts) {
        throw new Error('Execution timed out');
      }
    } while (result.status?.id === 1 || result.status?.id === 2); // Processing or In Queue

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to execute code' }),
      { 
        status: 200, // Sending 200 even for errors to prevent Supabase from rejecting the response
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
