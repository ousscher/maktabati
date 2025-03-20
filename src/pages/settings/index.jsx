import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfileContext";
import { FiX, FiSettings, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";
import { changePassword } from "@/services/authService";
import { ToastContainer, toast } from "react-toastify";

export default function Settings() {
  const router = useRouter();
  const { profile, isLoading, error, updateProfile } = useProfile();
  const { locale, pathname, asPath, query } = router;
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValid = newPassword.length > 6 && newPassword === confirmPassword;

  const [googleAuthMessage, setGoogleAuthMessage] = useState(false);

  const [formData, setFormData] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const t = useTranslations("Settings");
  const tr = useTranslations("Sidebar");

  const [menu, showMenu] = useState(false);
  const menuItems = [
    {
      id: "home",
      label: tr("home"),
      path: "/home",
      icon: "/images/icons/home.svg",
    },
    {
      id: "library",
      label: tr("library"),
      path: "/mylibrary",
      icon: "/images/icons/library.svg",
    },
    {
      id: "writing-assistant",
      label: tr("writingAssistant"),
      path: "/writing-assistant",
      icon: "/images/icons/assistant.svg",
    },
    {
      id: "profile",
      label: tr("profile"),
      path: "/profile",
      icon: "/images/icons/profile.svg",
    },
  ];

  // Extra Items (More Section)
  const extraItems = [
    {
      id: "added-recently",
      label: tr("addedRecently"),
      path: "/added-recently",
      icon: "/images/icons/recent.svg",
    },
    {
      id: "starred",
      label: tr("starred"),
      path: "/starred",
      icon: "/images/icons/star.svg",
    },
    {
      id: "trash",
      label: tr("trash"),
      path: "/trash",
      icon: "/images/icons/trash.svg",
    },
  ];

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    if (profile) {
      const requiredFields = ["name", "email", "occupation", "profileImage"];
      const filledFields = requiredFields.filter((field) => profile[field]);

      const completionPercentage =
        (filledFields.length / requiredFields.length) * 100;
      setProfileCompletion(completionPercentage);
      setFormData({
        name: profile.name,
        occupation: profile.occupation,
        email: profile.email,
      });
    }
  }, [profile]);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    router.replace({ pathname, query }, asPath, { locale: newLocale });
  };

  const [isChecked, setIsChecked] = useState(false);
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  const [isEditing, setIsEditing] = useState(false);

  const handlePasswordEdit = () => {
    if (profile?.authProvider === "google") {
      setGoogleAuthMessage(!googleAuthMessage);
    } else {
      setIsEditing(!isEditing);
      setGoogleAuthMessage(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-md:fixed max-md:bg-white max-md:z-10 top-0 left-0 flex items-center justify-between px-4 py-6 md:py-2 w-full">
        <button className="md:hidden " onClick={() => showMenu(true)}>
          <Image
            src="/images/icons/menu.svg"
            width={26}
            height={26}
            alt="Menu"
          />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {t("welcomeBack")}, {profile?.name ?? "Guest"}!
        </h1>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 ml-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            {locale === "en" ? "FR" : "EN"}
          </button>
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={profile?.profileImage ?? "/images/profile.jpg"}
                alt={profile?.name}
                width={40}
                height={40}
              />
            </button>
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 mt-6 bg-white rounded-lg">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold">{t("myProfile")}</h1>
          <button className="text-gray-500">
            <Image
              src="/images/icons/chevron-down.svg"
              alt="Dropdown"
              width={12}
              height={12}
            />
          </button>
        </div>
      </div>
      {/* Profile Completion Section */}
      <section className="py-3 px-4 md:py-6 md:px-8 lg:px-14">
        <div className="flex flex-col lg:flex-row justify-around gap-6">
          <div className="w-full lg:w-1/2 p-4">
            {/* Profile Completion Section */}
            <div className="bg-teal-600 rounded-lg px-4 md:px-10 py-4 shadow-md mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 lg:space-x-11">
                  {/* Circular Progress */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-0">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 36 36"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Cercle de fond */}
                      <path
                        className="circle-background"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831"
                      />
                      {/* Cercle de progression */}
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
                      <span className="font-semibold text-white text-lg md:text-xl">
                        {Math.round(profileCompletion)}%
                      </span>
                    </div>
                  </div>
                  {/* Informations du profil */}
                  <div className="flex flex-col text-center md:text-left">
                    <h3 className="text-lg font-semibold text-white">
                      {t("profileInformations")}
                    </h3>
                    <p className="text-gray-200 mb-3">
                      {t("profileDescription")}
                    </p>
                    <button
                      onClick={() => router.push("/profile")}
                      className="bg-white text-teal-600 py-2 px-6 rounded-lg"
                    >
                      {t("completeYourProfile")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Mode Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t("displayMode")}</h2>
                <div className="flex justify-center items-center space-x-2">
                  {isChecked == false ? (
                    <p className="text-gray-400">{t("whiteMode")}</p>
                  ) : (
                    <p className="text-teal-600">{t("darkMode")}</p>
                  )}
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
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-md mb-6 w-full lg:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">
              {t("userManagement")}
            </h2>

            {/* Password Section */}
            <div className="mb-6">
              {/* Password Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{t("password")}</p>
                  <button
                    className="text-gray-600 rounded-full w-6 h-6 bg-gray-200 flex items-center justify-center"
                    onClick={handlePasswordEdit}
                  >
                    <Image
                      src="/images/icons/chevron-down.svg"
                      alt="Chevron"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
                <p className="text-gray-600">
                  {t("yourEmail", { email: profile?.email })}
                </p>
              </div>

              {/* Conditional rendering for password change */}
              {googleAuthMessage ? (
                <div className="p-3 bg-gray-100 rounded-md text-gray-700 mb-4">
                  {t("googleAuthMessage") ||
                    "Vous êtes connecté via Google. Le changement de mot de passe n'est pas disponible pour les comptes Google."}
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2 relative">
                    <label className="text-gray-600 text-sm">
                      {t("newPassword")}
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="px-4 py-2 rounded-md border border-gray-300 w-full"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-4 top-8 cursor-pointer text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </span>

                    <label className="text-gray-600 text-sm">
                      {t("confirmPassword")}
                    </label>
                    <input
                      type="password"
                      className="px-4 py-2 rounded-md border border-gray-300 w-full"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {!isValid &&
                      newPassword.length > 0 &&
                      confirmPassword.length > 0 && (
                        <p className="text-red-500 text-sm">
                          {newPassword.length <= 6
                            ? t("passwordLength")
                            : t("passwordMatch")}
                        </p>
                      )}

                    <button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await changePassword(newPassword);
                          setIsEditing(false);
                          setNewPassword("");
                          setConfirmPassword("");
                          toast.success(t("passwordChanged"));
                        } catch (error) {
                          console.log(error);
                          toast.error(t("errorChangingPassword"));
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-teal-600 text-white py-2 px-6 rounded-full mt-2 disabled:bg-gray-400"
                      disabled={!isValid || loading}
                    >
                      {!loading ? t("updatePassword") : t("loading")}
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="bg-gray-200 h-0.5 rounded-full mb-5"></div>
            {/* Deactivate Account Section */}
            <div className="mb-4">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">
                  {t("deactivateAccount")}
                </p>
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
              <button className="flex items-center justify-center bg-teal-600 text-4xl text-white w-10 h-10 rounded-full">
                +
              </button>
              <p className="text-xl font-semibold ml-3 text-teal-600 ">
                {t("addAccount")}
              </p>
            </div>
          </div>
        </div>
      </section>
      {menu && (
        <div className="z-10">
          {/* Background Overlay to Close Menu */}
          {menu && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
              onClick={() => showMenu(false)}
            ></div>
          )}

          {/* Sidebar Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: menu ? "0%" : "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-all z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center">
              {/* Logo */}
              <Image
                src="/images/logo.png"
                alt="Maktabati Logo"
                width={100}
                height={50}
              />

              {/* Close Button */}
              <button
                onClick={() => showMenu(false)}
                className="text-gray-700 hover:text-gray-900 transition"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition ${
                    router.pathname.startsWith(item.path)
                      ? "bg-teal-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => showMenu(false)}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* More Section */}
            <div className="px-6 mt-4">
              <p className="text-gray-500 text-sm mb-2">{tr("more")}</p>
              <div className="space-y-2">
                {extraItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition ${
                      router.pathname.startsWith(item.path)
                        ? "text-teal-500"
                        : "text-gray-700"
                    }`}
                    onClick={() => showMenu(false)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Language & Settings */}
            <div className="px-6 mt-auto mb-6">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <FiGlobe className="text-lg" />
                <span>{locale === "en" ? "FR" : "EN"}</span>
              </button>

              {/* Settings Button */}
              <Link
                href="/settings"
                className="flex items-center justify-center mt-4 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                onClick={() => showMenu(false)}
              >
                <FiSettings className="text-xl text-gray-700 mr-2" />
                <span className="text-lg text-gray-700">{tr("settings")}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center mt-4 p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <Image
                  src="/images/icons/logout.svg"
                  alt="Logout"
                  width={20}
                  height={20}
                />
                <span className="ml-3">{tr("logout")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ProtectedLayout>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      messages: (await import(`../../../public/locales/${context.locale}.json`))
        .default,
    },
  };
}
