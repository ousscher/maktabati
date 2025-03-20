import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import { processNameSearch } from "@/lib/rag/search";
import { db } from "@/lib/firebaseAdminConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    const { query, sectionId, topK = 2 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    let fileIds;
    fileIds = await processNameSearch(query, topK, sectionId);
    
    // Fetch file details from Firestore using the file IDs
    const filesRef = db.collection("users").doc(userId).collection("sections").doc(sectionId).collection("files");
    const files = [];
    
    for (const fileId of fileIds) {
      const fileDoc = await filesRef.doc(fileId).get();
      if (fileDoc.exists) {
        files.push({ id: fileDoc.id, ...fileDoc.data() });
      }
    }
    
    return res.status(200).json({ files });
    
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error in NL Search query API:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}