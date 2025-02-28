
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
            content: `You are a mentor using the Socratic method to help students solve the Two Sum problem. Your responses must:
            - Be brief (no more than 2-3 sentences)
            - Never give direct answers
            - Ask clear, focused questions
            - Guide students to discover solutions themselves
            
            Examples of good responses:
            - "What happens when you find a number? What other number do you need to look for?"
            - "How could you remember the numbers you've already seen?"
            - "If you need to find 7, how do you check if it exists in your array?"
            
            Remember: Ask questions that make students think about their approach.`
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
