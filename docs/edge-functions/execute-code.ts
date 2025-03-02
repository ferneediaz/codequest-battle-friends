import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = Deno.env.get('JUDGE0_RAPIDAPI_KEY')

interface ExecuteCodeRequest {
  sourceCode: string
  languageId: number
  isSubmission: boolean
}

serve(async (req) => {
  try {
    const { sourceCode, languageId, isSubmission } = await req.json() as ExecuteCodeRequest

    // Create submission
    const submission = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: ''
      })
    })

    const { token } = await submission.json()

    // Wait for result
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Get submission result
    const result = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    })

    return new Response(
      JSON.stringify(await result.json()),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
