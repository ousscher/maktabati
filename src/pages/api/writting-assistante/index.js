import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";
import fs from "fs";
import axios from "axios";
// import formidable from 'formidable';
import { Readable } from "stream";
import { indexDocument, indexDocumentName} from "@/lib/rag/indexing";
import FormData from "form-data";
import { processAsistanceQuery } from "@/lib/rag/wrtittingAssistant";
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
        multiples: true, // Enable multiple file uploads
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
    console.log(files);
    const uploadedFiles = [];

    const limitedFiles = files.files.slice(0, 3);
    uploadedFiles.push(...limitedFiles);
    
    if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: "At least one file is required" });
    }
    const query = fields.query?.[0] || fields.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const filesPath = uploadedFiles.map(file => file.filepath);
    uploadedFiles.map(file => fs.readFileSync(file.filepath));
    const assistedText = await processAsistanceQuery(filesPath, query);
    for (const file of uploadedFiles) {
        fs.unlink(file.filepath, (err) => {
          if (err) console.error(`Error deleting temporary file ${file.filepath}: ${err}`);
        });
      }      

    return res.status(200).json({
        'assistedText' : assistedText
    });

  } catch (error) {
    if (res.statusCode === 401) return;

    console.error("Error uploading file:", error);

    return res.status(500).json({
      error:
        error.response?.data?.message ||
        error.message ||
        "Error uploading file",
      details: error.stack,
    });
  }
}
