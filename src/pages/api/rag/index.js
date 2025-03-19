import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import { indexDocument, indexText } from "@/lib/rag/indexing";
import fs from "fs";
import path from "path";
import os from "os";

const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: os.tmpdir(),
      filename: (name, ext, part) => {
        return `${Date.now()}_${part.originalFilename}`;
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;

    // POST - Index a new document
    if (req.method === "POST") {
      const { fields, files } = await parseForm(req);
      // Get file or text content to index
      const file = files.file[0];
      const text = fields.text;
      const sectionId = fields.sectionid?.[0] || fields.sectionId?.[0];
      const documentId = fields.documentId || fields.fileId;

      // Check required fields
      if ((!file && !text) || !sectionId) {
        return res.status(400).json({ error: "File or text and section ID are required" });
      }
      
      // Create metadata for the document
      const metadata = {
        userId,
        sectionId,
        documentId: documentId || `doc_${Date.now()}`,
        documentName: file ? file.originalFilename : (fields.title || "Text Document"),
        documentType: file ? file.mimetype : "text/plain",
        indexed: true
      };
      
      let indexResult;
      
      // Index file or text based on what was provided
      if (file) {
        // Index the document
        indexResult = await indexDocument(file.filepath, metadata);
        
        // Create an index record in Firestore
        const indexRef = db.collection("users").doc(userId)
                        .collection("sections").doc(sectionId)
                        .collection("indices").doc();
                        
        await indexRef.set({
          documentId: metadata.documentId,
          documentName: metadata.documentName,
          documentType: metadata.documentType,
          totalChunks: indexResult.totalChunks,
          successful: indexResult.successful,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Clean up temporary file
        fs.unlinkSync(file.filepath);
      } else {
        // Index text content
        indexResult = await indexText(text, {
          ...metadata,
          text
        });
        
        // Create an index record in Firestore
        const indexRef = db.collection("users").doc(userId)
                        .collection("sections").doc(sectionId)
                        .collection("indices").doc();
                        
        await indexRef.set({
          documentId: metadata.documentId,
          documentName: metadata.documentName,
          documentType: "text/plain",
          textContent: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      return res.status(201).json({
        success: true,
        indexId: indexResult.documentId || indexResult.textId,
        ...indexResult
      });
    }
    
    // GET - List indexed documents
    else if (req.method === "GET") {
      const { sectionId } = req.query;
      
      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }
      
      // Get all indices for the section
      const indicesRef = db.collection("users").doc(userId)
                         .collection("sections").doc(sectionId)
                         .collection("indices");
                         
      const indicesSnapshot = await indicesRef.orderBy("createdAt", "desc").get();
      
      const indices = [];
      indicesSnapshot.forEach(doc => {
        indices.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json({ indices });
    }
    
    // DELETE - Remove an index
    else if (req.method === "DELETE") {
      const { sectionId, indexId } = req.query;
      
      if (!sectionId || !indexId) {
        return res.status(400).json({ error: "Section ID and index ID are required" });
      }
      
      // Check if index exists
      const indexRef = db.collection("users").doc(userId)
                       .collection("sections").doc(sectionId)
                       .collection("indices").doc(indexId);
      
      const indexDoc = await indexRef.get();
      if (!indexDoc.exists) {
        return res.status(404).json({ error: "Index not found" });
      }
      
      // TODO: Implement deletion from Pinecone
      // This would typically involve getting all chunks with this document ID
      // and deleting them from Pinecone
      
      // Delete the index record from Firestore
      await indexRef.delete();
      
      return res.status(200).json({
        message: "Index deleted successfully"
      });
    }
    
    else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error in RAG indexing API:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}