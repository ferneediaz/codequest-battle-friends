
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
            content: `You are a mentor helping students understand the Two Sum problem. Your responses must:
            - Be brief (1-2 questions max)
            - Focus on the immediate step they're stuck on
            - Never hint at specific data structures or solutions
            - Ask questions that help them understand what their code is doing
            
            Examples of good responses:
            - "What does your code do when it finds the first number?"
            - "What information do you currently have at this point in your code?"
            - "What happens if you run your code with [1,2,3] and target 5?"
            
            Remember: Help them understand their current approach rather than guiding them to a specific solution.`
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
