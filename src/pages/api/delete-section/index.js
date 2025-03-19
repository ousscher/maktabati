import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await runMiddleware(req, res, verifyToken);
      const userId = req.user.uid;
      const { sectionId } = req.body; 

      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }

      const sectionRef = db.collection("users").doc(userId).collection("sections").doc(sectionId);

      const deleteBatch = db.batch();

      const foldersRef = sectionRef.collection("folders");
      const foldersSnapshot = await foldersRef.get();

      foldersSnapshot.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });

      const filesRef = sectionRef.collection("files");
      const filesSnapshot = await filesRef.get();

      filesSnapshot.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });

      deleteBatch.delete(sectionRef);

      await deleteBatch.commit();

      return res.status(200).json({ message: "Section and its contents deleted successfully" });
    } catch (error) {
      console.error("Error while deleting section:", error);
      return res.status(500).json({ error: "Error while deleting section" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
