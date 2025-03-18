import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useEffect, useRef } from "react";
import ChatbotSection from "@/components/mylibrary/chatbot";
import { useRouter } from 'next/router';
import { useLibraryStore } from '@/store/libraryStore';


export default function MyFolders() {
    const router = useRouter();
    const { 
        hierarchy, 
        currentPath, 
        setCurrentPath, 
        isLoading, 
        error, 
        getCurrentFolderContent 
      } = useLibraryStore();
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
        if (!hierarchy && !isLoading) {
            router.push('/mylibrary');
        }
        // return () => {
        //     document.r
        //     emoveEventListener("mousedown", handleClickOutside);
        // };
        
    }, [hierarchy, isLoading, router]);
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
    // List of folders with unique IDs
    const currentContent = getCurrentFolderContent();
    const handleFolderClick = (folderId) => {
        // Add the folder ID to the current path
        setCurrentPath([...currentPath, folderId]);
      };
      const navigateBack = () => {
        if (currentPath.length > 1) {
          setCurrentPath(currentPath.slice(0, -1));
        } else {
          router.push('/mylibrary');
        }
      };
      const navigateToPathLevel = (index) => {
        if (index === currentPath.length - 1) return;
        const newPath = currentPath.slice(0, index + 1);
        setCurrentPath(newPath);
      };
      if (isLoading) {
        return <div className="container mx-auto p-4">Loading content...</div>;
      }
      
      if (error) {
        return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
      }
      
      if (!hierarchy) {
        return <div className="container mx-auto p-4">Redirecting to sections...</div>;
      }


    const folders = currentContent.folders;    

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
                            <h1 onClick={navigateBack}
                             className="text-2xl cursor-pointer font-medium text-gray-500">{t("myLibrary")}</h1>
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
                    <div className="flex items-center mb-6 text-sm">
                        <button 
                        onClick={navigateBack}
                        className="mr-2 p-1 rounded hover:bg-gray-100"
                        >
                        ← Back
                        </button>
                        
                        <div className="flex items-center flex-wrap">
                        {currentPath.map((id, index) => (
                            <div key={id} className="flex items-center">
                            {index > 0 && <span className="mx-1">/</span>}
                            <span 
                                className={`font-medium ${index !== currentPath.length - 1 ? 'cursor-pointer text-blue-600 hover:underline' : ''}`}
                                onClick={() => navigateToPathLevel(index)}
                            >
                                {getBreadcrumbName(id, index)}
                            </span>
                            </div>
                        ))}
                        </div>
                    </div>
                    {/* Summary */}
                    <div className="mb-6 text-sm text-gray-500">
                        <p>Total: {hierarchy.counts.totalFolders} folders, {hierarchy.counts.totalFiles} files</p>
                    </div>
                    {/* Folders Grid */}
                    <div className={`grid ${showChat ? 'grid-cols-4' : 'grid-cols-5'} gap-x-6 gap-y-6 mb-4`}>
                        {paginatedFolders.map((folder, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-4 rounded-lg cursor-pointer transition hover:shadow-lg"
                                onClick={() => handleFolderClick(folder.id)}
                                onDoubleClick={() => handleFolderClick(folder.id)}
                                // onClick={() => router.push(`/mylibrary/myfolders/mydocuments?folderName=${folder.name}`)}
                            >
                                <Image src="/images/icons/folder-large.svg" alt="Folder Icon" width={100} height={100} />
                                <h2 className="text-gray-800 font-medium mt-2">{folder.name}</h2>
                                <p className="text-gray-500 text-sm">{folder.files} {t("files")}</p>
                                <p className="text-gray-500 text-sm">{folder.size}</p>
                            </div>
                        ))}
                    </div>

                    {/* Files */}
                        {currentContent && (
                            <div>
                            <h2 className="text-lg font-semibold mb-3">Files</h2>
                            
                            {currentContent.files.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {currentContent.files.map((file) => (
                                    <div 
                                    key={file.id}
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                                    >
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                        {file.fileType === 'pdf' ? '📄' : 
                                        file.fileType === 'image' ? '🖼️' : '📝'}
                                        </span>
                                        <h3 className="font-medium">{file.name}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {file.fileType.toUpperCase()} • {formatFileSize(file.fileSize)}
                                    </p>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No files found at this level.</p>
                            )}
                            </div>
                        )}

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

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../../public/locales/${context.locale}.json`)).default
        }
    };
}
