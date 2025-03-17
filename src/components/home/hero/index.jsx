import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HeroSection() {
    const t = useTranslations("Hero"); // Get translations for Hero section

    return (
        <section className="text-center py-24 px-8 bg-transparent">
            {/* Maktabati Official Website */}
            <h4 className="text-teal-600 font-semibold uppercase tracking-widest">
                {t("officialWebsite")}
            </h4>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-3">
                {t("mainTitle")}
            </h1>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                <span className="text-gray-900">{t("mainTitleHighlight")}</span> {t("mainTitleAI")}
            </h2>

            {/* Subheading */}
            <p className="text-lg text-gray-600 mt-3 max-w-6xl mx-auto">
                {t("subheading")}
            </p>

            {/* Email Subscription Form */}
            <div className="mt-12 flex justify-center">
                <div className="relative flex items-center bg-white shadow-xl rounded-full p-2">
                    <input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-96 px-6 py-3 text-gray-900 rounded-full focus:outline-none"
                    />
                    <button className="ml-2 bg-teal-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-700 transition">
                        {t("subscribe")}
                    </button>
                </div>
            </div>

            {/* Disclaimer Text Below Input */}
            <p className="text-gray-500 text-sm mt-5 flex justify-center items-center">
                <Image src="/images/icons/check-circle.svg" alt="Check Icon" className="mr-2" width={20} height={20} />
                {t("disclaimer1")}
                <a href="#" className="text-teal-600 font-semibold underline px-1">
                    {t("disclaimerLink")}
                </a>
                {t("disclaimer2")}
            </p>
        </section>
    );
}
