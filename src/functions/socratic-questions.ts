
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
        inputs: `You are a helpful programming tutor. A student needs help solving the Two Sum problem:
                ${problemContext}
                
                The student says: "${userMessage}"
                
                If they're just starting or confused, give this response:
                "Let's solve this step by step:
                1. We need to find two numbers in the array that add up to the target (9)
                2. Let's look at the first number (2). We need to find 7 (target 9 - current number 2)
                3. Instead of searching the whole array, what if we stored numbers we've seen?
                4. We could use a hash map to store {number: index} for quick lookups
                
                Would you like me to explain how to use the hash map approach?"

                If they understand and want implementation help:
                "Here's how we can implement it:
                1. Create an empty hash map to store {number: index}
                2. For each number in the array:
                   - Calculate what we need (target - current number)
                   - Check if that number exists in our hash map
                   - If yes, return [stored_index, current_index]
                   - If no, store current {number: index} in map
                
                Would you like to see this in code?"

                Choose the response that best helps the student:`,
        parameters: {
          max_length: 200,
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
