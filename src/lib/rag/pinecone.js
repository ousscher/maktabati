import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

// Set your index name and namespace
const INDEX_NAME = 'salam-hack';
const NAMESPACE = 'ns1';
const FILENAMES_NAMESPACE = 'salam-hack-file-names';
const MODEL_NAME = 'llama-text-embed-v2';

/**
 * Initialize the Pinecone index
 * @returns {Promise<Object>} The Pinecone index
 */
async function getIndex() {
  return pinecone.index(INDEX_NAME).namespace(NAMESPACE);
}
async function getNmaesIndex() {
  return pinecone.index(FILENAMES_NAMESPACE).namespace(NAMESPACE);
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
async function querySimilarDocuments(queryText, sectionId, topK = 5) {
  try {
    console.log("--------------------------------------Querying documents in pinecone--------------------------------------");
    const index = await getIndex();
        
    
    const queryEmbedding = await pinecone.inference.embed(MODEL_NAME, [queryText], { inputType: 'query' });
    console.log('the query embedding : ',queryEmbedding)
    const queryResponse = await index.namespace(NAMESPACE).query({
      vector: queryEmbedding.data[0].values,
      topK: topK,
      includeValues: false,
      includeMetadata: true,
      filter: {
        "sectionId" : sectionId
      }});

    console.log('Query response : ',queryResponse);
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



/**
 * Store document embeddings using Pinecone's inference service
 * @param {string} documentId - Unique identifier for the document
 * @param {string} fileName - The file's name to embed
 * @param {Object} metadata - Document metadata
 * @returns {Promise<Object>} Result of the upsert operation
 */
async function storeNameEmbedding(documentId, fineName, metadata) {
  try {
    const index = await getNmaesIndex();
    // Generate embedding using Pinecone Inference
    const embedding = await pinecone.inference.embed(MODEL_NAME, [fineName], { inputType: 'passage', truncate: 'END' });
    await index.upsert([
      {
        id: documentId,
        values: embedding.data[0].values,
        metadata: metadata 
      }
    ]);
    return true;
  } catch (error) {
    console.error("Error storing embedding:", error);
    throw new Error("Failed to store embedding in Pinecone");
  }
}

/**
 * Query Pinecone for similar documents based on multiple name suggestions.
 * @param {Array<string>} suggestions - Array of suggested filenames
 * @param {string} sectionId - Section ID for filtering
 * @param {number} topK - Number of results per query
 * @returns {Promise<Array<Object>>} Array of similar documents
 */
async function querySimilarNames(suggestions, sectionId, topK = 2) {
  try {
    const index = await getNmaesIndex();
    
    let allMatches = [];
    
    for (const suggestion of suggestions) {
      // Get embedding for the individual suggestion
      const queryEmbeddings = await pinecone.inference.embed(MODEL_NAME, [suggestion], { inputType: 'query' });

      // Perform query on Pinecone
      const queryResponse = await index.namespace(NAMESPACE).query({
        vector: queryEmbeddings.data[0].values,
        topK: topK,
        includeValues: false,
        includeMetadata: true,
        filter: { "sectionId": sectionId }
      });

      console.log(`Query response for "${suggestion}":`, queryResponse);
      // Extracting IDs correctly
      const matchIds = queryResponse.matches.map(match => match.metadata.fileId);

      // Pushing extracted IDs into allMatches array
      allMatches.push(...matchIds);
    }

    return allMatches;

  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw new Error("Failed to query similar documents");
  }
}

export { storeEmbedding, querySimilarDocuments, deleteDocument, querySimilarNames, storeNameEmbedding };