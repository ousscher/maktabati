import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

// Set your index name and namespace
const INDEX_NAME = 'salam-hack';
const NAMESPACE = 'ns1';
const MODEL_NAME = 'llama-text-embed-v2';

/**
 * Initialize the Pinecone index
 * @returns {Promise<Object>} The Pinecone index
 */
async function getIndex() {
  return pinecone.index(INDEX_NAME).namespace(NAMESPACE);
}

/**
 * Store document embeddings using Pinecone's inference service
 * @param {string} documentId - Unique identifier for the document
 * @param {string} text - The text content to embed
 * @param {Object} metadata - Document metadata
 * @returns {Promise<Object>} Result of the upsert operation
 */
async function storeEmbedding(documentId, text, metadata) {
  try {
    const index = await getIndex();
    console.log("--------------------------------------Indexing the document in pinecone--------------------------------------");
    // Generate embedding using Pinecone Inference
    const embedding = await pinecone.inference.embed(MODEL_NAME, [text], { inputType: 'passage', truncate: 'END' });
    console.log("text : ",text);
    console.log("embedding : ",embedding);
    await index.upsert([
      {
        id: documentId,
        values: embedding.data[0].values,
        metadata: { ...metadata, text }
      }
    ]);
    return true;
  } catch (error) {
    console.error("Error storing embedding:", error);
    throw new Error("Failed to store embedding in Pinecone");
  }
}

/**
 * Query Pinecone for similar documents
 * @param {string} queryText - The query text
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array<Object>>} Array of similar documents
 */
async function querySimilarDocuments(queryText, topK = 5) {
  try {
    const index = await getIndex();
    
    // Generate embedding for the query text
    const queryEmbedding = await pinecone.inference.embed(MODEL_NAME, [queryText], { inputType: 'query', truncate: 'END' });
    
    const queryResponse = await index.query({
      vector: queryEmbedding[0].values,
      topK: topK,
      includeMetadata: true
    });
    
    return queryResponse.matches;
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw new Error("Failed to query similar documents");
  }
}

/**
 * Delete a document from Pinecone
 * @param {string} documentId - ID of the document to delete
 * @returns {Promise<Object>} Result of the delete operation
 */
async function deleteDocument(documentId) {
  try {
    const index = await getIndex();
    return await index.deleteOne(documentId);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document from Pinecone");
  }
}

export { storeEmbedding, querySimilarDocuments, deleteDocument };