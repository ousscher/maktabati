import { useTranslations } from "next-intl";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiX, FiSettings, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";
import { useProfile } from "@/contexts/ProfileContext";

export default function Profile() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [loaded, setLoaded] = useState(true);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    router.replace({ pathname, query }, asPath, { locale: newLocale });
  };

  const t = useTranslations("Profile");
  const tr = useTranslations("Sidebar");

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        occupation: profile.occupation,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    setLoaded(false);
    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }finally{
      setLoaded(true);
    }
  };

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

  // Afficher un état de chargement pendant la récupération des données
  if (isLoading)
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center h-screen">
          <p>{t("Loading")}</p>
        </div>
      </ProtectedLayout>
    );

  // Afficher un message d'erreur si la récupération a échoué
  if (error)
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Erreur lors du chargement du profil. Veuillez réessayer.</p>
        </div>
      </ProtectedLayout>
    );

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
        <h1 className="text-sm md:text-xl font-semibold text-gray-800">
          {t("welcomeBack")}, {profile?.name ?? "Guest"}!
        </h1>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 ml-4">
          <button
            onClick={toggleLanguage}
            className="max-md:hidden px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            {locale === "en" ? "FR" : "EN"}
          </button>
          <Link href="/settings">
            <button className="max-md:hidden p-2 hover:bg-gray-100 rounded-md transition">
              <Image
                src="/images/icons/settings.svg"
                alt="Settings"
                width={24}
                height={24}
              />
            </button>
          </Link>
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={profile?.profileImage ?? "/images/profile.jpg"}
                alt="User Profile"
                width={40}
                height={40}
              />
            </button>
          </Link>
        </div>
      </div>
      <div className="max-md:pt-14 flex justify-between items-center p-4 mt-6 bg-white rounded-lg">
        <div className="flex items-center space-x-2">
          <h1 className="text-sm md:text-2xl font-semibold">
            {t("myProfile")}
          </h1>
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
      <section className="p-6">
        <div className="md:flex justify-between items-center my-8 rounded-lg">
          <div className="flex items-center space-x-4">
            <Image
              src={profile?.profileImage ?? "/images/profile.jpg"}
              alt={profile?.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold">{profile?.name}</h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <div className="md:space-x-4 max-md:mt-4">
            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="max-md:hidden bg-white text-teal-600 py-2 rounded-full"
              >
                {t("cancel")}
              </button>
            )}
            <button
            disabled={!loaded}
              onClick={() => {
                if (editMode) {
                  handleSaveChanges();
                } else {
                  setEditMode(true);
                }
              }}
              className="bg-teal-600 disabled:bg-teal-400 text-white px-6 p-2 rounded-full"
            >
              {!loaded ? t("loading") : editMode === false ? t("edit") : t("saveChanges")}
            </button>
            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="md:hidden bg-white text-teal-600 ml-4 py-2 rounded-full"
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </div>

        <div className="md:flex justify-between items-center my-8">
          <div className="flex flex-col space-y-2 w-full">
            <label className="text-gray-600 text-sm">{t("fullName")}</label>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className="px-4 py-2 rounded-md border border-gray-300 w-full"
            />
          </div>

          <div className="flex flex-col max-md:mt-4 space-y-2 w-full md:ml-4">
            <label className="text-gray-600 text-sm">{t("occupation")}</label>
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className="px-4 py-2 rounded-md border border-gray-300 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-gray-800 font-semibold mb-5 text-xl">
            {t("myEmailAddress")}
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <Image
                src="/images/icons/email.svg"
                alt="Email Icon"
                width={24}
                height={20}
              />
            </div>
            <div>
              <p className="text-gray-600">{profile?.email}</p>
              <p className="text-gray-400 text-sm">{profile?.joinDate}</p>
            </div>
          </div>

          <button className="mt-4 text-teal-600 bg-teal-600 bg-opacity-10 py-2 px-4 rounded-lg max-w-72">
            {t("addEmailAddress")}
          </button>
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
