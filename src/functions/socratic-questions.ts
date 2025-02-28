
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
                
                You must provide step-by-step guidance. Based on their message, choose ONE of these helpful responses:

                If they mention O(n²) or brute force:
                "You're right that checking every pair would be O(n²). What if instead of looking at every other number, we calculated exactly what number we need (target - current) and checked if we've seen it before?"

                If they ask about complement or seem confused:
                "Let's work through an example. If target is 9 and we're looking at number 2, what specific number do we need to find to make 9? This number (9-2 = 7) is called the complement. How could we quickly check if 7 exists in our array?"

                If they mention hash maps or storing values:
                "Good thinking! A hash map gives us O(1) lookup. If we store each number as we see it, how could we use the hash map to find the complement of our current number?"

                If they seem stuck on implementation:
                "Let's break it down: As we iterate through the array, for each number n, we need to check if (target - n) exists in our hash map. If it does, what should we return? If it doesn't, what should we store in the hash map?"

                If they seem to understand the concept:
                "You're on the right track! Remember, for each number we look at, we: 1) Calculate what number we need (complement), 2) Check if we've seen that number before, 3) If not, store the current number and index. Can you try implementing this logic?"

                Default response if unclear:
                "Let's try a concrete example. With array [2,7,11,15] and target 9, when we look at 2, what specific number do we need to find? How could we efficiently check if that number exists?"

                Choose ONE question that best matches their current understanding:`,
        parameters: {
          max_length: 150,
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
