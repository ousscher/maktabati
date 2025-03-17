import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FAQSection() {
    const t = useTranslations("FAQ"); // Get translations for the FAQ section
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { key: "whatIsMaktabati" },
        { key: "howAiWorks" },
        { key: "uploadFormats" },
        { key: "dataPrivacy" },
        { key: "customizeWriting" },
        { key: "isFree" }
    ];

    return (
        <section className="py-16 px-8 max-w-5xl mx-auto bg-transparent">
            <h2 className="text-3xl font-bold text-gray-900 text-center">{t("title")}</h2>
            <div className="mt-10 space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-teal-50 bg-opacity-40">
                        <button
                            className="flex justify-between w-full text-left font-semibold text-lg"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            {t(`${faq.key}.question`)}
                            <span>{openIndex === index ? "−" : "+"}</span>
                        </button>
                        {openIndex === index && <p className="mt-2 text-gray-600">{t(`${faq.key}.answer`)}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
}
