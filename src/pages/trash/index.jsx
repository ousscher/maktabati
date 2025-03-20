import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ChatbotSection from "@/components/mylibrary/chatbot";
import ConfirmationModal from "@/components/myfolders/confirmation";
import API from "@/utils/api-client";

export default function Trash() {
  const t = useTranslations("Library");
  const tr = useTranslations("Sidebar");
  const { switchLocale } = useSwitchLang();
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { folderName } = router.query;
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const firstModalRef = useRef(null);
  const [showChat, setShowChat] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showMenu, setShowMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
    type: "", // "restore" or "delete"
  });

  // Fetch trash files on component mount
  useEffect(() => {
    fetchTrashFiles();
  }, []);

  // Fetch trash files from API
  const fetchTrashFiles = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/files/trash");
      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching trash files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore file function
  const restoreFile = async (fileToRestore) => {
    try {
      const response = await API.post("/files/trash", {
        fileId: fileToRestore.id,
        sectionId: fileToRestore.sectionId,
        parentId: fileToRestore?.parentId ?? null,
      });
      setFiles(files.filter((file) => file.id !== fileToRestore.id));
    } catch (error) {
      console.error("Error restoring file:", error);
    }
  };

  // Delete file function
  const deleteFile = async (fileToDelete) => {
    try {
      const data = {
        fileId: fileToDelete.id,
        sectionId: fileToDelete.sectionId,
        confirmation: true,
      };
      await API.delete(`/files`, {
        data,
      });

      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Restore all files function
  const restoreAllFiles = async () => {
    try {
      const response = await fetch("/api/files/restore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restoreAll: true }),
      });

      if (response.ok) {
        // Clear the files list after successful restoration
        setFiles([]);
        setIsFirstModalOpen(false);
      } else {
        console.error("Failed to restore all files");
      }
    } catch (error) {
      console.error("Error restoring all files:", error);
    }
  };

  // Delete all files function
  const deleteAllFiles = async () => {
    try {
      const response = await fetch("/api/trash", {
        method: "DELETE",
      });

      if (response.ok) {
        // Clear the files list after successful deletion
        setFiles([]);
        setConfirmModal({ ...confirmModal, isOpen: false });
      } else {
        console.error("Failed to delete all files");
      }
    } catch (error) {
      console.error("Error deleting all files:", error);
    }
  };

  // Handle file action (restore or delete)
  const handleFileAction = (fileId, action) => {
    setShowMenu(null);
    if (action === "restore") {
      setConfirmModal({
        isOpen: true,
        message: t("restoreConfirmationMessage"),
        onConfirm: () => {
          const fileToRestore = files.find((file) => file.id === fileId);
          restoreFile(fileToRestore);
          setConfirmModal({ ...confirmModal, isOpen: false });
        },
        type: "restore",
      });
    } else if (action === "delete") {
      setConfirmModal({
        isOpen: true,
        message: t("deleteConfirmationMessage"),
        onConfirm: () => {
          const fileToDelete = files.find((file) => file.id === fileId);
          deleteFile(fileToDelete);
          setConfirmModal({ ...confirmModal, isOpen: false });
        },
        type: "delete",
      });
    }
  };

  // Handle outside clicks to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        firstModalRef.current &&
        !firstModalRef.current.contains(event.target)
      ) {
        setIsFirstModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = files.slice(startIndex, endIndex);

  return (
    <ProtectedLayout>
      <SearchBar />
      <div className="p-6 flex max-md:pt-14">
        <div className="transition-all duration-500 w-full">
          {/* Header Section */}
          <div className="flex justify-between items-center py-4">
            {/* Left Side - Title Navigation */}
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-2xl font-medium">{tr("trash")}</h1>
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
              <button
                className="p-2 relative"
                onClick={() => setIsFirstModalOpen(true)}
              >
                <Image
                  src="/images/icons/add.svg"
                  alt="Grid View"
                  width={15}
                  height={15}
                />
              </button>
              {/* First Modal - "Actions for All Files" */}
              {isFirstModalOpen && (
                <div
                  ref={firstModalRef}
                  className="absolute top-44 right-10 bg-white shadow-lg rounded-md p-2 border z-50"
                >
                  {/* Restore All */}
                  <button
                    onClick={() => {
                      setIsFirstModalOpen(false);
                      setConfirmModal({
                        isOpen: true,
                        message: t("restoreAllConfirmationMessage"),
                        onConfirm: () => {
                          restoreAllFiles();
                          setConfirmModal({ ...confirmModal, isOpen: false });
                        },
                        type: "restore",
                      });
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition"
                  >
                    <Image
                      src="/images/icons/download.svg"
                      alt="Download Icon"
                      width={18}
                      height={18}
                    />
                    <span className="text-sm">{t("restoreAllFiles")}</span>
                  </button>

                  {/* Delete All Files */}
                  <button
                    onClick={() => {
                      setIsFirstModalOpen(false);
                      setConfirmModal({
                        isOpen: true,
                        message: t("deleteAllConfirmationMessage"),
                        onConfirm: () => {
                          deleteAllFiles();
                        },
                        type: "delete",
                      });
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-100 rounded-md transition"
                  >
                    <Image
                      src="/images/icons/trash.svg"
                      alt="Delete Icon"
                      width={18}
                      height={18}
                    />
                    <span className="text-sm">{t("deleteAllFiles")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Image
                src="/images/icons/loading.svg"
                alt="Loading"
                width={32}
                height={32}
                className="animate-spin"
              />
            </div>
          ) : (
            <>
              {/* Empty State */}
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Image
                    src="/images/icons/trash.svg"
                    alt="Empty Trash"
                    width={80}
                    height={80}
                  />
                  <p className="text-gray-500 mt-4">{t("emptyTrash")}</p>
                </div>
              ) : (
                <>
                  {/* Files Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-8 mb-4">
                    {paginatedFiles.map((file, index) => (
                      <div
                        key={file.id}
                        onDoubleClick={() =>
                          window.open(file.fileUrl, "_blank")
                        }
                        className="relative cursor-pointer flex flex-col items-center p-3 sm:p-4 rounded-lg transition hover:shadow-lg"
                      >
                        <Image
                          src={file.icon || "/images/icons/file.svg"}
                          alt={t("fileIconAlt")}
                          width={80}
                          height={80}
                        />
                        <h2 className="text-gray-800 font-medium mt-2">
                          {file.name}
                        </h2>
                        <p className="text-gray-500 text-sm">{file.size}</p>

                        {/* Three dots button */}
                        <button
                          className="absolute top-2 right-2 p-1 text-gray-500 hover:bg-gray-200 rounded-full"
                          onClick={() =>
                            setShowMenu(showMenu === index ? null : index)
                          }
                        >
                          <Image
                            src="/images/icons/threedots.svg"
                            alt={t("moreOptions")}
                            width={20}
                            height={20}
                          />
                        </button>

                        {/* File options pop-up */}
                        {showMenu === index && (
                          <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md p-2 border z-50">
                            <button
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                              onClick={() =>
                                handleFileAction(file.id, "restore")
                              }
                            >
                              <Image
                                src="/images/icons/download.svg"
                                alt={t("restore")}
                                width={16}
                                height={16}
                                className="mr-2"
                              />
                              {t("restoreFile")}
                            </button>
                            <button
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                              onClick={() =>
                                handleFileAction(file.id, "delete")
                              }
                            >
                              <Image
                                src="/images/icons/trash.svg"
                                alt={t("delete")}
                                width={16}
                                height={16}
                                className="mr-2"
                              />
                              {t("deleteFile")}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Component */}
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        message={confirmModal.message}
      />
    </ProtectedLayout>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      messages: (await import(`../../../public/locales/${context.locale}.json`))
        .default,
    },
  };
}
