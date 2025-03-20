import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import useSwitchLang from "@/utils/useSwitchLang";
import Image from "next/image";
import SearchBar from "@/components/searchbar";
import Pagination from "@/components/mylibrary/pagination";
import { useState, useEffect, useRef } from "react";
import { useLibraryStore } from "@/store/libraryStore";
import API from "@/utils/api-client";
import { useRouter } from "next/router";
import axios from "axios";

export default function Library() {
  const router = useRouter();
  const t = useTranslations("Library");
  const [deleteSection, setDeleteSection] = useState(null);
  const [menuSection, setMenuSection] = useState(null);
  const { switchLocale } = useSwitchLang();
  const [sortBy, setSortBy] = useState("name");
  const sectionsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [Form, setForm] = useState({
    name: "",
  });
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [creationError, setCreationError] = useState(null);

  const {
    sections,
    setSections,
    setCurrentSection,
    setHierarchy,
    setCurrentPath,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useLibraryStore();

  useEffect(() => {
    const fetchSections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.get("/sections");
        setSections(response.data.sections);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [triggerFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/sections", {
        name: Form.name,
      });
      setTriggerFetch((prev) => !prev);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(false);
      setForm({ name: "" });
      setCreationError(null);
    } catch (err) {
      console.log("Error creating section:", err.response?.data || err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete("/api/delete-section", {
        data: { sectionId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTriggerFetch((prev) => !prev);
    } catch (error) {
      console.error(
        "Error deleting section:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleSectionClick = async (section) => {
    setCurrentSection(section);
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.get(
        `/section-hierarchy?sectionId=${section.id}`
      );
      const hierarchyData = await response.data;
      setHierarchy(hierarchyData);
      setCurrentPath([section.id]);
      router.push("/mylibrary/myfolders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching hierarchy:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handling
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const firstModalRef = useRef(null);
  const secondModalRef = useRef(null);

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
        setSelectedIcon(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sorting and pagination
  const sortedSections = [...sections].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const totalPages = Math.ceil(sortedSections.length / sectionsPerPage);
  const startIndex = (currentPage - 1) * sectionsPerPage;
  const paginatedSections = sortedSections.slice(
    startIndex,
    startIndex + sectionsPerPage
  );

  return (
    <ProtectedLayout>
      <SearchBar />
      <div className="p-6 max-md:pt-14">
        <div className="flex justify-between items-center py-4 bg-white rounded-lg">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm md:text-2xl font-semibold">
              {t("myLibrary")}
            </h1>
            <button className="text-gray-500">
              <Image
                src="/images/icons/chevron-down.svg"
                alt="Dropdown"
                width={12}
                height={12}
              />
            </button>
          </div>

          <div className="flex items-center md:space-x-4">
            <button className="p-2">
              <Image
                src="/images/icons/grid.svg"
                alt="Grid View"
                className="max-md:w-4"
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
              className="p-2 relative"
              onClick={() => setIsFirstModalOpen(true)}
            >
              <Image
                src="/images/icons/add.svg"
                alt="Add Section"
                width={15}
                height={15}
              />
            </button>

            {/* Modals */}
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
                  <Image
                    src="/images/icons/folder-add.svg"
                    alt="Folder Icon"
                    width={18}
                    height={18}
                  />
                  <span className="text-sm text-gray-700">
                    {t("createNewSection")}
                  </span>
                </button>
              </div>
            )}

            {isSecondModalOpen && (
              <form onSubmit={handleSubmit}>
                <div
                  ref={secondModalRef}
                  className="absolute top-44 right-10 bg-white shadow-xl rounded-md p-6 w-72 border z-50"
                >
                  <h3 className="text-lg font-semibold">
                    {t("newSectionTitle")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("newSectionDescription")}
                  </p>

                  <label className="block mt-3 text-sm font-medium text-gray-700">
                    {t("sectionName")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("sectionNamePlaceholder")}
                    className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={Form.name}
                    onChange={(e) => {
                      setCreationError(null);
                      setForm({ ...Form, name: e.target.value });
                      const isDuplicate = sections.some(
                        (section) =>
                          section.name.toLowerCase() ===
                          e.target.value.trim().toLowerCase()
                      );

                      if (isDuplicate) {
                        setCreationError(t("sectionNameExists"));
                        return;
                      }
                    }}
                  />

                  {creationError && (
                    <p className="text-red-500 text-sm mt-2">{creationError}</p>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSecondModalOpen(false);
                        setSelectedIcon(null);
                      }}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      disabled={!Form.name || creationError}
                      type="submit"
                      className="px-4 py-2 disabled:opacity-50 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      {t("create")}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col min-h-[450px]">
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">{t("loading")}</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                <Image
                  src="/images/icons/folder-large.svg"
                  alt="Empty"
                  width={64}
                  height={64}
                />
                <h3 className="mt-4 text-lg font-medium text-gray-700">
                  {t("noSectionsFound")}
                </h3>
                <p className="mt-2 text-gray-500">{t("createFirstSection")}</p>
                <button
                  onClick={() => setIsSecondModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
                >
                  {t("createSection")}
                </button>
              </div>
            ) : (
              // Sections grid with max height and scroll if needed
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mb-4  overflow-y-auto">
                {paginatedSections.map((section) => (
                  <div
                    key={section.id}
                    className="relative bg-gray-50 p-4 rounded-lg shadow flex items-center justify-between transition hover:shadow-md cursor-pointer"
                    onClick={() => handleSectionClick(section)}
                  >
                    <div className="flex">
                      <Image
                        src={section.icon || "/images/icons/folder.svg"}
                        alt="Folder Icon"
                        className="ml-4"
                        width={24}
                        height={24}
                      />
                      <div className="ml-6">
                        <h2 className="text-teal-600 font-semibold">
                          {section.name}
                        </h2>
                        <p className="text-gray-500">
                          {section.folders || `XX ${t("folders")}`}
                        </p>
                      </div>
                    </div>

                    <button
                      className="text-teal-500 font-bold mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuSection(
                          menuSection === section.id ? null : section.id
                        );
                      }}
                    >
                      <Image
                        src="/images/icons/threedots.svg"
                        width={20}
                        height={20}
                        alt="Menu"
                      />
                    </button>

                    {menuSection === section.id && (
                      <div className="absolute top-14 right-4 bg-white shadow-lg rounded-md p-2 border z-50">
                        <button className="flex items-center w-full px-3 py-2 hover:bg-gray-100">
                          <Image
                            src="/images/icons/download.svg"
                            alt={t("download")}
                            width={16}
                            height={16}
                            className="mr-2"
                          />
                          {t("downloadFile")}
                        </button>
                        <button
                          className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuSection(null);
                            setDeleteSection(section.id);
                          }}
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

                    {deleteSection === section.id && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                          <h3 className="text-lg font-semibold">
                            {t("deleteConfirmation")}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            {t("deleteWarning")}
                          </p>
                          <div className="flex justify-end mt-4 space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteSection(null);
                              }}
                              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                            >
                              {t("cancel")}
                            </button>
                            <button
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSection(section.id);
                                setDeleteSection(null);
                              }}
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
            )}
          </div>

          <div className=" pt-4">
            {!isLoading && sections.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
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
