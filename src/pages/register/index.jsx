"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import useSwitchLang from "@/utils/useSwitchLang";
import axios from "axios";
import Link from 'next/link';
import Image from 'next/image';
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function Register() {
  const { isAuthenticated, loading, setAuthToken } = useAuth();
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations("Signup");
  const { switchLocale, locale } = useSwitchLang();
  
  useEffect(() => {
    if (isAuthenticated === true) {
      router.push("/home");
    }
    
    // Check if there's a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [isAuthenticated, router]);
  
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("/api/auth/signup", {
        email: signUpForm.email,
        password: signUpForm.password,
      });
      const token = response.data.token;
      if (token) {
        setAuthToken(token);
        router.push("/home");
      }
    } catch (err) {
      setError(t("invalidCredentials"));
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <main className="w-full flex">
      <div className="relative flex-1 flex items-center justify-center h-screen bg-maktabati-logo-primary overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl flex flex-col justify-center items-center px-6">
        {/* Feature cards */}
        <div className="w-[70%] mx-auto flex flex-col gap-6 mb-16">
  {/* Feature 1 */}
  <div className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4 self-start w-[60%]">
    <Image src="/images/icons/Icon.png" alt="Icon" width={24} height={24} />
    <div className="w-full">
      <h3 className="font-medium break-words">{t("feature1")}</h3>
    </div>
  </div>

  {/* Feature 2 */}
  <div className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4 self-end w-[60%]">
    <Image src="/images/icons/Icon.png" alt="Icon" width={24} height={24} />
    <div className="w-full">
      <h3 className="font-medium break-words">{t("feature2")}</h3>
    </div>
  </div>

  {/* Feature 3 */}
  <div className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4 self-start w-[60%]">
    <Image src="/images/icons/Icon.png" alt="Icon" width={24} height={24} />
    <div className="w-full">
      <h3 className="font-medium break-words">{t("feature3")}</h3>
    </div>
  </div>

  {/* Feature 4 */}
  <div className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4 self-end w-[60%]">
    <Image src="/images/icons/Icon.png" alt="Icon" width={24} height={24} />
    <div className="w-full">
      <h3 className="font-medium break-words">{t("feature4")}</h3>
    </div>
  </div>
</div>


        {/* Title and subtitle */}
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t("new_features_title")}</h2>
          <p className="max-w-2xl mx-auto">{t("new_features_description")}</p>
        </div>


        {/* Navigation dots */}
      </div>
    </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        {/* Language and Theme Toggles */}
        <div className="absolute right-6 top-6 flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'en' ? 'bg-maktabati-logo-primary text-maktabati-components-button-solid-default-text_color' : 'bg-maktabati-components-film_roll_rectangle-bg_color text-maktabati-text-normal_text'}`} 
              onClick={() => switchLocale('en')}
            >
              EN
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'fr' ? 'bg-maktabati-logo-primary text-maktabati-components-button-solid-default-text_color' : 'bg-maktabati-components-film_roll_rectangle-bg_color text-maktabati-text-normal_text'}`} 
              onClick={() => switchLocale('fr')}
            >
              FR
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-maktabati-components-film_roll_rectangle-bg_color transition-colors"
            aria-label="Toggle theme"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-maktabati-text-normal_text" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                className="hidden dark:block"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" 
                className="block dark:hidden"
              />
            </svg>
          </button>
        </div>

        <div className="max-w-xl w-full mx-auto bg-white p-6 rounded-lg ">
          <div className="text-center pb-4 flex flex-col items-start">
            <h1 className="text-4xl font-bold">{t("signup")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("haveAccount")} <Link href="/login" className="text-teal-500 font-medium">{t("connect")}</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">{t("email")}</label>
              <input
                value={signUpForm.email}
                onChange={(e) => {
                  setSignUpForm({ ...signUpForm, email: e.target.value });
                }}
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-600 mb-1 block">{t("password")}</label>
              <div className="relative">
                <input
                  type={hidePassword ? "password" : "text"}
                  value={signUpForm.password}
                  onChange={(e) => {
                    setSignUpForm({ ...signUpForm, password: e.target.value });
                  }}
                  placeholder={`${t("enter")} ${("password")}`}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  {t('rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-teal-500 hover:text-teal-600">
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>
            
            <button
              className="w-full px-4 py-3 text-white font-medium bg-maktabati-components-button-solid-blue-bg_color hover:bg-teal-600 rounded-lg duration-150"
              type="submit"
            >
              {t("login")}
            </button>

            <div className="relative flex items-center justify-center mt-4">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="absolute bg-white px-4 text-sm text-gray-500">{t('or')}</div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              {t("continue")} Google
            </button>
            
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                <path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"></path>
              </svg>
              {t("continue")} Facebook
            </button>
          </form>
    </div>
      </div>
    </main>
  );
}
export async function getStaticProps(context) {
  return {
      props: {
          messages: (await import(`../../../public/locales/${context.locale}.json`)).default
      }
  };
}