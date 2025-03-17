import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";


export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    if (req.method === "GET") {
      const { sectionId, folderId = null } = req.query;
      
      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }
      
      // Query to get files with specified folderId (or null for root files)
      const filesQuery = folderId 
        ? db.collection("users").doc(userId).collection("sections").doc(sectionId).collection("files")
            .where("folderId", "==", folderId)
        : db.collection("users").doc(userId).collection("sections").doc(sectionId).collection("files")
            .where("folderId", "==", null);
      
      const filesSnapshot = await filesQuery.get();
      
      const files = [];
      filesSnapshot.forEach(doc => {
        files.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json({ files });
    }
    
    // POST - Create a new file record after upload to storage
    else if (req.method === "POST") {
      const { sectionId, name, fileUrl, fileType, fileSize, folderId = null } = req.body;
      
      if (!sectionId || !name || !fileUrl || !fileType) {
        return res.status(400).json({ error: "Section ID, file name, file URL, and file type are required" });
      }
      
      // If folderId is provided, verify it exists
      if (folderId) {
        const folderDoc = await db.collection("users").doc(userId)
                               .collection("sections").doc(sectionId)
                               .collection("folders").doc(folderId).get();
        
        if (!folderDoc.exists) {
          return res.status(404).json({ error: "Folder not found" });
        }
      }
      
      // Create file record
      const fileRef = db.collection("users").doc(userId)
                      .collection("sections").doc(sectionId)
                      .collection("files").doc();
      
      await fileRef.set({
        name,
        fileUrl,
        fileType,
        fileSize: fileSize || 0,
        folderId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return res.status(201).json({
        id: fileRef.id,
        name,
        fileUrl,
        fileType,
        fileSize,
        folderId,
        message: "File created successfully"
      });
    }
    
    // PUT - Update a file record
    else if (req.method === "PUT") {
      const { sectionId, fileId, name, folderId } = req.body;
      
      if (!sectionId || !fileId || !name) {
        return res.status(400).json({ error: "Section ID, file ID, and name are required" });
      }
      
      // Check if file exists
      const fileRef = db.collection("users").doc(userId)
                      .collection("sections").doc(sectionId)
                      .collection("files").doc(fileId);
      
      const fileDoc = await fileRef.get();
      if (!fileDoc.exists) {
        return res.status(404).json({ error: "File not found" });
      }
      
      // If changing folderId, verify new folder exists
      if (folderId !== undefined && folderId !== null && folderId !== fileDoc.data().folderId) {
        const folderDoc = await db.collection("users").doc(userId)
                               .collection("sections").doc(sectionId)
                               .collection("folders").doc(folderId).get();
        
        if (!folderDoc.exists) {
          return res.status(404).json({ error: "Destination folder not found" });
        }
      }
      
      // Update data
      const updateData = {
        name,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Only include folderId in update if it's explicitly provided
      if (folderId !== undefined) {
        updateData.folderId = folderId;
      }
      
      // Update file record
      await fileRef.update(updateData);
      
      return res.status(200).json({
        id: fileId,
        name,
        message: "File updated successfully"
      });
    }
    
    // DELETE - Delete a file
    else if (req.method === "DELETE") {
      const { sectionId, fileId } = req.query;
      
      if (!sectionId || !fileId) {
        return res.status(400).json({ error: "Section ID and file ID are required" });
      }
      
      // Check if file exists
      const fileRef = db.collection("users").doc(userId)
                      .collection("sections").doc(sectionId)
                      .collection("files").doc(fileId);
      
      const fileDoc = await fileRef.get();
      if (!fileDoc.exists) {
        return res.status(404).json({ error: "File not found" });
      }
      
      // Delete the file record from Firestore
      await fileRef.delete();
      
      // Note: The file content in Storage would need to be deleted separately
      // This API only deletes the record in Firestore, not the actual file in Storage
      
      return res.status(200).json({
        message: "File record deleted successfully",
        note: "The file in Storage must be deleted separately"
      });
    }
    
    else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error in file API:", error);
    return res.status(500).json({ error: "Server error" });
  }
}