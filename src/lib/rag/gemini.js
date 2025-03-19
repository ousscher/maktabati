import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API client
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 * Generate a response using the Gemini model
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Array} context - Array of context chunks to include
 * @returns {Promise<string>} The generated response
 */
async function generateResponse(prompt, context = []) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    // Build the prompt with context
    let fullPrompt = "You are a helpful assistant. ";
    
    if (context && context.length > 0) {
      fullPrompt += "Use the following information to answer the question:\n\n";
      fullPrompt += context.join("\n\n");
      fullPrompt += "\n\nQuestion: " + prompt;
    } else {
      fullPrompt += "Answer the following question: " + prompt;
    }
    
    const result = await chatSession.sendMessage(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response from Gemini API");
  }
}

/**
 * Generate embeddings for a text using Gemini       USLESS FOR NOW
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Array<number>>} The generated embeddings
 */
async function generateEmbeddings(text) {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
}

export { generateResponse, generateEmbeddings };