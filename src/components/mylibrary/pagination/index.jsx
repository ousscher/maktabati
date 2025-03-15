import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
    const t = useTranslations("Library");

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex justify-center items-center space-x-2 mt-6">
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
                &lt; {t("previous")}
            </button>

            {/* First Page */}
            <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 border rounded-md ${
                    currentPage === 1 ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
                1
            </button>

            {/* Middle Pages */}
            {currentPage > 2 && <span className="px-3 py-1 text-gray-500">...</span>}

            {currentPage > 1 && currentPage < totalPages && (
                <button
                    onClick={() => handlePageChange(currentPage)}
                    className="px-3 py-1 border rounded-md bg-gray-200 text-black"
                >
                    {currentPage}
                </button>
            )}

            {currentPage < totalPages - 1 && <span className="px-3 py-1 text-gray-500">...</span>}

            {/* Last Page */}
            {totalPages > 1 && (
                <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 border rounded-md ${
                        currentPage === totalPages ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {totalPages}
                </button>
            )}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-600 border rounded-md hover:bg-gray-100 disabled:opacity-50 flex items-center"
            >
                {t("next")} &gt;
            </button>
        </div>
    );
}
