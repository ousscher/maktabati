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
    
    const { query, sectionId, useRAG = true, topK = 5, historyLimit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    
    let result;
    let conversationHistory = [];
    
    // Fetch conversation history if sectionId is provided
    if (sectionId) {
      const historySnapshot = await db.collection("users").doc(userId)
                             .collection("sections").doc(sectionId)
                             .collection("conversations")
                             .orderBy("timestamp", "desc")
                             .limit(historyLimit)
                             .get();
      
      // Format conversation history
      historySnapshot.forEach(doc => {
        const data = doc.data();
        conversationHistory.push({
          role: "user", 
          content: data.query
        });
        conversationHistory.push({
          role: "assistant", 
          content: data.response,
          sources: data.sources || []
        });
      });
      
      // Reverse to get chronological order
      conversationHistory = conversationHistory.reverse();
    }
    
    // Process the query with or without RAG
    if (useRAG && sectionId) {
      // Use RAG with document retrieval and conversation history
      result = await processQuery(query, topK, conversationHistory);
    } else {
      // Direct query with conversation history
      result = await processDirectQuery(query, conversationHistory);
    }
    
    // Save the conversation to Firestore if sectionId is provided
    if (sectionId) {
      const chatRef = db.collection("users").doc(userId)
                     .collection("sections").doc(sectionId)
                     .collection("conversations").doc();
                     
      await chatRef.set({
        query,
        response: result.response,
        sources: result.sources || [],
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