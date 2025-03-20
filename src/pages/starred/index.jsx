import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ChatbotSection from "@/components/mylibrary/chatbot";
import API from "@/utils/api-client";
import ConfirmationModal from "@/components/myfolders/confirmation";

export default function Starred() {
  const t = useTranslations("Library");
  const tr = useTranslations("Sidebar");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [foldersPerPage, setFoldersPerPage] = useState(5);
  const [newFolderName, setNewFolderName] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);
  

  useEffect(() => {
    async function fetchStarredFiles() {
      setIsLoading(true);
      try {
        const response = await API.get("/files/starred-files");
        setFiles(response.data.files);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStarredFiles();
  }, []);

  // Files inside the folder
  const [files, setFiles] = useState([]);

  // Pagination Logic
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = files.slice(startIndex, endIndex);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true); // Show loading popup

      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false); // Hide loading popup after upload
      }, 3000);
    }
  };
  return (
    <ProtectedLayout>
      {/* Search Bar */}
      <SearchBar />
      <div className="p-6 flex max-md:pt-14">
        <div
          className={`transition-all duration-500 ${
            showChat ? "w-2/3" : "w-full"
          }`}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center py-4">
            {/* Left Side - Title Navigation */}
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-2xl font-medium">
                {tr("starred")}
              </h1>
              <Image
                src="/images/icons/chevron-down.svg"
                alt="Dropdown"
                width={12}
                height={12}
              />
            </div>

            {/* Right Side - Sorting & View Options */}
            <div className="flex items-center md:space-x-4">
              {/* Grid View Button */}
              <button className="p-2">
                <Image
                  src="/images/icons/grid.svg"
                  alt="Grid View"
                  className="max-md:w-4"
                  width={20}
                  height={20}
                />
              </button>

              {/* Sorting Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 md:text-sm md:py-2 md:px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="name">{t("sortByName")}</option>
                <option value="date">{t("sortByDate")}</option>
              </select>
              {/* Delete Confirmation Modal */}
              {isDeleteConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center  z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold">
                      {t("deleteConfirmationTitle")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                      {t("deleteConfirmationMessage")}
                    </p>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteConfirmOpen(false);
                          // Add your delete function here
                          console.log("Folder deleted!");
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        {t("continue")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="fixed bottom-5 right-5 bg- text-black px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
                  <Image
                    src="/images/icons/loading.svg"
                    alt="Loading"
                    width={16}
                    height={16}
                    className="animate-spin"
                  />
                  <span className="text-sm">{t("uploadingFile")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Files Grid */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
              {t("files")}
            </h3>

            {paginatedFiles.length === 0 ? (
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
                <p className="mt-16 sm:mt-8 text-sm sm:text-base text-gray-500 ">
                  {t("noStarredFound")}
                </p>
              </div>
            ) : (
              // Grille des fichiers
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedFiles.map((file) => (
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

                    {/* Bouton favori/étoile */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        // Si le fichier est déjà un favori et que l'utilisateur veut le retirer
                        if (file.favorite) {
                          setFileToRemove(file); // Stocker le fichier à retirer
                          setIsConfirmModalOpen(true); // Ouvrir le modal de confirmation
                        } else {
                          // Si l'utilisateur veut ajouter aux favoris, on le fait directement sans confirmation
                          try {
                            const data = {
                              ...file,
                              favorite: true,
                            };
                            console.log(data);
                            const sectionId = data.sectionId;
                            if (data.sectionId) {
                              delete data.sectionId;
                            }
                            const response = await API.put("/files", {
                              file: data,
                              sectionId: sectionId,
                            });
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                      className="absolute top-2 left-2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <Image
                        src={
                          file.favorite
                            ? "/images/icons/star-filled.svg"
                            : "/images/icons/star.svg"
                        }
                        alt={
                          file.favorite
                            ? "Remove from shortcuts"
                            : "Add to shortcuts"
                        }
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={async () => {
              try {
                if (fileToRemove) {
                  const data = {
                    ...fileToRemove,
                    favorite: false,
                  };
                  console.log(data);
                  const sectionId = data.sectionId;
                  if (data.sectionId) {
                    delete data.sectionId;
                  }
                  const response = await API.put("/files", {
                    file: data,
                    sectionId: sectionId,
                  });
                  setFiles((prevFiles) =>
                    prevFiles.filter((file) => file.id !== fileToRemove.id)
                  );
                }
                setIsConfirmModalOpen(false);
              } catch (e) {
                console.error(e);
                setIsConfirmModalOpen(false);
              }
            }}
            message={tr("removeFavorisConfirmation", { name: fileToRemove?.name })}
          />

          {/* Pagination Component */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
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
      messages: (await import(`../../../public/locales/${context.locale}.json`))
        .default,
    },
  };
}
