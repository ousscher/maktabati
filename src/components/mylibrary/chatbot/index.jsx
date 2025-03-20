import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import axios from "axios";

export default function ChatbotSection({ sectionId }) {
    const t = useTranslations("Chatbot");
    const tr = useTranslations("Library");
    const [isChatting, setIsChatting] = useState(false);
    const [deleteChatHistory, setDeleteChatHistory] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        // Add user message to state
        const newMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/rag/query",
                {
                    query: input,
                    sectionId: sectionId,
                    useRAG: true,
                    topK: 5
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Add chatbot response to state
            const botResponse = {
                role: "assistant",
                content: response.data.response,
                sources: response.data.sources || []
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteChat = async () => {
        try {
            const response = await axios.delete(`/api/rag/conversation`, {
                params: { sectionId },  
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (response.status === 200) {
                console.log("Chat history deleted successfully");
                setMessages([]); // Clear the chat in the frontend
            }
        } catch (error) {
            console.error("Error deleting chat history:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!sectionId) return;
            try {
                const response = await axios.post("/api/rag/conversation", {
                    sectionId: sectionId,
                    limit: 50,  // Adjust limit if needed
                }, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
    
                console.log("API Response:", response.data); // Debugging
    
                // Convert Firestore format to match messages array
                const formattedMessages = response.data.conversations.map(convo => [
                    { role: "user", content: convo.query },
                    { role: "assistant", content: convo.response, sources: convo.sources || [] }
                ]).flat(); // Flatten array to avoid nested arrays
    
                setMessages(formattedMessages);
            } catch (error) {
                console.error("Error fetching messages:", error.response?.data || error.message);
            }
        };
    
        fetchMessages();
    }, [sectionId]);
    
    
    

    return (
        <div className="fixed bottom-0 left-0 w-full h-screen md:h-[640px] md:w-2/3 lg:w-1/3 bg-white shadow-lg md:relative p-4 md:p-6 max-h-screen overflow-hidden transition-transform duration-300 transform">
            {/* Chat Window */}
            {isChatting ? (
                <div className="max-md:pt-20 w-full max-w-md flex flex-col h-full">
                    {/* Header */}
                    <div className="relative flex items-center justify-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">{t("chatbotName")}</h2>
                        <button className="absolute left-0 p-2 text-gray-700 hover:bg-gray-200 rounded-full" onClick={() => setIsChatting(false)}>
                            <Image src="/images/icons/back.svg" alt="Back" width={24} height={24} />
                        </button>
                        <button 
                        className="absolute right-0 p-2 text-gray-700 hover:bg-gray-200 rounded-full" onClick={() => setDeleteChatHistory(true)}>
                            <Image src="/images/icons/x.png" alt="Back" width={20} height={20} />
                        </button>
                        {deleteChatHistory && <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h3 className="text-lg font-semibold">
                                    {tr("deleteConfirmation")}
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    {tr("deleteWarning")}
                                </p>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteChatHistory(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
                                    >
                                    {tr("cancel")}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteChat();
                                            setDeleteChatHistory(false);
                                        }}
                                    >
                                        {tr("continue")}
                                    </button>
                                </div>
                            </div>
                        </div>}
                    </div>

                    {/* Messages */}
                    <div className="flex-grow overflow-y-auto space-y-3 p-2">
                        {messages.length > 1 ? (
                            messages.map((msg, index) => (
                                <div key={index} className={`p-3 rounded-lg ${msg.role === "user" ? "bg-teal-500 text-white self-end" : "bg-gray-100 text-gray-700 self-start"}`}>
                                    {msg.content}
                                    {/* Show sources if available */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-1 text-xs text-gray-500">
                                            sources: {msg.sources.join(", ")}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>
                                {/* AI Logo */}
                                <Image src="/images/icons/ai-assistant-grey.svg" alt="Chatbot Icon" width={80} height={80} className="mx-auto my-4 opacity-50" />

                                {/* Example Prompts */}
                                <div className="space-y-4 flex-grow overflow-y-auto">
                                    {["example1", "example2", "example3"].map((example, index) => (
                                        <button key={index} className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 text-sm">
                                            {t(example)}
                                            <p className="text-gray-500 text-xs">{t(`${example}desc`)}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Subtitle */}
                                <p className="text-gray-500 text-center text-xs mt-4">{t("examplesFooter")}</p>
                            </div>

                        )}
                        {loading && <div className="flex justify-center items-center py-4">
                            <div className="w-6 h-6 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
                        </div>}
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center mt-4 w-full p-3 bg-white border-t sticky bottom-0">
                        <input
                            type="text"
                            placeholder={t("inputPlaceholder")}
                            className="flex-grow bg-gray-100 p-3 border-none rounded-xl focus:outline-none text-gray-600"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className="ml-3 bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition"
                            onClick={sendMessage}
                            disabled={loading}
                        >
                            <Image src="/images/icons/send.svg" alt="Send" width={20} height={20} />
                        </button>
                    </div>
                </div>
            ) : (
                // Initial Chatbot Welcome Section
                <div className="max-md:pt-20 flex flex-col items-center w-full text-center">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-4">
                        <Image src="/images/icons/ai-assistant.svg" alt="Chatbot Icon" width={25} height={25} />
                        <h2 className="text-lg font-semibold text-gray-800">{t("chatbotName")}</h2>
                    </div>

                    {/* AI Logo */}
                    <Image src="/images/icons/ai-assistant.svg" alt="AI Logo" width={80} height={80} className="mb-4" />

                    {/* Welcome Message */}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {t("welcome")} <br />
                        <span className="text-teal-600">{t("chatbotName")}</span>
                    </h1>

                    <p className="text-gray-500 text-sm max-w-xs mx-auto">{t("description")}</p>

                    {/* Start Button */}
                    <button
                        className="mt-6 px-6 py-3 bg-teal-500 text-white text-lg font-medium rounded-xl hover:bg-teal-600 transition w-full max-w-xs"
                        onClick={() => setIsChatting(true)}
                    >
                        {t("startButton")}
                    </button>
                </div>
            )}
        </div>
    );
}
