import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SearchBar from "@/components/searchbar";
import axios from "axios"; 
import { useLibraryStore } from "@/store/libraryStore";
import API from "@/utils/api-client";
import { useRouter } from "next/router";

export default function Hero() {
    const t = useTranslations("Library");
    const { switchLocale } = useSwitchLang();
    const [sortBy, setSortBy] = useState("Name");
    const [Form, setForm] = useState({
        name: "",
    });
    
    const router = useRouter();
    const [deleteSection, setDeleteSection] = useState(null);
    const [menuSection, setMenuSection] = useState(null);

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
    
    const [triggerFetch, setTriggerFetch] = useState(false); 

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No authentication token found");
                return;
            }
    
            const response = await axios.post("/api/sections", {
                name: Form.name
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTriggerFetch(true);
        } catch (err) {
            console.log("Error creating section:", err.response?.data || err.message);
        }
    };
    const { 
        sections, 
        setSections, 
        setCurrentSection, 
        setHierarchy, 
        setCurrentPath, 
        isLoading, 
        setIsLoading, 
        error, 
        setError 
      } = useLibraryStore();


    useEffect(() => {
        const fetchSections = async () => {
          try {
            const response = await axios.get("/api/sections", {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`, 
              },
            });
    
            setSections(response.data.sections); 
          } catch (err) {
            console.log(err);
          } 
        };
    
        fetchSections();  
      }, [triggerFetch]);
    
      


      const handleSectionClick = async (section) => {
        setCurrentSection(section);
        setIsLoading(true);
        setError(null);
        
        try {
            
          const response = await API.get(`/section-hierarchy?sectionId=${section.id}`, {
            sectionId: section.id
        });
          const hierarchyData = await response.data;
          setHierarchy(hierarchyData);
          setCurrentPath([section.id]);
          
          // Navigate to folders page
          router.push('/mylibrary/myfolders');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          console.error('Error fetching hierarchy:', err);
        } finally {
          setIsLoading(false);
        }
      };

      const hereDeleteSection = async (sectionId) => {
        try {
          const response = await axios.delete("/api/delete-section", {
            data: { sectionId }, // The payload must be inside "data" for DELETE requests
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          console.log(response.data.message); // "Section deleted successfully"
          setTriggerFetch((prev) => !prev);
        } catch (error) {
          console.error("Error deleting section:", error.response?.data?.error || error.message);
        }
      };
      
    // Function to sort sections based on selected criteria
    const sortedSections = [...sections].sort((a, b) => {
        if (sortBy === "Name") return a.name.localeCompare(b.name);
        if (sortBy === "Date") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
    }); 


    return (
        <ProtectedLayout>
            <SearchBar/>
            <section className="p-6 max-md:pt-14">
                <div className="flex justify-between items-center py-4  bg-white  rounded-lg">
                    {/* Left Side - Library Title */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-sm md:text-2xl font-semibold">{t("myLibrary")}</h1>
                        <button className="text-gray-500">
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </button>
                    </div> 

                    {/* Right Side - Sorting & View Options */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {/* Grid View Button */}
                        <button className="p-2">
                            <Image src="/images/icons/grid.svg" alt="Grid View" className="max-md:w-4" width={20} height={20} />
                        </button>
                        {/* Sorting Dropdown */}
                        <div className="">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 md:text-sm md:py-2 md:px-5 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="Name">{t("sortByName")}</option>
                                <option value="Date">{t("sortByDate")}</option>
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
                            <form onSubmit={handleSubmit}>
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
                                        value={Form.name}
                                    onChange={(e) => setForm({ ...Form, name: e.target.value })}
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
                                            type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                        >
                                            {t("create")}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sections Grid */}
                <div className="pt-6 pb-14 relative">
                    {/* Sections Grid */}
                    {sortedSections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 mb-4">
                            {sortedSections.slice(0, 6).map((section) => (
                                <div
                                    key={section.id}
                                    className="relative bg-gray-50 p-4 rounded-lg shadow flex items-center justify-between transition hover:shadow-md cursor-pointer"
                                    onClick={() => handleSectionClick(section)} // Section opens on click
                                    onDoubleClick={() => handleSectionClick(section)}
                                >
                                    <div className="flex">
                                        <Image src={section.icon || "/images/icons/folder.svg"} alt="Folder Icon" className="ml-4" width={24} height={24} />
                                        <div className="ml-6">
                                            <h2 className="text-teal-600 font-semibold">{section.name}</h2>
                                            <p className="text-gray-500">{section.folders ? section.folders : `XX ${t("folders")}`}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Three Dots Button */}
                                    <button 
                                        className="text-teal-500 font-bold mr-3"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents the section from opening
                                            setMenuSection(menuSection === section.id ? null : section.id);
                                        }}
                                    >
                                        <Image src="/images/icons/threedots.svg" width={20} height={20}/>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {menuSection === section.id && (
                                        <div key={section.id} className="absolute top-14 right-4 bg-white shadow-lg rounded-md p-2 border z-50">
                                            <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                                                <Image src="/images/icons/download.svg" alt={t("download")} width={16} height={16} className="mr-2" />
                                                {t("downloadFile")}
                                            </button>
                                            <button
                                                className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents accidental section opening
                                                    setMenuSection(null);
                                                    setDeleteSection(section.id);
                                                }}
                                            >
                                                <Image src="/images/icons/trash.svg" alt={t("delete")} width={16} height={16} className="mr-2" />
                                                {t("deleteFile")}
                                            </button>
                                        </div>
                                    )}

                                    {/* Delete Confirmation Modal */}
                                    {deleteSection === section.id && (
                                        <div className="fixed inset-0 flex items-center justify-center z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                                <h3 className="text-lg font-semibold">{t("deleteConfirmation")}</h3>
                                                <p className="text-gray-600 mt-2">{t("deleteWarning")}</p>
                                                <div className="flex justify-end mt-4 space-x-2">
                                                    <button
                                                        onClick={(e) => {e.stopPropagation();setDeleteSection(null)}}
                                                        className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                                                    >
                                                        {t("cancel")}
                                                    </button>
                                                    <button 
                                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                        onClick={(e) => {e.stopPropagation();hereDeleteSection(section.id); setDeleteSection(null)}}
                                                    >
                                                        {t("continue")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div> 
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t("noSectionsFound")}</p>
                    )}
                    {/* See More Link */}
                    <div className="text-right max-md:text-xs absolute right-5 ">
                        <Link href="/mylibrary" className="text-black flex items-center">
                            {t("seeMore")}
                            <Image src="/images/icons/arrow-right.svg" alt="See More" width={18} height={18} className="ml-1" />
                        </Link>
                    </div>
                </div>


                {/* AI Writing Assistant Section */}
                <div className="mb-6">
                    <h2 className="text-sm md:text-xl font-semibold">{t("aiWritingAssistant")}</h2>
                    <p className="max-md:text-xs text-gray-600 mt-2">
                        {t("aiDescription")}
                    </p>
                </div>

                {/* Upload Section */}
                <div className="">
                    <h3 className="text-sm md:text-lg font-medium">{t("trainAiModel")}</h3>
                    <p className="max-md:text-xs text-gray-500 mb-4">{t("chooseFile")}</p>

                    <div className="flex space-x-4">
                        <button className="max-md:text-xs flex items-center  text-teal-600 px-4 py-2 rounded-lg" style={{ backgroundColor: "#E7F4F3" }}>
                            <Image src="/images/icons/upload.svg" alt="Upload Icon" width={20} height={20} className="mr-2" />
                            {t("uploadFromLibrary")}
                        </button>
                        <button className="max-md:text-xs flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg">
                            <Image src="/images/icons/device.svg" alt="Device Icon" width={20} height={20} className="mr-2" />
                            {t("uploadFromDevice")}
                        </button>
                    </div>
                </div>
            </section>
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