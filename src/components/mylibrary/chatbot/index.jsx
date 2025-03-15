import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ChatbotSection() {
    const t = useTranslations("Chatbot");
    const [isChatting, setIsChatting] = useState(false);

    return (
        <div className=" relative flex flex-col items-center h-screen p-6 ">
            {/* Show Chat UI if isChatting is true */}
            {isChatting ? (
                <div className="w-full max-w-md text-center ">
                    {/* Back Button */}
                    <button className="absolute left-5" onClick={() => setIsChatting(false)}>
                        <Image src="/images/icons/back.svg" alt="Back" width={24} height={24} />
                    </button>

                    {/* Chatbot Header */}
                    <h2 className="text-2xl font-semibold text-gray-900">{t("chatbotName")}</h2>

                    {/* AI Logo */}
                    <Image src="/images/icons/ai-assistant-grey.svg" alt="Chatbot Icon" width={80} height={80} className="mx-auto my-10 opacity-50" />

                    {/* Example Prompts */}
                    <div className="mt-6 space-y-4">
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700">
                            {t("example1")}
                            <p className="text-gray-500 text-sm">{t("example1desc")}</p>
                        </button>
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700">
                            {t("example2")}
                            <p className="text-gray-500 text-sm">{t("example2desc")}</p>
                        </button>
                        <button className="w-full bg-gray-100 p-4 rounded-xl text-gray-700">
                            {t("example3")}
                            <p className="text-gray-500 text-sm">{t("example3desc")}</p>
                        </button>
                    </div>

                    {/* Subtitle */}
                    <p className="text-gray-500 mt-6">{t("examplesFooter")}</p>

                    {/* Chat Input */}
                   
                        <div className="flex items-center mt-10">
                            <input
                                type="text"
                                placeholder={t("inputPlaceholder")}
                                className="flex-grow bg-transparent bg-gray-200 p-3 border-none rounded-xl focus:outline-none mr-4 text-gray-600"
                            />
                            <button className="ml-3 bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition">
                                <Image src="/images/icons/send.svg" alt="Send" width={20} height={20} />
                            </button>
                        </div>
                    
                </div>
            ) : (
                // Initial Chatbot Welcome Section
                <div className="flex flex-col items-center">
                    {/* Chatbot Header */}
                    <div className="flex items-center space-x-2 mb-10">
                        <Image src="/images/icons/ai-assistant.svg" alt="Chatbot Icon" width={25} height={25} />
                        <h2 className="text-xl font-semibold text-gray-800">{t("chatbotName")}</h2>
                    </div>

                    {/* Large AI Logo */}
                    <Image src="/images/icons/ai-assistant.svg" alt="AI Logo" width={120} height={120} className="mb-6" />

                    {/* Welcome Message */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-10">
                        {t("welcome")} <br />
                        <span className="text-black text-3xl">{t("chatbotName")}</span>
                    </h1>

                    <p className="text-gray-500 text-center text-sm my-3 px-6 pb-16">
                        {t("description")}
                    </p>

                    {/* Start Button */}
                    <button
                        className="mt-6 px-20 py-3 bg-teal-500 text-white text-lg font-medium rounded-xl hover:bg-teal-600 transition"
                        onClick={() => setIsChatting(true)}
                    >
                        {t("startButton")}
                    </button>
                </div>
            )}
        </div>
    );
}
