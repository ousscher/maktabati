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
  const getBreadcrumbName = (id, index) => {
    if (index === 0 && hierarchy) {
      return hierarchy.section.name;
    }

    if (!hierarchy) return id;

    // Find folder name based on ID
    const findFolderName = (folders, targetId) => {
      for (const folder of folders) {
        if (folder.id === targetId) return folder.name;

        const found = findFolderName(folder.folders, targetId);
        if (found) return found;
      }
      return null;
    };

    return findFolderName(hierarchy.section.folders, id) || id;
  };

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const fileModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        firstModalRef.current &&
        !firstModalRef.current.contains(event.target)
      ) {
        setIsFirstModalOpen(false);
      }
      if (
        secondModalRef.current &&
        !secondModalRef.current.contains(event.target)
      ) {
        setIsSecondModalOpen(false);
      }
      if (
        fileModalRef.current &&
        !fileModalRef.current.contains(event.target)
      ) {
        setIsFileModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (!hierarchy && !isLoading) router.push("/mylibrary");

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hierarchy, isLoading, router]);

  // File upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

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
        (f) => f.name.toLowerCase() === file.name.trim().toLowerCase()
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
        parentId:
          currentPath.length > 1 ? currentPath[currentPath.length - 1] : null,
        name: newFolderName,
      });
      await refreshLibrary();
      setIsSecondModalOpen(false);
      setNewFolderName("");
    } catch (error) {
      setCreateFolderError(
        error.response?.data?.message || t("folderCreationFailed")
      );
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
      <div className="p-6 flex max-md:pt-14 w-full ">
        <div
          className={`transition-all duration-500 w-full ${
            showChat ? "max-md:hidden md:w-2/3" : "md:w-full "
          }`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center md:space-x-2">
              <h1
                onClick={() =>
                  currentPath.length > 1
                    ? setCurrentPath(currentPath.slice(0, -1))
                    : router.push("/mylibrary")
                }
                className="max-md:hidden text-sm md:text-2xl cursor-pointer font-medium text-gray-500"
              >
                {t("myLibrary")}
              </h1>
              {currentPath.map((id, index) => (
                <div key={id} className="flex items-center">
                  <span
                    className={`text-sm md:text-2xl font-semibold mr-2 ${
                      index !== currentPath.length - 1 ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      setCurrentPath(currentPath.slice(0, index + 1))
                    }
                  >
                    {getBreadcrumbName(id, index)}
                  </span>
                  <Image
                    src="/images/icons/chevron-down.svg"
                    alt="Dropdown"
                    width={12}
                    height={12}
                  />
                </div>
              ))}
            </div>

            {/* Right Side - Sorting & Actions */}
            <div className="flex items-center md:space-x-4">
              <button
                onClick={() => {
                  setShowChat(!showChat);
                  setFoldersPerPage(8);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Image
                  src="/images/icons/ai-assistant.svg"
                  alt="AI Assistant"
                  width={20}
                  height={20}
                />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 md:text-sm md:py-2 md:px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="name">{t("sortByName")}</option>
                <option value="date">{t("sortByDate")}</option>
              </select>

              <button
                onClick={() => setIsFirstModalOpen(true)}
                className="p-2 relative"
              >
                <Image
                  src="/images/icons/add.svg"
                  alt="Add"
                  width={15}
                  height={15}
                />
              </button>

              {/* Creation Modals */}
              {isFirstModalOpen && (
                <div
                  ref={firstModalRef}
                  className="absolute top-44 right-10 bg-white shadow-lg rounded-md p-4 w-64 border z-50 space-y-2"
                >
                  <button
                    onClick={() => {
                      setIsFirstModalOpen(false);
                      setIsSecondModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100"
                  >
                    <Image
                      src="/images/icons/folder-add.svg"
                      alt="Folder"
                      width={18}
                      height={18}
                    />
                    <span className="text-sm text-gray-700">
                      {t("createNewFolder")}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFirstModalOpen(false);
                      setIsFileModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100"
                  >
                    <Image
                      src="/images/icons/upload.svg"
                      alt="Upload"
                      width={18}
                      height={18}
                    />
                    <span className="text-sm text-gray-700">
                      {t("uploadNewFile")}
                    </span>
                  </button>
                </div>
              )}

              {isSecondModalOpen && (
                <div
                  ref={secondModalRef}
                  className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                >
                  <h3 className="text-lg font-semibold">
                    {t("newFolderTitle")}
                  </h3>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => {
                      setNewFolderName(e.target.value);
                      setFolderExists(
                        currentContent.folders.some(
                          (f) => f.name === e.target.value
                        )
                      );
                      setCreateFolderError(
                        folderExists ? t("folderNameExists") : ""
                      );
                    }}
                    placeholder={t("folderNamePlaceholder")}
                    className="w-full mt-4 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                  />

                  {createFolderError && (
                    <p className="text-red-500 text-sm mt-1">
                      {createFolderError}
                    </p>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => setIsSecondModalOpen(false)}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={createFolder}
                      disabled={folderExists || isCreatingFolder}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                    >
                      {isCreatingFolder ? t("creating") : t("create")}
                    </button>
                  </div>
                </div>
              )}

              {isFileModalOpen && (
                <div
                  ref={fileModalRef}
                  className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                >
                  <h3 className="text-lg font-semibold">{t("uploadFile")}</h3>
                  <p className="text-sm text-gray-500">{t("uploadFileDesc")}</p>

                  <div
                    className={`mt-4 p-4 border-2 border-dashed rounded-md ${
                      isDragging
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Image
                        src="/images/icons/upload.svg"
                        alt="Upload"
                        width={40}
                        height={40}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {t("dragDrop")}{" "}
                        <span className="text-teal-600">{t("browse")}</span>
                      </p>
                    </label>
                  </div>

                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-700 truncate">
                      {selectedFile.name}
                    </p>
                  )}

                  {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => {
                        setIsFileModalOpen(false);
                        setSelectedFile(null);
                        setUploadError("");
                      }}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                      disabled={isUploading}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={uploadFile}
                      disabled={!selectedFile || isUploading || fileExists}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-300"
                    >
                      {isUploading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t("uploading")}
                        </span>
                      ) : (
                        t("upload")
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Grids */}
          <div className="flex flex-col min-h-[600px] w-[100%">
            {/* Info sur le nombre total d'éléments */}
            <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">
              <p>
                {t("totalItems", {
                  folders: hierarchy?.counts.totalFolders || 0,
                  files: hierarchy?.counts.totalFiles || 0,
                })}
              </p>
            </div>

            {/* Section des dossiers */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                {t("folders")}
              </h3>

              {paginatedFolders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16">
                    <Image
                      src="/images/icons/folder-large.svg"
                      alt="No Folders"
                      width={64}
                      height={64}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">
                    {t("noFoldersFound")}
                  </p>
                  <button
                    onClick={() => setIsSecondModalOpen(true)}
                    className="mt-2 sm:mt-3 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                  >
                    {t("createFolder")}
                  </button>
                </div>
              ) : (
                // Grille des dossiers
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    showChat
                      ? "md:grid-cols-3 lg:grid-cols-4"
                      : "md:grid-cols-4 lg:grid-cols-5"
                  } gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 mb-4`}
                >
                  {paginatedFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="relative flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer transition hover:shadow-lg"
                    >
                      {/* Taille d'icône responsive */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24">
                        <Image
                          src="/images/icons/folder-large.svg"
                          alt="Folder"
                          width={100}
                          height={100}
                          className="w-full h-full"
                        />
                      </div>

                      <h2 className="text-sm sm:text-base text-gray-800 font-medium mt-1 sm:mt-2 text-center">
                        {folder.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {folder.files.length} {t("files")}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {folder.folders.length} {t("folders")}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(folder.id);
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 hover:bg-gray-200 rounded-full"
                      >
                        <div className="w-5 h-5">
                          <Image
                            src="/images/icons/threedots.svg"
                            alt="Menu"
                            width={20}
                            height={20}
                            className="w-full h-full"
                          />
                        </div>
                      </button>

                      {showMenu === folder.id && (
                        <div className="absolute top-10 right-3 bg-white shadow-lg rounded-md p-2 border z-50">
                          <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                            <Image
                              src="/images/icons/download.svg"
                              alt="Download"
                              width={16}
                              height={16}
                              className="mr-2"
                            />
                            {t("download")}
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => {
                              setShowDeleteAlert(true);
                              setShowMenu(null);
                            }}
                          >
                            <Image
                              src="/images/icons/trash.svg"
                              alt="Delete"
                              width={16}
                              height={16}
                              className="mr-2"
                            />
                            {t("delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section des fichiers */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                {t("files")}
              </h3>

              {currentContent.files.length === 0 ? (
                // État vide pour les fichiers
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16">
                    <Image
                      src="/images/icons/file.svg"
                      alt="No Files"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="mt-8 sm:mt-4 text-sm sm:text-base text-gray-500 ">
                    {t("noFilesFound")}
                  </p>
                  <button
                    onClick={() => setIsFileModalOpen(true)}
                    className="mt-2 sm:mt-3 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                  >
                    {t("uploadFile")}
                  </button>
                </div>
              ) : (
                // Grille des fichiers
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentContent.files.map((file) => (
                    <div
                      key={file.id}
                      className="relative flex flex-col items-center p-3 sm:p-4 rounded-lg transition hover:shadow-lg"
                    >
                      {/* Taille d'icône réduite sur mobile */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16">
                        <Image
                          src="/images/icons/file.svg"
                          alt="File"
                          width={80}
                          height={80}
                          className="w-full h-full"
                        />
                      </div>
                      <h2 className="text-sm sm:text-base text-gray-800 font-medium mt-1 sm:mt-2 truncate max-w-[90%]">
                        {file.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {file.fileType?.toUpperCase()} •{" "}
                        {formatFileSize(file.fileSize)}
                      </p>

                      <button
                        onClick={() => setShowMenu(file.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full"
                      >
                        <Image
                          src="/images/icons/threedots.svg"
                          alt="Menu"
                          width={20}
                          height={20}
                        />
                      </button>

                      {showMenu === file.id && (
                        <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md p-2 border z-50">
                          <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                            <Image
                              src="/images/icons/download.svg"
                              alt="Download"
                              width={16}
                              height={16}
                              className="mr-2"
                            />
                            {t("download")}
                          </button>
                          <button
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => deleteFile(file.id)}
                          >
                            <Image
                              src="/images/icons/trash.svg"
                              alt="Delete"
                              width={16}
                              height={16}
                              className="mr-2"
                            />
                            {t("delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination toujours en bas */}
            <div className="mt-auto pt-4">
              {(paginatedFolders.length > 0 ||
                currentContent.files.length > 0) && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
        {showChat && <ChatbotSection sectionId={currentPath[0]}/>} 
      </div>
    </ProtectedLayout>
  );
}

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
