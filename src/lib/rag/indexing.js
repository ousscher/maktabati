import { v4 as uuidv4 } from 'uuid';
import { processDocument } from './documentLoader';
import { generateEmbeddings } from './gemini';
import { storeEmbedding } from './pinecone';

/**
 * Index a document file
 * @param {string} filePath - Path to the document file
 * @param {Object} metadata - Additional metadata for the document
 * @returns {Promise<Object>} Result of the indexing operation
 */
async function indexDocument(filePath, metadata = {}) {
  try {
    // Process the document into chunks
    const chunks = await processDocument(filePath);
    console.log("--------------------------------------Indexing the document--------------------------------------");
    console.log("THE GENERATED CHUNKS : ", chunks);

    // Track the indexing results
    const results = [];
    
    // Process each chunk
    for (const chunk of chunks) {
      // Generate a unique ID for this chunk
      const chunkId = uuidv4();
      
      // Store the embedding directly using Pinecone's inference
      const result = await storeEmbedding(chunkId, chunk.pageContent, {
        ...metadata,
        ...chunk.metadata,
        indexedAt: new Date().toISOString()
      });
      console.log("the results we got : ",result);
      results.push({
        chunkId,
        success: !!result
      });
    }
    
    return {
      documentId: metadata.documentId || uuidv4(),
      totalChunks: chunks.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  } catch (error) {
    console.error("Error indexing document:", error);
    throw new Error(`Failed to index document: ${error.message}`);
  }
}


/**
 * Index a text string
 * @param {string} text - Text content to index
 * @param {Object} metadata - Additional metadata for the text
 * @returns {Promise<Object>} Result of the indexing operation
 */
async function indexText(text, metadata = {}) {
  try {
    // Generate a unique ID for this text
    const textId = metadata.textId || uuidv4();
    
    // Generate embedding for the text
    const embedding = await generateEmbeddings(text);
    
    // Combine metadata
    const combinedMetadata = {
      ...metadata,
      text: text,
      indexedAt: new Date().toISOString()
    };
    
    // Store the embedding in Pinecone
    const result = await storeEmbedding(textId, embedding, combinedMetadata);
    
    return {
      textId,
      success: !!result
    };
  } catch (error) {
    console.error("Error indexing text:", error);
    throw new Error(`Failed to index text: ${error.message}`);
  }
}

export { indexDocument, indexText };