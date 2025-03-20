import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import API from "@/utils/api-client";
import ConfirmationModal from "@/components/myfolders/confirmation";
import { toast } from "react-toastify";

export default function Recent() {
  const t = useTranslations("Library");
  const tr = useTranslations("Sidebar");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const firstModalRef = useRef(null);
  const secondModalRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showMenu, setShowMenu] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    function handleClickOutside(event) {
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
    }
    async function fetchRecentlyFiles() {
      setIsLoading(true);
      try {
        const response = await API.get("/files/added-recently");
        setFiles(response.data.files);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentlyFiles();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteFile = async (fileId, sectionId) => {
    try {
      const data = {
        sectionId: sectionId,
        fileId: fileId,
        confirmation: false,
      };
      await API.delete(`/files`, {
        data,
      });
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
      toast.success(t("fileDeleted"));
    } catch (error) {
      // console.error(error);
    } finally {
      setShowMenu(null);
      setShowDeleteAlert(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = files.slice(startIndex, endIndex);

  const [isUploading, setIsUploading] = useState(false);
  return (
    <ProtectedLayout>
      {/* Search Bar */}
      <SearchBar />
      <div className="p-6 flex max-md:pt-14">
        <div className={`transition-all duration-500 w-full`}>
          {/* Header Section */}
          <div className="flex justify-between items-center py-4">
            {/* Left Side - Title Navigation */}
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-2xl font-medium">
                {tr("addedRecently")}
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
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
              {t("files")}
            </h3>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">{t("loading")}</p>
              </div>
            ) : paginatedFiles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16">
                  <Image
                    src="/images/icons/file.svg"
                    alt="No Files"
                    width={64}
                    height={64}
                  />
                </div>
                <p className="mt-16 sm:mt-8 text-sm sm:text-base text-gray-500">
                  {t("noFilesFound")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paginatedFiles.map((file) => (
                  <div
                    key={file.id}
                    onDoubleClick={() => window.open(file.fileUrl, "_blank")}
                    className="relative cursor-pointer flex flex-col items-center p-3 sm:p-4 rounded-lg transition hover:shadow-lg"
                  >
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

                    {/* Bouton favori */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const data = { ...file, favorite: !file.favorite };
                          await API.put("/files", {
                            file: data,
                            sectionId: file.sectionId,
                          });
                          setFiles((prevFiles) =>
                            prevFiles.map((f) =>
                              f.id === file.id
                                ? { ...f, favorite: !f.favorite }
                                : f
                            )
                          );
                        } catch (e) {
                          console.error(e);
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

                    {/* Bouton menu */}
                    <button
                      onClick={() => {
                        const menu = {
                          id: file.id,
                          type: "file",
                          display: true,
                          sectionId: file.sectionId,
                        };
                        setShowMenu(showMenu?.id === file.id ? null : menu);
                      }}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <Image
                        src="/images/icons/threedots.svg"
                        alt="Menu"
                        width={20}
                        height={20}
                      />
                    </button>

                    {/* Menu déroulant */}
                    {showMenu?.display && showMenu?.id === file.id && (
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteAlert(true);
                            setShowMenu({ ...showMenu, display: false });
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

          <ConfirmationModal
            isOpen={showDeleteAlert}
            onClose={() => setShowDeleteAlert(false)}
            onConfirm={() => {
              if (showMenu?.type === "folder") {
                // deleteFolder(showMenu.id);
              } else {
                deleteFile(showMenu.id, showMenu.sectionId);
              }
            }}
            message={
              showMenu?.type === "folder"
                ? t("confirmDeleteFolder")
                : t("confirmDeleteFile")
            }
          />
          {!isLoading && files.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
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
