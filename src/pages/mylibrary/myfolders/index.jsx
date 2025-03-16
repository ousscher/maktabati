import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useEffect, useRef } from "react";
import ChatbotSection from "@/components/mylibrary/chatbot";
import { router } from "next/router";

export default function MyFolders() {
    const t = useTranslations("Library");
    const { switchLocale } = useSwitchLang();
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const firstModalRef = useRef(null);
    const secondModalRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const [foldersPerPage, setFoldersPerPage] = useState(10);
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
    // List of folders with unique IDs
    const folders = [
        { id: 1, name: "Work Files", files: 120, size: "999 MB", icon: "/images/icons/folder-large.svg" },
        { id: 2, name: "Personal Projects", files: 85, size: "650 MB", icon: "/images/icons/folder-large.svg" },
        { id: 3, name: "Research Papers", files: 200, size: "1.5 GB", icon: "/images/icons/folder-large.svg" },
        { id: 4, name: "Archived Files", files: 45, size: "320 MB", icon: "/images/icons/folder-large.svg" },
        { id: 5, name: "Financial Reports", files: 73, size: "890 MB", icon: "/images/icons/folder-large.svg" },
        { id: 6, name: "Team Documents", files: 150, size: "2.2 GB", icon: "/images/icons/folder-large.svg" },
        { id: 7, name: "AI Research", files: 98, size: "1.1 GB", icon: "/images/icons/folder-large.svg" },
        { id: 8, name: "Marketing Strategies", files: 60, size: "540 MB", icon: "/images/icons/folder-large.svg" },
        { id: 9, name: "Course Materials", files: 230, size: "3.4 GB", icon: "/images/icons/folder-large.svg" },
        { id: 10, name: "Client Presentations", files: 33, size: "400 MB", icon: "/images/icons/folder-large.svg" },
        { id: 11, name: "Legal Documents", files: 77, size: "870 MB", icon: "/images/icons/folder-large.svg" },
        { id: 12, name: "Design Assets", files: 105, size: "2 GB", icon: "/images/icons/folder-large.svg" },
        { id: 13, name: "Coding Projects", files: 132, size: "4.5 GB", icon: "/images/icons/folder-large.svg" },
        { id: 14, name: "Event Planning", files: 90, size: "780 MB", icon: "/images/icons/folder-large.svg" },
        { id: 15, name: "Photography", files: 200, size: "5.2 GB", icon: "/images/icons/folder-large.svg" }
    ];    

    // Pagination logic
    const totalPages = Math.ceil(folders.length / foldersPerPage);
    const startIndex = (currentPage - 1) * foldersPerPage;
    const endIndex = startIndex + foldersPerPage;
    const paginatedFolders = folders.slice(startIndex, endIndex);

    return (
        <ProtectedLayout>
             {/* Search Bar */}
             <SearchBar />
            <div className="p-6 flex">
                <div className={`transition-all duration-500 ${showChat ? "w-2/3" : "w-full"}`}>

                    {/* Header Section */}
                    <div className="flex justify-between items-center py-4">
                        {/* Left Side - Title Navigation */}
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-medium text-gray-500">{t("myLibrary")}</h1>
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                            <h1 className="text-2xl font-semibold">{t("myFolders")}</h1>
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </div>

                        {/* Right Side - Sorting & View Options */}
                        <div className="flex items-center space-x-4">
                            {/* AI Assistant Button */}
                            <button className="p-2" onClick={() => {
                                setShowChat(!showChat);
                                setFoldersPerPage(8);
                            }}>
                                <Image src="/images/icons/ai-assistant.svg" alt="AI Assistant" width={20} height={20} />
                            </button>

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
                                    className="absolute top-44 right-10 bg-white shadow-lg rounded-md p-4 w-64 border z-50"
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

                    {/* Folders Grid */}
                    <div className={`grid ${showChat ? 'grid-cols-4' : 'grid-cols-5'} gap-x-6 gap-y-6 mb-4`}>
                        {paginatedFolders.map((folder, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-4 rounded-lg cursor-pointer transition hover:shadow-lg"
                                onClick={() => router.push(`/mylibrary/myfolders/mydocuments?folderName=${folder.name}`)}
                            >
                                <Image src={folder.icon} alt="Folder Icon" width={100} height={100} />
                                <h2 className="text-gray-800 font-medium mt-2">{folder.name}</h2>
                                <p className="text-gray-500 text-sm">{folder.files} {t("files")}</p>
                                <p className="text-gray-500 text-sm">{folder.size}</p>
                            </div>
                        ))}
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
            messages: (await import(`../../../../public/locales/${context.locale}.json`)).default
        }
    };
}
