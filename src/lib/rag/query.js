import { generateEmbeddings, generateResponse } from './gemini';
import { querySimilarDocuments } from './pinecone';

/**
 * Process a query using the RAG system
 * @param {string} query - The user's query
 * @param {number} topK - Number of similar documents to retrieve
 * @returns {Promise<Object>} The query results
 */

async function extractContext(query, topK = 5) {
  try {
    console.log("--------------------------------------Processing query--------------------------------------");
    
    // Query Pinecone for similar documents
    const similarDocuments = await querySimilarDocuments(query, topK);
    
    // Extract text from similar documents
    const contextTexts = similarDocuments.map(doc => doc.metadata.text);
    
    return contextTexts
  } catch (error) {
    console.error("Error extracting cotext", error);
    throw new Error(`Failed to extract context from query: ${error.message}`);
  }
}

async function processQuery(query, topK = 5) {
  try {
    console.log("--------------------------------------Processing query--------------------------------------");
    
    // Query Pinecone for similar documents
    const similarDocuments = await querySimilarDocuments(query, topK);
    
    // Extract text from similar documents
    const contextTexts = similarDocuments.map(doc => doc.metadata.text);

    // Generate a response using the retrieved context
    const response = await generateResponse(query, contextTexts);
    console.log("LLM answer : ",response);
    return {
      query,
      response,
      sources: similarDocuments.map(doc => ({
        id: doc.id,
        score: doc.score,
        metadata: doc.metadata
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

export { processQuery, processDirectQuery };