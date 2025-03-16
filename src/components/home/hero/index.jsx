import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";


export default function Hero() {
    const t = useTranslations("Home");

    return (
        <section className="flex flex-col items-center justify-center h-screen bg-blue-500 text-white text-center p-6">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-lg mt-4">{t("description")}</p>
        </section>
    );
}
