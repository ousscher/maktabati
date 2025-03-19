import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

// Set your index name
const INDEX_NAME = 'hackathon-docs';

/**
 * Initialize the Pinecone index
 * @returns {Promise<Object>} The Pinecone index
 */
async function getIndex() {
  return pinecone.index(INDEX_NAME);
}

/**
 * Store document embeddings in Pinecone
 * @param {string} documentId - Unique identifier for the document
 * @param {Array<number>} embedding - Vector embedding of the document
 * @param {Object} metadata - Document metadata
 * @returns {Promise<Object>} Result of the upsert operation
 */
async function storeEmbedding(documentId, embedding, metadata) {
  try {
    const index = await getIndex();
    
    const upsertResponse = await index.upsert([{
      id: documentId,
      values: embedding,
      metadata: metadata
    }]);
    
    return upsertResponse;
  } catch (error) {
    console.error("Error storing embedding:", error);
    throw new Error("Failed to store embedding in Pinecone");
  }
}

/**
 * Query Pinecone for similar documents
 * @param {Array<number>} queryEmbedding - Vector embedding of the query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array<Object>>} Array of similar documents
 */
async function querySimilarDocuments(queryEmbedding, topK = 5) {
  try {
    const index = await getIndex();
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
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