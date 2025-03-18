// store/libraryStore.js
import { create } from 'zustand';

export const useLibraryStore = create((set, get) => ({
  sections: [],
  currentSection: null,
  hierarchy: null,
  currentPath: [],
  isLoading: false,
  error: null,
  
  setSections: (sections) => set({ sections }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setHierarchy: (hierarchy) => set({ hierarchy }),
  setCurrentPath: (path) => set({ currentPath: path }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  getCurrentFolderContent: () => {
    const { hierarchy, currentPath } = get();
    
    if (!hierarchy) return null;
    
    // If we're at the root level of the section
    if (currentPath.length === 1 && currentPath[0] === hierarchy.section.id) {
      return {
        folders: hierarchy.section.folders,
        files: hierarchy.section.files
      };
    }
    
    // If we're in a subfolder
    if (currentPath.length > 1) {
      let current = null;
      let folders = hierarchy.section.folders;
      
      // Navigate to the current folder based on path
      for (let i = 1; i < currentPath.length; i++) {
        const folderId = currentPath[i];
        current = folders.find(f => f.id === folderId) || null;
        if (!current) return null;
        folders = current.folders;
      }
      
      if (current) {
        return {
          folders: current.folders,
          files: current.files
        };
      }
    }
    
    return null;
  }
}));