import { v4 as uuidv4 } from 'uuid';
import { processDocuments } from './documentLoader';
import { generateAssistedText } from './gemini';

/**
 * Index a document file
 * @param {string} filePath - Path to the document file
 * @param {Object} metadata - Additional metadata for the document
 * @returns {Promise<Object>} Result of the indexing operation
 */
async function processAsistanceQuery(filesPath,query) {
  try {
    // Process the document into chunks
    const extractedText = await processDocuments(filesPath);
    const contexts = extractedText.flat().map(doc => doc.pageContent);
    console.log("THE Extracted text : ", contexts);
    const assistedText = await generateAssistedText(contexts,query);
    return assistedText;
    
  } catch (error) {
    console.error("Error indexing document:", error);
    throw new Error(`Failed to index document: ${error.message}`);
  }
}

export {processAsistanceQuery} ; 