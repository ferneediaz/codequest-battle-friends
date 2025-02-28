
// HuggingFace Inference API endpoint
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";

export const getStoredApiKey = () => {
  return localStorage.getItem('huggingface_api_key');
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem('huggingface_api_key', key);
};

export async function generateSocraticQuestion(userMessage: string) {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("Please set your HuggingFace API key first");
  }

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Act as Socrates, the ancient Greek philosopher known for teaching through questions. 
                Given this coding problem or question: "${userMessage}"
                Respond with one thought-provoking question that will help guide the person to discover the answer themselves.
                Keep the response focused on coding and programming concepts.`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from HuggingFace");
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
  } catch (error) {
    console.error("Error generating Socratic question:", error);
    throw error;
  }
}
