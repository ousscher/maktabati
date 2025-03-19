import { generateEmbeddings, generateResponse } from './gemini';
import { querySimilarDocuments } from './pinecone';

/**
 * Process a query using the RAG system
 * @param {string} query - The user's query
 * @param {number} topK - Number of similar documents to retrieve
 * @returns {Promise<Object>} The query results
 */

async function processQuery(query, topK = 5,conversationHistory) {
  try {
    console.log("--------------------------------------Processing query--------------------------------------");
    
    // Query Pinecone for similar documents
    const similarDocuments = await querySimilarDocuments(query, topK);
    
    // Extract text from similar documents
    const contextTexts = similarDocuments.map(doc => doc.metadata.text);
    console.log("Text context : ",contextTexts);
    // Generate a response using the retrieved context
    const formattedHistory = formatConversationHistory(conversationHistory);
    const response = await generateResponse(query, contextTexts,formattedHistory);
    console.log("LLM answer : ",response);
    return {
      query,
      response,
      sources: similarDocuments.map(doc => ({
        id: doc.id,
        score: doc.score,
        text_context: doc.metadata.text,
      }))
    };
  } catch (error) {
    console.error("Error processing query:", error);
    throw new Error(`Failed to process query: ${error.message}`);
  }
}

/**
 * Process a query without using context retrieval
 * @param {string} query - The user's query
 * @returns {Promise<Object>} The query results
 */
async function processDirectQuery(query) {
  try {
    // Generate a response directly without context
    const response = await generateResponse(query);
    
    return {
      query,
      response,
      sources: []
    };
  } catch (error) {
    console.error("Error processing direct query:", error);
    throw new Error(`Failed to process direct query: ${error.message}`);
  }
}

function formatConversationHistory(history) {
  if (!history || history.length === 0) return "";
  
  let formattedHistory = "";
  
  for (const msg of history) {
    if (msg.role === "user") {
      formattedHistory += `User: ${msg.content}\n`;
    } else if (msg.role === "assistant") {
      formattedHistory += `Assistant: ${msg.content}\n`;
      
      // Include sources text_context if available
      if (msg.sources && msg.sources.length > 0) {
        formattedHistory += "Reference contexts:\n";
        msg.sources.forEach((source) => {
          if (source.text_context) {
            formattedHistory += `${source.text_context}\n`;
          }
        });
      }
      
      formattedHistory += "\n";
    }
  }
  
  return formattedHistory.trim();
}

export { processQuery, processDirectQuery };