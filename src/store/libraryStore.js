import { create } from 'zustand';
import API from '@/utils/api-client';

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
  
  // Fonction pour récupérer les données d'une section et sa hiérarchie
  fetchSectionHierarchy: async (sectionId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await API.get(`/section-hierarchy?sectionId=${sectionId}`);
      set({ 
        hierarchy: response.data,
        currentPath: [response.data.section.id],
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching section hierarchy:", error);
      set({ 
        error: error.response?.data?.message || "Failed to fetch section hierarchy", 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Fonction pour rafraîchir les données de la bibliothèque
  refreshLibrary: async () => {
    const { currentPath } = get();
    
    // Si nous n'avons pas de chemin actuel, il n'y a rien à rafraîchir
    if (!currentPath || currentPath.length === 0) {
      return;
    }
    
    // Récupérer l'ID de la section (premier élément du chemin)
    const sectionId = currentPath[0];
    
    // Mémoriser le chemin actuel
    const pathToRestore = [...currentPath];
    
    try {
      set({ isLoading: true, error: null });
      
      // Récupérer à nouveau les données de la hiérarchie de la section
      const response = await API.get(`/section-hierarchy?sectionId=${sectionId}`);
      
      // Mettre à jour le state avec les nouvelles données
      set({ 
        hierarchy: response.data,
        // Restaurer le chemin
        currentPath: pathToRestore,
        isLoading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error("Error refreshing library data:", error);
      set({ 
        error: error.response?.data?.message || "Failed to refresh library data", 
        isLoading: false 
      });
      return null;
    }
  },
  
  getCurrentFolderContent: () => {
    const { hierarchy, currentPath } = get();
    
    if (!hierarchy) return null;
    
    // Si nous sommes au niveau racine de la section
    if (currentPath.length === 1 && currentPath[0] === hierarchy.section.id) {
      return {
        folders: hierarchy.section.folders,
        files: hierarchy.section.files
      };
    }
    
    // Si nous sommes dans un sous-dossier
    if (currentPath.length > 1) {
      let current = null;
      let folders = hierarchy.section.folders;
      
      // Naviguer vers le dossier actuel en suivant le chemin
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