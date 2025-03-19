import { useTranslations } from "next-intl";
import Image from "next/image";

export default function FeaturesSection() {
    const t = useTranslations("Features"); // Get translations for the Features section

    const features = [
        { key: "writingAssistant", icon: "/images/icons/writing.png" },
        { key: "retrievalAugmented", icon: "/images/icons/retrieval.png" },
        { key: "documentOrganization", icon: "/images/icons/organization.png" },
        { key: "crossPlatform", icon: "/images/icons/accessibility.png" },
        { key: "documentTraining", icon: "/images/icons/training.png" },
        { key: "privacySecurity", icon: "/images/icons/security.png" }
    ];

    return (
        <section className="py-16 px-6 md:px-12 lg:px-20 text-center bg-transparent">
            <h2 className="text-4xl font-extrabold text-gray-900">{t("title")}</h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-8 mt-16">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-white shadow-md rounded-full p-5 w-[300px] md:w-[500px] mx-auto border border-teal-600">
                        {/* Feature Icon */}
                        <div className="flex justify-center items-center bg-gray-100 rounded-full mr-4">
                            <Image src={feature.icon} alt={t(`${feature.key}.title`)} width={60} height={60} />
                        </div>

                        {/* Feature Text */}
                        <div className="text-left flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">{t(`${feature.key}.title`)}</h3>
                            <p className="hidden md:block text-sm text-gray-600">
                                {t(`${feature.key}.description`)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}