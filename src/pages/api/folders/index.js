import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  try {
    // Execute authentication middleware for all requests
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;

    // GET - Retrieve folders
    if (req.method === "GET") {
      const { sectionId, parentId = null } = req.body;
      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }

      // Query to get folders with specified parentId (or null for root folders)
      const foldersQuery = parentId
        ? db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("folders")
            .where("parentId", "==", parentId)
        : db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("folders")
            .where("parentId", "==", null);

      const foldersSnapshot = await foldersQuery.get();

      const folders = [];
      foldersSnapshot.forEach((doc) => {
        folders.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return res.status(200).json({ folders });
    }

    // POST - Create a new folder
    else if (req.method === "POST") {
      const { sectionId, name, parentId = null } = req.body;

      if (!sectionId || !name) {
        return res
          .status(400)
          .json({ error: "Section ID and folder name are required" });
      }

      // If parentId is provided, verify it exists
      if (parentId) {
        const parentDoc = await db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .doc(sectionId)
          .collection("folders")
          .doc(parentId)
          .get();

        if (!parentDoc.exists) {
          return res.status(404).json({ error: "Parent folder not found" });
        }
      }

      // Create folder
      const folderRef = db
        .collection("users")
        .doc(userId)
        .collection("sections")
        .doc(sectionId)
        .collection("folders")
        .doc();

      await folderRef.set({
        name,
        parentId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(201).json({
        id: folderRef.id,
        name,
        parentId,
        message: "Folder created successfully",
      });
    }

    // PUT - Update a folder
    else if (req.method === "PUT") {
      const { sectionId, folderId, name } = req.body;

      if (!sectionId || !folderId || !name) {
        return res
          .status(400)
          .json({ error: "Section ID, folder ID, and name are required" });
      }

      // Check if folder exists
      const folderRef = db
        .collection("users")
        .doc(userId)
        .collection("sections")
        .doc(sectionId)
        .collection("folders")
        .doc(folderId);

      const folderDoc = await folderRef.get();
      if (!folderDoc.exists) {
        return res.status(404).json({ error: "Folder not found" });
      }

      // Update folder
      await folderRef.update({
        name,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({
        id: folderId,
        name,
        message: "Folder updated successfully",
      });
    }

    // DELETE - Delete a folder
    else if (req.method === "DELETE") {
      const { sectionId, folderId, confirmation } = req.body;
      if (!sectionId || !folderId) {
        return res
          .status(400)
          .json({ error: "Section ID and folder ID are required" });
      }

      const folderRef = db
        .collection("users")
        .doc(userId)
        .collection("sections")
        .doc(sectionId)
        .collection("folders")
        .doc(folderId);

      const folderDoc = await folderRef.get();
      if (!folderDoc.exists) {
        return res.status(404).json({ error: "Folder not found" });
      }

      if (confirmation) {
        // Suppression définitive du dossier et de ses fichiers associés
        const filesQuery = db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .doc(sectionId)
          .collection("files")
          .where("parentId", "==", folderId);

        const filesSnapshot = await filesQuery.get();

        // Supprimer tous les fichiers appartenant au dossier
        const batch = db.batch();
        filesSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Supprimer le dossier lui-même
        batch.delete(folderRef);
        await batch.commit();

        return res.status(200).json({
          message: "Folder and associated files deleted successfully",
        });
      } else {
        // Marquer le dossier comme supprimé (soft delete)
        await folderRef.update({ deleted: true });
        const filesQuery = db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .doc(sectionId)
          .collection("files")
          .where("parentId", "==", folderId);

        const filesSnapshot = await filesQuery.get();

        // Supprimer tous les fichiers appartenant au dossier
        const batch = db.batch();
        filesSnapshot.forEach((doc) => {
          batch.update(doc.ref, { deleted: true });
        });
        await batch.commit();
        return res.status(200).json({
          message: "Folder marked as deleted",
        });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;

    console.error("Error in folder API:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
