import { create } from "zustand";
import API from "@/utils/api-client";

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

  fetchSectionHierarchy: async (sectionId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await API.get(
        `/section-hierarchy?sectionId=${sectionId}`
      );
      set({
        hierarchy: response.data,
        currentPath: [response.data.section.id],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching section hierarchy:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch section hierarchy",
        isLoading: false,
      });
      return null;
    }
  },

  refreshLibrary: async () => {
    const { currentPath } = get();

    if (!currentPath || currentPath.length === 0) {
      return;
    }

    const sectionId = currentPath[0];

    const pathToRestore = [...currentPath];

    try {
      set({ isLoading: true, error: null });

      const response = await API.get(
        `/section-hierarchy?sectionId=${sectionId}`
      );

      set({
        hierarchy: response.data,
        currentPath: pathToRestore,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Error refreshing library data:", error);
      set({
        error:
          error.response?.data?.message || "Failed to refresh library data",
        isLoading: false,
      });
      return null;
    }
  },

  getCurrentFolderContent: () => {
    const { hierarchy, currentPath } = get();
    if (!hierarchy) return { folders: [], files: [] };

    if (currentPath.length === 1) {
      return {
        folders: hierarchy.section.folders || [],
        files: hierarchy.section.files || [],
      };
    }

    let currentFolder = null;
    let folders = hierarchy.section.folders || [];

    for (let i = 1; i < currentPath.length; i++) {
      const folderId = currentPath[i];
      currentFolder = folders.find((f) => f.id === folderId);

      if (!currentFolder) return { folders: [], files: [] };

      if (i === currentPath.length - 1) {
        return {
          folders: currentFolder.folders || [],
          files: currentFolder.files || [],
        };
      }

      folders = currentFolder.folders || [];
    }

    return { folders: [], files: [] };
  },
}));
