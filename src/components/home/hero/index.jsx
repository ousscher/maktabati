import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HeroSection() {
    const t = useTranslations("Hero"); // Get translations for Hero section

    return (
        <section className="text-center py-16 px-6 md:py-24 md:px-8 bg-transparent">
            {/* Maktabati Official Website */}
            <h4 className="text-teal-600 font-medium uppercase tracking-widest text-sm md:text-base">
                {t("officialWebsite")}
            </h4>

            {/* Main Title */}
            <h1 className="text-xl md:text-5xl font-extrabold text-gray-900 mt-6">
                {t("mainTitle")}
            </h1>
            <h2 className="text-xl md:text-5xl font-extrabold text-gray-900">
                <span className="text-gray-900">{t("mainTitleHighlight")}</span> {t("mainTitleAI")}
            </h2>

            {/* Subheading */}
            <p className="text-xs md:text-lg text-gray-600 mt-3 max-w-3xl mx-auto">
                {t("subheading")}
            </p>

            {/* Email Subscription Form */}
            <div className="mt-8 flex justify-center">
                <div className="relative flex items-center max-w-md w-full bg-white shadow-xl rounded-full p-1">
                    <input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full px-4 py-3 text-sm text-gray-700 rounded-full focus:outline-none"
                    />
                    <button className="absolute right-2 bg-teal-600 text-white text-sm px-5 py-2 rounded-full shadow-md hover:bg-teal-700 transition">
                        {t("subscribe")}
                    </button>
                </div>
            </div>

            {/* Disclaimer Text Below Input */}
            <p className="text-gray-500 text-xs md:text-sm mt-4 flex justify-center items-center">
                <Image src="/images/icons/check-circle.svg" alt="Check Icon" className="mr-2" width={16} height={16} />
                {t("disclaimer1")} 
                {t("disclaimerLink")}
                {t("disclaimer2")}
            </p>
        </section>
    );
}
