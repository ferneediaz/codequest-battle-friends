
// Fallback to empty string if API key is not available
const OPENAI_API_KEY = '';

export async function generateSocraticQuestion(userMessage: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Socrates, a wise teacher who uses the Socratic method to help learners discover answers through questioning.
            Never give direct answers. Instead, respond with ONE thought-provoking question that guides them to discover the solution themselves.
            Keep your questions focused, clear, and specific to their coding challenge. Respond with just the question, no additional text.`
          },
          { role: 'user', content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating Socratic question:', error);
    throw error;
  }
}
