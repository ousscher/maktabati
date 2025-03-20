import * as fs from 'fs';
import * as path from 'path';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';

/**
 * Load and process a document file
 * @param {string} filePath - Path to the document file
 * @returns {Promise<string>} Full text content of the document
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
            case '.pdf':
                loader = new PDFLoader(filePath);
                break;
            case '.docx':
                loader = new DocxLoader(filePath);
                break;
            case '.doc':
                loader = new DocxLoader(filePath, { type: 'doc' });
                break;
            default:
                throw "";
        }

        // Load the document
        const docs = await loader.load();
        // Concatenate and return the full text content
        return docs.map(doc => doc.pageContent).join('\n');
    } catch (error) {
        console.error("Error loading document:", error);
        throw new Error(`Failed to load document: ${error.message}`);
    }
}


/**
 * Split a document into chunks
 * @param {string} text - The text to split
 * @param {number} chunkSize - Size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<string>} Array of document chunks
 */
function splitDocument(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];

  // Iterate with correct step size
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunk = text.slice(i, i + chunkSize);
      chunks.push(chunk);

      // Stop if the last chunk reaches the end of the text
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
    const document_text = await loadDocument(filePath);
    console.log("THE DOCCCCCCCCCCCCCCCCS /////////////////////////",document_text);
    if (document_text == ""){ // this document type is not handeled yet
      return []
    }
    // Process each page/section
    let allChunks = [];
    
    allChunks = splitDocument(document_text);

    console.log("ALL CHUNNKS / ",allChunks);
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


