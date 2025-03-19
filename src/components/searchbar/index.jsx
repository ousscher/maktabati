import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { FiX, FiSettings, FiGlobe } from "react-icons/fi"; // Import icons
import { motion } from "framer-motion";


export default function SearchBar() {
    const tr = useTranslations("Search");
    const t = useTranslations("Sidebar");
    const router = useRouter();
    const [menu , showMenu] = useState(false);
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

    return (
        <div className="max-md:fixed max-md:bg-white max-md:z-10 top-0 left-0  flex items-center justify-between px-4 py-6 md:py-2 w-full">
            <button className="md:hidden "
            onClick={()=>showMenu(true)}
            >
                <Image src="/images/icons/menu.svg" width={26} height={26}/>
            </button>
            {/* Search Bar */}
            <div className="relative flex items-center w-56 md:w-[35%] rounded-lg border border-gray-200 p-3">
                {/* Search Icon */}
                <Image
                    src="/images/icons/search.svg"
                    alt="Search Icon"
                    width={16}
                    height={16}
                    className="absolute left-4 text-gray-400"
                />

                {/* Search Input */}
                <input
                    type="text"
                    placeholder={tr("placeholder")}
                    className="w-full bg-transparent border-none pl-10 pr-8 text-gray-500 placeholder-gray-400 text-sm focus:outline-none"
                />

                {/* Voice Search Icon */}
                <button className="absolute right-4 text-gray-500 hover:text-teal-600">
                    <Image src="/images/icons/mic.svg" alt="Voice Search" width={18} height={18} />
                </button>
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