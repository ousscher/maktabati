import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import ChatbotSection from "@/components/mylibrary/chatbot";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useLibraryStore } from "@/store/libraryStore";
import API from "@/utils/api-client";

export default function MyFolders() {
  const router = useRouter();
  const {
    hierarchy,
    currentPath,
    setCurrentPath,
    isLoading,
    error,
    getCurrentFolderContent,
    refreshLibrary,
  } = useLibraryStore();
  const t = useTranslations("Library");
  const { switchLocale } = useSwitchLang();
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderExists, setFolderExists] = useState(false);
  const [createFolderError, setCreateFolderError] = useState("");
  const firstModalRef = useRef(null);
  const secondModalRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [foldersPerPage, setFoldersPerPage] = useState(5);
  const [showMenu, setShowMenu] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // File upload states
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const fileModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (firstModalRef.current && !firstModalRef.current.contains(event.target)) {
        setIsFirstModalOpen(false);
      }
      if (secondModalRef.current && !secondModalRef.current.contains(event.target)) {
        setIsSecondModalOpen(false);
      }
      if (fileModalRef.current && !fileModalRef.current.contains(event.target)) {
        setIsFileModalOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    if (!hierarchy && !isLoading) router.push("/mylibrary");
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hierarchy, isLoading, router]);

  // File upload handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) setSelectedFile(files[0]);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isDuplicate = currentContent.files.some(
        f => f.name.toLowerCase() === file.name.trim().toLowerCase()
      );
      setFileExists(isDuplicate);
      setUploadError(isDuplicate ? t("fileNameExists") : "");
      setSelectedFile(isDuplicate ? null : file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || fileExists) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sectionId", currentPath[0]);
      
      if (currentPath.length > 1) {
        formData.append("folderId", currentPath[currentPath.length - 1]);
      }

      await API.post("/files-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshLibrary();
      setIsFileModalOpen(false);
    } catch (error) {
      setUploadError(error.response?.data?.error || t("fileUploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  // Folder creation
  const createFolder = async () => {
    if (!newFolderName.trim() || folderExists) return;

    setIsCreatingFolder(true);
    try {
      await API.post("/folders", {
        sectionId: currentPath[0],
        parentId: currentPath.length > 1 ? currentPath[currentPath.length - 1] : null,
        name: newFolderName,
      });
      await refreshLibrary();
      setIsSecondModalOpen(false);
      setNewFolderName("");
    } catch (error) {
      setCreateFolderError(error.response?.data?.message || t("folderCreationFailed"));
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Responsive design elements from amine
  const currentContent = getCurrentFolderContent();
  const totalPages = Math.ceil(currentContent.folders.length / foldersPerPage);
  const paginatedFolders = currentContent.folders.slice(
    (currentPage - 1) * foldersPerPage,
    currentPage * foldersPerPage
  );

  return (
    <ProtectedLayout>
      <SearchBar />
      <div className="p-6 flex max-md:pt-14">
        <div className={`transition-all duration-500 ${showChat ? "max-md:hidden md:w-2/3" : "md:w-full "}`}>
          
          {/* Header Section */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center md:space-x-2">
              <h1 onClick={() => currentPath.length > 1 ? setCurrentPath(currentPath.slice(0, -1)) : router.push('/mylibrary')}
                className="max-md:hidden text-sm md:text-2xl cursor-pointer font-medium text-gray-500">
                {t("myLibrary")}
              </h1>
              {currentPath.map((id, index) => (
                <div key={id} className="flex items-center">
                  <span className={`text-sm md:text-2xl font-semibold mr-2 ${index !== currentPath.length - 1 ? 'cursor-pointer' : ''}`}
                    onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}>
                    {getBreadcrumbName(id, index)}
                  </span>
                  <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                </div>
              ))}
            </div>

            {/* Right Side - Sorting & Actions */}
            <div className="flex items-center md:space-x-4">
              <button onClick={() => { setShowChat(!showChat); setFoldersPerPage(8); }}
                className="p-2 hover:bg-gray-100 rounded-full">
                <Image src="/images/icons/ai-assistant.svg" alt="AI Assistant" width={20} height={20} />
              </button>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 md:text-sm md:py-2 md:px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="name">{t("sortByName")}</option>
                <option value="date">{t("sortByDate")}</option>
              </select>

              <button onClick={() => setIsFirstModalOpen(true)} className="p-2 relative">
                <Image src="/images/icons/add.svg" alt="Add" width={15} height={15} />
              </button>

              {/* Creation Modals */}
              {isFirstModalOpen && (
                <div ref={firstModalRef} className="absolute top-44 right-10 bg-white shadow-lg rounded-md p-4 w-64 border z-50 space-y-2">
                  <button onClick={() => { setIsFirstModalOpen(false); setIsSecondModalOpen(true); }}
                    className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100">
                    <Image src="/images/icons/folder-add.svg" alt="Folder" width={18} height={18} />
                    <span className="text-sm text-gray-700">{t("createNewFolder")}</span>
                  </button>
                  
                  <label className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100">
                    <Image src="/images/icons/upload.svg" alt="Upload" width={18} height={18} />
                    <span className="text-sm">{t("uploadNewFile")}</span>
                    <input type="file" className="hidden" onChange={handleFileInput} />
                  </label>
                </div>
              )}

              {isSecondModalOpen && (
                <div ref={secondModalRef} className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50">
                  <h3 className="text-lg font-semibold">{t("newFolderTitle")}</h3>
                  <input type="text" value={newFolderName} onChange={(e) => {
                    setNewFolderName(e.target.value);
                    setFolderExists(currentContent.folders.some(f => f.name === e.target.value));
                    setCreateFolderError(folderExists ? t("folderNameExists") : "");
                  }} placeholder={t("folderNamePlaceholder")}
                    className="w-full mt-4 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none" />
                  
                  {createFolderError && <p className="text-red-500 text-sm mt-1">{createFolderError}</p>}

                  <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={() => setIsSecondModalOpen(false)}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100">
                      {t("cancel")}
                    </button>
                    <button onClick={createFolder} disabled={folderExists || isCreatingFolder}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50">
                      {isCreatingFolder ? t("creating") : t("create")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Grids */}
          <div className="mb-6 text-sm text-gray-500">
            <p>{t("totalItems", { folders: hierarchy?.counts.totalFolders, files: hierarchy?.counts.totalFiles })}</p>
          </div>

          <div className={`grid grid-cols-2 ${showChat ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-x-6 gap-y-6 mb-4`}>
            {paginatedFolders.map(folder => (
              <div key={folder.id} className="relative flex flex-col items-center p-4 rounded-lg cursor-pointer transition hover:shadow-lg"
                onClick={() => setCurrentPath([...currentPath, folder.id])}>
                
                <Image src="/images/icons/folder-large.svg" alt="Folder" width={100} height={100} />
                <h2 className="text-gray-800 font-medium mt-2">{folder.name}</h2>
                <p className="text-gray-500 text-sm">{folder.files.length} {t("files")}</p>
                
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(folder.id); }}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full">
                  <Image src="/images/icons/threedots.svg" alt="Menu" width={20} height={20} />
                </button>

                {showMenu === folder.id && (
                  <div className="absolute top-10 right-3 bg-white shadow-lg rounded-md p-2 border z-50">
                    <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                      <Image src="/images/icons/download.svg" alt="Download" width={16} height={16} className="mr-2" />
                      {t("download")}
                    </button>
                    <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                      onClick={() => { setShowDeleteAlert(true); setShowMenu(null); }}>
                      <Image src="/images/icons/trash.svg" alt="Delete" width={16} height={16} className="mr-2" />
                      {t("delete")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Files Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentContent.files.map(file => (
              <div key={file.id} className="relative flex flex-col items-center p-4 rounded-lg transition hover:shadow-lg">
                <Image src="/images/icons/file.svg" alt="File" width={80} height={80} />
                <h2 className="text-gray-800 font-medium mt-2 truncate max-w-full">{file.name}</h2>
                <p className="text-gray-500 text-sm">{file.fileType?.toUpperCase()} • {formatFileSize(file.fileSize)}</p>
                
                <button onClick={() => setShowMenu(file.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full">
                  <Image src="/images/icons/threedots.svg" alt="Menu" width={20} height={20} />
                </button>

                {showMenu === file.id && (
                  <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md p-2 border z-50">
                    <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                      <Image src="/images/icons/download.svg" alt="Download" width={16} height={16} className="mr-2" />
                      {t("download")}
                    </button>
                    <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                      onClick={() => deleteFile(file.id)}>
                      <Image src="/images/icons/trash.svg" alt="Delete" width={16} height={16} className="mr-2" />
                      {t("delete")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination {...{ totalPages, currentPage, setCurrentPage }} />
        </div>
        
        {showChat && <ChatbotSection />}
      </div>
    </ProtectedLayout>
  );
}

// Helper functions
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}


export async function getStaticProps(context) {
  return {
    props: {
      messages: (
        await import(`../../../../public/locales/${context.locale}.json`)
      ).default,
    },
  };
}
