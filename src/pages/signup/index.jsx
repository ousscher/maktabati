"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from 'next/image';
import Link from "next/link";

export default function SignIn() {
    const t = useTranslations("SignIn");
    const { isAuthenticated, loading, setAuthToken } = useAuth();
    const [error, setError] = useState(null);
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    // Function to toggle between English and French
    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        router.replace({ pathname, query }, asPath, { locale: newLocale });
    };
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="flex h-screen">
            {/* Left Side - Sign In Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 relative">
              {/* Language Switcher */}
              <button 
                  className="absolute top-5 right-20 text-gray-800 px-4 py-1 rounded-lg border"
                  onClick={toggleLanguage}
              >
                  {locale === "en" ? "FR" : "EN"}
              </button>
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-maktabati-components-film_roll_rectangle-bg_color transition-colors"
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

              <div className="max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-900">{t("signUp")}</h2>
                <p className="mt-2 text-gray-600">
                    {t("account")} <Link href="/login" className="text-teal-600 font-semibold">{t("uhave")}</Link>
                </p>
                <form onSubmit={handleSubmit} >
                  {/* Email Input */}
                  <div className="mt-6">
                      <label className="block text-gray-700 font-medium">{t("email")}</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="example@example.com"
                        value={signUpForm.email}
                        onChange={(e) => {
                            setSignUpForm({ ...signUpForm, email: e.target.value });
                        }}
                      />
                  </div>

                  {/* Password Input */}
                  <div className="mt-4 relative">
                    <label className="block text-gray-700 font-medium">{t("password")}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder={t("enterPassword")}
                        value={signUpForm.password}
                        onChange={(e) => {
                            setSignUpForm({ ...signUpForm, password: e.target.value });
                        }}
                      />
                      {/* Eye Icon */}
                      <span 
                        className="absolute right-4 top-5 cursor-pointer text-gray-400"
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
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error}
                      </p>
                    )}
                  </div>
                  
                  

                  {/* Sign In Button */}
                  <button className="w-full bg-teal-600 text-white text-lg font-semibold py-3 mt-6 rounded-lg hover:bg-teal-700 transition">
                      {t("signUp")}
                  </button>
                  {/* OR Divider */}
                  <div className="flex items-center my-6">
                      <div className="w-full h-px bg-gray-300"></div>
                      <span className="px-4 text-gray-600">{t("Or")}</span>
                      <div className="w-full h-px bg-gray-300"></div>
                  </div>

                  {/* Social Login Buttons */}
                  <button type="submit" className="relative w-full flex items-center justify-center border py-3 rounded-3xl text-gray-700 hover:bg-gray-100 transition">
                      <Image src="/images/icons/google.svg" alt="Google Logo" className="absolute left-5" width={24} height={24} />
                      {t("Google")}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Features Section */}
            <div className="max-lg:hidden w-1/2 text-white flex flex-col justify-center px-24 py-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/loginbg.png')" }}>
                <div className="flex flex-col space-y-6 ">
                    <div className="bg-white text-gray-800 p-4 shadow-lg rounded-lg w-64 flex items-center self-start">
                        <Image src="/images/icons/folder.svg" alt="Icon" width={20} height={20} className="m-3" />
                        <p className="text-sm font-medium text-teal-600">{t("storage")}</p>
                    </div>

                    <div className="bg-white text-gray-800 p-4 shadow-lg rounded-lg w-72 flex items-center self-end">
                        <Image src="/images/icons/folder.svg" alt="Icon" width={20} height={20} className="mr-3" />
                        <p className="text-sm font-medium text-teal-600">{t("design")}</p>
                    </div>

                    <div className="bg-white text-gray-800 p-4 shadow-lg rounded-lg w-72 flex items-center self-start">
                        <Image src="/images/icons/folder.svg" alt="Icon" width={20} height={20} className="mr-3" />
                        <p className="text-sm font-medium text-teal-600">{t("upload")}</p>
                    </div>

                    <div className="bg-white text-gray-800 p-4 shadow-lg rounded-lg w-80 flex items-center self-end">
                        <Image src="/images/icons/folder.svg" alt="Icon" width={20} height={20} className="mr-3" />
                        <p className="text-sm font-medium text-teal-600">{t("security")}</p>
                    </div>
                </div>
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-bold">{t("featuresTitle")}</h2>
                    <p className="mt-4 text-gray-200 px-10">{t("featuresDescription")}</p>
                </div>
            </div>
        </div>
    );
}
export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../../public/locales/${context.locale}.json`)).default
        }
    };
}