import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import fs from "fs";
import axios from "axios";
// import formidable from 'formidable';
import { Readable } from "stream";
import { indexDocument, indexDocumentName} from "@/lib/rag/indexing";
import FormData from "form-data";
const formidable = require("formidable");

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      filename: (name, ext, part) => {
        return `${Date.now()}_${part.originalFilename}`;
      },
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

    // Gestion compatible avec différentes versions de formidable
    const file =
      files.file && Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    const sectionId = fields.sectionId?.[0] || fields.sectionId;
    // Accepter soit folderId soit parentId
    const folderId =
      fields.folderId?.[0] ||
      fields.folderId ||
      fields.parentId?.[0] ||
      fields.parentId ||
      null;

    console.log("Processing upload - Section:", sectionId, "Folder:", folderId);

    if (!sectionId) {
      return res.status(400).json({ error: "Section ID is required" });
    }

    // Vérification du dossier si spécifié
    if (folderId) {
      const folderDoc = await db
        .collection("users")
        .doc(userId)
        .collection("sections")
        .doc(sectionId)
        .collection("folders")
        .doc(folderId)
        .get();

      if (!folderDoc.exists) {
        return res.status(404).json({ error: "Folder not found" });
      }
    }

    // Lecture du fichier temporaire
    const fileData = fs.readFileSync(file.filepath);

    // Envoi à l'API externe
    const formData = new FormData();
    const fileStream = Readable.from(fileData);

    formData.append("upload", fileStream, {
      filename: file.originalFilename || file.newFilename,
      contentType: file.mimetype,
      knownLength: fileData.length,
    });

    // Utiliser axios pour envoyer le fichier à l'API externe
    const response = await axios.post(
      "https://octopus-app-i4ylg.ondigitalocean.app/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          // Ne pas utiliser getLengthSync() qui peut ne pas exister
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    if (!response.data || !response.data.url) {
      throw new Error("Invalid response from upload service");
    }

    const fileUrl = response.data.url;

    // Création du document Firestore
    const fileRef = db
      .collection("users")
      .doc(userId)
      .collection("sections")
      .doc(sectionId)
      .collection("files")
      .doc();

    await fileRef.set({
      name: file.originalFilename || file.newFilename,
      fileUrl: fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      folderId: folderId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });



    // Upserting document content & name to Pinecone
    const vectdb_metadata = {
      userId,
      sectionId,
      fileId : fileRef.id,
      documentId: `doc_${Date.now()}`,
      documentName: file ? file.originalFilename : (fields.title || "Text Document"),
      documentType: file ? file.mimetype : "text/plain",
      indexed: true
    };

    await indexDocument(file.filepath, vectdb_metadata);
    await indexDocumentName(vectdb_metadata.documentName,vectdb_metadata)

    // Nettoyage du fichier temporaire
    fs.unlinkSync(file.filepath);
    return res.status(201).json({
      id: fileRef.id,
      name: file.originalFilename || file.newFilename,
      fileUrl: fileUrl,
      fileType: file.mimetype,
      fileSize: file.size,
      parentId: folderId,
      message: "File uploaded successfully",
    });
  } catch (error) {
    if (res.statusCode === 401) return;

    console.error("Error uploading file:", error);

    // Fournir plus de détails sur l'erreur pour le débogage
    return res.status(500).json({
      error:
        error.response?.data?.message ||
        error.message ||
        "Error uploading file",
      details: error.stack,
    });
  }
}
