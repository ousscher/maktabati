import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import { indexDocument } from "@/lib/rag/indexing";
import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    const { fileId, sectionId } = req.body;
    
    if (!fileId || !sectionId) {
      return res.status(400).json({ error: "File ID and section ID are required" });
    }
    
    // Get file info from Firestore
    const fileRef = db.collection("users").doc(userId)
                    .collection("sections").doc(sectionId)
                    .collection("files").doc(fileId);
    
    const fileDoc = await fileRef.get();
    if (!fileDoc.exists) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const fileData = fileDoc.data();
    
    // Download the file from its URL
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_${fileData.name}`);
    
    const response = await axios({
      method: 'GET',
      url: fileData.fileUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(tempFilePath);
    
    response.data.pipe(writer);
    
    // Wait for the file to be downloaded
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Create metadata for the document
    const metadata = {
      userId,
      sectionId,
      documentId: fileId,
      documentName: fileData.name,
      documentType: fileData.fileType,
      fileUrl: fileData.fileUrl,
      indexed: true
    };
    
    // Index the document
    const indexResult = await indexDocument(tempFilePath, metadata);
    
    // Create an index record in Firestore
    const indexRef = db.collection("users").doc(userId)
                    .collection("sections").doc(sectionId)
                    .collection("indices").doc();
                    
    await indexRef.set({
      documentId: fileId,
      documentName: fileData.name,
      documentType: fileData.fileType,
      totalChunks: indexResult.totalChunks,
      successful: indexResult.successful,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update the file record to mark it as indexed
    await fileRef.update({
      indexed: true,
      indexedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    
    return res.status(200).json({
      success: true,
      indexId: indexRef.id,
      fileId,
      ...indexResult
    });
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error processing file for RAG:", error);
    return res.status(500).json({ 
      error: "Server error", 
      message: error.message 
    });
  }
}