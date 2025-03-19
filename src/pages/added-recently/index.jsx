import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ChatbotSection from "@/components/mylibrary/chatbot";

export default function Recent() {
    const t = useTranslations("Library");
    const tr = useTranslations("Sidebar");
    const { switchLocale } = useSwitchLang();
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [foldersPerPage, setFoldersPerPage] = useState(5);
    const router = useRouter();
    const { folderName } = router.query; 
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const firstModalRef = useRef(null);
    const secondModalRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    useEffect(() => {
        function handleClickOutside(event) {
            if (firstModalRef.current && !firstModalRef.current.contains(event.target)) {
                setIsFirstModalOpen(false);
            }
            if (secondModalRef.current && !secondModalRef.current.contains(event.target)) {
                setIsSecondModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Files inside the folder
    const files = [
        { id: 1, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 2, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 3, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 4, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 5, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 6, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 7, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 8, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 9, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 10, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 11, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" },
        { id: 12, name: "File name", size: "400 MB", icon: "/images/icons/file.svg" }
    ];

    // Pagination Logic
    const totalPages = Math.ceil(files.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFiles = files.slice(startIndex, endIndex);


    const [isUploading, setIsUploading] = useState(false);
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
                <div className={`transition-all duration-500 ${showChat ? "w-2/3" : "w-full"}`}>
                    

                    {/* Header Section */}
                    <div className="flex justify-between items-center py-4">
                        {/* Left Side - Title Navigation */}
                        <div className="flex items-center space-x-2">
                            <h1 className="text-sm md:text-2xl font-medium">{tr("addedRecently")}</h1>
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </div>

                        {/* Right Side - Sorting & View Options */}
                        <div className="flex items-center md:space-x-4">
                            {/* AI Assistant Button */}
                            <button className="p-2" onClick={() => {
                                setShowChat(!showChat);
                                setFoldersPerPage(8);
                            }}>
                                <Image src="/images/icons/ai-assistant.svg" alt="AI Assistant" width={20} height={20} />
                            </button>

                            {/* Grid View Button */}
                            <button className="p-2">
                                <Image src="/images/icons/grid.svg" alt="Grid View" className="max-md:w-4" width={20} height={20} />
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
                            <button className="p-2 relative" onClick={() => setIsFirstModalOpen(true)} >
                                <Image src="/images/icons/add.svg" alt="Grid View" width={15} height={15} />
                            </button>
                            {/* Step 1: First Modal - "Create a New Section" */}
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
                                        <Image src="/images/icons/folder-add.svg" alt="Folder Icon" width={18} height={18} />
                                        <span className="text-sm text-gray-700">{t("createNewFolder")}</span>
                                    </button>
                                    <label
                                        htmlFor="file-upload"
                                        className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100"
                                    >
                                        <Image src="/images/icons/folder-add.svg" alt="Upload Icon" width={18} height={18} />
                                        <span className="text-sm">{t("uploadNewFile")}</span>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>
                                
                            )}

                            {/* Step 2: Second Modal - "New Folder Form" */}
                            {isSecondModalOpen && (
                                <div
                                    ref={secondModalRef}
                                    className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                                >
                                    <h3 className="text-lg font-semibold">{t("newFolderTitle")}</h3>
                                    <p className="text-sm text-gray-500">{t("newFolderDescription")}</p>

                                    {/* Folder Name Input */}
                                    <label className="block mt-3 text-sm font-medium text-gray-700">{t("folderName")}</label>
                                    <input
                                        type="text"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder={t("folderNamePlaceholder")}
                                        className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                    
                                    {createFolderError && (
                                        <p className="text-red-500 text-sm mt-1">{createFolderError}</p>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex justify-end mt-4 space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsSecondModalOpen(false);
                                                setNewFolderName("");
                                                setCreateFolderError("");
                                            }}
                                            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                                            disabled={isCreatingFolder}
                                        >
                                            {t("cancel")}
                                        </button>
                                        <button
                                            onClick={createFolder}
                                            disabled={isCreatingFolder}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-300"
                                        >
                                            {isCreatingFolder ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {t("creating")}
                                                </span>
                                                
                                            ) : (
                                                t("create")
                                            )}
                                        </button>
                                        {isCreatingFolder && <div className="fixed bottom-6 right-6 bg-white text-teal-600 shadow-lg rounded-lg px-6 py-3 flex items-center space-x-3 border border-gray-200 animate-fadeIn">
                                            <svg className="w-6 h-6 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            <span className="font-semibold">Loading content...</span>
                                        </div>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                
                    {/* Files Grid */}
                    <div className={`grid grid-cols-2 ${showChat ? 'md:grid-cols-4' : 'md:grid-cols-5'} gap-x-8 gap-y-8 mb-4`}>
                        {paginatedFiles.map((file, index) => (
                            <div key={index} className="relative flex flex-col items-center text-center p-4 rounded-lg cursor-pointer transition hover:shadow-lg">
                                <Image src={file.icon} alt={t("fileIconAlt")} width={80} height={80} />
                                <h2 className="text-gray-800 font-medium mt-2">{file.name}</h2>
                                <p className="text-gray-500 text-sm">{file.size}</p>

                                {/* Three dots button */}
                                <button
                                    className="absolute top-2 right-2 p-1 text-gray-500 hover:bg-gray-200 rounded-full"
                                    onClick={() => setShowMenu(showMenu === index ? null : index)}
                                >
                                    <Image src="/images/icons/threedots.svg" alt={t("moreOptions")} width={20} height={20} />
                                </button>

                                {/* File options pop-up */}
                                {showMenu === index && (
                                    <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md p-2 border z-50">
                                        <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                                            <Image src="/images/icons/download.svg" alt={t("download")} width={16} height={16} className="mr-2" />
                                            {t("downloadFile")}
                                        </button>
                                        <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                                            <Image src="/images/icons/star.svg" alt={t("star")} width={16} height={16} className="mr-2" />
                                            {t("starFile")}
                                        </button>
                                        <button
                                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                                            onClick={() => {
                                                setShowMenu(null);
                                                setShowDeleteAlert(true);
                                            }}
                                        >
                                            <Image src="/images/icons/trash.svg" alt={t("delete")} width={16} height={16} className="mr-2" />
                                            {t("deleteFile")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Delete Confirmation Alert */}
                        {showDeleteAlert && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                    <h3 className="text-lg font-semibold">{t("deleteConfirmation")}</h3>
                                    <p className="text-gray-600 mt-2">{t("deleteWarning")}</p>
                                    <div className="flex justify-end mt-4 space-x-2">
                                        <button
                                            onClick={() => setShowDeleteAlert(false)}
                                            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                                        >
                                            {t("cancel")}
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                            {t("continue")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    </div>
                {showChat && (
                    <ChatbotSection/>
                )}
            </div>
        </ProtectedLayout>
    );
}

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../public/locales/${context.locale}.json`)).default
        }
    };
}
