import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useEffect, useRef } from "react";

export default function Library() {
    const t = useTranslations("Library");
    const { switchLocale } = useSwitchLang();
    const [sortBy, setSortBy] = useState("name");
    const sectionsPerPage = 12; // Set the number of sections per page
    const [currentPage, setCurrentPage] = useState(1);

    // Sections list with unique IDs
    const sections = [
        { id: 1, name: "Work Documents", folders: 12, icon: "/images/icons/folder.svg" },
        { id: 2, name: "Personal Projects", folders: 19, icon: "/images/icons/folder.svg" },
        { id: 3, name: "Research Papers", folders: 8, icon: "/images/icons/folder.svg" },
        { id: 4, name: "Archived Files", folders: 25, icon: "/images/icons/folder.svg" },
        { id: 5, name: "Financial Reports", folders: 30, icon: "/images/icons/folder.svg" },
        { id: 6, name: "Team Projects", folders: 15, icon: "/images/icons/folder.svg" },
        { id: 7, name: "AI Development", folders: 22, icon: "/images/icons/folder.svg" },
        { id: 8, name: "Client Work", folders: 14, icon: "/images/icons/folder.svg" },
    ];

    // Pagination logic
    const totalPages = Math.ceil(sections.length / sectionsPerPage);
    const startIndex = (currentPage - 1) * sectionsPerPage;
    const endIndex = startIndex + sectionsPerPage;
    const paginatedSections = sections.slice(startIndex, endIndex);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
        const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
        const firstModalRef = useRef(null);
        const secondModalRef = useRef(null);
        const [selectedIcon, setSelectedIcon] = useState(null);
        const icons = [
            "/images/icons/icon1.png",
            "/images/icons/icon2.png",
            "/images/icons/icon3.png",
            "/images/icons/icon4.png",
            "/images/icons/icon5.png",
            "/images/icons/icon6.png"
        ];
        useEffect(() => {
            function handleClickOutside(event) {
                if (firstModalRef.current && !firstModalRef.current.contains(event.target)) {
                    setIsFirstModalOpen(false);
                }
                if (secondModalRef.current && !secondModalRef.current.contains(event.target)) {
                    setIsSecondModalOpen(false);
                    setSelectedIcon(null);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);
    return (
        <ProtectedLayout>
             {/* Search Bar */}
             <SearchBar />
            <div className="p-6">

                {/* Header Section */}
                <div className="flex justify-between items-center py-4  bg-white  rounded-lg">
                    {/* Left Side - Library Title */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-semibold">{t("myLibrary")}</h1>
                        <button className="text-gray-500">
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </button>
                    </div>

                    {/* Right Side - Sorting & View Options */}
                    <div className="flex items-center space-x-4">
                        {/* Grid View Button */}
                        <button className="p-2">
                            <Image src="/images/icons/grid.svg" alt="Grid View" width={20} height={20} />
                        </button>
                        {/* Sorting Dropdown */}
                        <div className="">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-100 text-gray-700 text-sm py-2 px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="name">{t("sortByName")}</option>
                                <option value="date">{t("sortByDate")}</option>
                            </select>
                        </div>
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
                                        setIsSecondModalOpen(true); // Open next modal
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-100"
                                >
                                    <Image src="/images/icons/folder-add.svg" alt="Folder Icon" width={18} height={18} />
                                    <span className="text-sm text-gray-700">{t("createNewSection")}</span>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Second Modal - "New Section Form" */}
                        {isSecondModalOpen && (
                            <div
                                ref={secondModalRef}
                                className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                            >
                                <h3 className="text-lg font-semibold">{t("newSectionTitle")}</h3>
                                <p className="text-sm text-gray-500">{t("newSectionDescription")}</p>

                                {/* Section Name Input */}
                                <label className="block mt-3 text-sm font-medium text-gray-700">{t("sectionName")}</label>
                                <input
                                    type="text"
                                    placeholder={t("sectionNamePlaceholder")}
                                    className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />

                                {/* Icon Selection */}
                                {/* Icon Selection Grid */}
                                <label className="block mt-3 text-sm font-medium text-gray-700">{t("icon")}</label>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {icons.map((icon, index) => (
                                        <button
                                            key={index}
                                            className={`p-3 border rounded-md hover:bg-gray-100 transition ${
                                                selectedIcon === icon ? "border-teal-500 bg-gray-100" : "border-gray-300"
                                            }`}
                                            onClick={() => setSelectedIcon(icon)}
                                        >
                                            <Image src={icon} alt={`Icon ${index}`} width={24} height={24} />
                                        </button>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        onClick={() => {
                                            setIsSecondModalOpen(false);
                                            setSelectedIcon(null); 
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

                {/* Sections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mb-4">
                    {paginatedSections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center hover:shadow-lg cursor-pointer"
                        >
                            <Image src={section.icon} alt="Folder Icon" className="ml-4" width={24} height={24} />
                            <div className="ml-6">
                                <h2 className="text-teal-600 font-semibold">{section.name}</h2>
                                <p className="text-gray-500">{section.folders} {t("folders")}</p>
                            </div>
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
