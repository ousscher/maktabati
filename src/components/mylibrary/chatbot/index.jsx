import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ChatbotSection() {
    const t = useTranslations("Chatbot");
    const [isChatting, setIsChatting] = useState(false);

    return (
        <div className="relative flex flex-col items-center w-full md:w-2/3 lg:w-1/3 p-6 max-h-screen overflow-hidden">
            {/* Show Chat UI if isChatting is true */}
            {isChatting ? (
                <div className="w-full max-w-md text-center flex flex-col">
                    {/* Back Button */}
                    <button className="absolute left-5 top-5" onClick={() => setIsChatting(false)}>
                        <Image src="/images/icons/back.svg" alt="Back" width={24} height={24} />
                    </button>

                    {/* Chatbot Header */}
                    <h2 className="text-2xl font-semibold text-gray-900">{t("chatbotName")}</h2>

                    {/* AI Logo */}
                    <Image src="/images/icons/ai-assistant-grey.svg" alt="Chatbot Icon" width={80} height={80} className="mx-auto my-5 opacity-50" />

                    {/* Example Prompts */}
                    <div className=" space-y-4 w-full px-4">
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 text-sm">
                            {t("example1")}
                            <p className="text-gray-500 text-xs">{t("example1desc")}</p>
                        </button>
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 text-sm">
                            {t("example2")}
                            <p className="text-gray-500 text-xs">{t("example2desc")}</p>
                        </button>
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 text-sm">
                            {t("example3")}
                            <p className="text-gray-500 text-xs">{t("example3desc")}</p>
                        </button>
                    </div>

                    {/* Subtitle */}
                    <p className="text-gray-500 mt-6 text-sm">{t("examplesFooter")}</p>

                    {/* Chat Input */}
                    <div className="flex items-center mt-10 w-full px-4">
                        <input
                            type="text"
                            placeholder={t("inputPlaceholder")}
                            className="flex-grow bg-gray-200 p-3 border-none rounded-xl focus:outline-none text-gray-600"
                        />
                        <button className="ml-3 bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition">
                            <Image src="/images/icons/send.svg" alt="Send" width={20} height={20} />
                        </button>
                    </div>
                </div>
            ) : (
                // Initial Chatbot Welcome Section
                <div className="flex flex-col items-center w-full px-4 text-center">
                    {/* Chatbot Header */}
                    <div className="flex items-center space-x-2 mb-6">
                        <Image src="/images/icons/ai-assistant.svg" alt="Chatbot Icon" width={25} height={25} />
                        <h2 className="text-xl font-semibold text-gray-800">{t("chatbotName")}</h2>
                    </div>

                    {/* Large AI Logo */}
                    <Image src="/images/icons/ai-assistant.svg" alt="AI Logo" width={100} height={100} className="mb-4" />

                    {/* Welcome Message */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                        {t("welcome")} <br />
                        <span className="text-black text-3xl">{t("chatbotName")}</span>
                    </h1>

                    <p className="text-gray-500 text-center text-sm my-2 px-4">
                        {t("description")}
                    </p>

                    {/* Start Button */}
                    <button
                        className="mt-6 px-10 py-3 bg-teal-500 text-white text-lg font-medium rounded-xl hover:bg-teal-600 transition"
                        onClick={() => setIsChatting(true)}
                    >
                        {t("startButton")}
                    </button>
                </div>
            )}
        </div>
    );
}
