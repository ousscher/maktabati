import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  await runMiddleware(req, res, verifyToken);
  const userId = req.user.uid;
  switch (req.method) {
    case "GET":
      try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const userData = userDoc.data();
        return res.status(200).json(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }

    case "PUT":
      try {
        const updatedData = req.body;
        await db.collection("users").doc(userId).update(updatedData);
        return res.status(200).json(updatedData);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return res.status(500).json({ message: "Erreur serveur" });
      }

    default:
      return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
