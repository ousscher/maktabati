import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import { processQuery, processDirectQuery } from "@/lib/rag/query";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    const { query, sectionId, useRAG = true, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    let result;
    
    // Process the query with or without RAG
    if (useRAG && sectionId) {
      // Use RAG with document retrieval
      result = await processQuery(query, topK);
    } else {
      // Direct query without document retrieval
      result = await processDirectQuery(query);
    }
    
    // Save the conversation to Firestore if sectionId is provided
    if (sectionId) {
      const chatRef = db.collection("users").doc(userId)
                     .collection("sections").doc(sectionId)
                     .collection("conversations").doc();
                     
      await chatRef.set({
        query,
        response: result.response,
        sources: result.sources,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error in RAG query API:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}