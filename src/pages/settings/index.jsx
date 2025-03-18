import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


export default function Settings() {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;
    const [isDeactivated, setIsDeactivated] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.replace({ pathname, query }, asPath, { locale: newLocale });
    };

    const t = useTranslations("Settings");
    const user = {
        name: "Meriem Lamri",
        email: "meriem030333@gmail.com",
        joinDate: "12/12/2024",
        occupation: "Student",
        profileImage: "/images/profile.jpg", // Update with the actual profile image path
    };
    const [profileCompletion] = useState(85);
    const [isChecked, setIsChecked] = useState(false);
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <ProtectedLayout>
            <div className="flex items-center justify-between px-4 py-2 w-full">
                <h1 className="text-xl font-semibold text-gray-800">
                    {t("welcomeBack")}, {user.name}!
                </h1>

                {/* Action Icons */}
                <div className="flex items-center space-x-4 ml-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
                    >
                        {locale === "en" ? "FR" : "EN"}
                    </button>
                    <Link href="/settings">
                        <button className="p-2 hover:bg-gray-100 rounded-md transition">
                            <Image src="/images/icons/settings.svg" alt="Settings" width={24} height={24} />
                        </button>
                    </Link>
                    <Link href="/profile">
                        <button className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                            <Image src="/images/profile.jpg" alt="User Profile" width={40} height={40} />
                        </button>
                    </Link>
                    
                </div>
            </div>
            <div className="flex justify-between items-center p-4 mt-6 bg-white rounded-lg">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-semibold">{t("myProfile")}</h1>
                        <button className="text-gray-500">
                            <Image src="/images/icons/chevron-down.svg" alt="Dropdown" width={12} height={12} />
                        </button>
                    </div>
                </div>
            {/* Profile Completion Section */}
            <section className="py-6 px-14 flex justify-around ">
                <div className="p-6">
                    {/* Profile Completion Section */}
                    <div className="bg-teal-600 rounded-lg px-10 py-4 shadow-md mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-11 ">
                                {/* Circular Progress */}
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        className="circle-background"
                                        fill="none"
                                        stroke="#e6e6e6"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                                    />
                                    <path
                                        className="circle-progress"
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${profileCompletion}, 100`}
                                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                                    />
                                    </svg>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                    <span className="font-semibold text-white text-xl">{profileCompletion}%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold text-white">{t("profileInformations")}</h3>
                                    <p className="text-gray-200 mb-3">{t("profileDescription")}</p>
                                    <button className="bg-white text-teal-600 py-2 px-6 rounded-lg">
                                    {t("completeYourProfile")}
                                    </button>
                                </div>
                                  
                            </div>
                        </div>
                    </div>

                    {/* Display Mode Section */}
                    <div className=" mT-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{t("displayMode")}</h2>
                            <div className="flex justify-center items-center space-x-2">
                                {isChecked == false ? <p className="text-gray-400">{t("whiteMode")}</p> : <p className="text-teal-600">{t("darkMode")}</p>}
                                <label className="relative inline-block w-14 h-8">
                                    <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleToggle}
                                    className="sr-only"
                                    />
                                    <span
                                    className={`absolute inset-0 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                                        isChecked ? "bg-teal-600" : "bg-gray-300"
                                    }`}
                                    />
                                    <span
                                    className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ease-in-out ${
                                        isChecked ? "translate-x-6" : "translate-x-0"
                                    }`}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">{t("userManagement")}</h2>

                    {/* Password Section */}
                    <div className="mb-6">
                        {/* Password Section */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">{t("password")}</p>
                                <button
                                    className="text-gray-600 rounded-full w-6 h-6 bg-gray-200 flex items-center justify-center"
                                    onClick={() => setIsEditing(!isEditing)} // Toggle between view and form
                                >
                                    <Image
                                        src="/images/icons/chevron-down.svg"
                                        alt="Chevron"
                                        width={12}
                                        height={12}
                                    />
                                </button>
                            </div>
                            <p className="text-gray-600">{t("yourEmail", { email: user.email })}</p>
                        </div>

                        {/* Conditional rendering for password change */}
                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="flex flex-col space-y-2 relative">
                                    <label className="text-gray-600 text-sm">{t("currentPassword")}</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="px-4 py-2 rounded-md border border-gray-300 w-full"
                                    />
                                    <span 
                                        className="absolute right-4 top-8 cursor-pointer text-gray-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {!showPassword ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        : 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        }
                                    </span>
                                </div>
                                <div className="flex flex-col space-y-2 relative">
                                    <label className="text-gray-600 text-sm">{t("newPassword")}</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="px-4 py-2 rounded-md border border-gray-300 w-full"
                                    />
                                    <span 
                                        className="absolute right-4 top-8 cursor-pointer text-gray-400"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {!showPassword ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        : 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        }
                                    </span>
                                </div>
                                <button className="bg-teal-600 text-white py-2 px-6 rounded-full">
                                    {t("updatePassword")}
                                </button>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="bg-gray-200 h-0.5 rounded-full mb-5"></div>
                    {/* Deactivate Account Section */}
                    <div className="mb-4">
                        
                        <div className="flex justify-between">
                            <p className="text-lg font-semibold">{t("deactivateAccount")}</p>
                            <button
                                className="bg-red-600 text-white text-sm px-2.5 py-1 rounded-lg"
                                onClick={() => setIsDeactivated(!isDeactivated)}
                            >
                                {isDeactivated ? t("activated") : t("deactivate")}
                            </button>
                        </div>
                        <p className="text-gray-600">{t("deactivateDescription")}</p>
                    </div>
                    <div className="bg-gray-200 h-0.5 rounded-full mb-5"></div>
                    {/* Delete Account Section */}
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <p className="text-lg font-semibold">{t("delete")}</p>
                            <button
                                className="bg-red-600 text-white text-sm px-6 py-1 rounded-lg"
                                onClick={() => setIsDeleted(!isDeleted)}
                            >
                                {isDeleted ? t("deleted") : t("delete")}
                            </button>
                        </div>
                        <p className="text-gray-600">{t("deleteDescription")}</p>
                        
                    </div>

                    {/* Add Account Section */}
                    <div className="flex items-center">
                        <button className="flex items-center bg-teal-600 text-4xl text-white px-4 py-2 rounded-full">+</button>
                        <p className="text-xl font-semibold ml-3 text-teal-600 ">{t("addAccount")}</p>
                    </div>
                </div>

            </section>
        </ProtectedLayout>
    );
}

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../public/locales/${context.locale}.json`)).default
        }
    };
}
