import { generateFilenameSuggestions } from './gemini';
import { querySimilarNames } from './pinecone';

/**
 * Process a query using the RAG system
 * @param {string} query - The user's query
 * @param {number} topK - Number of similar documents to retrieve
 * @returns {Promise<Object>} The query results
 */

async function processNameSearch(fileName, topK = 2,sectionID) {
  try {
    const suggestions = await generateFilenameSuggestions(fileName);
    // Query Pinecone for similar names
    const fileIDs = await querySimilarNames(suggestions,sectionID, topK);
    const uniqueIDs = [...new Set(fileIDs)];
    return uniqueIDs;

  } catch (error) {
    console.error("Error processing names:", error);
    throw new Error(`Failed to ftech names: ${error.message}`);
  }
}

export {processNameSearch};