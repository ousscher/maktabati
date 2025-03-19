import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  // GET - Récupérer les sections d'un utilisateur
  if (req.method === "GET") {
    try {
      // Exécuter le middleware d'authentification
      await runMiddleware(req, res, verifyToken);
      
      const userId = req.user.uid;
      
      // Récupérer toutes les sections de l'utilisateur
      const sectionsSnapshot = await db.collection("users").doc(userId).collection("sections").get();
      
      const sections = [];
      sectionsSnapshot.forEach(doc => {
        sections.push({
          id: doc.id,
          ...doc.data() 
        });
      });
      
      return res.status(200).json({ sections });
    } catch (error) {
      // Si une erreur a été renvoyée par le middleware, elle a déjà été gérée
      if (res.statusCode === 401) return;
      
    console.error("Error while retrieving sections:", error);
    return res.status(500).json({ error: "Error while retrieving sections" });
    }
  }
  
  // POST - Créer une nouvelle section
  else if (req.method === "POST") {
    try {
      // Exécuter le middleware d'authentification
      await runMiddleware(req, res, verifyToken);
      
      const userId = req.user.uid;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "The section name is required" });
      }
      
      // Créer la section avec Firebase Admin
      const sectionRef = db.collection("users").doc(userId).collection("sections").doc();
      await sectionRef.set({
        name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
    return res.status(201).json({ 
      id: sectionRef.id, 
      name,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // message: "Section created successfully" 
    });
    } catch (error) {
      // Si une erreur a été renvoyée par le middleware, elle a déjà été gérée
      if (res.statusCode === 401) return;
      
    console.error("Error while creating the section:", error);
    return res.status(500).json({ error: "Error while creating the section" });
    }
  }
  
  // Méthode non autorisée
else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
}