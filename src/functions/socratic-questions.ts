
// HuggingFace Inference API endpoint
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";

export const getStoredApiKey = () => {
  return localStorage.getItem('huggingface_api_key');
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem('huggingface_api_key', key);
};

export const validateApiKey = (key: string) => {
  return key.startsWith('hf_') && key.length > 8;
};

export async function generateSocraticQuestion(userMessage: string) {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error("Please set your HuggingFace API key first");
  }

  if (!validateApiKey(apiKey)) {
    throw new Error("Invalid API key format. HuggingFace API keys should start with 'hf_'");
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
                Keep your question clear, specific, and related to solving the two sum problem.
                
                Examples of good questions:
                - "If we need to find two numbers that add up to 9, and we're looking at the number 2, what other number would we need to find?"
                - "How could we efficiently check if the complement (target - current number) exists in our array?"
                - "Instead of checking every possible pair, could we use a data structure to remember the numbers we've seen?"
                - "Could we use a hash map to store each number's index as we iterate through the array?"
                - "What data structure would give us O(1) lookup time for finding the complement?"
                
                Bad questions to avoid:
                - Generic questions not specific to Two Sum
                - Philosophy questions
                - Questions about ancient Greece
                - Questions that don't help solve the problem
                
                Your turn - give ONE specific, helpful question related to solving Two Sum:`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("HuggingFace API error:", errorData);
      throw new Error("Failed to get response from HuggingFace. Please check if your API key is valid.");
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
  } catch (error) {
    console.error("Error generating Socratic question:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate response. Please check your API key and try again.");
  }
}
