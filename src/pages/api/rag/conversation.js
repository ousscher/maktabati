import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    // GET - Fetch conversation history
    if (req.method === "POST") {
      const { sectionId, limit = 50, startAfter = null } = req.body;
      
      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }
      
      // Get conversations for the section
      let conversationsRef = db.collection("users").doc(userId)
                             .collection("sections").doc(sectionId)
                             .collection("conversations")
                             .orderBy("timestamp", "desc")
                             .limit(parseInt(limit));

      // Support pagination with startAfter
      if (startAfter) {
        const startAfterDoc = await db.collection("users").doc(userId)
                                    .collection("sections").doc(sectionId)
                                    .collection("conversations").doc(startAfter).get();
        if (startAfterDoc.exists) {
          conversationsRef = conversationsRef.startAfter(startAfterDoc);
        }
      }
                             
      const conversationsSnapshot = await conversationsRef.get();
      
      const conversations = [];
      conversationsSnapshot.forEach(doc => {
        conversations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return res.status(200).json({ 
        conversations: conversations.reverse(),
        hasMore: conversations.length === parseInt(limit)
      });
    }
    
    
    // DELETE - Delete a conversation or clear all conversations
    else if (req.method === "DELETE") {
      const { sectionId, conversationId } = req.query;
      
      if (!sectionId) {
        return res.status(400).json({ error: "Section ID is required" });
      }
      
      if (conversationId) {
        // Delete a specific conversation
        const conversationRef = db.collection("users").doc(userId)
                              .collection("sections").doc(sectionId)
                              .collection("conversations").doc(conversationId);
                              
        await conversationRef.delete();
        
        return res.status(200).json({
          message: "Conversation deleted successfully"
        });
      } else {
        // Clear all conversations (batch delete)
        const conversationsRef = db.collection("users").doc(userId)
                               .collection("sections").doc(sectionId)
                               .collection("conversations");
                               
        const conversationsSnapshot = await conversationsRef.get();
        
        // Use batched writes for efficiency
        const batch = db.batch();
        conversationsSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        return res.status(200).json({
          message: "All conversations cleared successfully",
          count: conversationsSnapshot.size
        });
      }
    }
    
    else {
      res.setHeader("Allow", ["GET", "DELETE", "PATCH"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error in RAG conversations API:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
}