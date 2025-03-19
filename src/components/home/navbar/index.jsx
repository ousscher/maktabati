import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations("SignIn");  
    const router = useRouter();
    const { locale, pathname, query, asPath } = router;

    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <nav className="flex justify-between items-center px-6 md:px-40 py-4 max-w-screen-xl mx-auto bg-transparent">
            {/* Logo */}
            <div className="flex items-center">
                <Image 
                    src="/images/logo.png" 
                    alt="Maktabati Logo" 
                    width={100} 
                    height={100} 
                    className="w-24 h-auto" 
                />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4 md:space-x-6">
                {/* Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="border border-teal-600 text-teal-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-sm md:text-base"
                >
                    {locale === "en" ? "FR" : "EN"}
                </button>

                {/* Sign In Button */}
                <Link href="/login">
                    <button className="bg-teal-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full shadow-md hover:bg-teal-700 transition text-sm md:text-base">
                        {t("signIn")}
                    </button>
                </Link>
            </div>
        </nav>
    );
}
