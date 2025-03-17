import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations("SignIn");  // Get translations for Navbar section
    const router = useRouter();
    const { locale, pathname, query, asPath } = router;

    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <nav className="flex justify-between items-center py-3 px-40 bg-transparent">
            {/* Logo */}
            <div className="text-teal-600 font-bold text-xl">
                <Image src="/images/logo.png" alt="Maktabati Logo" width={100} height={100} />
            </div>

            {/* Right Section: Language Toggle & Sign In Button */}
            <div className="flex items-center space-x-6">
                {/* Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="border border-teal-600 text-teal-600 px-4 py-1 rounded-full"
                >
                    {locale === "en" ? "FR" : "EN"}
                </button>

                {/* Sign In Button */}
                <Link href="/login">
                    <button className="bg-teal-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-teal-700 transition">
                        {t("signIn")} {/* Translated text */}
                    </button>
                </Link>
            </div>
        </nav>
    );
}
