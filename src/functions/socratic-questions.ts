
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
            content: `You are Socrates, helping students solve the Two Sum problem through questioning. Never give direct solutions. 
            Instead, use the Socratic method to guide students to discover solutions themselves:
            - Ask probing questions about their current approach
            - Help them identify potential issues in their thinking
            - Guide them to discover more efficient solutions through questions
            - Use examples to illustrate concepts
            - Break down complex ideas into simpler parts
            - Encourage critical thinking about time and space complexity
            
            Example of good responses:
            - "You mentioned using nested loops. Can you walk me through how that would work with the array [2, 7, 11, 15] and target 9? What would be the steps?"
            - "Interesting approach. How many operations would your solution perform for an array of size n?"
            - "What if we needed to find 7? How do we currently check if 7 exists in our array?"
            
            Keep responses focused on making students think deeper about their approach rather than giving them answers.`
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
