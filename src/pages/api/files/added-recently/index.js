import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;

    if (req.method === "GET") {
      try {
        const twoDaysAgo = admin.firestore.Timestamp.fromDate(
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        );

        const sectionsSnapshot = await db
          .collection("users")
          .doc(userId)
          .collection("sections")
          .get();

        let allStarredFiles = [];
        console.log("date", twoDaysAgo);

        for (const sectionDoc of sectionsSnapshot.docs) {
          const sectionId = sectionDoc.id;

          const filesSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("sections")
            .doc(sectionId)
            .collection("files")
            .where("createdAt", ">=", twoDaysAgo)
            .get();

          filesSnapshot.forEach((fileDoc) => {
            allStarredFiles.push({
              id: fileDoc.id,
              sectionId: sectionId,
              ...fileDoc.data(),
            });
          });
        }

        return res.status(200).json({ files: allStarredFiles });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    if (res.statusCode === 401) return;

    console.error("Error in file API:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
