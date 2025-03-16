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
    const router = useRouter();
    const { folderName } = router.query; 
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
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
            console.log("Uploading file:", file.name);

            // Simulate upload delay
            setTimeout(() => {
                setIsUploading(false); // Hide loading popup after upload
                console.log("File uploaded successfully:", file.name);
            }, 3000);
        }
    };
    return (
        <ProtectedLayout>
            <SearchBar />
            <div className="p-6 flex">
                <div className="transition-all duration-500 w-full">

                    {/* Header Section */}
                    <div className="flex justify-between items-center py-4">
                        {/* Left Side - Title Navigation */}
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-medium">{tr("trash")}</h1>
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </div>

                        {/* Right Side - Sorting & View Options */}
                        <div className="flex items-center space-x-4">

                            {/* Grid View Button */}
                            <button className="p-2">
                                <Image src="/images/icons/grid.svg" alt="Grid View" width={20} height={20} />
                            </button>

                            {/* Sorting Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-100 text-gray-700 text-sm py-2 px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
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
                                    className="absolute top-44 right-10 bg-white shadow-lg rounded-md p-2  border z-50"
                                >
                                    {/* Restore All */}
                                    <button
                                        onClick={() => {
                                            setIsFirstModalOpen(false);
                                            // Add your function for downloading this folder
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition"
                                    >
                                        <Image src="/images/icons/download.svg" alt="Download Icon" width={18} height={18} />
                                        <span className="text-sm">{t("restoreAllFiles")}</span>
                                    </button>
                                
                                    {/* Delete This Folder */}
                                    <button
                                        onClick={() => {
                                            setIsFirstModalOpen(false);
                                            setIsDeleteConfirmOpen(true);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-100 rounded-md transition"
                                    >
                                        <Image src="/images/icons/trash.svg" alt="Delete Icon" width={18} height={18} />
                                        <span className="text-sm">{t("deleteAllFiles")}</span>
                                    </button>
                                    
                                </div>
                                
                            )}
                            {/* Delete Confirmation Modal */}
                            {isDeleteConfirmOpen && (
                                <div className="fixed inset-0 flex items-center justify-center  z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                        <h2 className="text-lg font-semibold">{t("deleteConfirmationTitle")}</h2>
                                        <p className="text-gray-500 text-sm mt-2">{t("deleteConfirmationMessage")}</p>

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
                            {/* Small Uploading Pop-up */}
                            {isUploading && (
                                <div className="fixed bottom-5 right-5 bg- text-black px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
                                    <Image src="/images/icons/loading.svg" alt="Loading" width={16} height={16} className="animate-spin" />
                                    <span className="text-sm">{t("uploadingFile")}</span>
                                </div>
                            )}
                            {/* Step 2: Second Modal - "New Section Form" */}
                            {isSecondModalOpen && (
                                <div
                                    ref={secondModalRef}
                                    className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                                >
                                    <h3 className="text-lg font-semibold">{t("newFolderTitle")}</h3>
                                    <p className="text-sm text-gray-500">{t("newFolderDescription")}</p>

                                    {/* Section Name Input */}
                                    <label className="block mt-3 text-sm font-medium text-gray-700">{t("folderName")}</label>
                                    <input
                                        type="text"
                                        placeholder={t("folderNamePlaceholder")}
                                        className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />

                                    {/* Buttons */}
                                    <div className="flex justify-end mt-4 space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsSecondModalOpen(false);
                                            }}
                                            className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                                        >
                                            {t("cancel")}
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                        >
                                            {t("create")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                
                    {/* Files Grid */}
                    <div className='grid grid-cols-5 gap-x-8 gap-y-8 mb-4'>
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
                                            {t("restoreFile")}
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
