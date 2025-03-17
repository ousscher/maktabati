import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CTASection() {
    const t = useTranslations("CTA");

    return (
        <section className="py-16 text-center flex items-center justify-center bg-transparent">
            <div className="max-w-md">
                <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
                <p className="text-lg text-gray-600 mt-2">{t("description")}</p>
                <Link href="/login">
                    <button className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-700 transition">
                        {t("button")} →
                    </button>
                </Link>
            </div>
        </section>
    );
}
