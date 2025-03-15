import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export default function SearchBar() {
    const t = useTranslations("Search");
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.replace({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div className="flex items-center justify-between px-4 py-2 w-full">
            {/* Search Bar */}
            <div className="relative flex items-center w-[35%] rounded-lg border border-gray-200 p-3">
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
                    placeholder={t("placeholder")}
                    className="w-full bg-transparent border-none pl-10 pr-8 text-gray-500 placeholder-gray-400 text-sm focus:outline-none"
                />

                {/* Voice Search Icon */}
                <button className="absolute right-4 text-gray-500 hover:text-teal-600">
                    <Image src="/images/icons/mic.svg" alt="Voice Search" width={18} height={18} />
                </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 ml-4">
                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
                >
                    {locale === "en" ? "FR" : "EN"}
                </button>

                {/* Settings Icon */}
                <button className="p-2 hover:bg-gray-100 rounded-md transition">
                    <Image src="/images/icons/settings.svg" alt="Settings" width={24} height={24} />
                </button>

                {/* Profile Image */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    <Image src="/images/profile.jpg" alt="User Profile" width={40} height={40} />
                </div>
            </div>
        </div>
    );
}
