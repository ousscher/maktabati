import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.replace({ pathname, query }, asPath, { locale: newLocale });
    };

    const t = useTranslations("Profile");
    const user = {
        name: "Meriem Lamri",
        email: "meriem030333@gmail.com",
        joinDate: "12/12/2024",
        occupation: "Student",
        profileImage: "/images/profile.jpg", // Update with the actual profile image path
    };

    const [editMode, setEditMode] = useState(false);

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
                    <Link href='/settings'>
                        <button className="p-2 hover:bg-gray-100 rounded-md transition">
                            <Image src="/images/icons/settings.svg" alt="Settings" width={24} height={24} />
                        </button>
                    </Link>
                    <Link href='/profile'>
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
            <section className="p-6">
                
                <div className="flex justify-between items-center my-8 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={user.profileImage}
                            alt={user.name}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <div>
                            <h1 className="text-xl font-semibold">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>
                    <div className="space-x-4">
                        {editMode &&
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="bg-white text-teal-600  py-2 rounded-full"
                            >
                                {t("cancel")}
                            </button>
                        }
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="bg-teal-600 text-white px-6 py-2 rounded-full"
                        >
                            {editMode === false ? t("edit") : t("saveChanges")}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center my-8">
                    <div className="flex flex-col space-y-2 w-full">
                        <label className="text-gray-600 text-sm">{t("fullName")}</label>
                        <input
                            type="text"
                            defaultValue={user.name}
                            disabled={!editMode}
                            className="px-4 py-2 rounded-md border border-gray-300 w-full"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 w-full ml-4">
                        <label className="text-gray-600 text-sm">{t("occupation")}</label>
                        <input
                            type="text"
                            defaultValue={user.occupation}
                            disabled={!editMode}
                            className="px-4 py-2 rounded-md border border-gray-300 w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold mb-5 text-xl">{t("myEmailAddress")}</p>
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                            <Image src="/images/icons/email.svg" alt="Email Icon" width={24} height={20} />
                        </div>
                        <div>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-400 text-sm">{user.joinDate}</p>
                        </div>
                    </div>

                    <button className="mt-4 text-teal-600 bg-teal-600 bg-opacity-10 py-2 px-4 rounded-lg max-w-72">
                        {t("addEmailAddress")}
                    </button>
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
