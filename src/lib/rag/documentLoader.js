import * as fs from 'fs';
import * as path from 'path';
import { TextLoader } from 'langchain/document_loaders/fs/text';

/**
 * Load and process a document file
 * @param {string} filePath - Path to the document file
 * @returns {Promise<Array<Object>>} Array of document chunks
 */
async function loadDocument(filePath) {
  try {
    const extension = path.extname(filePath).toLowerCase();
    let loader;
    
    // Select appropriate loader based on file extension
    switch (extension) {
      case '.txt':
        loader = new TextLoader(filePath);
        break;
      default:
        return "";
    }
    
    // Load and split the document
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.error("Error loading document:", error);
    throw new Error(`Failed to load document: ${error.message}`);
  }
}

/**
 * Split a document into chunks
 * @param {Object} document - The document to split
 * @param {number} chunkSize - Size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<Object>} Array of document chunks
 */
function splitDocument(document, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  const text = document.pageContent;
  
  // Simple text splitting by characters
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    if (i > 0) {
      i -= overlap;
    }
    
    const chunk = text.slice(i, i + chunkSize);
    
    chunks.push({
      pageContent: chunk,
      metadata: {
        ...document.metadata,
        chunkIndex: chunks.length,
        totalChunks: Math.ceil(text.length / (chunkSize - overlap))
      }
    });
    
    if (i + chunkSize >= text.length) {
      break;
    }
  }
  
  return chunks;
}

/**
 * Process document into chunks suitable for embedding
 * @param {string} filePath - Path to the document file
 * @returns {Promise<Array<Object>>} Array of document chunks
 */
async function processDocument(filePath) {
  try {
    const document = await loadDocument(filePath);
    if (document == ""){ // this document type is not handeled yet
      return []
    }
    // Process each page/section
    const allChunks = [];
    for (const doc of document) {
      const chunks = splitDocument(doc);
      allChunks.push(...chunks);
    }
    
    return allChunks;
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

/**
 * Load and process a document file
 * @param {Array<string>} filesPath - Array of document file paths
 * @returns {Promise<Array<Object>>} Array of document chunks
 */
async function processDocuments(filesPath) {
  const totalDocs = [];
  try {
    for (const filePath of filesPath) {
      totalDocs.push(await loadDocument(filePath));
    }
  } catch (error) {
    console.error("Error loading document:", error);
    throw new Error(`Failed to load document: ${error.message}`);
  }
  return totalDocs;
}

export {processDocument , processDocuments}


