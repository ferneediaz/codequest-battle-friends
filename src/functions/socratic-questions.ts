
// HuggingFace Inference API endpoint
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";
// Add your free HuggingFace API token here - you can get one at huggingface.co
const HUGGINGFACE_API_KEY = "";

export async function generateSocraticQuestion(userMessage: string) {
  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
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
    // The model returns an array of generated texts, we take the first one
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
  } catch (error) {
    console.error("Error generating Socratic question:", error);
    throw error;
  }
}
