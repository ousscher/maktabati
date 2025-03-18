import { admin,db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import fs from "fs";
import axios from "axios";

const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      keepExtensions: true, // Conserve les fichiers temporaires
      filename: (name, ext, part) => {
        return `${Date.now()}_${part.originalFilename}`;
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;

    const { fields, files } = await parseForm(req);
    const file = files.file[0]; // Accès au premier fichier dans le tableau
    const sectionId = fields.sectionId;
    const folderId = fields.folderId || null;

    if (!file || !sectionId) {
      return res.status(400).json({ error: "File and section ID are required" });
    }

    // Vérification du dossier si spécifié
    if (folderId) {
      const folderDoc = await db.collection("users").doc(userId)
                               .collection("sections").doc(sectionId)
                               .collection("folders").doc(folderId).get();
      
      if (!folderDoc.exists) {
        return res.status(404).json({ error: "Folder not found" });
      }
    }

    // Lecture du fichier temporaire
    const fileData = fs.readFileSync(file.filepath);

    // Envoi à l'API externe
    const formData = new FormData();
    formData.append('upload', fileData, {
      filename: file.originalFilename,
      contentType: file.mimetype
    });

    const response = await axios.post(
      'https://octopus-app-i4yg.ondigitalocean.app/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...formData.getHeaders()
        }
      }
    );

    const fileUrl = response.data.url;

    // Création du document Firestore
    const fileRef = db.collection("users").doc(userId)
                    .collection("sections").doc(sectionId)
                    .collection("files").doc();

    await fileRef.set({
      name: file.originalFilename,
      fileUrl: fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      folderId: folderId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Utilisation correcte de admin
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Nettoyage du fichier temporaire
    fs.unlinkSync(file.filepath);

    return res.status(201).json({
      id: fileRef.id,
      name: file.originalFilename,
      fileUrl: fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      folderId: folderId,
      message: "File uploaded successfully"
    });
  } catch (error) {
    if (res.statusCode === 401) return;

    console.error("Error uploading file:", error);
    return res.status(500).json({ 
      error: error.response?.data?.message || error.message || "Error uploading file" 
    });
  }
}