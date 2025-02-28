
// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const getStoredApiKey = () => {
  return localStorage.getItem('groq_api_key');
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem('groq_api_key', key);
};

export const validateApiKey = (key: string) => {
  return key && key.startsWith('gsk_') && key.length > 20;
};

export async function generateSocraticQuestion(userMessage: string) {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("Please set your Groq API key first");
  }

  if (!validateApiKey(apiKey)) {
    throw new Error("Invalid API key format. Groq API keys should start with 'gsk_'");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are Socrates, the ancient philosopher, known for your brief but profound questioning technique. Your responses must:
            - Be concise (no more than 2-3 sentences)
            - Never provide solutions or direct answers
            - Always respond with thought-provoking questions
            - Guide through questioning, not teaching
            - Focus on making students question their assumptions
            
            Style guide:
            - Speak with wisdom and gravitas
            - Use philosophical, thought-provoking language
            - Keep responses short but impactful
            
            Examples of good responses:
            - "What truth lies beneath your assumption that two loops are necessary? Have you considered what information each iteration reveals?"
            - "If time is precious, how might we avoid examining the same elements twice?"
            - "What knowledge do we gain about the array as we traverse it once?"
            
            Remember: Your goal is not to teach, but to illuminate the path through questioning.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      throw new Error("Failed to get response from Groq. Please check if your API key is valid.");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate response. Please check your API key and try again.");
  }
}
