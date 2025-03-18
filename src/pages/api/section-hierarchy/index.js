import { admin, db } from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";


export default async function handler(req, res) {
  // Only handle GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
  
  try {
    // Execute authentication middleware
    await runMiddleware(req, res, verifyToken);
    const userId = req.user.uid;
    
    // const { sectionId } = req.body;
    const { sectionId } = req.query;
    console.log("sectionId", sectionId);
    
    if (!sectionId) {
      return res.status(400).json({ error: "Section ID is required" });
    }
    
    // Check if section exists
    const sectionRef = db.collection("users").doc(userId).collection("sections").doc(sectionId);
    const sectionDoc = await sectionRef.get();
    
    if (!sectionDoc.exists) {
      return res.status(404).json({ error: "Section not found" });
    }
    
    // Get all folders for this section
    const foldersSnapshot = await sectionRef.collection("folders").get();
    const folders = {};
    
    foldersSnapshot.forEach(doc => {
      folders[doc.id] = {
        id: doc.id,
        ...doc.data(),
        folders: [],
        files: []
      };
    });
    
    // Get all files for this section
    const filesSnapshot = await sectionRef.collection("files").get();
    const files = [];
    
    filesSnapshot.forEach(doc => {
      files.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Build the folder hierarchy
    const rootFolders = [];
    
    // First, organize folders into their parent relationships
    Object.values(folders).forEach(folder => {
      if (!folder.parentId) {
        rootFolders.push(folder);
      } else if (folders[folder.parentId]) {
        folders[folder.parentId].folders.push(folder);
      } else {
        // If parent doesn't exist, treat as root
        folder.parentId = null;
        rootFolders.push(folder);
      }
    });
    
    // Then, assign files to their folders
    files.forEach(file => {
      if (!file.folderId) {
        // Root level files
        file.path = [sectionId];
      } else if (folders[file.folderId]) {
        folders[file.folderId].files.push(file);
        
        // Calculate file path
        let currentFolder = folders[file.folderId];
        file.path = [currentFolder.id];
        
        while (currentFolder.parentId) {
          file.path.unshift(currentFolder.parentId);
          currentFolder = folders[currentFolder.parentId];
        }
        
        file.path.unshift(sectionId);
      }
    });
    
    // Create the final hierarchy
    const rootFiles = files.filter(file => !file.folderId);
    
    // Sort folders and files by name
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    
    rootFolders.sort(sortByName);
    rootFiles.sort(sortByName);
    
    // Sort all nested folders and files
    const sortFolderContents = (folder) => {
      folder.folders.sort(sortByName);
      folder.files.sort(sortByName);
      
      folder.folders.forEach(subFolder => {
        sortFolderContents(subFolder);
      });
      
      return folder;
    };
    
    rootFolders.forEach(folder => {
      sortFolderContents(folder);
    });
    
    // Calculate folder paths
    const calculateFolderPath = (folder, parentPath = [sectionId]) => {
      folder.path = [...parentPath, folder.id];
      
      folder.folders.forEach(subFolder => {
        calculateFolderPath(subFolder, folder.path);
      });
      
      return folder;
    };
    
    rootFolders.forEach(folder => {
      calculateFolderPath(folder);
    });
    
    // Create section details for response
    const sectionData = {
      id: sectionId,
      ...sectionDoc.data(),
      folders: rootFolders,
      files: rootFiles
    };
    
    // Optional: Calculate total counts
    const totalCounts = calculateCounts(sectionData);
    
    return res.status(200).json({
      section: sectionData,
      counts: totalCounts
    });
  } catch (error) {
    // If an error was returned by the middleware, it has already been handled
    if (res.statusCode === 401) return;
    
    console.error("Error retrieving section hierarchy:", error);
    return res.status(500).json({ error: "Error retrieving section hierarchy" });
  }
}

// Helper function to calculate counts
function calculateCounts(section) {
  let folderCount = section.folders.length;
  let fileCount = section.files.length;
  
  // Recursive function to count items in nested folders
  function countNestedItems(folder) {
    folderCount += folder.folders.length;
    fileCount += folder.files.length;
    
    folder.folders.forEach(subFolder => {
      countNestedItems(subFolder);
    });
  }
  
  section.folders.forEach(folder => {
    countNestedItems(folder);
  });
  
  return {
    totalFolders: folderCount,
    totalFiles: fileCount
  };
}