import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken } from "@/lib/authMiddleware";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware function for Next.js API Routes
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Parse form data with formidable
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  // Only handle POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  
  try {
    // Execute authentication middleware
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    // Parse the form data
    const { fields, files } = await parseForm(req);
    const file = files.file;
    const sectionId = fields.sectionId;
    const folderId = fields.folderId || null;
    
    if (!file || !sectionId) {
      return res.status(400).json({ error: "File and section ID are required" });
    }
    
    // If folderId is provided, verify it exists
    if (folderId) {
      const folderDoc = await db.collection("users").doc(userId)
                             .collection("sections").doc(sectionId)
                             .collection("folders").doc(folderId).get();
      
      if (!folderDoc.exists) {
        return res.status(404).json({ error: "Folder not found" });
      }
    }
    
    // Create a storage reference
    const bucket = admin.storage().bucket();
    const fileName = `users/${userId}/sections/${sectionId}/${Date.now()}_${file.name}`;
    const fileBuffer = fs.readFileSync(file.path);
    
    // Upload the file to Firebase Storage
    const fileUpload = bucket.file(fileName);
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type
      }
    });
    
    // Get the public URL
    await fileUpload.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    // Create file record in Firestore
    const fileRef = db.collection("users").doc(userId)
                    .collection("sections").doc(sectionId)
                    .collection("files").doc();
    
    await fileRef.set({
      name: file.name,
      fileUrl: fileUrl,
      fileType: file.type,
      fileSize: file.size,
      folderId: folderId,
      storagePath: fileName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(201).json({
      id: fileRef.id,
      name: file.name,
      fileUrl: fileUrl,
      fileType: file.type,
      fileSize: file.size,
      folderId: folderId,
      message: "File uploaded successfully"
    });
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Error uploading file" });
  }
}