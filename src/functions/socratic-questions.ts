
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

  const problemContext = `
    Problem: Given an array of integers, find two numbers that add up to a target sum.
    Example: nums = [2, 7, 11, 15], target = 9
    Expected Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)
    Constraints: 
    - 2 ≤ nums.length ≤ 104
    - -109 ≤ nums[i] ≤ 109
    - Only one valid solution exists
  `;

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `You are Socrates helping a student solve this coding problem:
                ${problemContext}
                
                The student says: "${userMessage}"
                
                Respond with ONE thought-provoking question that will guide them towards solving this specific problem.
                Focus on making them think about data structures, algorithms, and problem-solving approaches.
                Keep your question clear, specific, and related to solving the two sum problem.`,
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
