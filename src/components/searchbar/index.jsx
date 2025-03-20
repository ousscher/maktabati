import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { FiX, FiSettings, FiGlobe } from "react-icons/fi"; // Import icons
import { motion } from "framer-motion";
import axios from "axios";


export default function SearchBar({ sectionId }) {
    const tr = useTranslations("Search");
    const t = useTranslations("Sidebar");
    const router = useRouter();
    const [menu , showMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const { locale, pathname, asPath, query } = router;
    const menuItems = [
        { id: 'home', label: t('home'), path: '/home', icon: '/images/icons/home.svg' },
        { id: 'library', label: t('library'), path: '/mylibrary', icon: '/images/icons/library.svg' },
        { id: 'writing-assistant', label: t('writingAssistant'), path: '/writing-assistant', icon: '/images/icons/assistant.svg' },
        { id: 'profile', label: t('profile'), path: '/profile', icon: '/images/icons/profile.svg' },
    ];

    // Extra Items (More Section)
    const extraItems = [
        { id: 'added-recently', label: t('addedRecently'), path: '/added-recently', icon: '/images/icons/recent.svg' },
        { id: 'starred', label: t('starred'), path: '/starred', icon: '/images/icons/star.svg' },
        { id: 'trash', label: t('trash'), path: '/trash', icon: '/images/icons/trash.svg' },
    ];

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
 
    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.replace({ pathname, query }, asPath, { locale: newLocale });
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);
        setShowResults(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No authentication token found");
                setError(tr("authError"));
                setLoading(false);
                return;
            }

            const response = await axios.post("/api/search", {
                query: searchQuery,
                sectionId: sectionId,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setSearchResults(response.data.files || []);
        } catch (error) {
            console.error("Search error:", error.response?.data || error.message);
            setError(tr("searchError"));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={sectionId == null ? "max-md:fixed max-md:bg-white max-md:z-10 top-0 left-0  flex items-center justify-between md:justify-end px-4 py-6 md:py-2 w-full" : "max-md:fixed max-md:bg-white max-md:z-10 top-0 left-0  flex items-center justify-between px-4 py-6 md:py-2 w-full"}>
            <button className="md:hidden "
            onClick={()=>showMenu(true)}
            >
                <Image src="/images/icons/menu.svg" width={26} height={26}/>
            </button>
            {/* Search Input */}
            <div className={sectionId == null ? `hidden` : `relative flex items-center w-56 md:w-[35%] rounded-lg border border-gray-200 p-3`}>
                <Image src="/images/icons/search.svg" alt="Search Icon" width={16} height={16} className="absolute left-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={tr("placeholder")}
                    className="w-full bg-transparent border-none pl-10 pr-8 text-gray-500 placeholder-gray-400 text-sm focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()) {
                            setShowResults(false); // Clear search results when input is empty
                        }
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch} className="absolute right-4 text-gray-500 hover:text-teal-600">
                    <Image src="/images/icons/mic.svg" alt="Voice Search" width={18} height={18} />
                </button>
                {/* Search Results */}
                {showResults && (
                    <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg p-4 z-50">
                        {loading ? (
                            <div className="flex justify-center items-center py-4">
                                <div className="w-6 h-6 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <p className="text-red-500">Sorry something went wrong</p>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((file) => (
                                <div
                                onClick={() => window.open(file.fileUrl, "_blank")}
                                key={file.id} className="cursor-pointer flex items-center p-2 border-b border-gray-200">
                                    <Image src="/images/icons/file.svg" alt="File" width={20} height={20} />
                                    <span className="ml-2 text-gray-700">{file.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">{tr("noResults")}</p>
                        )}
                    </div>
                )}
            </div>

            

            {/* Action Icons */}
            <div className="max-md:hidden flex items-center space-x-4 ml-4">
                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    className="max-md:hidden px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
                >
                    {locale === "en" ? "FR" : "EN"}
                </button>

                {/* Settings Icon */}
                <Link href='/settings'>
                    <button className="max- p-2 hover:bg-gray-100 rounded-md transition">
                        <Image src="/images/icons/settings.svg" alt="Settings" width={24} height={24} />
                    </button>
                </Link>
                {/* Profile Image */}
                <Link href='/profile'>
                    <button className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image src="/images/profile.jpg" alt="User Profile" width={40} height={40} />
                    </button>
                </Link>
            </div>
            <Link href='/profile' className="md:hidden">
                <button className=" w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    <Image src="/images/profile.jpg" alt="User Profile" width={35} height={35} />
                </button>
            </Link>
            {menu && 
                <div className=" z-10">
                    {/* Background Overlay to Close Menu */}
                    {menu && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                            onClick={() => showMenu(false)}
                        ></div>
                    )}
        
                    {/* Sidebar Menu */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: menu ? '0%' : '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-all z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex justify-between items-center">
                            {/* Logo */}
                            <Image src="/images/logo.png" alt="Maktabati Logo" width={100} height={50} />
        
                            {/* Close Button */}
                            <button onClick={() => showMenu(false)} className="text-gray-700 hover:text-gray-900 transition">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
        
                        {/* Navigation Menu */}
                        <nav className="flex-1 px-6 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.path}
                                    className={`flex items-center p-3 rounded-lg transition ${
                                        router.pathname.startsWith(item.path)
                                            ? 'bg-teal-500 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => showMenu(false)}
                                >
                                    <Image src={item.icon} alt={item.label} width={20} height={20} />
                                    <span className="ml-3">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
        
                        {/* More Section */}
                        <div className="px-6 mt-4">
                            <p className="text-gray-500 text-sm mb-2">{t('more')}</p>
                            <div className="space-y-2">
                                {extraItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        className={`flex items-center p-3 rounded-lg transition ${
                                            router.pathname.startsWith(item.path) ? 'text-teal-500' : 'text-gray-700'
                                        }`}
                                        onClick={() => setMenu(false)}
                                    >
                                        <Image src={item.icon} alt={item.label} width={20} height={20} />
                                        <span className="ml-3">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
        
                        {/* Language & Settings */}
                        <div className="px-6 mt-auto mb-6">
                            {/* Language Switcher */}
                            <button
                                onClick={toggleLanguage}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                <FiGlobe className="text-lg" />
                                <span>{locale === 'en' ? 'FR' : 'EN'}</span>
                            </button>
        
                            {/* Settings Button */}
                            <Link
                                href="/settings"
                                className="flex items-center justify-center mt-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                onClick={() => showMenu(false)}
                            >
                                <FiSettings className="text-xl text-gray-700 mr-2" />
                                <span className="text-lg text-gray-700">{t('settings')}</span>
                            </Link>
        
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center mt-4 p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                            >
                                <Image src="/images/icons/logout.svg" alt="Logout" width={20} height={20} />
                                <span className="ml-3">{t('logout')}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            }
        </div>

    );
}
export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../public/locales/${context.locale}.json`)).default
        }
    };
}