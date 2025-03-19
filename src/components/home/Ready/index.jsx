import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CTASection() {
    const t = useTranslations("CTA");

    return (
        <section className="py-16 text-center flex items-center justify-center bg-transparent">
            <div className="w-full max-w-lg px-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                    {t("title")}
                </h2>
                <p className="text-base md:text-lg text-gray-600 mt-2">
                    {t("description")}
                </p>

                {/* CTA Button */}
                <div className="mt-6">
                    <Link href="/login">
                        <button className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-700 transition text-lg md:text-xl">
                            {t("button")} →
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
