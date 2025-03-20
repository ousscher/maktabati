import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;

    if (req.method === "GET") {
      try {
        const sectionsSnapshot = await db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .get();

        let allDeletedFiles = [];

        for (const sectionDoc of sectionsSnapshot.docs) {
          const sectionId = sectionDoc.id;

          const filesSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("files")
            .where("deleted", "==", true)
            .get();

          filesSnapshot.forEach((fileDoc) => {
            allDeletedFiles.push({
              id: fileDoc.id,
              sectionId: sectionId, 
              ...fileDoc.data(),
            });
          });
        }
        return res.status(200).json({ files: allDeletedFiles});
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    if (req.method === "POST") {
      try {
        const { fileId, sectionId, parentId = null} = req.body;

        if (!fileId || !sectionId) {
          return res.status(400).json({ error: "fileId and sectionId are required" });
        }

        const fileRef = db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .doc(sectionId)
          .collection("files")
          .doc(fileId);
        
        let currentParentId = parentId;

        while (currentParentId) {
          const parentRef = db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("folders")
            .doc(currentParentId);

          const parentDoc = await parentRef.get();

          if (!parentDoc.exists) {
            break; 
          }
          await parentRef.update({ deleted: false });
          currentParentId = parentDoc.data().parentId; 
        }

        const fileDoc = await fileRef.get();

        if (!fileDoc.exists) {
          return res.status(404).json({ error: "File not found" });
        }

        await fileRef.update({ deleted: false });

        return res.status(200).json({ message: "File restored successfully" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }


  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;

    console.error("Error in file API:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
