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

        let allStarredFiles = [];
        console.log("allStarredFiles", allStarredFiles);

        for (const sectionDoc of sectionsSnapshot.docs) {
          const sectionId = sectionDoc.id;

          const filesSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("files")
            .where("favorite", "==", true)
            .get();

          filesSnapshot.forEach((fileDoc) => {
            allStarredFiles.push({
              id: fileDoc.id,
              sectionId: sectionId, 
              ...fileDoc.data(),
            });
          });
        }
        return res.status(200).json({ files: allStarredFiles});
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
