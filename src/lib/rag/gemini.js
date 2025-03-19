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
async function generateResponse(prompt, context = [], formattedHistory) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [], // Model might track internally, but we pass history in the prompt
    });

    // Build the structured prompt
    let fullPrompt = "You are a helpful and knowledgeable assistant.\n\n";

    // Append chat history if available
    if (formattedHistory && formattedHistory.length > 0) {
      fullPrompt += "Here is the conversation history to maintain context:\n";
      fullPrompt += formattedHistory;
    }

    // Append context if provided
    if (context && context.length > 0) {
      fullPrompt += "Use the following relevant information when answering:\n";
      fullPrompt += context.join("\n") + "\n\n";
    }

    // Append the current user query
    fullPrompt += `User: ${prompt}\nAssistant:`;

    // Send prompt to chat model
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