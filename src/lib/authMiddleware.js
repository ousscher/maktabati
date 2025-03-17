import { admin, db } from "@/lib/firebaseAdminConfig";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      return next();
    } else {
      return res.status(401).json({ error: "Token manquant" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}